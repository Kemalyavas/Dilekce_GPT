// /src/app/api/generate/route.ts DOSYASININ TAMAMI

import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { createClient } from '@/lib/supabase/server';
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');

const formatDilekce = (content: string) => {
  return content.split('\n').map(line => line.trim()).join('\n');
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
    const currentDate = new Date().toLocaleDateString('tr-TR');

    const baseInstructions = `
      Sen, Türkiye Cumhuriyeti'ndeki resmi yazışma ve dilekçe kurallarını çok iyi bilen, Anayasa'nın 74. ve 3071 sayılı Dilekçe Hakkının Kullanılmasına Dair Kanun'un ruhuna hakim, deneyimli bir dilekçe yazarı asistanısın. Görevin, aşağıda verilen kullanıcı bilgilerini kullanarak, hukuki geçerliliği yüksek, dilbilgisi kurallarına tam uyumlu, ikna edici ve profesyonel bir dille dilekçe metni oluşturmaktır.

      DİLEKÇE OLUŞTURMA KURALLARI:

      1.  **ÇIKTI FORMATI:** Çıktı KESİNLİKLE Markdown (\`\`\`, **, # gibi) İÇERMEMELİDİR. Sadece ve sadece düz metin (plain text) olmalıdır. Her bölüm arasında bir veya iki satır boşluk bırakarak okunabilirliği artır.
      2.  **BAŞLIK (MUHATAP MAKAM):** Dilekçenin en üstüne, tamamı BÜYÜK HARFLERLE ve ortalanmış olarak hitap edilecek makam yazılmalıdır.
      3.  **SAĞ BLOK (TARİH/AD-SOYAD):** Dilekçe metninin en sonuna, sağa yaslanmış bir blok halinde önce güncel tarih, altına da ad-soyad ve imza için boşluk bırakılmalıdır.
      4.  **İLETİŞİM BİLGİLERİ:** Metnin sonunda, imza bloğunun altında sola yaslı olarak Adres, T.C. Kimlik No ve Telefon gibi iletişim bilgileri yer almalıdır.
      5.  **KONU:** "KONU:" başlığı altında, dilekçenin içeriğini bir cümlede özetleyen kısa ve net bir ifade bulunmalıdır.
      6.  **HİYERARŞİK ÜSLUP (ARZ/RİCA):** Talep cümlesi makamın hiyerarşisine uygun olmalıdır. Üst makama veya aynı seviyeye "saygılarımla arz ederim", alt makama "rica ederim" kullanılmalıdır. Şüphede kalındığında "arz ederim" daha güvenlidir.
      7.  **YAPI:** Açıklamalar, varsa yasal dayanaklar ve "SONUÇ VE İSTEM" bölümleri net bir şekilde ayrılmalıdır.
    `;

    let prompt = '';

    switch (type) {
      case 'traffic':
        prompt = `${baseInstructions}
        Dilekçe Türü: Trafik Cezası İtiraz Dilekçesi (Sulh Ceza Hakimliği'ne)
        Kullanıcı Bilgileri:
        - Hitap Edilecek Makam: ${formData.city} NÖBETÇİ SULH CEZA HAKİMLİĞİ'NE
        - İtiraz Eden: ${formData.fullName}, T.C. No: ${formData.tcNo}
        - Adres: ${formData.address}, Tel: ${formData.phone}
        - Araç Plakası: ${formData.plateNo}
        - Ceza Bilgileri: ${formData.penaltyDate} tarihli, ${formData.penaltyNo} numaralı, ${formData.amount} TL tutarındaki ceza.
        - Tebliğ Tarihi: ${formData.notificationDate}
        - İtiraz Gerekçesi: ${formData.reason}
        Görev: Karayolları Trafik Kanunu çerçevesinde, cezanın haksız olduğunu hukuki bir dille anlatan ve cezanın iptalini talep eden bir itiraz dilekçesi oluştur. "İTİRAZ GEREKÇELERİM" ve "SONUÇ VE İSTEM" başlıklarını kullan.`;
        break;

      case 'tax':
        prompt = `${baseInstructions}
        Dilekçe Türü: Vergi/SGK Borcuna İtiraz veya Yapılandırma Talebi
        Kullanıcı Bilgileri:
        - Hitap Edilecek Makam: ${formData.institution} (${formData.taxOffice} Vergi Dairesi / SGK Müdürlüğü)
        - Mükellef/Borçlu: ${formData.fullName}, T.C./Vergi No: ${formData.idNo}
        - Adres: ${formData.address}, Tel: ${formData.phone}
        - Talep Tipi: ${formData.requestType}
        - Borç Türü ve Dönemi: ${formData.debtType}, ${formData.debtPeriod}
        - İtiraz/Talep Gerekçesi: ${formData.reason}
        Görev: Kullanıcının talebine göre (itiraz veya yapılandırma), ilgili kuruma sunulacak resmi bir dilekçe oluştur. İtiraz ise gerekçeleri net maddelerle açıkla. Yapılandırma ise ilgili kanun (örn: 7440 sayılı kanun) kapsamında borcun taksitlendirilmesini talep et.`;
        break;

      case 'job':
        prompt = `${baseInstructions}
        Dilekçe Türü: İş Başvurusu İçin Ön Yazı
        Kullanıcı Bilgileri:
        - Hitap Edilecek Makam: ${formData.company} İnsan Kaynakları Departmanına
        - Aday: ${formData.fullName}
        - İletişim: ${formData.email}, ${formData.phone}
        - Başvurulan Pozisyon: ${formData.position}
        - Adayın Yetenekleri ve Deneyimi: ${formData.skills}
        - Motivasyon/Neden Bu Şirket?: ${formData.motivation}
        Görev: Bu bir dilekçe değil, profesyonel bir iş başvurusu ön yazısıdır. Resmi ama akıcı bir dil kullan. Adayın pozisyona uygunluğunu, yeteneklerini ve şirkete katacağı değeri vurgula. Standart bir mektup yerine, adayın motivasyonunu yansıtan, ikna edici ve samimi bir metin oluştur. "Saygılarımla," ifadesiyle bitir.`;
        break;

      case 'complaint':
        prompt = `${baseInstructions}
        Dilekçe Türü: Şikayet Dilekçesi
        Kullanıcı Bilgileri:
        - Hitap Edilecek Makam: ${formData.institution}
        - Şikayetçi: ${formData.fullName}, T.C. No: ${formData.tcNo}
        - Adres: ${formData.address}, Tel: ${formData.phone}
        - Şikayet Konusu: ${formData.subject}
        - Olay Tarihi: ${formData.complaintDate}
        - Şikayet Detayları: ${formData.complaint}
        - Talep: ${formData.request}
        Görev: Yaşanan sorunu ve mağduriyeti kronolojik sırayla, açıkça anlatan bir şikayet dilekçesi oluştur. "SONUÇ VE İSTEM" bölümünde, şikayet edilen durumun düzeltilmesi için net bir talepte bulun.`;
        break;

      case 'leave':
        prompt = `${baseInstructions}
        Dilekçe Türü: İzin Talep Dilekçesi
        Kullanıcı Bilgileri:
        - Hitap Edilecek Makam: ${formData.company} İnsan Kaynakları Müdürlüğüne (veya ilgili departman)
        - Personel: ${formData.fullName}, Görevi: ${formData.position}
        - İletişim: ${formData.phone}
        - İzin Türü: ${formData.leaveType}
        - İzin Tarihleri: ${formData.startDate} başlangıç ve ${formData.endDate} bitiş tarihleri arasında.
        - Açıklama: ${formData.reason}
        Görev: Personelin izin talebini içeren kısa, net ve resmi bir dilekçe oluştur. Yasal hak olduğunu belirterek veya mazereti kısaca açıklayarak, belirtilen tarihlerde izinli sayılması için onay talep et.`;
        break;

      case 'school':
        prompt = `${baseInstructions}
        Dilekçe Türü: Okul İdaresine Dilekçe
        Kullanıcı Bilgileri:
        - Hitap Edilecek Makam: ${formData.school} ${formData.department}
        - Öğrenci: ${formData.fullName}, Öğrenci No: ${formData.studentNo}, T.C. No: ${formData.tcNo}
        - İletişim: ${formData.phone}, ${formData.email}
        - Talep Türü: ${formData.requestType}
        - Talep Detayları: ${formData.details}
        Görev: Öğrencinin talebini resmi ve saygılı bir dille ifade eden bir dilekçe oluştur. Talebin nedenlerini ve öğrencinin durumunu açıkça belirt.`;
        break;

      default:
        prompt = `${baseInstructions}
        Dilekçe Türü: Genel Amaçlı Dilekçe
        Kullanıcı Bilgileri:
        - Hitap Edilecek Makam: ${formData.institution}
        - Talepte Bulunan: ${formData.fullName}
        - İletişim: ${JSON.stringify({ phone: formData.phone, email: formData.email, address: formData.address })}
        - Konu: ${formData.subject}
        - İçerik: ${formData.content}
        Görev: Verilen bilgileri kullanarak, yapılandırılmış ve resmi bir genel dilekçe metni oluştur.`;
        break;
    }

    const result = await model.generateContent(prompt);
    const response = result.response;
    const content = formatDilekce(response.text());

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