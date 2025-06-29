import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { createClient } from '@/lib/supabase/server';
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');

const formatDilekce = (content: string) => {
  // Satır başlarındaki gereksiz boşlukları temizle
  return content.split('\n').map(line => line.trim()).join('\n');
};

// Mevcut POST fonksiyonunu silip bunu yapıştırın.

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

    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });
    const currentDate = new Date().toLocaleDateString('tr-TR');

    // --- YENİ VE GELİŞTİRİLMİŞ PROMPT'LAR ---

    // Genel talimatlar her prompt'a eklenecek
    const baseInstructions = `
      Sen, Türkiye'deki resmi yazışma kurallarını çok iyi bilen, deneyimli bir dilekçe yazarısın.
      Aşağıdaki bilgileri kullanarak, istenen dilekçeyi oluştur.
      
      ÖNEMLİ KURALLAR:
      1. Çıktı KESİNLİKLE Markdown (` + "```" + `, ** gibi) İÇERMEMELİDİR. Tamamen düz metin (plain text) olmalıdır.
      2. Tarih ve İmza bloğu metnin sağ tarafında olacak şekilde konumlandırılmalıdır.
      3. Hitap edilen makam en üste, ortalı ve büyük harflerle yazılmalıdır.
      4. Kullanılan dil son derece resmi, saygılı, net ve ikna edici olmalıdır.
      5. Yazım ve dil bilgisi kurallarına %100 uyulmalıdır.
      6. Dilekçenin sonunda mutlaka "Gereğinin yapılmasını saygılarımla arz ederim." gibi resmi bir talep cümlesi bulunmalıdır.
    `;

    let prompt = '';

    switch (type) {
      case 'traffic':
        prompt = `${baseInstructions}
        
        Dilekçe Türü: Trafik Cezası İtiraz Dilekçesi
        
        Kullanıcı Bilgileri:
        - Hitap Edilecek Makam: ${formData.city} SULH CEZA HAKİMLİĞİ'NE
        - Ad Soyad: ${formData.fullName}
        - TC No: ${formData.tcNo}
        - Adres: ${formData.address}
        - Telefon: ${formData.phone}
        - Araç Plakası: ${formData.plateNo}
        - Ceza Tutanağı Tarih ve Numarası: ${formData.penaltyDate}, ${formData.penaltyNo}
        - Ceza Tutarı: ${formData.amount} TL
        - İtiraz Gerekçesi: ${formData.reason}
        
        Görev: Yukarıdaki bilgileri kullanarak, cezanın haksız olduğunu hukuki bir dille anlatan ve cezanın iptalini talep eden bir itiraz dilekçesi oluştur. Gerekçeleri net maddeler halinde sırala.`;
        break;

      case 'school':
        prompt = `${baseInstructions}
        
        Dilekçe Türü: Okul İdaresine Sunulacak Talep Dilekçesi
        
        Kullanıcı Bilgileri:
        - Hitap Edilecek Makam: ${formData.school} ${formData.department ? formData.department + ' BÖLÜM BAŞKANLIĞINA' : 'MÜDÜRLÜĞÜNE'}
        - Ad Soyad: ${formData.fullName}
        - Öğrenci No: ${formData.studentNo || 'Belirtilmemiş'}
        - TC No: ${formData.tcNo}
        - Telefon: ${formData.phone}
        - E-posta: ${formData.email}
        - Talep Türü: ${formData.requestType}
        - Talebin Açıklaması: ${formData.details}
        
        Görev: Kullanıcının talebini resmi ve saygılı bir dille ifade eden bir dilekçe oluştur. Örneğin, "Staj yeri bulamıyorum, hoca yardımcı olabilir mi?" gibi bir talebi, "Zorunlu yaz stajımı tamamlayabilmem için tarafıma bir staj danışmanı atanması veya staj yeri bulma konusunda destek olunması hususunda" gibi resmi bir ifadeye dönüştür. Dilekçenin ana metnini bu resmi üslupta oluştur.`;
        break;

      // Diğer dilekçe tipleri için de benzer şekilde detaylı prompt'lar oluşturulabilir...
      // Şimdilik diğerlerini basit bırakıyorum, mantığı anladıktan sonra sen de geliştirebilirsin.

      default:
        prompt = `${baseInstructions}
        
        Dilekçe Türü: Genel Dilekçe
        
        Kullanıcı Bilgileri: ${JSON.stringify(formData, null, 2)}
        
        Görev: Yukarıdaki JSON verilerini kullanarak, verinin tipine en uygun resmi dilekçeyi oluştur.`;
        break;
    }

    const result = await model.generateContent(prompt);
    const response = result.response;
    const content = response.text();
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
      { success: false, error: 'Dilekçe oluşturulurken bir hata oluştu' },
      { status: 500 }
    );
  }
}