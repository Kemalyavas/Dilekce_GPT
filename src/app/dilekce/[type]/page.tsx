'use client';
import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { ChevronLeft, Download, FileText, Loader2, Copy, CheckCircle, AlertCircle, Sparkles, Info } from 'lucide-react';
import toast, { Toaster } from 'react-hot-toast';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

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

  const downloadPDF = async () => {
    // Önce dilekçe içeriğini bir div'e render et
    const element = document.createElement('div');
    element.style.position = 'absolute';
    element.style.left = '-9999px';
    element.style.top = '-9999px';
    element.style.width = '210mm';
    element.style.minHeight = '297mm';
    element.style.padding = '25mm 20mm';
    element.style.backgroundColor = 'white';
    element.style.fontFamily = 'Arial, sans-serif';
    element.style.fontSize = '12pt';
    element.style.lineHeight = '1.6';
    element.style.color = '#000';

    // İçeriği HTML olarak oluştur
    const lines = generatedContent.split('\n');
    let htmlContent = '';
    let skipNext = false;

    lines.forEach((line, index) => {
      if (skipNext) {
        skipNext = false;
        return;
      }

      // Ana başlık
      if (line.includes('REKTÖRLÜĞÜNE') || line.includes('MÜDÜRLÜĞÜNE') ||
        line.includes('BAŞKANLIĞINA') || line.includes('HAKİMLİĞİNE')) {
        htmlContent += `<h1 style="text-align: center; font-size: 14pt; font-weight: bold; margin: 0 0 10px 0;">${line.trim()}</h1>`;
      }
      // Alt başlık
      else if (index === 1 && line.trim() && lines[0].includes('REKTÖRLÜĞÜNE')) {
        htmlContent += `<h2 style="text-align: center; font-size: 13pt; font-weight: bold; margin: 0 0 30px 0;">${line.trim()}</h2>`;
      }
      // Sayın ile başlayan satırlar
      else if (line.trim().startsWith('Sayın')) {
        htmlContent += `<p style="margin: 20px 0 20px 0;">${line.trim()}</p>`;
      }
      // Tarih ve imza bloğu
      else if (line.includes('Tarih:')) {
        htmlContent += `<div style="text-align: right; margin-top: 50px;">`;
        htmlContent += `<p style="margin: 5px 0;">${line.trim()}</p>`;

        // Sonraki satırları da ekle
        let nextIndex = index + 1;
        while (nextIndex < lines.length && lines[nextIndex].trim()) {
          htmlContent += `<p style="margin: 5px 0;">${lines[nextIndex].trim()}</p>`;
          nextIndex++;
          skipNext = true;
        }
        htmlContent += `</div>`;
      }
      // Konu başlıkları
      else if (line.includes('KONU:') || line.includes('İTİRAZ GEREKÇELERİM:') ||
        line.includes('SONUÇ VE TALEP:') || line.includes('EKLER:')) {
        htmlContent += `<h3 style="font-weight: bold; margin: 20px 0 10px 0;">${line.trim()}</h3>`;
      }
      // Madde numaraları
      else if (/^\d+\./.test(line.trim())) {
        htmlContent += `<p style="margin: 5px 0 5px 20px;">${line.trim()}</p>`;
      }
      // Boş satır
      else if (line.trim() === '') {
        htmlContent += `<div style="height: 15px;"></div>`;
      }
      // Normal paragraf
      else if (line.trim()) {
        htmlContent += `<p style="text-align: justify; margin: 0 0 10px 0;">${line.trim()}</p>`;
      }
    });

    element.innerHTML = htmlContent;
    document.body.appendChild(element);

    try {
      // HTML'i canvas'a çevir
      const canvas = await html2canvas(element, {
        scale: 2,
        useCORS: true,
        logging: false,
        backgroundColor: '#ffffff'
      });

      // Canvas'ı PDF'e dönüştür
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4'
      });

      const imgWidth = 210;
      const pageHeight = 297;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      let heightLeft = imgHeight;
      let position = 0;

      // İlk sayfaya ekle
      pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;

      // Eğer birden fazla sayfa gerekiyorsa
      while (heightLeft >= 0) {
        position = heightLeft - imgHeight;
        pdf.addPage();
        pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
        heightLeft -= pageHeight;
      }

      // PDF'i kaydet
      const fileName = `${categoryNames[type].name.toLowerCase().replace(/ /g, '-')}-dilekce-${new Date().toISOString().split('T')[0]}.pdf`;
      pdf.save(fileName);

      toast.success('PDF başarıyla indirildi!');
    } catch (error) {
      console.error('PDF oluşturma hatası:', error);
      toast.error('PDF oluşturulurken bir hata oluştu');
    } finally {
      // Temp elementi kaldır
      document.body.removeChild(element);
    }
  };

  const downloadWord = () => {
    // Word formatı için HTML oluştur
    const htmlContent = `
    <html xmlns:o='urn:schemas-microsoft-com:office:office' xmlns:w='urn:schemas-microsoft-com:office:word' xmlns='http://www.w3.org/TR/REC-html40'>
    <head>
      <meta charset="UTF-8">
      <title>Dilekçe</title>
      <style>
        @page {
          size: A4;
          margin: 2.5cm;
        }
        body {
          font-family: "Times New Roman", Times, serif;
          font-size: 12pt;
          line-height: 1.5;
          color: #000;
        }
        .header {
          text-align: center;
          font-weight: bold;
          font-size: 14pt;
          margin-bottom: 10pt;
        }
        .sub-header {
          text-align: center;
          font-weight: bold;
          font-size: 13pt;
          margin-bottom: 20pt;
        }
        .date-signature {
          text-align: right;
          margin-top: 50pt;
        }
        .content {
          text-align: justify;
          margin-bottom: 10pt;
        }
        .subject {
          font-weight: bold;
          margin-top: 15pt;
          margin-bottom: 10pt;
        }
        p {
          margin: 0 0 10pt 0;
        }
      </style>
    </head>
    <body>
  `;

    // İçeriği işle
    const lines = generatedContent.split('\n');
    let processedHtml = '';
    let skipNext = false;

    lines.forEach((line, index) => {
      if (skipNext) {
        skipNext = false;
        return;
      }

      // Ana başlık
      if (line.includes('REKTÖRLÜĞÜNE') || line.includes('MÜDÜRLÜĞÜNE') ||
        line.includes('BAŞKANLIĞINA') || line.includes('HAKİMLİĞİNE')) {
        processedHtml += `<div class="header">${line.trim()}</div>`;
      }
      // Alt başlık
      else if (index === 1 && line.trim() && lines[0].includes('REKTÖRLÜĞÜNE')) {
        processedHtml += `<div class="sub-header">${line.trim()}</div>`;
      }
      // Tarih ve imza
      else if (line.includes('Tarih:')) {
        processedHtml += `<div class="date-signature">`;
        processedHtml += `<p>${line.trim()}</p>`;

        // Sonraki satırları da ekle
        let nextIndex = index + 1;
        while (nextIndex < lines.length && lines[nextIndex].trim()) {
          processedHtml += `<p>${lines[nextIndex].trim()}</p>`;
          nextIndex++;
          skipNext = true;
        }
        processedHtml += `</div>`;
      }
      // Konu başlıkları
      else if (line.includes('KONU:') || line.includes('İTİRAZ GEREKÇELERİM:') ||
        line.includes('SONUÇ VE TALEP:') || line.includes('EKLER:')) {
        processedHtml += `<div class="subject">${line.trim()}</div>`;
      }
      // Normal paragraf
      else if (line.trim()) {
        processedHtml += `<p class="content">${line.trim()}</p>`;
      }
    });

    const fullHtml = htmlContent + processedHtml + '</body></html>';

    // Blob oluştur ve indir
    const blob = new Blob(['\ufeff', fullHtml], {
      type: 'application/msword'
    });

    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;

    const fileName = `${categoryNames[type].name.toLowerCase().replace(/ /g, '-')}-dilekce-${new Date().toISOString().split('T')[0]}.doc`;
    a.download = fileName;

    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);

    toast.success('Word dosyası başarıyla indirildi!');
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(generatedContent);
    setCopied(true);
    toast.success('Metin kopyalandı!');
    setTimeout(() => setCopied(false), 2000);
  };

  const formatContentForDisplay = (content: string) => {
    const lines = content.split('\n');
    return lines.map((line, index) => {
      // Ana başlık
      if (line.includes('REKTÖRLÜĞÜNE') || line.includes('MÜDÜRLÜĞÜNE') ||
        line.includes('BAŞKANLIĞINA') || line.includes('HAKİMLİĞİNE')) {
        return <h1 key={index} className="text-center font-bold text-xl mb-3 uppercase">{line.trim()}</h1>;
      }
      // Alt başlık
      else if (index === 1 && line.trim() && lines[0].includes('REKTÖRLÜĞÜNE')) {
        return <h2 key={index} className="text-center font-bold text-lg mb-6">{line.trim()}</h2>;
      }
      // Sayın ile başlayan
      else if (line.trim().startsWith('Sayın')) {
        return <p key={index} className="mb-4">{line.trim()}</p>;
      }
      // Tarih ve imza bloğu
      else if (line.includes('Tarih:')) {
        return (
          <div key={index} className="text-right mt-12 mb-4">
            <p className="mb-2">{line.trim()}</p>
            {lines.slice(index + 1).map((subLine, subIndex) => (
              subLine.trim() && <p key={`${index}-${subIndex}`} className="mb-2">{subLine.trim()}</p>
            ))}
          </div>
        );
      }
      // Konu başlıkları
      else if (line.includes('KONU:') || line.includes('İTİRAZ GEREKÇELERİM:') ||
        line.includes('SONUÇ VE TALEP:') || line.includes('EKLER:')) {
        return <h3 key={index} className="font-bold mt-6 mb-3">{line.trim()}</h3>;
      }
      // Madde numaraları
      else if (/^\d+\./.test(line.trim())) {
        return <p key={index} className="ml-4 mb-2">{line.trim()}</p>;
      }
      // Boş satır
      else if (line.trim() === '') {
        return <div key={index} className="h-4" />;
      }
      // Normal paragraf
      else {
        return <p key={index} className="text-justify mb-3 leading-relaxed">{line.trim()}</p>;
      }
    }).filter(Boolean);
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
                  <p className="text-blue-100">
                    {categoryNames[type].name} başarıyla oluşturuldu
                  </p>
                </div>
                <div className="text-6xl">{categoryNames[type].icon}</div>
              </div>
            </div>

            {/* Content */}
            <div className="p-8">
              {/* Action Buttons */}
              <div className="flex flex-wrap gap-3 mb-8">
                <button
                  onClick={downloadPDF}
                  className="flex items-center gap-2 bg-red-600 text-white px-6 py-3 rounded-xl hover:bg-red-700 transition-all duration-200 font-semibold"
                >
                  <Download className="w-5 h-5" />
                  PDF İndir
                </button>
                <button
                  onClick={downloadWord}
                  className="flex items-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-xl hover:bg-blue-700 transition-all duration-200 font-semibold"
                >
                  <FileText className="w-5 h-5" />
                  Word İndir
                </button>
                <button
                  onClick={copyToClipboard}
                  className="flex items-center gap-2 bg-gray-600 text-white px-6 py-3 rounded-xl hover:bg-gray-700 transition-all duration-200 font-semibold"
                >
                  {copied ? <CheckCircle className="w-5 h-5" /> : <Copy className="w-5 h-5" />}
                  {copied ? 'Kopyalandı!' : 'Metni Kopyala'}
                </button>
              </div>

              {/* Formatted Content Display */}
              <div className="bg-gray-50 rounded-2xl p-8 mb-8">
                <div className="max-w-3xl mx-auto font-serif text-gray-800">
                  {formatContentForDisplay(generatedContent)}
                </div>
              </div>

              {/* Info Box */}
              <div className="bg-blue-50 border border-blue-200 rounded-xl p-6">
                <div className="flex items-start">
                  <Info className="w-6 h-6 text-blue-600 mt-0.5 mr-3 flex-shrink-0" />
                  <div>
                    <h3 className="font-semibold text-blue-900 mb-2">Önemli Notlar</h3>
                    <ul className="text-sm text-blue-800 space-y-1">
                      <li>• Dilekçenizi indirdikten sonra imzalamayı unutmayın</li>
                      <li>• Gerekli ekleri dilekçenize iliştirin</li>
                      <li>• Dilekçenizi ilgili kuruma elden veya posta yoluyla ulaştırın</li>
                      <li>• Bir kopyasını kendinizde saklayın</li>
                    </ul>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="mt-8 flex flex-col sm:flex-row gap-4">
                <button
                  onClick={() => {
                    setShowResult(false);
                    setFormData({});
                    setGeneratedContent('');
                  }}
                  className="flex-1 bg-gradient-to-r from-green-600 to-emerald-600 text-white py-3 rounded-xl font-semibold hover:shadow-lg transition-all duration-200"
                >
                  Yeni Dilekçe Oluştur
                </button>
                <button
                  onClick={() => router.push('/')}
                  className="flex-1 bg-gray-200 text-gray-700 py-3 rounded-xl font-semibold hover:bg-gray-300 transition-all duration-200"
                >
                  Ana Sayfaya Dön
                </button>
              </div>
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