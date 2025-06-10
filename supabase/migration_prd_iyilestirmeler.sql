-- PRD Öncelikli Veritabanı İyileştirmeleri Migration Dosyası

-- 1. Status için enum oluşturulması
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'book_status') THEN
    CREATE TYPE book_status AS ENUM ('Draft', 'Published', 'Rejected');
  END IF;
END$$;

-- 2. Books tablosunda yeni bir geçici sütun ekle
ALTER TABLE books
ADD COLUMN status_new book_status;

-- 3. Eski 'status' sütunundaki verileri yeni 'status_new' sütununa aktar
-- Geçersiz değerleri 'Draft' olarak ayarla
UPDATE books
SET status_new =
    CASE
        WHEN TRIM(status) = 'Draft' THEN 'Draft'::book_status
        WHEN TRIM(status) = 'Published' THEN 'Published'::book_status
        WHEN TRIM(status) = 'Rejected' THEN 'Rejected'::book_status
        ELSE 'Draft'::book_status -- Varsayılan olarak 'Draft' yap
    END
WHERE status IS NOT NULL;

-- 4. Eski 'status' sütununu bırak
ALTER TABLE books
DROP COLUMN status;

-- 5. Yeni 'status_new' sütununu 'status' olarak yeniden adlandır
ALTER TABLE books
RENAME COLUMN status_new TO status;

-- 6. 'status' sütununa NOT NULL kısıtlaması ekle (opsiyonel, zaten varsa atlar)
ALTER TABLE books
ALTER COLUMN status SET NOT NULL;

-- 7. 'status' sütununa varsayılan değeri ekle
ALTER TABLE books
ALTER COLUMN status SET DEFAULT 'Draft'::book_status;

-- 3. Resim yönetimi için ayrı tablo oluşturulması
CREATE TABLE IF NOT EXISTS book_images (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  book_id UUID REFERENCES books(id) ON DELETE CASCADE,
  url TEXT NOT NULL,
  order_index INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 4. Admin kullanıcıları için rol yönetimi
ALTER TABLE admin_users
  ADD COLUMN IF NOT EXISTS role TEXT NOT NULL DEFAULT 'admin';

-- 5. User activity tablosu için foreign key constraint
ALTER TABLE user_activity
  ALTER COLUMN user_id SET NOT NULL;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1
    FROM information_schema.table_constraints
    WHERE constraint_name = 'fk_user_activity_user'
      AND table_name = 'user_activity'
  ) THEN
    ALTER TABLE user_activity
      ADD CONSTRAINT fk_user_activity_user
      FOREIGN KEY (user_id)
      REFERENCES auth.users(id)
      ON DELETE CASCADE;
  END IF;
END$$;

-- 6. Performans için indexler
CREATE INDEX IF NOT EXISTS idx_book_categories_book_id ON book_categories(book_id);
CREATE INDEX IF NOT EXISTS idx_book_categories_category_id ON book_categories(category_id);
CREATE INDEX IF NOT EXISTS idx_books_status ON books(status);
CREATE INDEX IF NOT EXISTS idx_books_created_at ON books(created_at);

-- 7. Books tablosunda category alanını kaldırmak (çünkü book_categories ile ilişki var)
ALTER TABLE books
  DROP COLUMN IF EXISTS category; 