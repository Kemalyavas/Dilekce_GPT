// /src/templates/dilekce-templates.ts DOSYASININ TAMAMI

export const dilekceExamples = {
  traffic: {
    title: "Trafik Cezası İtiraz Dilekçesi",
    fields: {
      fullName: "Ahmet Yılmaz",
      tcNo: "12345678901",
      phone: "0555 123 4567",
      address: "Cumhuriyet Mah. Atatürk Cad. No: 123 Daire: 4, Kadıköy/İstanbul",
      city: "İstanbul",
      plateNo: "34 ABC 123",
      penaltyNo: "MA-12345678",
      penaltyDate: "2025-06-15T14:30",
      notificationDate: "2025-06-25",
      amount: "1506",
      reason: "Tarafıma kesilen 'kırmızı ışık ihlali' konulu cezayı kabul etmiyorum. Belirtilen tarih ve saatte aracım, ikametgahıma ait kapalı otoparkta park halinde bulunmaktaydı. Otoparkın giriş ve çıkış saatlerini gösteren güvenlik kamerası kayıtlarının celbini talep ediyorum. Bu nedenle haksız ve hukuka aykırı olarak düzenlenen cezanın iptalini talep ederim."
    }
  },
  tax: {
    title: "Vergi Borcuna İtiraz Dilekçesi",
    fields: {
      institution: "Vergi Dairesi Başkanlığına",
      taxOffice: "Maslak Vergi Dairesi Müdürlüğüne",
      fullName: "Elif Kaya",
      idNo: "10987654321",
      address: "Vadi Mah. Park Sok. No: 1 D: 2, Sarıyer/İstanbul",
      phone: "0532 987 6543",
      requestType: "Borca İtiraz",
      debtType: "Gelir Vergisi",
      debtPeriod: "2024 Yılı",
      reason: "Tarafıma 2024 yılı için tahakkuk ettirilen gelir vergisi borcunda maddi hata olduğunu düşünmekteyim. Beyan ettiğim gelir ile tahakkuk eden vergi arasında uyuşmazlık mevcuttur. Konunun incelenerek yapılan hatanın düzeltilmesini ve borcun yeniden hesaplanmasını talep ediyorum."
    }
  },
  job: {
    title: "İş Başvurusu Ön Yazı",
    fields: {
      company: "TeknoSoft Yazılım A.Ş.",
      position: "Kıdemli Frontend Geliştirici",
      fullName: "Murat Öztürk",
      email: "murat.ozturk@email.com",
      phone: "0545 111 2233",
      skills: "React, TypeScript ve Next.js konularında 5 yıldan fazla tecrübem bulunmaktadır. Büyük ölçekli e-ticaret platformlarının geliştirilmesinde ve performans optimizasyonunda aktif rol aldım.",
      motivation: "TeknoSoft'un yenilikçi projelerini ve sektördeki lider konumunu uzun süredir ilgiyle takip ediyorum. Özellikle kullanıcı deneyimine verdiğiniz önemin, benim kariyer hedeflerimle birebir örtüştüğüne inanıyorum. Yeteneklerimle ekibinize değer katacağıma ve birlikte harika işler başaracağımıza eminim."
    }
  },
  complaint: {
    title: "Şikayet Dilekçesi",
    fields: {
      institution: "ABC Kargo Şirketi Genel Müdürlüğüne",
      fullName: "Hasan Vural",
      tcNo: "11223344556",
      address: "Örnek Mah. Test Sok. No: 1, Ankara",
      phone: "0505 111 2233",
      subject: "Teslim Edilmeyen ve Hasarlı Ürün Hakkında",
      complaintDate: "2025-06-20",
      complaint: "15.06.2025 tarihinde XYZ E-Ticaret sitesinden satın aldığım 987654 numaralı siparişim, şirketiniz tarafından taşınmak üzere 17.06.2025 tarihinde yola çıkmıştır. Ancak ürün tarafıma teslim edilmediği gibi, kargo takip sisteminde 'teslim edildi' olarak görünmektedir. Müşteri hizmetlerinizle yaptığım görüşmede tatmin edici bir yanıt alamadım. Bu durumdan dolayı mağdur olmuş bulunmaktayım.",
      request: "Siparişimin bedeli olan 450 TL'nin tarafıma iade edilmesini veya ürünün hasarsız ve eksiksiz bir şekilde derhal tarafıma teslim edilmesini talep ediyorum."
    }
  },
  leave: {
    title: "İzin Talep Dilekçesi",
    fields: {
      company: "Yıldız Holding A.Ş.",
      department: "İnsan Kaynakları Müdürlüğüne",
      fullName: "Ayşe Güneş",
      position: "Pazarlama Uzmanı",
      phone: "0555 888 7766",
      leaveType: "Yıllık Ücretli İzin",
      startDate: "2025-08-01",
      endDate: "2025-08-15",
      reason: "Yasal yıllık ücretli iznimin bir kısmını kullanmak istiyorum."
    }
  },
  school: {
    title: "Okul İşlemleri Dilekçesi",
    fields: {
      school: "Marmara Üniversitesi",
      department: "İktisat Fakültesi Dekanlığına",
      fullName: "Zeynep Öztürk",
      studentNo: "190712345",
      tcNo: "10987654321",
      phone: "0555 987 6543",
      email: "zeynep.ozturk@ornek.com",
      requestType: "Sınav Sonucuna İtiraz",
      details: "Fakülteniz İşletme Bölümü 2. sınıf öğrencisiyim. 10.06.2025 tarihinde yapılan 'IKT202 - Mikroekonomi' dersi final sınavı sonucumun, sınav performansıma göre beklentimin çok altında (FF) olarak ilan edildiğini gördüm. Sınav kağıdımın maddi hata yönünden tekrar incelenmesini ve sonucun yeniden değerlendirilmesini talep ediyorum."
    }
  },
  other: {
    title: "Genel Dilekçe",
    fields: {
      institution: "Beşiktaş Belediyesi Zabıta Müdürlüğüne",
      fullName: "Mehmet Çelik",
      tcNo: "12312312312",
      address: "Barbaros Mah. Çiçek Sok. No: 5, Beşiktaş/İstanbul",
      phone: "0507 123 4567",
      subject: "Kaldırım İşgali ve Gürültü Şikayeti",
      content: "İkamet ettiğim Çiçek Sokak üzerinde bulunan 'Cafe X' isimli işletme, yasal sınırların çok üzerinde bir alanda kaldırıma masa ve sandalye koyarak yaya geçişini engellemektedir. Ayrıca, gece geç saatlere kadar yüksek sesli müzik yayını yaparak çevreye rahatsızlık vermektedir. Gerekli denetimlerin yapılarak kaldırım işgalinin sonlandırılması ve gürültü seviyesinin yasal sınırlara çekilmesi için gereğinin yapılmasını arz ederim."
    }
  }
};