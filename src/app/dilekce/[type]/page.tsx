'use client';
import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { ChevronLeft, Download, FileText, Loader2, Copy, CheckCircle, AlertCircle, Sparkles, Info } from 'lucide-react';
import toast, { Toaster } from 'react-hot-toast';
import jsPDF from 'jspdf';

const formFields: any = {
  traffic: [
    { name: 'fullName', label: 'Ad Soyad', type: 'text', required: true, placeholder: 'Örn: Ahmet Yılmaz' },
    { name: 'tcNo', label: 'T.C. Kimlik No', type: 'text', required: true, placeholder: '11 haneli TC kimlik numaranız' },
    { name: 'phone', label: 'Telefon', type: 'tel', required: true, placeholder: 'Örn: 0555 123 4567' },
    { name: 'email', label: 'E-posta', type: 'email', required: true, placeholder: 'ornek@email.com' },
    { name: 'address', label: 'Adres', type: 'textarea', required: true, rows: 3, placeholder: 'Tam adresinizi yazın' },
    { name: 'city', label: 'Şehir', type: 'text', required: true, placeholder: 'Örn: İstanbul' },
    { name: 'plateNo', label: 'Araç Plakası', type: 'text', required: true, placeholder: 'Örn: 34 ABC 123' },
    { name: 'penaltyNo', label: 'Ceza Numarası', type: 'text', required: true, placeholder: 'Ceza tutanağındaki numara' },
    { name: 'penaltyDate', label: 'Ceza Tarihi', type: 'date', required: true },
    { name: 'penaltyLocation', label: 'Ceza Yeri', type: 'text', required: true, placeholder: 'Örn: Atatürk Caddesi' },
    { name: 'amount', label: 'Ceza Tutarı (TL)', type: 'number', required: true, placeholder: 'Örn: 1500' },
    {
      name: 'reason', label: 'İtiraz Gerekçeniz', type: 'textarea', required: true, rows: 5,
      placeholder: 'İtiraz nedeninizi detaylıca açıklayın. Örn: Belirtilen tarih ve saatte aracım park halindeydi...'
    },
  ],
  tax: [
    { name: 'fullName', label: 'Ad Soyad / Şirket Adı', type: 'text', required: true },
    { name: 'tcNo', label: 'T.C. / Vergi No', type: 'text', required: true },
    { name: 'phone', label: 'Telefon', type: 'tel', required: true },
    { name: 'email', label: 'E-posta', type: 'email', required: true },
    { name: 'address', label: 'Adres', type: 'textarea', required: true, rows: 3 },
    { name: 'taxOffice', label: 'Vergi Dairesi', type: 'text', required: true },
    {
      name: 'debtType', label: 'Borç Türü', type: 'select', required: true,
      options: ['Gelir Vergisi', 'KDV', 'ÖTV', 'SGK Primi', 'Diğer']
    },
    { name: 'debtAmount', label: 'Borç Tutarı', type: 'number', required: true },
    { name: 'debtPeriod', label: 'Borç Dönemi', type: 'text', required: true, placeholder: 'Örn: 2024/3. Dönem' },
    { name: 'reason', label: 'İtiraz Gerekçeniz', type: 'textarea', required: true, rows: 5 },
  ],
  job: [
    { name: 'fullName', label: 'Ad Soyad', type: 'text', required: true },
    { name: 'email', label: 'E-posta', type: 'email', required: true },
    { name: 'phone', label: 'Telefon', type: 'tel', required: true },
    { name: 'address', label: 'Adres', type: 'textarea', required: true, rows: 3 },
    { name: 'position', label: 'Başvurulan Pozisyon', type: 'text', required: true },
    { name: 'company', label: 'Başvurulan Şirket', type: 'text', required: true },
    { name: 'experience', label: 'Deneyim (Yıl)', type: 'number', required: true },
    { name: 'education', label: 'Eğitim Durumu', type: 'text', required: true },
    { name: 'skills', label: 'Yetenekler', type: 'textarea', required: true, rows: 3 },
    { name: 'coverLetter', label: 'Ön Yazı', type: 'textarea', required: true, rows: 6 },
  ],
  complaint: [
    { name: 'fullName', label: 'Ad Soyad', type: 'text', required: true },
    { name: 'tcNo', label: 'T.C. Kimlik No', type: 'text', required: true },
    { name: 'phone', label: 'Telefon', type: 'tel', required: true },
    { name: 'email', label: 'E-posta', type: 'email', required: true },
    { name: 'address', label: 'Adres', type: 'textarea', required: true, rows: 3 },
    { name: 'institution', label: 'Şikayet Edilen Kurum', type: 'text', required: true },
    { name: 'subject', label: 'Şikayet Konusu', type: 'text', required: true },
    { name: 'complaintDate', label: 'Olay Tarihi', type: 'date', required: true },
    { name: 'complaint', label: 'Şikayet Detayı', type: 'textarea', required: true, rows: 6 },
  ],
  leave: [
    { name: 'fullName', label: 'Ad Soyad', type: 'text', required: true },
    { name: 'tcNo', label: 'T.C. Kimlik No', type: 'text', required: true },
    { name: 'department', label: 'Çalıştığı Bölüm', type: 'text', required: true },
    { name: 'position', label: 'Görevi', type: 'text', required: true },
    { name: 'company', label: 'Şirket Adı', type: 'text', required: true },
    {
      name: 'leaveType', label: 'İzin Türü', type: 'select', required: true,
      options: ['Yıllık İzin', 'Mazeret İzni', 'Hastalık İzni', 'Doğum İzni', 'Evlilik İzni', 'Ölüm İzni', 'Diğer']
    },
    { name: 'startDate', label: 'İzin Başlangıç Tarihi', type: 'date', required: true },
    { name: 'endDate', label: 'İzin Bitiş Tarihi', type: 'date', required: true },
    { name: 'reason', label: 'İzin Gerekçesi', type: 'textarea', required: true, rows: 4 },
  ],
  school: [
    { name: 'fullName', label: 'Ad Soyad', type: 'text', required: true },
    { name: 'tcNo', label: 'T.C. Kimlik No', type: 'text', required: true },
    { name: 'studentNo', label: 'Öğrenci No', type: 'text', required: false },
    { name: 'phone', label: 'Telefon', type: 'tel', required: true },
    { name: 'email', label: 'E-posta', type: 'email', required: true },
    { name: 'school', label: 'Okul Adı', type: 'text', required: true },
    { name: 'department', label: 'Bölüm', type: 'text', required: false },
    {
      name: 'requestType', label: 'Talep Türü', type: 'select', required: true,
      options: ['Kayıt', 'Kayıt Dondurma', 'Yatay Geçiş', 'Burs Başvurusu', 'Belge Talebi', 'Diğer']
    },
    { name: 'details', label: 'Açıklama', type: 'textarea', required: true, rows: 5 },
  ],
  other: [
    { name: 'fullName', label: 'Ad Soyad', type: 'text', required: true },
    { name: 'tcNo', label: 'T.C. Kimlik No', type: 'text', required: false, placeholder: 'Gerekli ise doldurun' },
    { name: 'phone', label: 'Telefon', type: 'tel', required: true },
    { name: 'email', label: 'E-posta', type: 'email', required: true },
    { name: 'address', label: 'Adres', type: 'textarea', required: false, rows: 3 },
    { name: 'institution', label: 'Dilekçe Verilecek Kurum', type: 'text', required: true, placeholder: 'Örn: ... Belediyesi, ... Müdürlüğü' },
    { name: 'subject', label: 'Dilekçe Konusu', type: 'text', required: true, placeholder: 'Kısa ve net bir başlık yazın' },
    {
      name: 'content', label: 'Dilekçe İçeriği', type: 'textarea', required: true, rows: 8,
      placeholder: 'Talebinizi detaylıca açıklayın. Ne istediğinizi, neden istediğinizi ve varsa dayanaklarınızı belirtin.'
    },
  ]
};

export default function DilekcePage() {
  const params = useParams();
  const router = useRouter();
  const type = params.type as string;

  const [formData, setFormData] = useState<any>({});
  const [loading, setLoading] = useState(false);
  const [generatedContent, setGeneratedContent] = useState('');
  const [showResult, setShowResult] = useState(false);
  const [freeUsesLeft, setFreeUsesLeft] = useState(3);
  const [copied, setCopied] = useState(false);

  const categoryNames: any = {
    traffic: { name: 'Trafik Cezası İtiraz', icon: '🚗', color: 'from-red-500 to-orange-500' },
    tax: { name: 'Vergi/SGK İtiraz', icon: '💰', color: 'from-green-500 to-emerald-500' },
    job: { name: 'İş Başvurusu', icon: '💼', color: 'from-blue-500 to-indigo-500' },
    complaint: { name: 'Şikayet Dilekçesi', icon: '📢', color: 'from-purple-500 to-pink-500' },
    leave: { name: 'İzin Talebi', icon: '📅', color: 'from-yellow-500 to-amber-500' },
    school: { name: 'Okul İşlemleri', icon: '🎓', color: 'from-cyan-500 to-teal-500' },
    other: { name: 'Diğer Dilekçe', icon: '✍️', color: 'from-gray-500 to-slate-500' }
  };

  useEffect(() => {
    const savedUses = localStorage.getItem('freeUsesLeft');
    if (savedUses) {
      setFreeUsesLeft(parseInt(savedUses));
    }
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (freeUsesLeft <= 0) {
      toast.error('Ücretsiz kullanım hakkınız bitti!');
      setTimeout(() => {
        router.push('/#pricing');
      }, 2000);
      return;
    }

    setLoading(true);

    try {
      const response = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type, formData })
      });

      const data = await response.json();

      if (data.success) {
        setGeneratedContent(data.content);
        setShowResult(true);

        // Ücretsiz kullanım hakkını azalt
        const newUsesLeft = freeUsesLeft - 1;
        setFreeUsesLeft(newUsesLeft);
        localStorage.setItem('freeUsesLeft', newUsesLeft.toString());

        toast.success('Dilekçeniz başarıyla oluşturuldu!');
      } else {
        toast.error(data.error || 'Dilekçe oluşturulurken hata oluştu');
      }
    } catch (error) {
      toast.error('Bir hata oluştu, lütfen tekrar deneyin');
    } finally {
      setLoading(false);
    }
  };

  const downloadPDF = () => {
    const pdf = new jsPDF();
    const margin = 25;
    const pageWidth = pdf.internal.pageSize.width;
    const pageHeight = pdf.internal.pageSize.height;
    const maxWidth = pageWidth - (margin * 2);
    let y = margin;

    // Font ayarları
    pdf.setFont('helvetica');

    const lines = generatedContent.split('\n');

    lines.forEach(line => {
      if (y > pageHeight - margin) {
        pdf.addPage();
        y = margin;
      }

      // Başlıklar ve önemli kısımlar için
      if (line.includes('T.C.') || line.includes('KONU:') || line.includes('İTİRAZ GEREKÇELERİM:') ||
        line.includes('SONUÇ VE TALEP:') || line.includes('EKLER:')) {
        pdf.setFontSize(12);
        pdf.setFont('helvetica', 'bold');
      } else {
        pdf.setFontSize(11);
        pdf.setFont('helvetica', 'normal');
      }

      // Boş satırlar
      if (line.trim() === '') {
        y += 7;
        return;
      }

      // Metni sar ve yazdır
      const splitText = pdf.splitTextToSize(line, maxWidth);
      splitText.forEach((textLine: string) => {
        pdf.text(textLine, margin, y);
        y += 6;
      });
    });

    pdf.save(`${categoryNames[type].name.toLowerCase().replace(/ /g, '-')}-dilekce.pdf`);
    toast.success('PDF başarıyla indirildi!');
  };

  const downloadWord = () => {
    const content = generatedContent;
    const blob = new Blob([content], { type: 'application/msword' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${categoryNames[type].name.toLowerCase().replace(/ /g, '-')}-dilekce.doc`;
    a.click();
    window.URL.revokeObjectURL(url);
    toast.success('Word dosyası başarıyla indirildi!');
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(generatedContent);
    setCopied(true);
    toast.success('Metin kopyalandı!');
    setTimeout(() => setCopied(false), 2000);
  };

  if (showResult) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white py-12">
        <Toaster position="top-center" />
        <div className="max-w-4xl mx-auto px-4">
          <div className="bg-white rounded-3xl shadow-2xl overflow-hidden">
            {/* Header */}
            <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-8 text-white">
              <div className="flex justify-between items-center">
                <div>
                  <h1 className="text-3xl font-bold mb-2">Dilekçeniz Hazır! 🎉</h1>
                  <p className="text-blue-100">Hemen indirebilir veya kopyalayabilirsiniz</p>
                </div>
                <button
                  onClick={() => {
                    setShowResult(false);
                    setFormData({});
                  }}
                  className="bg-white/20 hover:bg-white/30 p-3 rounded-xl transition"
                >
                  <ChevronLeft className="w-6 h-6" />
                </button>
              </div>
            </div>

            {/* Content */}
            <div className="p-8">
              <div className="bg-white rounded-xl p-8 shadow-inner border border-gray-200 mb-6">
                <div className="font-sans space-y-4 text-gray-800" style={{ fontFamily: 'Arial, sans-serif', lineHeight: '1.6' }}>
                  <pre className="whitespace-pre-wrap" style={{ fontFamily: 'inherit' }}>
                    {generatedContent}
                  </pre>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="grid md:grid-cols-3 gap-4">
                <button
                  onClick={downloadPDF}
                  className="group bg-gradient-to-r from-blue-600 to-purple-600 text-white py-4 rounded-xl font-semibold hover:shadow-xl transition-all duration-300 flex items-center justify-center"
                >
                  <Download className="w-5 h-5 mr-2 group-hover:translate-y-0.5 transition-transform" />
                  PDF İndir
                </button>
                <button
                  onClick={downloadWord}
                  className="group bg-gradient-to-r from-green-600 to-emerald-600 text-white py-4 rounded-xl font-semibold hover:shadow-xl transition-all duration-300 flex items-center justify-center"
                >
                  <FileText className="w-5 h-5 mr-2 group-hover:translate-y-0.5 transition-transform" />
                  Word İndir
                </button>
                <button
                  onClick={copyToClipboard}
                  className={`${copied
                    ? 'bg-green-500 text-white'
                    : 'border-2 border-gray-300 hover:border-blue-600'
                    } py-4 rounded-xl font-semibold transition-all duration-300 flex items-center justify-center`}
                >
                  {copied ? (
                    <>
                      <CheckCircle className="w-5 h-5 mr-2" />
                      Kopyalandı!
                    </>
                  ) : (
                    <>
                      <Copy className="w-5 h-5 mr-2" />
                      Metni Kopyala
                    </>
                  )}
                </button>
              </div>

              {/* Info Box */}
              <div className="mt-6 bg-blue-50 border border-blue-200 rounded-xl p-4">
                <div className="flex items-start">
                  <AlertCircle className="w-5 h-5 text-blue-600 mt-0.5 mr-2 flex-shrink-0" />
                  <div className="text-sm text-blue-800">
                    <p className="font-semibold mb-1">Önemli Hatırlatmalar:</p>
                    <ul className="list-disc list-inside space-y-1">
                      <li>Dilekçenizi imzalamayı unutmayın</li>
                      <li>Varsa ek belgeleri dilekçeye ekleyin</li>
                      <li>Dilekçenin bir kopyasını saklayın</li>
                      <li>İlgili kuruma elden veya posta yoluyla teslim edin</li>
                    </ul>
                  </div>
                </div>
              </div>

              {/* New Dilekce Button */}
              <button
                onClick={() => {
                  setShowResult(false);
                  setFormData({});
                }}
                className="w-full mt-6 bg-gray-100 hover:bg-gray-200 py-3 rounded-xl font-semibold transition flex items-center justify-center"
              >
                <FileText className="w-5 h-5 mr-2" />
                Yeni Dilekçe Oluştur
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white py-12">
      <Toaster position="top-center" />
      <div className="max-w-2xl mx-auto px-4">
        <div className="bg-white rounded-3xl shadow-2xl overflow-hidden">
          {/* Header */}
          <div className={`bg-gradient-to-r ${categoryNames[type]?.color || 'from-blue-600 to-purple-600'} p-8 text-white`}>
            <div className="flex items-center mb-4">
              <button
                onClick={() => router.push('/')}
                className="bg-white/20 hover:bg-white/30 p-2 rounded-lg transition mr-4"
              >
                <ChevronLeft className="w-6 h-6" />
              </button>
              <div className="text-5xl mr-4">{categoryNames[type]?.icon}</div>
              <div>
                <h1 className="text-2xl font-bold">{categoryNames[type]?.name}</h1>
                <p className="text-white/80">Bilgileri eksiksiz doldurun</p>
              </div>
            </div>

            {/* Free Uses Alert */}
            {freeUsesLeft > 0 ? (
              <div className="bg-white/20 rounded-xl p-3 flex items-center">
                <Sparkles className="w-5 h-5 mr-2" />
                <span className="font-semibold">{freeUsesLeft} ücretsiz hakkınız kaldı</span>
              </div>
            ) : (
              <div className="bg-red-500/20 rounded-xl p-3 flex items-center">
                <AlertCircle className="w-5 h-5 mr-2" />
                <span>Ücretsiz hakkınız bitti. Paketlerimize göz atın!</span>
              </div>
            )}
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="p-8 space-y-6">
            {/* Form Açıklaması */}
            <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 mb-6">
              <div className="flex items-start">
                <Info className="w-5 h-5 text-blue-600 mt-0.5 mr-2 flex-shrink-0" />
                <div className="text-sm text-blue-800">
                  <p>Lütfen tüm alanları doğru ve eksiksiz doldurun. Dilekçeniz resmi formata uygun olarak hazırlanacaktır.</p>
                </div>
              </div>
            </div>

            {formFields[type]?.map((field: any) => (
              <div key={field.name} className="group">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {field.label} {field.required && <span className="text-red-500">*</span>}
                </label>

                {field.type === 'textarea' ? (
                  <textarea
                    name={field.name}
                    required={field.required}
                    rows={field.rows || 3}
                    placeholder={field.placeholder}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 resize-none"
                    onChange={(e) => setFormData({ ...formData, [field.name]: e.target.value })}
                    value={formData[field.name] || ''}
                  />
                ) : field.type === 'select' ? (
                  <select
                    name={field.name}
                    required={field.required}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                    onChange={(e) => setFormData({ ...formData, [field.name]: e.target.value })}
                    value={formData[field.name] || ''}
                  >
                    <option value="">Seçiniz</option>
                    {field.options.map((opt: string) => (
                      <option key={opt} value={opt}>{opt}</option>
                    ))}
                  </select>
                ) : (
                  <input
                    type={field.type}
                    name={field.name}
                    required={field.required}
                    placeholder={field.placeholder}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                    onChange={(e) => setFormData({ ...formData, [field.name]: e.target.value })}
                    value={formData[field.name] || ''}
                  />
                )}
              </div>
            ))}

            <button
              type="submit"
              disabled={loading || freeUsesLeft <= 0}
              className={`w-full ${freeUsesLeft <= 0
                ? 'bg-gray-300 cursor-not-allowed'
                : 'bg-gradient-to-r from-blue-600 to-purple-600 hover:shadow-xl transform hover:scale-[1.02]'
                } text-white py-4 rounded-xl font-semibold transition-all duration-300 flex items-center justify-center`}
            >
              {loading ? (
                <>
                  <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                  Dilekçe Oluşturuluyor...
                </>
              ) : freeUsesLeft <= 0 ? (
                <>
                  <AlertCircle className="w-5 h-5 mr-2" />
                  Ücretsiz Hakkınız Bitti
                </>
              ) : (
                <>
                  <FileText className="w-5 h-5 mr-2" />
                  Dilekçeyi Oluştur
                </>
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}