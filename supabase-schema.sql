-- Supabase'de çalıştırılması gereken SQL
-- Kullanıcı limitlerini takip etmek için

-- Kullanıcı istatistikleri tablosu
CREATE TABLE user_stats (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  free_uses_remaining INTEGER DEFAULT 3,
  total_dilekce_created INTEGER DEFAULT 0,
  last_dilekce_date TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id)
);

-- RLS (Row Level Security) politikaları
ALTER TABLE user_stats ENABLE ROW LEVEL SECURITY;

-- Kullanıcı sadece kendi verilerini görebilir
CREATE POLICY "Users can view own stats" ON user_stats
  FOR SELECT USING (auth.uid() = user_id);

-- Kullanıcı sadece kendi verilerini güncelleyebilir  
CREATE POLICY "Users can update own stats" ON user_stats
  FOR UPDATE USING (auth.uid() = user_id);

-- Yeni kullanıcı kaydında otomatik stats oluştur
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO user_stats (user_id)
  VALUES (NEW.id);
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger oluştur
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE handle_new_user();

-- Dilekçe tablosunu güncelle (eğer yoksa)
CREATE TABLE IF NOT EXISTS dilekce (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  type TEXT NOT NULL,
  content TEXT NOT NULL,
  form_data JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- RLS politikaları
ALTER TABLE dilekce ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own dilekce" ON dilekce
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own dilekce" ON dilekce
  FOR INSERT WITH CHECK (auth.uid() = user_id);
