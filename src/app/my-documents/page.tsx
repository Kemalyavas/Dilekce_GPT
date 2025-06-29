'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { createClient } from '@/lib/supabase/client';
import { FileText, ChevronLeft, Download, Eye, Trash2, Calendar, Search, Filter, Loader2 } from 'lucide-react';
import Link from 'next/link';
import toast, { Toaster } from 'react-hot-toast';
import jsPDF from 'jspdf';

interface Dilekce {
  id: string;
  type: string;
  content: string;
  created_at: string;
  form_data: any;
}

export default function MyDocumentsPage() {
  const { user } = useAuth();
  const router = useRouter();
  const supabase = createClient();

  const [documents, setDocuments] = useState<Dilekce[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [selectedDoc, setSelectedDoc] = useState<Dilekce | null>(null);
  const [showPreview, setShowPreview] = useState(false);

  const categoryNames: Record<string, { name: string; icon: string; color: string }> = {
    traffic: { name: 'Trafik Cezası İtiraz', icon: '🚗', color: 'from-red-500 to-orange-500' },
    tax: { name: 'Vergi/SGK İtiraz', icon: '💰', color: 'from-green-500 to-emerald-500' },
    job: { name: 'İş Başvurusu', icon: '💼', color: 'from-blue-500 to-indigo-500' },
    complaint: { name: 'Şikayet Dilekçesi', icon: '📢', color: 'from-purple-500 to-pink-500' },
    leave: { name: 'İzin Talebi', icon: '📅', color: 'from-yellow-500 to-amber-500' },
    school: { name: 'Okul İşlemleri', icon: '🎓', color: 'from-cyan-500 to-teal-500' },
    other: { name: 'Diğer Dilekçe', icon: '✍️', color: 'from-gray-500 to-slate-500' }
  };

  useEffect(() => {
    if (!user) {
      router.push('/auth/login');
      return;
    }

    fetchDocuments();
  }, [user, router]);

  const fetchDocuments = async () => {
    try {
      const { data, error } = await supabase
        .from('dilekce')
        .select('*')
        .eq('user_id', user?.id)
        .order('created_at', { ascending: false });

      if (error) throw error;

      setDocuments(data || []);
    } catch (error: any) {
      toast.error('Dilekçeler yüklenirken hata oluştu');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Bu dilekçeyi silmek istediğinizden emin misiniz?')) return;

    try {
      const { error } = await supabase
        .from('dilekce')
        .delete()
        .eq('id', id)
        .eq('user_id', user?.id);

      if (error) throw error;

      toast.success('Dilekçe başarıyla silindi');
      fetchDocuments();
    } catch (error: any) {
      toast.error('Dilekçe silinirken hata oluştu');
      console.error(error);
    }
  };

  const downloadPDF = async (doc: Dilekce) => {
    const pdf = new jsPDF();
    const pageWidth = pdf.internal.pageSize.getWidth();
    const margin = 20;
    const maxWidth = pageWidth - 2 * margin;
    let yPosition = margin;

    // Başlık
    pdf.setFontSize(16);
    pdf.setFont('helvetica', 'bold');
    const title = categoryNames[doc.type]?.name || 'Dilekçe';
    pdf.text(title, pageWidth / 2, yPosition, { align: 'center' });
    yPosition += 15;

    // Tarih
    pdf.setFontSize(10);
    pdf.setFont('helvetica', 'normal');
    const date = new Date(doc.created_at).toLocaleDateString('tr-TR');
    pdf.text(`Oluşturulma Tarihi: ${date}`, margin, yPosition);
    yPosition += 20;

    // İçerik
    pdf.setFontSize(11);
    const lines = doc.content.split('\n');

    lines.forEach(line => {
      if (yPosition > pdf.internal.pageSize.getHeight() - margin) {
        pdf.addPage();
        yPosition = margin;
      }

      const splitLines = pdf.splitTextToSize(line, maxWidth);
      splitLines.forEach((splitLine: string) => {
        pdf.text(splitLine, margin, yPosition);
        yPosition += 6;
      });
    });

    // PDF'i indir
    const fileName = `${doc.type}-dilekce-${doc.id.substring(0, 8)}.pdf`;
    pdf.save(fileName);
    toast.success('PDF başarıyla indirildi!');
  };

  const filteredDocuments = documents.filter(doc => {
    const matchesSearch = doc.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
      categoryNames[doc.type]?.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterType === 'all' || doc.type === filterType;

    return matchesSearch && matchesFilter;
  });

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('tr-TR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (!user) return null;

  return (
    <div className="min-h-screen bg-gray-50">
      <Toaster position="top-center" />

      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <Link
            href="/dashboard"
            className="flex items-center text-gray-600 hover:text-gray-900 transition"
          >
            <ChevronLeft className="h-5 w-5 mr-1" />
            Dashboard'a Dön
          </Link>

          <h1 className="text-2xl font-bold text-gray-900">Dilekçelerim</h1>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-8">
        {/* Search and Filter */}
        <div className="bg-white rounded-xl shadow-md p-6 mb-6">
          <div className="flex flex-col md:flex-row gap-4">
            {/* Search */}
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
              <input
                type="text"
                placeholder="Dilekçe ara..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            {/* Filter */}
            <div className="relative">
              <Filter className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
              <select
                value={filterType}
                onChange={(e) => setFilterType(e.target.value)}
                className="pl-10 pr-8 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none bg-white"
              >
                <option value="all">Tüm Dilekçeler</option>
                {Object.entries(categoryNames).map(([key, value]) => (
                  <option key={key} value={key}>{value.name}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Documents List */}
        {loading ? (
          <div className="flex justify-center items-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
          </div>
        ) : filteredDocuments.length === 0 ? (
          <div className="bg-white rounded-xl shadow-md p-12 text-center">
            <FileText className="h-16 w-16 mx-auto mb-4 text-gray-300" />
            <p className="text-gray-500 mb-4">
              {searchTerm || filterType !== 'all'
                ? 'Arama kriterlerine uygun dilekçe bulunamadı'
                : 'Henüz dilekçe oluşturmadınız'}
            </p>
            <Link
              href="/"
              className="inline-block text-blue-600 hover:underline"
            >
              İlk dilekçenizi oluşturun →
            </Link>
          </div>
        ) : (
          <div className="grid gap-4">
            {filteredDocuments.map((doc) => (
              <div key={doc.id} className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition-shadow">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <span className="text-3xl">{categoryNames[doc.type]?.icon}</span>
                      <h3 className="text-xl font-semibold text-gray-900">
                        {categoryNames[doc.type]?.name || 'Dilekçe'}
                      </h3>
                    </div>

                    <div className="flex items-center text-sm text-gray-500 mb-3">
                      <Calendar className="h-4 w-4 mr-1" />
                      {formatDate(doc.created_at)}
                    </div>

                    <p className="text-gray-600 line-clamp-2">
                      {doc.content.substring(0, 150)}...
                    </p>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2 ml-4">
                    <button
                      onClick={() => {
                        setSelectedDoc(doc);
                        setShowPreview(true);
                      }}
                      className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition"
                      title="Önizle"
                    >
                      <Eye className="h-5 w-5" />
                    </button>

                    <button
                      onClick={() => downloadPDF(doc)}
                      className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition"
                      title="PDF İndir"
                    >
                      <Download className="h-5 w-5" />
                    </button>

                    <button
                      onClick={() => handleDelete(doc.id)}
                      className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition"
                      title="Sil"
                    >
                      <Trash2 className="h-5 w-5" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      {/* Preview Modal */}
      {showPreview && selectedDoc && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
            <div className="p-6 border-b flex justify-between items-center">
              <h3 className="text-2xl font-bold flex items-center gap-2">
                <span className="text-3xl">{categoryNames[selectedDoc.type]?.icon}</span>
                {categoryNames[selectedDoc.type]?.name}
              </h3>
              <button
                onClick={() => {
                  setShowPreview(false);
                  setSelectedDoc(null);
                }}
                className="text-gray-500 hover:text-gray-700"
              >
                ✕
              </button>
            </div>

            <div className="p-6 overflow-y-auto max-h-[70vh]">
              <div className="bg-gray-50 rounded-xl p-8">
                <pre className="whitespace-pre-wrap font-sans text-gray-800">
                  {selectedDoc.content}
                </pre>
              </div>
            </div>

            <div className="p-6 border-t flex justify-end gap-3">
              <button
                onClick={() => downloadPDF(selectedDoc)}
                className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 transition flex items-center gap-2"
              >
                <Download className="h-5 w-5" />
                PDF İndir
              </button>
              <button
                onClick={() => {
                  setShowPreview(false);
                  setSelectedDoc(null);
                }}
                className="bg-gray-200 text-gray-700 px-6 py-2 rounded-lg hover:bg-gray-300 transition"
              >
                Kapat
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}