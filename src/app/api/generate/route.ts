import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { createClient } from '@/lib/supabase/server';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');

// Bu fonksiyon, AI tarafından üretilen metni son kullanıcı için temizler.
const formatDilekce = (content: string) => {
  return content
    .replace(/```/g, '') // Kod bloklarını temizle
    .replace(/markdown/gi, '') // "markdown" kelimesini temizle
    .split('\n')
    .map(line => line.trim())
    .join('\n')
    .trim();
};

export async function POST(request: NextRequest) {
  const supabase = await createClient();

  try {
    // GÜVENLIK: Kullanıcı kimliği kontrolü
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    const body = await request.json();
    const { type, formData } = body;

    if (!type || !formData) {
      return NextResponse.json(
        { success: false, error: 'Eksik bilgi: Dilekçe tipi veya form verisi gönderilmedi.' },
        { status: 400 }
      );
    }

    // GÜVENLIK: Eğer kullanıcı yoksa ücretsiz limit kontrolü yap
    let userStats = null;
    if (!user) {
      // Anonymous user için basit rate limiting (IP bazlı)
      const forwarded = request.headers.get('x-forwarded-for');
      const ip = forwarded ? forwarded.split(',')[0] : request.headers.get('x-real-ip') || 'unknown';

      // Burada Redis veya database ile IP bazlı rate limiting yapılabilir
      // Şimdilik sadece warning log
      console.warn(`Anonymous dilekçe request from IP: ${ip}`);
    } else {
      // GÜVENLIK: Kullanıcı limiti kontrolü
      const { data: stats } = await supabase
        .from('user_stats')
        .select('free_uses_remaining, total_dilekce_created')
        .eq('user_id', user.id)
        .single();

      userStats = stats;

      if (userStats && userStats.free_uses_remaining <= 0) {
        return NextResponse.json(
          { success: false, error: 'Ücretsiz kullanım hakkınız dolmuştur. Premium üyelik gerekiyor.' },
          { status: 403 }
        );
      }
    }

    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    const currentDate = new Date().toLocaleDateString('tr-TR');

    // Her dilekçe türü için kullanıcı verilerini tek bir metin bloğunda birleştirelim.
    // GÜVENLİK: Input sanitization
    const sanitizeInput = (input: any): string => {
      if (typeof input !== 'string') return String(input);
      return input
        .replace(/IGNORE/gi, '[FILTERED]')
        .replace(/PREVIOUS INSTRUCTIONS/gi, '[FILTERED]')
        .replace(/SYSTEM PROMPT/gi, '[FILTERED]')
        .replace(/OVERRIDE/gi, '[FILTERED]')
        .slice(0, 2000); // Maksimum 2000 karakter
    };

    let caseDetails = `Dilekçe Türü: ${type}\n`;
    for (const key in formData) {
      caseDetails += `${key}: ${sanitizeInput(formData[key])}\n`;
    }

    // --- YENİ VE GÜÇLENDİRİLMİŞ ANA PROMPT ---
    // Bu yapı, modelin bir uzman gibi davranmasını, hukuki argüman üretmesini ve katı kurallara uymasını sağlar.
    const masterPrompt = `
  # GÖREV VE KİMLİK
  Sen, Türkiye'deki idari hukuk ve ceza hukuku alanlarında 20 yıllık tecrübeye sahip, son derece yetenekli bir UZMAN AVUKATSIN. Görevin, sana sunulan vaka detaylarını analiz ederek, hukuki dayanakları güçlü, ikna edici, dilbilgisi ve format açısından kusursuz, resmi bir dilekçe metni oluşturmaktır.

      # VAKA DETAYLARI
      Aşağıda, müvekkilinin sana sunduğu bilgiler yer almaktadır:
      ---
      ${caseDetails}
      ---

      # KRİTİK TALİMATLAR VE ZORUNLU KURALLAR
  1.  HUKUKİ ARGÜMAN GELİŞTİR: Müvekkilin basit anlatımını AL, bunu hukuki bir temele oturt. Örneğin, "önümdeki araba aniden durdu" ifadesini "Karayolları Trafik Kanunu çerçevesinde ani ve beklenmedik bir tehlike oluştuğu ve kazayı önlemek amacıyla zaruret hali içinde manevra yapıldığı" gibi profesyonel bir argümana dönüştür. İlgili kanun maddelerine (Örn: TCK md. 25 - Zaruret Hali, 6502 sayılı Tüketici Kanunu, İş Kanunu vb.) MUTLAKA atıfta bulun.
  2.  PROFESYONEL FORMATI KORU: Başlık (ortalı ve büyük harf), Konu, Açıklamalar, Hukuki Gerekçeler, Sonuç ve İstem, Tarih, İmza Bloğu (Ad-Soyad, T.C. No, Adres, Tel) ve Ekler yapısını KUSURSUZ uygula.
  3.  RESMİ ÜSLUP KULLAN: Metin son derece resmi, saygılı ve net olmalıdır. Duygusal, suçlayıcı veya argo ifadelerden KESİNLİKLE kaçın.
  4.  NET TALEP: "SONUÇ VE İSTEM" bölümü çok önemlidir. Sadece tek ve net bir talep sun. Örneğin, SADECE "iptal" talep et.

  # ASLA YAPILMAMASI GEREKENLER (KIRMIZI ÇİZGİLER)
  -   ASLA "iptal veya taksitlendirme" gibi birbiriyle çelişen taleplerde bulunma.
  -   ASLA "maddi durumum kötü", "ceza bütçemi zorlar" gibi hukuki geçerliliği olmayan gerekçeler sunma.
  -   ASLA "elimde delil yok", "tanığım yok" gibi negatif ve savunmayı zayıflatan ifadeler kullanma.
  -   ASLA "Sayın Hakim Bey" gibi gayriresmi hitaplar kullanma. Hitap her zaman kuruma yönelik olmalıdır ("...HAKİMLİĞİNE").

  # ÇIKTI KURALLARI (ÇOK ÖNEMLİ!)
  -   Çıktı, SADECE ve SADECE DÜZ METİN (plain text) olmalıdır.
  -   KESİNLİKLE Markdown formatlama karakterleri (yıldız, kare, diyez, kod bloku vb.) KULLANMA.
  -   Metin içinde hiçbir yorum, ek açıklama veya formatlama talimatı bulunmamalıdır.
  -   Yazım ve dilbilgisi hataları KESİNLİKLE olmamalıdır. Metni son bir kez kontrol et.
`;

    // Dilekçeyi oluştur
    const result = await model.generateContent(masterPrompt);
    const response = result.response;
    const content = formatDilekce(response.text());

    // Kullanıcı varsa veritabanına kaydet
    if (user) {
      // Kullanıcının limitini güncelle
      await supabase
        .from('user_stats')
        .upsert({
          user_id: user.id,
          free_uses_remaining: Math.max(0, (userStats?.free_uses_remaining || 3) - 1),
          total_dilekce_created: (userStats?.total_dilekce_created || 0) + 1,
          last_dilekce_date: new Date().toISOString()
        });

      await supabase.from('dilekce').insert({
        user_id: user.id,
        type,
        content,
        form_data: formData
      });
    }

    return NextResponse.json({
      success: true,
      content: content
    });

  } catch (error) {
    // Detaylı error logging
    console.error('API Hatası:', {
      error: error instanceof Error ? error.message : error,
      stack: error instanceof Error ? error.stack : undefined,
      timestamp: new Date().toISOString(),
      userAgent: request.headers.get('user-agent'),
      ip: request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip')
    });

    // Kullanıcıya güvenli hata mesajı
    if (error instanceof Error && error.message.includes('quota')) {
      return NextResponse.json(
        { success: false, error: 'Sistem yoğunluğu nedeniyle geçici hata. Lütfen birkaç dakika sonra tekrar deneyin.' },
        { status: 429 }
      );
    }

    return NextResponse.json(
      { success: false, error: 'Dilekçe oluşturulurken sunucu tarafında bir hata oluştu.' },
      { status: 500 }
    );
  }
}