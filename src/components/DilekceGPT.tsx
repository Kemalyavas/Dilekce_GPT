'use client';
import React, { useState, useEffect, useRef } from 'react';
import { ChevronRight, FileText, Clock, Shield, Star, Check, Menu, X, Zap, Users, Award, ArrowRight, Sparkles, Lock, TrendingUp, Heart, AlertCircle, Play, Pause, Volume2, VolumeX, CheckCircle2, Gift, Timer, ThumbsUp, Eye, Download, MessageSquare, User, LogOut } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import Link from 'next/link';

const DilekceGPT = () => {
  const { user, signOut } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [animatedNumber, setAnimatedNumber] = useState(0);
  const [isScrolled, setIsScrolled] = useState(false);
  const [freeUsesLeft, setFreeUsesLeft] = useState(3);
  const [currentTestimonial, setCurrentTestimonial] = useState(0);
  const [activeViewers, setActiveViewers] = useState(127);
  const [showExampleModal, setShowExampleModal] = useState(false);

  // Scroll ve sayaç animasyonları
  useEffect(() => {
    // Aktif kullanıcı sayısı
    const timer = setInterval(() => {
      setActiveViewers(prev => 85 + Math.floor(Math.random() * 30));
    }, 3000);

    // Scroll durumu
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);

    // LocalStorage kontrolü
    const savedUses = localStorage.getItem('freeUsesLeft');
    if (savedUses) setFreeUsesLeft(parseInt(savedUses));

    // Testimonial otomatik geçiş
    const testimonialTimer = setInterval(() => {
      setCurrentTestimonial(prev => (prev + 1) % testimonials.length);
    }, 5000);

    // Sayı animasyonu
    const animateNumber = () => {
      const target = 4523;
      const duration = 2000;
      const increment = target / (duration / 16);
      let current = 0;

      const counter = setInterval(() => {
        current += increment;
        if (current >= target) {
          setAnimatedNumber(target);
          clearInterval(counter);
        } else {
          setAnimatedNumber(Math.floor(current));
        }
      }, 16);
    };

    animateNumber();

    return () => {
      clearInterval(timer);
      clearInterval(testimonialTimer);
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  interface Category {
    name: string;
    icon: string;
    desc: string;
    stats: string;
  }

  const categories: Record<string, Category> = {
    traffic: {
      name: 'Trafik Cezası İtiraz',
      icon: '🚗',
      desc: 'Haksız cezalara itiraz',
      stats: '847 başarılı itiraz'
    },
    tax: {
      name: 'Vergi/SGK İtiraz',
      icon: '💰',
      desc: 'Borç yapılandırma ve itiraz',
      stats: '523 kabul edilen dilekçe'
    },
    job: {
      name: 'İş Başvurusu',
      icon: '💼',
      desc: 'Profesyonel başvuru mektubu',
      stats: '291 işe kabul'
    },
    complaint: {
      name: 'Şikayet Dilekçesi',
      icon: '📢',
      desc: 'Hakkınızı arayın',
      stats: '412 çözülen sorun'
    },
    leave: {
      name: 'İzin Talebi',
      icon: '📅',
      desc: 'Yasal izin haklarınız',
      stats: '956 onaylanan izin'
    },
    school: {
      name: 'Okul İşlemleri',
      icon: '🎓',
      desc: 'Eğitim dilekçeleri',
      stats: '634 başarılı başvuru'
    },
    other: {
      name: 'Diğer',
      icon: '✍️',
      desc: 'Özel dilekçe talepleriniz',
      stats: '1.287 farklı dilekçe'
    }
  };

  const testimonials = [
    {
      name: "Serkan Demir",
      role: "Ankara",
      content: "Arkadaşlar ben de pek inanmamıştım açıkçası ama denedim. Gerçekten de dilekçem kabul edildi, 1450 tl trafik cezam iptal oldu. Teşekkürler.",
      date: "3 gün önce",
      verified: true,
      rating: 5,
      type: "traffic"
    },
    {
      name: "Elif Kaya",
      role: "İzmir",
      content: "SGK borç yapılandırması için kullandım, avukata gitmeden hallettim işimi. Güzel olmuş site.",
      date: "1 hafta önce",
      verified: true,
      rating: 4,
      type: "tax"
    },
    {
      name: "Murat Öztürk",
      role: "İstanbul",
      content: "İş başvurusu için kullandım ama pek bir farkı yok normal yazdığımdan. Yine de pratik oldu 3-5 dakikada hazır olması güzel.",
      date: "4 gün önce",
      verified: true,
      rating: 3,
      type: "job"
    },
    {
      name: "Zeynep Arslan",
      role: "Bursa",
      content: "okul kayıt dilekçesi için kullandım sorunsuz çalıştı. pdf olarak indirip çıktı aldım okula verdim.",
      date: "2 gün önce",
      verified: true,
      rating: 4,
      type: "school"
    },
    {
      name: "Ahmet Yılmaz",
      role: "Antalya",
      content: "Belediyeye şikayet dilekçesi yazdım, gerçekten profesyonel görünüyordu. Bakalım sonuç ne olacak :)",
      date: "5 gün önce",
      verified: true,
      rating: 4,
      type: "complaint"
    }
  ];

  const handleCategorySelect = (key: string) => {
    setSelectedCategory(key);
    setTimeout(() => {
      document.getElementById('start-form')?.scrollIntoView({ behavior: 'smooth' });
    }, 100);
  };

  const handleSignOut = async () => {
    await signOut();
  };

  return (
    <div className="min-h-screen bg-white">
      {/* CSS Styles */}
      <style jsx>{`
        html {
          scroll-behavior: smooth;
        }
        
        /* Logo animasyonu */
        @keyframes gradient-shift {
          0%, 100% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
        }
        
        .logo-gradient {
          background: linear-gradient(135deg, #3b82f6, #8b5cf6, #ec4899, #3b82f6);
          background-size: 200% 200%;
          animation: gradient-shift 3s ease infinite;
          -webkit-background-clip: text;
          background-clip: text;
          -webkit-text-fill-color: transparent;
        }
        
        /* Smooth hover transitions */
        .hover-lift {
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        }
        
        .hover-lift:hover {
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
        }
        
        /* Testimonial scroll animation */
        @keyframes scroll {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        
        .animate-scroll {
          animation: scroll 30s linear infinite;
        }
        
        /* Fade in animation */
        @keyframes fadeIn {
          from { 
            opacity: 0;
            transform: translateY(10px);
          }
          to { 
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        .fade-in {
          animation: fadeIn 0.6s ease-out;
        }
      `}</style>

      {/* Aciliyet Banner */}
      <div className="bg-gradient-to-r from-orange-500 to-red-500 text-white py-2 text-center text-sm font-medium">
        <div className="flex items-center justify-center space-x-4">
          <span>Bu ay için özel indirimli fiyatlar!</span>
          <span className="text-yellow-300">•</span>
          <span className="flex items-center">
            <Eye className="w-4 h-4 mr-1" />
            {activeViewers} kişi şu an bakıyor
          </span>
        </div>
      </div>

      {/* Navigation */}
      <nav className={`sticky top-0 z-50 transition-all duration-300 ${isScrolled ? 'bg-white shadow-lg py-3' : 'bg-white/95 backdrop-blur py-4'}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center">
            {/* Logo */}
            <Link href="/" className="flex items-center">
              <h1 className="text-2xl font-bold logo-gradient">
                DilekçeGPT
              </h1>
            </Link>

            {/* Desktop Menu */}
            <div className="hidden md:flex items-center space-x-6">
              <button
                onClick={() => setShowExampleModal(true)}
                className="text-gray-700 hover:text-blue-600 font-medium flex items-center transition-colors"
              >
                <FileText className="w-4 h-4 mr-1" />
                Örnek Dilekçe
              </button>
              <a href="#testimonials" className="text-gray-700 hover:text-blue-600 font-medium transition-colors">
                Kullanıcı Yorumları
              </a>
              <a href="#how" className="text-gray-700 hover:text-blue-600 font-medium transition-colors">
                Nasıl Çalışır?
              </a>
              <a href="#pricing" className="text-gray-700 hover:text-blue-600 font-medium transition-colors">
                Fiyatlar
              </a>

              {/* Kullanıcı durumuna göre butonlar */}
              {user ? (
                <>
                  <Link
                    href="/dashboard"
                    className="text-gray-700 hover:text-blue-600 font-medium flex items-center transition-colors"
                  >
                    <User className="w-4 h-4 mr-1" />
                    Dashboard
                  </Link>
                  <button
                    onClick={handleSignOut}
                    className="text-gray-700 hover:text-red-600 font-medium flex items-center transition-colors"
                  >
                    <LogOut className="w-4 h-4 mr-1" />
                    Çıkış
                  </button>
                </>
              ) : (
                <>
                  <Link
                    href="/auth/login"
                    className="text-gray-700 hover:text-blue-600 font-medium transition-colors"
                  >
                    Giriş Yap
                  </Link>
                  <Link
                    href="/auth/register"
                    className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    Kayıt Ol
                  </Link>
                </>
              )}

              <button
                onClick={() => document.getElementById('categories')?.scrollIntoView({ behavior: 'smooth' })}
                className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-2.5 rounded-full hover:shadow-lg transition-all duration-300 font-semibold flex items-center"
              >
                <Zap className="w-4 h-4 mr-2" />
                Hemen Başla
                {freeUsesLeft > 0 && (
                  <span className="ml-2 bg-white/20 px-2 py-0.5 rounded-full text-xs">
                    {freeUsesLeft} ücretsiz
                  </span>
                )}
              </button>
            </div>

            {/* Mobile Menu Button */}
            <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="md:hidden">
              {isMenuOpen ? <X /> : <Menu />}
            </button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative py-16 overflow-hidden bg-gradient-to-b from-gray-50 to-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center fade-in">
            {/* Trust Badges */}
            <div className="flex flex-wrap justify-center gap-4 mb-8">
              <div className="flex items-center bg-green-50 text-green-700 px-4 py-2 rounded-full text-sm hover-lift">
                <CheckCircle2 className="w-4 h-4 mr-2" />
                <span className="font-semibold">{animatedNumber.toLocaleString('tr-TR')} Oluşturulan Dilekçe</span>
              </div>
              <div className="flex items-center bg-blue-50 text-blue-700 px-4 py-2 rounded-full text-sm hover-lift">
                <Shield className="w-4 h-4 mr-2" />
                <span className="font-semibold">%100 Güvenli & KVKK Uyumlu</span>
              </div>
              <div className="flex items-center bg-purple-50 text-purple-700 px-4 py-2 rounded-full text-sm hover-lift">
                <Users className="w-4 h-4 mr-2" />
                <span className="font-semibold">Binlerce Mutlu Kullanıcı</span>
              </div>
            </div>

            {/* Main Heading */}
            <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
              <span className="block">Avukata </span>
              <span className="relative inline-block">
                <span className="text-red-600 line-through opacity-50">Binlerce TL</span>
                <span className="absolute -top-8 -right-12 bg-green-500 text-white text-sm px-3 py-1 rounded-full transform rotate-12">
                  Ücretsiz!
                </span>
              </span>
              <span className="block mt-2">Vermeyin!</span>
            </h1>

            <p className="text-xl md:text-2xl text-gray-700 max-w-3xl mx-auto mb-8">
              Yapay zeka ile <span className="font-bold text-blue-600">2 dakikada</span> profesyonel dilekçenizi oluşturun.
              <br />
              <span className="text-lg">
                Binlerce kişi dilekçelerini kabul ettirdi!
              </span>
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
              <button
                onClick={() => document.getElementById('categories')?.scrollIntoView({ behavior: 'smooth' })}
                className="group bg-gradient-to-r from-green-600 to-emerald-600 text-white px-10 py-5 rounded-full text-lg font-bold hover:shadow-lg transition-all duration-300 flex items-center justify-center"
              >
                <Gift className="w-6 h-6 mr-2" />
                3 Ücretsiz Dilekçe Hakkı
                <ArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" />
              </button>
              <button
                onClick={() => setShowExampleModal(true)}
                className="bg-white border-2 border-gray-300 text-gray-700 px-10 py-5 rounded-full text-lg font-semibold hover:border-blue-600 hover:text-blue-600 transition-colors duration-300"
              >
                Örnek Dilekçe Gör
              </button>
            </div>

            {/* Social Proof */}
            <div className="bg-gray-100 rounded-2xl p-4 max-w-2xl mx-auto">
              <div className="flex items-center justify-center space-x-4 text-sm">
                <div className="flex -space-x-2">
                  {['👨', '👩', '🧑', '👴', '👵'].map((emoji, i) => (
                    <div key={i} className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center border-2 border-white">
                      <span className="text-lg">{emoji}</span>
                    </div>
                  ))}
                </div>
                <div className="text-left">
                  <p className="font-semibold text-gray-900">
                    Son 24 saatte <span className="text-green-600">132 kişi</span> dilekçe oluşturdu
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Kullanıcı giriş yapmamışsa göster */}
      {!user && (
        <div className="bg-blue-50 py-4">
          <div className="max-w-7xl mx-auto px-4 text-center">
            <p className="text-blue-800">
              <Link href="/auth/login" className="font-semibold underline hover:text-blue-900 transition-colors">
                Giriş yapın
              </Link>
              {' '}veya{' '}
              <Link href="/auth/register" className="font-semibold underline hover:text-blue-900 transition-colors">
                kayıt olun
              </Link>
              {' '}ve tüm dilekçelerinizi kaydedin!
            </p>
          </div>
        </div>
      )}

      {/* Success Stories Ticker */}
      <section className="bg-gradient-to-r from-blue-600 to-purple-600 py-4 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center justify-between text-white">
            <div className="flex items-center space-x-8 animate-scroll">
              {[...testimonials, ...testimonials].map((item, i) => (
                <div key={i} className="flex items-center space-x-2 whitespace-nowrap">
                  <span className="font-semibold">{item.name}:</span>
                  <span className="italic">"{item.content.substring(0, 50)}..."</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Categories */}
      <section id="categories" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Hangi Sorununuzu Çözelim?
            </h2>
            <p className="text-xl text-gray-600">Kategori seçin, 2 dakikada dilekçeniz hazır!</p>
          </div>

          <div className="grid md:grid-cols-3 gap-6 mb-12">
            {Object.entries(categories).map(([key, category]) => (
              <button
                key={key}
                onClick={() => handleCategorySelect(key)}
                className={`group relative p-6 rounded-2xl transition-all duration-300 hover-lift ${selectedCategory === key
                    ? 'bg-gradient-to-br from-blue-600 to-purple-600 text-white shadow-2xl'
                    : 'bg-white border-2 border-gray-200 hover:border-blue-600 hover:shadow-lg'
                  }`}
              >
                {key === 'traffic' && (
                  <div className="absolute -top-3 -right-3 bg-red-500 text-white px-3 py-1 rounded-full text-xs font-bold">
                    En Popüler
                  </div>
                )}

                <div className="text-5xl mb-4">{category.icon}</div>
                <h3 className={`text-xl font-bold mb-2 ${selectedCategory === key ? 'text-white' : 'text-gray-900'}`}>
                  {category.name}
                </h3>
                <p className={`text-sm mb-3 ${selectedCategory === key ? 'text-white/90' : 'text-gray-600'}`}>
                  {category.desc}
                </p>

                <div className={`text-sm ${selectedCategory === key ? 'text-white/80' : 'text-gray-500'}`}>
                  <p className="flex items-center justify-center">
                    <TrendingUp className="w-4 h-4 mr-1" />
                    {category.stats}
                  </p>
                </div>

                {selectedCategory === key && (
                  <ArrowRight className="absolute bottom-4 right-4 w-6 h-6" />
                )}
              </button>
            ))}
          </div>

          {/* Selected Category Action */}
          {selectedCategory && (
            <div id="start-form" className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-3xl p-8 shadow-xl fade-in">
              <div className="max-w-2xl mx-auto text-center">
                <div className="text-6xl mb-4">{categories[selectedCategory].icon}</div>
                <h3 className="text-3xl font-bold mb-4">{categories[selectedCategory].name}</h3>

                <div className="flex flex-wrap justify-center gap-4 mb-6">
                  <div className="flex items-center text-sm text-gray-700">
                    <Lock className="w-4 h-4 mr-1 text-green-600" />
                    <span>Güvenli</span>
                  </div>
                  <div className="flex items-center text-sm text-gray-700">
                    <Clock className="w-4 h-4 mr-1 text-blue-600" />
                    <span>2 Dakika</span>
                  </div>
                  <div className="flex items-center text-sm text-gray-700">
                    <Users className="w-4 h-4 mr-1 text-purple-600" />
                    <span>{categories[selectedCategory].stats}</span>
                  </div>
                </div>

                <button
                  onClick={() => window.location.href = `/dilekce/${selectedCategory}`}
                  className="group bg-gradient-to-r from-green-600 to-emerald-600 text-white px-12 py-5 rounded-full text-xl font-bold hover:shadow-lg transition-all duration-300 flex items-center justify-center mx-auto"
                >
                  <Zap className="w-6 h-6 mr-2" />
                  Hemen Başla
                  <span className="ml-2 bg-white/20 px-3 py-1 rounded-full text-sm">
                    Ücretsiz
                  </span>
                  <ArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" />
                </button>

                <p className="mt-4 text-sm text-gray-600">
                  <Shield className="w-4 h-4 inline mr-1" />
                  Bilgileriniz şifrelenir ve dilekçe oluştuktan sonra silinir
                </p>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* How It Works */}
      <section id="how" className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-4xl md:text-5xl font-bold text-center mb-16">
            Nasıl Bu Kadar Hızlı?
          </h2>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                step: "1",
                title: "Kategori Seç",
                desc: "Sorununuza uygun kategoriyi seçin",
                time: "5 saniye",
                icon: <FileText className="w-8 h-8" />
              },
              {
                step: "2",
                title: "Bilgileri Gir",
                desc: "Basit formu doldurun",
                time: "60 saniye",
                icon: <Zap className="w-8 h-8" />
              },
              {
                step: "3",
                title: "İndir & Gönder",
                desc: "PDF olarak indirin, imzalayın",
                time: "10 saniye",
                icon: <Download className="w-8 h-8" />
              }
            ].map((item, i) => (
              <div key={i} className="relative group">
                <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 hover-lift">
                  <div className="flex items-center justify-between mb-4">
                    <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white w-12 h-12 rounded-full flex items-center justify-center text-xl font-bold">
                      {item.step}
                    </div>
                    <span className="text-sm text-gray-500 bg-gray-100 px-3 py-1 rounded-full">
                      {item.time}
                    </span>
                  </div>

                  <div className="text-blue-600 mb-4">{item.icon}</div>

                  <h3 className="text-xl font-bold mb-2">{item.title}</h3>
                  <p className="text-gray-600">{item.desc}</p>
                </div>

                {i < 2 && (
                  <div className="hidden md:block absolute top-1/2 -right-4 transform -translate-y-1/2 z-10">
                    <ChevronRight className="w-8 h-8 text-gray-300" />
                  </div>
                )}
              </div>
            ))}
          </div>

          <div className="text-center mt-12">
            <div className="inline-flex items-center bg-green-100 text-green-800 px-6 py-3 rounded-full">
              <Timer className="w-5 h-5 mr-2" />
              <span className="font-bold text-lg">Toplam: 75 saniye!</span>
            </div>
          </div>
        </div>
      </section>

      {/* User Reviews */}
      <section id="testimonials" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              Kullanıcı Yorumları
            </h2>
            <p className="text-xl text-gray-600">Gerçek kullanıcılar ne diyor?</p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {testimonials.map((testimonial, i) => (
              <div key={i} className="bg-gray-50 rounded-2xl p-6 relative hover:shadow-lg transition-all duration-300 hover-lift">
                <div className="flex mb-3">
                  {[...Array(5)].map((_, idx) => (
                    <Star
                      key={idx}
                      className={`w-5 h-5 ${idx < testimonial.rating ? 'text-yellow-400 fill-current' : 'text-gray-300'}`}
                    />
                  ))}
                </div>

                <p className="text-gray-700 mb-4">"{testimonial.content}"</p>

                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-semibold text-sm">{testimonial.name}</p>
                    <p className="text-xs text-gray-600">{testimonial.role}</p>
                  </div>
                  <p className="text-xs text-gray-500">{testimonial.date}</p>
                </div>
              </div>
            ))}
          </div>

          {/* İstatistikler */}
          <div className="mt-16 bg-gradient-to-r from-blue-600 to-purple-600 rounded-3xl p-12 text-white">
            <div className="grid md:grid-cols-4 gap-8 text-center">
              <div>
                <div className="text-5xl font-bold mb-2">₺50K+</div>
                <div className="text-blue-100">Toplam Tasarruf</div>
              </div>
              <div>
                <div className="text-5xl font-bold mb-2">{animatedNumber.toLocaleString('tr-TR')}</div>
                <div className="text-blue-100">Mutlu Kullanıcı</div>
              </div>
              <div>
                <div className="text-5xl font-bold mb-2">7/24</div>
                <div className="text-blue-100">Hizmet</div>
              </div>
              <div>
                <div className="text-5xl font-bold mb-2">3 dk</div>
                <div className="text-blue-100">Ortalama Süre</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Trust Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Neden Bize Güveniyorlar?</h2>
          </div>

          <div className="grid md:grid-cols-4 gap-6">
            {[
              {
                icon: <Shield className="w-8 h-8" />,
                title: "Güvenli",
                desc: "SSL şifreleme"
              },
              {
                icon: <Lock className="w-8 h-8" />,
                title: "KVKK Uyumlu",
                desc: "Verileriniz güvende"
              },
              {
                icon: <Heart className="w-8 h-8" />,
                title: "7/24 Destek",
                desc: "Her zaman yanınızdayız"
              },
              {
                icon: <FileText className="w-8 h-8" />,
                title: "Hızlı Sonuç",
                desc: "3 dakikada hazır"
              }
            ].map((item, i) => (
              <div key={i} className="bg-white p-6 rounded-xl shadow-lg text-center hover:shadow-xl transition-shadow hover-lift">
                <div className="text-blue-600 mb-4 flex justify-center">{item.icon}</div>
                <h3 className="font-bold mb-2">{item.title}</h3>
                <p className="text-sm text-gray-600">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" className="py-20 bg-white overflow-x-hidden">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              İlk 3 Dilekçe Ücretsiz!
            </h2>
            <p className="text-xl text-gray-600">Kredi kartı gerekmez, hemen deneyin</p>

            <div className="mt-4 inline-flex items-center bg-orange-100 text-orange-700 px-4 py-2 rounded-full">
              <AlertCircle className="w-4 h-4 mr-2" />
              <span className="font-semibold">Bu fiyatlar sadece bu ay geçerli!</span>
            </div>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {/* Ücretsiz */}
            <div className="relative bg-gray-50 p-8 rounded-3xl hover:shadow-xl transition-all duration-300 hover-lift">
              <h3 className="text-2xl font-bold mb-6">Ücretsiz Deneme</h3>
              <div className="text-5xl font-bold mb-6">₺0</div>
              <ul className="space-y-3 mb-8">
                <li className="flex items-center">
                  <Check className="w-5 h-5 text-green-600 mr-2" />
                  <span>3 Dilekçe Hakkı</span>
                </li>
                <li className="flex items-center">
                  <Check className="w-5 h-5 text-green-600 mr-2" />
                  <span>Tüm Kategoriler</span>
                </li>
                <li className="flex items-center">
                  <Check className="w-5 h-5 text-green-600 mr-2" />
                  <span>PDF İndirme</span>
                </li>
              </ul>
              <button
                onClick={() => document.getElementById('categories')?.scrollIntoView({ behavior: 'smooth' })}
                className="w-full py-4 bg-gray-200 text-gray-700 rounded-xl font-semibold hover:bg-gray-300 transition-colors"
              >
                Hemen Dene
              </button>
            </div>

            {/* Popüler */}
            <div className="relative bg-gradient-to-b from-blue-600 to-purple-600 p-8 rounded-3xl shadow-2xl transform scale-105">
              <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                <div className="bg-orange-500 text-white px-6 py-2 rounded-full text-sm font-bold">
                  ÇOK SATAN
                </div>
              </div>
              <div className="text-white">
                <h3 className="text-2xl font-bold mb-6">Sınırsız Aylık</h3>
                <div className="mb-6">
                  <span className="text-5xl font-bold">₺99</span>
                  <span className="text-xl line-through opacity-50 ml-2">₺299</span>
                </div>
                <ul className="space-y-3 mb-8">
                  <li className="flex items-center">
                    <Check className="w-5 h-5 mr-2" />
                    <span className="font-semibold">Sınırsız Dilekçe</span>
                  </li>
                  <li className="flex items-center">
                    <Check className="w-5 h-5 mr-2" />
                    <span>Word + PDF</span>
                  </li>
                  <li className="flex items-center">
                    <Check className="w-5 h-5 mr-2" />
                    <span>Öncelikli Destek</span>
                  </li>
                  <li className="flex items-center">
                    <Check className="w-5 h-5 mr-2" />
                    <span>E-posta Gönderimi</span>
                  </li>
                  <li className="flex items-center">
                    <Check className="w-5 h-5 mr-2" />
                    <span>Dilekçe Arşivi</span>
                  </li>
                </ul>
                <button className="w-full py-4 bg-white text-blue-600 rounded-xl font-bold hover:shadow-lg transition-shadow">
                  Hemen Başla
                </button>
              </div>
            </div>

            {/* Yıllık */}
            <div className="relative bg-gray-50 p-8 rounded-3xl hover:shadow-xl transition-all duration-300 hover-lift">
              <div className="absolute -top-4 right-4">
                <div className="bg-green-500 text-white px-4 py-2 rounded-full text-sm font-bold">
                  2 AY BEDAVA
                </div>
              </div>
              <h3 className="text-2xl font-bold mb-6">Yıllık</h3>
              <div className="mb-6">
                <span className="text-5xl font-bold">₺990</span>
                <p className="text-green-600 font-semibold mt-2">₺198 tasarruf!</p>
              </div>
              <ul className="space-y-3 mb-8">
                <li className="flex items-center">
                  <Check className="w-5 h-5 text-green-600 mr-2" />
                  <span>Aylık paket özellikleri</span>
                </li>
                <li className="flex items-center">
                  <Check className="w-5 h-5 text-green-600 mr-2" />
                  <span>VIP Destek</span>
                </li>
                <li className="flex items-center">
                  <Check className="w-5 h-5 text-green-600 mr-2" />
                  <span>API Erişimi</span>
                </li>
              </ul>
              <button className="w-full py-4 bg-gray-800 text-white rounded-xl font-semibold hover:bg-gray-900 transition-colors">
                Başla
              </button>
            </div>
          </div>

          <div className="text-center mt-12">
            <div className="inline-flex items-center bg-green-100 text-green-800 px-6 py-3 rounded-full">
              <Shield className="w-5 h-5 mr-2" />
              <span className="font-semibold">30 Gün Para İade Garantisi</span>
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-20 bg-gradient-to-r from-blue-600 to-purple-600 text-white">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            Daha Fazla Beklemeyin!
          </h2>
          <p className="text-xl mb-8 text-white/90">
            Her gün yüzlerce kişi gereksiz para ve zaman kaybediyor. Siz olmayın!
          </p>

          <button
            onClick={() => document.getElementById('categories')?.scrollIntoView({ behavior: 'smooth' })}
            className="group bg-white text-blue-600 px-12 py-5 rounded-full text-xl font-bold hover:shadow-2xl transition-all duration-300 transform hover:scale-105"
          >
            Ücretsiz Başla
            <ArrowRight className="inline ml-2 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-16">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-8">
            <div className="text-2xl font-bold mb-4">DilekçeGPT</div>
            <p className="text-gray-400 mb-6">Türkiye'nin en güvenilir dilekçe asistanı</p>

            <div className="flex flex-wrap justify-center gap-6 mb-8">
              <div className="flex items-center text-sm">
                <Shield className="w-4 h-4 mr-2 text-green-500" />
                <span>SSL Güvenlik</span>
              </div>
              <div className="flex items-center text-sm">
                <Lock className="w-4 h-4 mr-2 text-blue-500" />
                <span>KVKK Uyumlu</span>
              </div>
              <div className="flex items-center text-sm">
                <Users className="w-4 h-4 mr-2 text-purple-500" />
                <span>Binlerce Kullanıcı</span>
              </div>
            </div>
          </div>

          <div className="border-t border-gray-800 pt-8 text-center text-gray-400">
            <p>&copy; 2025 DilekçeGPT. Tüm hakları saklıdır.</p>
          </div>
        </div>
      </footer>

      {/* Example Modal */}
      {showExampleModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur z-50 flex items-center justify-center p-4 fade-in">
          <div className="bg-white rounded-3xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden">
            <div className="p-6 border-b flex justify-between items-center">
              <h3 className="text-2xl font-bold">Örnek Dilekçe</h3>
              <button
                onClick={() => setShowExampleModal(false)}
                className="text-gray-500 hover:text-gray-700 transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
            <div className="p-6 overflow-y-auto max-h-[70vh]">
              <div className="bg-white rounded-xl p-8 shadow-inner">
                <div className="font-sans space-y-6 text-gray-800">
                  <div className="text-center space-y-2">
                    <p className="font-bold">T.C.</p>
                    <p className="font-bold">İSTANBUL VALİLİĞİ</p>
                    <p className="font-bold">İl Emniyet Müdürlüğü</p>
                    <p className="font-bold">Trafik Denetleme Şube Müdürlüğüne</p>
                  </div>

                  <div className="text-right">
                    <p className="text-sm">Tarih: 15.01.2025</p>
                  </div>

                  <div>
                    <p className="font-bold">KONU: 34 ABC 123 Plakalı Araca Kesilen Trafik Cezasına İtiraz</p>
                  </div>

                  <div className="space-y-4">
                    <p>Sayın Müdürlük,</p>

                    <p className="text-justify">
                      15.01.2025 tarihinde saat 14:30'da, 34 ABC 123 plakalı aracıma Atatürk Caddesi'nde kesilen
                      2025/12345 numaralı ve 3.500 TL tutarındaki "kırmızı ışık ihlali" gerekçeli trafik cezasına
                      itiraz etmek istiyorum.
                    </p>

                    <div>
                      <p className="font-bold mb-2">İTİRAZ GEREKÇELERİM:</p>
                      <ol className="list-decimal list-inside space-y-2 ml-4">
                        <li>Belirtilen tarih ve saatte aracım işyerimin kapalı otoparkında park halindeydi.</li>
                        <li>O gün ve saatte İstanbul dışında iş toplantısında bulunmaktaydım. (Uçak bileti ve otel rezervasyon belgeleri ektedir)</li>
                        <li>Aracımın park halinde olduğunu gösteren otopark güvenlik kamera kayıtları mevcuttur.</li>
                        <li>Ceza tutanağında belirtilen yer ve zamanda aracımın kullanılmadığını kanıtlayan tüm belgeler ekte sunulmuştur.</li>
                      </ol>
                    </div>

                    <div>
                      <p className="font-bold mb-2">SONUÇ VE TALEP:</p>
                      <p className="text-justify">
                        Yukarıda belirttiğim gerekçeler ve sunduğum kanıtlar doğrultusunda, hakkımda düzenlenen
                        3.500 TL tutarındaki idari para cezasının iptalini saygılarımla talep ederim.
                      </p>
                    </div>

                    <div className="mt-8 text-right space-y-1">
                      <p>Saygılarımla,</p>
                      <div className="mt-8">
                        <p className="font-semibold">Ahmet YILMAZ</p>
                        <p className="text-sm">T.C. No: 12345678901</p>
                        <p className="text-sm">Adres: Atatürk Mah. Cumhuriyet Cad.</p>
                        <p className="text-sm ml-12">No:123/5 Kadıköy/İSTANBUL</p>
                        <p className="text-sm">Tel: 0555 123 45 67</p>
                        <p className="text-sm">E-posta: ahmet.yilmaz@email.com</p>
                      </div>
                    </div>

                    <div className="mt-6 border-t pt-4">
                      <p className="font-bold">EKLER:</p>
                      <ol className="list-decimal list-inside text-sm ml-4 mt-2 space-y-1">
                        <li>Trafik cezası tutanağı fotokopisi</li>
                        <li>Uçak bileti</li>
                        <li>Otel rezervasyon belgesi</li>
                        <li>Otopark güvenlik kamera kayıt tutanağı</li>
                        <li>Araç ruhsatı fotokopisi</li>
                      </ol>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-4 bg-green-50 border border-green-200 rounded-xl p-4">
                <p className="text-green-800 font-semibold">
                  ✅ Bu dilekçe formatı tüm resmi kurumlarca kabul edilir
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DilekceGPT;