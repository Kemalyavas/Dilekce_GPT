// /src/app/api/generate/route.ts - GELİŞTİRİLMİŞ VERSİYON

import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { createClient } from '@/lib/supabase/server';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');

// Geliştirilmiş format fonksiyonu
const formatDilekce = (content: string) => {
  // Gereksiz boşlukları temizle ama paragraf yapısını koru
  return content
    .split('\n')
    .map(line => line.trim())
    .filter((line, index, array) => {
      // Art arda gelen boş satırları tek satıra indir
      if (line === '' && index > 0 && array[index - 1] === '') {
        return false;
      }
      return true;
    })
    .join('\n');
};

export async function POST(request: NextRequest) {
  const supabase = await createClient();

  try {
    const body = await request.json();
    const { type, formData } = body;

    if (!type || !formData) {
      return NextResponse.json(
        { success: false, error: 'Eksik bilgi' },
        { status: 400 }
      );
    }

    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    const currentDate = new Date().toLocaleDateString('tr-TR', {
      day: 'numeric',
      month: 'numeric',
      year: 'numeric'
    });

    // Profesyonel dilekçe yazım kuralları
    const professionalWritingRules = `
      PROFESYONEL DİLEKÇE YAZIM STANDARTLARI:
      
      1. TEKNİK FORMAT:
         - A4 sayfa standardı (210×297 mm)
         - 2.5 cm kenar boşlukları
         - Times New Roman 12 punto veya Arial 11 punto
         - Tek satır aralığı (1.0)
         - Paragraf girintisi 1.25 cm
         - Siyah mürekkep rengi
      
      2. DİLEKÇE YAPISI:
         A) BAŞLIK (Tamamı BÜYÜK HARF, ortalanmış, kalın)
            - Kurum adı tam ve doğru yazılmalı
            - "...MÜDÜRLÜĞÜNE", "...BAŞKANLIĞINA", "...HAKİMLİĞİNE" şeklinde sonlanmalı
            
         B) TARİH (Sağ üst köşe)
            - Tarih: GG.AA.YYYY formatında
            
         C) KONU SATIRI
            - "KONU:" kalın yazılmalı
            - Konu kısa, net ve açıklayıcı olmalı
            
         D) HİTAP
            - "Sayın Müdürlük," veya uygun hitap şekli
            
         E) GİRİŞ PARAGRAF
            - Kim olduğunuz ve ne talep ettiğiniz özet olarak
            
         F) AÇIKLAMA BÖLÜMÜ
            - Kronolojik sıralama
            - Objektif anlatım
            - Kanıt ve belgelere atıf
            
         G) TALEP BÖLÜMÜ
            - "SONUÇ VE İSTEM:" veya "SONUÇ VE TALEP:" başlığı
            - Net ve açık talep
            
         H) KAPANIŞ
            - Hiyerarşiye uygun: "Gereğini arz ederim" / "Gereğini rica ederim"
            
         I) İMZA BLOĞU (Sağ alt, düzenli hizalanmış)
            - Ad Soyad
            - T.C. Kimlik No
            - Adres (tam ve açık)
            - Telefon
            - E-posta (varsa)
            
         J) EKLER (varsa)
            - "EKLER:" başlığı
            - Numaralı liste halinde
      
      3. DİL VE ÜSLUP:
         - Resmi Türkçe kullanımı
         - Saygılı ve mesafeli üslup
         - Duygusal ifadelerden kaçınma
         - Kısa ve net cümleler
         - Edilgen çatı tercih edilmeli
         - Gereksiz süslemelerden kaçınma
      
      4. YASAL ATIFLAR:
         - İlgili kanun ve yönetmeliklere atıf
         - Madde numaraları açıkça belirtilmeli
         - Tarih ve sayı bilgileri eksiksiz
    `;

    let prompt = '';

    switch (type) {
      case 'traffic':
        prompt = `${professionalWritingRules}
        
        GÖREV: Profesyonel bir TRAFİK CEZASI İTİRAZ DİLEKÇESİ oluştur.
        
        MUHATAP: ${formData.city.toUpperCase()} NÖBETÇİ SULH CEZA HAKİMLİĞİNE
        
        DİLEKÇE SAHİBİ BİLGİLERİ:
        - Ad Soyad: ${formData.fullName}
        - T.C. Kimlik No: ${formData.tcNo}
        - Adres: ${formData.address}
        - Telefon: ${formData.phone}
        
        CEZA BİLGİLERİ:
        - Araç Plakası: ${formData.plateNo}
        - Ceza Tarihi ve Saati: ${formData.penaltyDate}
        - Tutanak No: ${formData.penaltyNo}
        - Ceza Tutarı: ${formData.amount} TL
        - Tebliğ Tarihi: ${formData.notificationDate}
        
        İTİRAZ GEREKÇESİ: ${formData.reason}
        
        ÖNEMLİ NOTLAR:
        1. Karayolları Trafik Kanunu'nun 116. maddesine göre itiraz süresi 15 gündür
        2. İtiraz gerekçeleri madde madde, net ve kanıtlara dayalı yazılmalı
        3. "İTİRAZ GEREKÇELERİM:" başlığı altında detaylandır
        4. Varsa tanık, kamera kaydı, GPS verisi gibi delilleri belirt
        5. Cezanın hukuka aykırı olduğunu ve iptalini talep et
        
        ÇIKTI FORMATI: Düz metin, markdown işareti YOK, her bölüm arasında uygun boşluk`;
        break;

      case 'tax':
        prompt = `${professionalWritingRules}
        
        GÖREV: Profesyonel bir VERGİ/SGK DİLEKÇESİ oluştur.
        
        MUHATAP: ${formData.taxOffice.toUpperCase()}
        
        MÜKELLEF BİLGİLERİ:
        - Ad Soyad/Unvan: ${formData.fullName}
        - T.C./Vergi No: ${formData.idNo}
        - Adres: ${formData.address}
        - Telefon: ${formData.phone}
        
        TALEP DETAYLARI:
        - Talep Tipi: ${formData.requestType}
        - Borç Türü: ${formData.debtType}
        - Borç Dönemi: ${formData.debtPeriod}
        - Gerekçe: ${formData.reason}
        
        ÖNEMLİ NOTLAR:
        1. İlgili vergi kanunlarına (VUK, GVK, KVK) atıf yap
        2. Yapılandırma talebiyse 7440 sayılı kanun veya güncel yapılandırma kanununa atıf
        3. Mali durumu objektif şekilde açıkla
        4. Ödeme güçlüğünün geçici olduğunu vurgula
        5. Talep edilen taksit sayısı veya indirim oranını belirt
        
        ÇIKTI FORMATI: Düz metin, markdown işareti YOK`;
        break;

      case 'job':
        prompt = `${professionalWritingRules}
        
        GÖREV: Profesyonel bir İŞ BAŞVURU MEKTUBU oluştur (dilekçe formatında değil, modern iş başvuru mektubu).
        
        ŞİRKET: ${formData.company}
        POZİSYON: ${formData.position}
        
        ADAY BİLGİLERİ:
        - Ad Soyad: ${formData.fullName}
        - E-posta: ${formData.email}
        - Telefon: ${formData.phone}
        
        ADAY NİTELİKLERİ:
        - Yetenekler: ${formData.skills}
        - Motivasyon: ${formData.motivation}
        
        ÖNEMLİ NOTLAR:
        1. Modern ve profesyonel bir dil kullan
        2. Resmi dilekçe formatı DEĞİL, kurumsal mektup formatı
        3. Şirketin değerlerine ve pozisyonun gerekliliklerine odaklan
        4. Somut başarılar ve deneyimlerle destekle
        5. Özgün ve samimi bir ton kullan
        6. 3-4 paragrafı geçmesin
        
        ÇIKTI FORMATI: Modern iş mektubu formatı`;
        break;

      case 'complaint':
        prompt = `${professionalWritingRules}
        
        GÖREV: Profesyonel bir ŞİKAYET DİLEKÇESİ oluştur.
        
        MUHATAP: ${formData.institution.toUpperCase()}
        
        ŞİKAYETÇİ BİLGİLERİ:
        - Ad Soyad: ${formData.fullName}
        - T.C. Kimlik No: ${formData.tcNo}
        - Adres: ${formData.address}
        - Telefon: ${formData.phone}
        
        ŞİKAYET DETAYLARI:
        - Konu: ${formData.subject}
        - Olay Tarihi: ${formData.complaintDate}
        - Şikayet: ${formData.complaint}
        - Talep: ${formData.request}
        
        ÖNEMLİ NOTLAR:
        1. Olayı kronolojik sırayla, tarafsız anlat
        2. Tarih, saat, yer bilgilerini eksiksiz ver
        3. Varsa tanık isimlerini belirt
        4. Uğranılan zarar veya mağduriyeti açıkla
        5. İlgili kanun ve yönetmeliklere atıf yap (Tüketici Kanunu, TCK vb.)
        6. Somut talep ve çözüm önerisi sun
        
        ÇIKTI FORMATI: Düz metin, markdown işareti YOK`;
        break;

      case 'leave':
        prompt = `${professionalWritingRules}
        
        GÖREV: Profesyonel bir İZİN TALEP DİLEKÇESİ oluştur.
        
        MUHATAP: ${formData.company} ${formData.department || 'İNSAN KAYNAKLARI MÜDÜRLÜĞÜNE'}
        
        PERSONEL BİLGİLERİ:
        - Ad Soyad: ${formData.fullName}
        - Pozisyon: ${formData.position}
        - Telefon: ${formData.phone}
        
        İZİN DETAYLARI:
        - İzin Türü: ${formData.leaveType}
        - Başlangıç: ${formData.startDate}
        - Bitiş (İşe Dönüş): ${formData.endDate}
        - Açıklama: ${formData.reason || 'Belirtilmemiş'}
        
        ÖNEMLİ NOTLAR:
        1. İş Kanunu'nun ilgili maddelerine atıf (yıllık izin için md. 53-54)
        2. İzin süresini net belirt (kaç gün)
        3. Yokluğunda işlerin aksamaması için alınan tedbirleri belirt
        4. Gerekiyorsa vekil personel önerisi yap
        5. Kısa ve öz tut
        
        ÇIKTI FORMATI: Düz metin, markdown işareti YOK`;
        break;

      case 'school':
        prompt = `${professionalWritingRules}
        
        GÖREV: Profesyonel bir ÖĞRENCİ DİLEKÇESİ oluştur.
        
        MUHATAP: ${formData.school.toUpperCase()} ${formData.department.toUpperCase()}
        
        ÖĞRENCİ BİLGİLERİ:
        - Ad Soyad: ${formData.fullName}
        - Öğrenci No: ${formData.studentNo}
        - T.C. Kimlik No: ${formData.tcNo}
        - Telefon: ${formData.phone}
        - E-posta: ${formData.email}
        
        TALEP DETAYLARI:
        - Talep Türü: ${formData.requestType}
        - Açıklama: ${formData.details}
        
        ÖNEMLİ NOTLAR:
        1. YÖK ve üniversite yönetmeliklerine atıf yap
        2. Akademik gerekçeleri net açıkla
        3. Varsa sağlık raporu, transkript gibi belgeleri ekle
        4. Öğrenci numarası ve bölüm bilgisini mutlaka belirt
        5. Saygılı ve akademik bir dil kullan
        
        ÇIKTI FORMATI: Düz metin, markdown işareti YOK`;
        break;

      default:
        prompt = `${professionalWritingRules}
        
        GÖREV: Profesyonel bir GENEL DİLEKÇE oluştur.
        
        MUHATAP: ${formData.institution.toUpperCase()}
        
        DİLEKÇE SAHİBİ:
        - Ad Soyad: ${formData.fullName}
        - T.C. Kimlik No: ${formData.tcNo || 'Belirtilmemiş'}
        - Adres: ${formData.address}
        - Telefon: ${formData.phone}
        
        DİLEKÇE İÇERİĞİ:
        - Konu: ${formData.subject}
        - Talep: ${formData.content}
        
        ÇIKTI FORMATI: Düz metin, markdown işareti YOK`;
        break;
    }

    // Dilekçe oluştur
    const result = await model.generateContent(prompt);
    const response = result.response;
    const content = formatDilekce(response.text());

    // Kullanıcı varsa kaydet
    const { data: { user } } = await supabase.auth.getUser();
    if (user) {
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
    console.error('API Error:', error);
    return NextResponse.json(
      { success: false, error: 'Dilekçe oluşturulurken sunucu tarafında bir hata oluştu.' },
      { status: 500 }
    );
  }
}