# Kids Book Haven - Product Requirements Document (PRD)

## 1. Proje Özeti
Kids Book Haven, çocuklar için kitap önerileri sunan ve kitap incelemelerini paylaşabilecekleri bir web platformudur. Modern web teknolojileri kullanılarak geliştirilmiş, kullanıcı dostu bir arayüze sahiptir.

## 2. Teknik Altyapı

### 2.1 Frontend Teknolojileri ✅
- **Framework**: React 18 ssss
- **Dil**: TypeScript
- **Routing**: React Router v6
- **State Management**: React Query (TanStack Query)
- **UI Framework**: 
  - Tailwind CSS
  - Shadcn UI (Radix UI tabanlı)
  - Lucide React (ikonlar)
- **Form Yönetimi**: React Hook Form + Zod validasyonu
- **Tema Yönetimi**: next-themes

### 2.2 Backend ve Veritabanı ✅
- **Backend**: Supabase
- **Kimlik Doğrulama**: Supabase Auth
- **Veritabanı**: Supabase (PostgreSQL)

### 2.3 Geliştirme Araçları ✅
- **Build Tool**: Vite
- **Package Manager**: Bun
- **Linting**: ESLint
- **Testing**: Vitest + React Testing Library

## 3. Temel Özellikler

### 3.1 Kullanıcı Yönetimi ✅
- Kullanıcı kaydı ve girişi
- Profil yönetimi
- Korumalı rotalar (Protected Routes)

### 3.2 Kitap Yönetimi ✅
- Kitap listeleme
- Kategori bazlı filtreleme
- Kitap detay sayfaları
- Kitap önerisi gönderme sistemi

### 3.3 Kategori ve Fayda Sistemi ✅
- Kategori bazlı kitap listeleme
- Fayda bazlı kitap önerileri
- Dinamik kategori sayfaları

### 3.4 Yönetici Özellikleri ✅
- Kullanıcı yönetimi paneli
- Analitik dashboard
- Kitap onay sistemi

## 4. Sayfa Yapısı

### 4.1 Ana Sayfalar ✅
- Ana Sayfa (Index)
- Kategori Sayfası (CategoryPage)
- Kitap Detay Sayfası (BookDetail)
- Fayda Sayfası (BenefitPage)
- Giriş Sayfası (Login)
- Profil Sayfası (Profile)

### 4.2 Yönetici Sayfaları ✅
- Kullanıcı Yönetimi (UserManagement)
- Analitik (Analytics)
- Kitap Gönderme (SubmitBook)

### 4.3 Yardımcı Sayfalar ✅
- Site Haritası (Sitemap)

## 5. Kullanıcı Deneyimi

### 5.1 Erişilebilirlik ⚠️
- Klavye navigasyonu desteği
- Screen reader uyumluluğu
- Skip to main content özelliği

### 5.2 Bildirim Sistemi ✅
- Toast bildirimleri (Sonner)
- Tooltip bilgilendirmeleri
- Form validasyon bildirimleri

### 5.3 Performans Optimizasyonu ⚠️
- React Query ile veri önbellekleme
- Lazy loading desteği
- 5 dakikalık veri önbellekleme süresi

## 6. Güvenlik

### 6.1 Kimlik Doğrulama ✅
- Supabase Auth entegrasyonu
- Oturum yönetimi
- Korumalı rotalar

### 6.2 Veri Güvenliği ⚠️
- TypeScript tip güvenliği
- Form validasyonu
- API güvenliği

## 7. Geliştirme ve Dağıtım

### 7.1 Geliştirme Ortamı ✅
- Development modu
- Hot module replacement
- ESLint entegrasyonu

### 7.2 Build ve Deployment ✅
- Production build
- Development build
- Preview modu

## 8. Yapılacak İyileştirmeler

### 8.1 Acil İyileştirmeler 🚨
- [ ] Arama Fonksiyonunun İyileştirilmesi ⚠️
  - [ ] Mevcut arama fonksiyonunun analizi ve iyileştirme planı ⚠️
  - [ ] Arama algoritmasının güncellenmesi ⚠️
  - [ ] Arama sonuçlarının sıralanması ve filtreleme seçeneklerinin eklenmesi ⚠️
  - [ ] Arama performansının test edilmesi ve optimizasyonu ⚠️
- [ ] Gerekli İndekslerin Oluşturulması ✅
  - [ ] Performans analizi ve indeks ihtiyaçlarının belirlenmesi ✅
  - [ ] İndekslerin oluşturulması ve test edilmesi ✅
  - [ ] İndeks performansının izlenmesi ve optimizasyonu ✅
- [ ] Gereksiz Sayfaların Kaldırılması ✅
  - [ ] Analytics.tsx ve UserManagement.tsx sayfalarının kaldırılması ✅
  - [ ] İlgili route'ların ve bağlantıların temizlenmesi ✅
- [ ] Toplu Kitap Yükleme Ekranı ✅
  - [ ] Toplu yükleme arayüzünün tasarlanması ✅
  - [ ] JSON dosyası yükleme ve işleme mantığının geliştirilmesi ✅
  - [ ] Hata yönetimi ve kullanıcı geri bildirimi ✅
  - [ ] Yükleme işleminin test edilmesi ✅
- [ ] Bir Kitaba Birden Fazla Benefit Ekleme ✅
  - [ ] Veritabanı Şeması Güncellemesi ✅
    - [ ] `book_benefits` junction tablosunun oluşturulması ✅
    - [ ] `books` tablosundan `benefit` kolonunun kaldırılması ✅
  - [ ] API/Sorgu Güncellemeleri ✅
    - [ ] Kitap detaylarını çeken sorgular (ana sayfa, kategori/fayda sayfaları, kitap detay sayfası) güncellenmesi ✅
    - [ ] Supabase Type Tanımlamalarının Güncellenmesi (types.ts) ✅
    - [ ] Kitap ekleme/güncelleme işlemleri (`SubmitBook.tsx`, `BulkUpload.tsx`) güncellenmesi ✅
  - [ ] Frontend Güncellemeleri ✅
    - [ ] Kitap Formu: Birden fazla fayda seçimine izin verecek şekilde UI güncellenmesi ✅
    - [ ] Kitap Görüntüleme: Faydaların bir dizi olarak gösterildiği yerlerin güncellenmesi ✅
    - [ ] Toplu Yükleme: Tek fayda yerine birden fazla faydayı işleyecek şekilde güncellenmesi ✅
    - [ ] Filtreleme/Arama: Birden fazla faydayı işleyecek şekilde mantığın güncellenmesi ✅
- [ ] Bize Ulaşın Bölümü 🚨
  - [ ] Bize ulaşın sayfasının/bölümünün tasarlanması ⚠️
  - [ ] İletişim formu/bilgilerinin eklenmesi ⚠️
  - [ ] Gerekli yönlendirmelerin yapılması ⚠️
- [ ] Öne Çıkan Kategorilerin Konumlandırılması 🚨
  - [ ] `Index.tsx` dosyasında "Featured Categories" bölümünün yerinin belirlenmesi ⚠️
  - [ ] Bölümün sayfanın en altına taşınması ⚠️
- [ ] SSS (FAQ) Bölümü 🚨
  - [ ] SSS sayfasının/bölümünün tasarlanması ⚠️
  - [ ] Sıkça sorulan soruların ve cevaplarının eklenmesi ⚠️
  - [ ] Gerekli yönlendirmelerin yapılması ⚠️
- [ ] Benefits Tablosu İyileştirmesi 🚨
  - [ ] Benefits tablosunun otomatik oluşturulması için getBenefitId fonksiyonunun güncellenmesi
  - [ ] Var olmayan benefit'lerin otomatik oluşturulması
  - [ ] Hata yönetiminin iyileştirilmesi

### 8.2 Orta Vadeli İyileştirmeler 📅
1. **Kod Organizasyonu**
   - Bileşenlerin daha küçük parçalara bölünmesi
   - API servis katmanının oluşturulması
   - Type tanımlarının modülerleştirilmesi

2. **Test Kapsamı**
   - Unit testlerin artırılması
   - E2E testlerin eklenmesi
   - Performance testlerinin implementasyonu

3. **Erişilebilirlik**
   - ARIA etiketlerinin tamamlanması
   - Klavye navigasyonunun geliştirilmesi
   - Renk kontrastı optimizasyonu

4. **Veritabanı Genişletmeleri**
   - Kullanıcı rolleri için yeni tablo oluşturulması
   - Kitap yorumları sistemi için tablo yapısı
   - Kitap etiketleri için tag sistemi
   - Veritabanı migration planının oluşturulması
   - Veri bütünlüğü kontrollerinin güçlendirilmesi

5. **Harici Entegrasyonlar** ⚠️
   - [ ] Amazon Kitap Verisi Entegrasyonu ⚠️
     - [ ] Amazon API veya Web Kazıma (Scraping) yoluyla kitap verisi (fiyat, açıklama vb.) çekilmesi ⚠️
     - [ ] Entegrasyon yöntemine ve kapsamına karar verilmesi ⚠️

### 8.3 Uzun Vadeli Geliştirmeler 🎯
1. **SEO ve Pazarlama**
   - [x] Sitemap İyileştirmeleri ✅
     - [x] Eksik sayfaların eklenmesi (Submit Book, Login, Profile, Sitemap)
     - [x] Lastmod tarihlerinin iyileştirilmesi
     - [x] Priority değerlerinin optimizasyonu
     - [x] Change frequency eklenmesi
     - [x] XML şema validasyonu eklendi
     - [x] robots.txt oluşturuldu ve sitemap referansı eklendi
     - [x] Search Console entegrasyonu için hazırlık yapıldı
   - [x] Meta tag'lerin optimizasyonu ✅
     - [x] Global site için İngilizce dil ayarı
     - [x] Canonical URL eklendi
     - [x] Meta açıklamaları geliştirildi ve optimize edildi
     - [x] Sosyal medya meta tag'leri eklendi ve güncellendi
     - [x] Favicon ve apple-touch-icon eklendi
     - [x] Mobil uyumluluk meta tag'leri eklendi
   - [ ] SEO Stratejisinin Oluşturulması 🚨
     - [ ] Anahtar Kelime Araştırması 🚨
       - [ ] Kitap Kategorileri Analizi
         - [ ] Mevcut Kategoriler:
           - Picture Books
             - Arama Hacmi: Yüksek
             - Rekabet: Orta
             - Önerilen Alt Kategoriler:
               - Early Readers
               - Board Books
               - Interactive Picture Books
             - Optimizasyon Önerileri:
               - "Best Picture Books for [Age Group]"
               - "Interactive Picture Books for [Skill]"
               - "Award-Winning Picture Books"
           - Educational
             - Arama Hacmi: Yüksek
             - Rekabet: Yüksek
             - Önerilen Alt Kategoriler:
               - STEM Books
               - Language Learning
               - Social Studies
             - Optimizasyon Önerileri:
               - "Educational Books for [Subject]"
               - "STEM Books for Kids"
               - "Learning Books for [Age]"
           - Bedtime Stories
             - Arama Hacmi: Orta
             - Rekabet: Düşük
             - Önerilen Alt Kategoriler:
               - Sleep Training Books
               - Calming Stories
               - Nighttime Routines
             - Optimizasyon Önerileri:
               - "Bedtime Stories for [Age]"
               - "Calming Bedtime Books"
               - "Sleep Training Books"
         - [ ] Her kategori için arama hacmi analizi
         - [ ] Her kategori için rekabet analizi
         - [ ] Kategori başlıklarının optimize edilmesi
       - [ ] Eğitici Faydalar Analizi
         - [ ] Mevcut Faydalar:
           - Emotional Intelligence
             - Arama Hacmi: Yüksek
             - Rekabet: Orta
             - Önerilen Alt Kategoriler:
               - Emotional Awareness
               - Empathy Development
               - Self-Regulation
             - Optimizasyon Önerileri:
               - "Books for Emotional Intelligence in [Age Group]"
               - "Emotional Learning Books for Kids"
               - "Books Teaching Empathy to Children"
           - Problem Solving
             - Arama Hacmi: Yüksek
             - Rekabet: Yüksek
             - Önerilen Alt Kategoriler:
               - Critical Thinking
               - Logical Reasoning
               - Creative Problem Solving
             - Optimizasyon Önerileri:
               - "Problem Solving Books for [Age]"
               - "Critical Thinking Books for Kids"
               - "Books Teaching Problem Solving Skills"
           - Social Skills
             - Arama Hacmi: Yüksek
             - Rekabet: Orta
             - Önerilen Alt Kategoriler:
               - Communication
               - Cooperation
               - Friendship
             - Optimizasyon Önerileri:
               - "Social Skills Books for [Age]"
               - "Books About Making Friends"
               - "Communication Skills Books for Kids"
           - Character Building
             - Arama Hacmi: Orta
             - Rekabet: Düşük
             - Önerilen Alt Kategoriler:
               - Values
               - Ethics
               - Personal Growth
             - Optimizasyon Önerileri:
               - "Character Building Books for [Age]"
               - "Books Teaching Values to Children"
               - "Personal Growth Books for Kids"
           - Language Development
             - Arama Hacmi: Yüksek
             - Rekabet: Yüksek
             - Önerilen Alt Kategoriler:
               - Vocabulary
               - Grammar
               - Reading Skills
             - Optimizasyon Önerileri:
               - "Language Development Books for [Age]"
               - "Vocabulary Building Books for Kids"
               - "Reading Skills Books for Children"
         - [ ] Her fayda için arama hacmi analizi
         - [ ] Her fayda için rekabet analizi
         - [ ] Fayda başlıklarının optimize edilmesi
       - [ ] Rakip Analizi
         - [ ] Ana Rakipler:
           - Goodreads
             - Güçlü Yönleri:
               - Geniş kullanıcı tabanı
               - Detaylı kitap incelemeleri
               - Sosyal özellikler
             - Zayıf Yönleri:
               - Eğitici fayda odaklı değil
               - Çocuk kitapları için özel filtreleme yok
               - Fırsat Alanları:
                 - Eğitici fayda bazlı filtreleme
                 - Yaş grubuna göre öneriler
                 - Ebeveyn odaklı içerik
           - Amazon
             - Güçlü Yönleri:
               - Geniş kitap koleksiyonu
               - Güçlü arama algoritması
               - Satış entegrasyonu
             - Zayıf Yönleri:
               - Eğitici içerik odaklı değil
               - Karmaşık arayüz
               - Fırsat Alanları:
                 - Basit ve kullanıcı dostu arayüz
                 - Eğitici fayda bazlı kategorilendirme
                 - Detaylı kitap açıklamaları
           - BookBub
             - Güçlü Yönleri:
               - İndirim odaklı
               - Kişiselleştirilmiş öneriler
               - E-posta pazarlama
             - Zayıf Yönleri:
               - Çocuk kitapları için özel bölüm yok
               - Eğitici içerik eksik
               - Fırsat Alanları:
                 - Çocuk kitapları için özel bölüm
                 - Eğitici fayda bazlı öneriler
                 - Ebeveyn odaklı içerik
         - [ ] Rakiplerin anahtar kelime stratejilerinin analizi
         - [ ] Fırsat alanlarının belirlenmesi
         - [ ] Boşluk analizi ve öneriler
     - [ ] İçerik Stratejisi
       - [ ] Kategori Açıklamaları:
         - Picture Books:
           - Ana Açıklama: "Discover our collection of picture books that combine engaging stories with beautiful illustrations to spark your child's imagination and love for reading."
           - Alt Kategori Açıklamaları:
             - Early Readers: "Perfect for children beginning their reading journey, these books feature simple text and supportive illustrations."
             - Board Books: "Durable and engaging books designed for the youngest readers, featuring sturdy pages and interactive elements."
             - Interactive Picture Books: "Engage your child with books that encourage participation through lift-the-flap, touch-and-feel, and other interactive features."
         - Educational:
           - Ana Açıklama: "Explore our educational books that make learning fun and engaging, covering various subjects from STEM to language arts."
           - Alt Kategori Açıklamaları:
             - STEM Books: "Introduce your child to science, technology, engineering, and math through engaging stories and hands-on activities."
             - Language Learning: "Help your child develop language skills with books that focus on vocabulary, grammar, and reading comprehension."
             - Social Studies: "Discover books that teach children about history, geography, and cultural diversity in an engaging way."
         - Bedtime Stories:
           - Ana Açıklama: "Create peaceful bedtime routines with our collection of calming stories perfect for winding down at the end of the day."
           - Alt Kategori Açıklamaları:
             - Sleep Training Books: "Help establish healthy sleep habits with books that guide children through bedtime routines."
             - Calming Stories: "Soothe your child with gentle stories designed to promote relaxation and peaceful sleep."
             - Nighttime Routines: "Build consistent bedtime routines with books that make the transition to sleep smooth and enjoyable."
       - [ ] Fayda Açıklamaları:
         - Emotional Intelligence:
           - Ana Açıklama: "Help your child develop emotional awareness and empathy through books that explore feelings and relationships."
           - Alt Kategori Açıklamaları:
             - Emotional Awareness: "Books that help children identify and understand their own emotions."
             - Empathy Development: "Stories that teach children to understand and share the feelings of others."
             - Self-Regulation: "Books that guide children in managing their emotions and behavior."
         - Problem Solving:
           - Ana Açıklama: "Develop your child's critical thinking and problem-solving skills with engaging books that present challenges and solutions."
           - Alt Kategori Açıklamaları:
             - Critical Thinking: "Books that encourage children to analyze situations and think independently."
             - Logical Reasoning: "Stories that help children develop step-by-step thinking and decision-making skills."
             - Creative Problem Solving: "Books that inspire innovative thinking and unique solutions to challenges."
         - Social Skills:
           - Ana Açıklama: "Build your child's social skills through books that teach communication, cooperation, and friendship."
           - Alt Kategori Açıklamaları:
             - Communication: "Books that help children express themselves and understand others."
             - Cooperation: "Stories that teach the value of working together and sharing."
             - Friendship: "Books that explore the meaning of friendship and how to be a good friend."
         - Character Building:
           - Ana Açıklama: "Shape your child's character with books that teach important values and personal growth."
           - Alt Kategori Açıklamaları:
             - Values: "Books that introduce and reinforce important moral values."
             - Ethics: "Stories that help children understand right from wrong."
             - Personal Growth: "Books that encourage self-improvement and positive character traits."
         - Language Development:
           - Ana Açıklama: "Enhance your child's language skills with books that focus on vocabulary, grammar, and reading comprehension."
           - Alt Kategori Açıklamaları:
             - Vocabulary: "Books that introduce new words and expand language knowledge."
             - Grammar: "Stories that help children understand language structure and rules."
             - Reading Skills: "Books that develop reading comprehension and fluency."
       - [ ] Kitap Detay Sayfası Şablonu:
         - Başlık: "[Kitap Adı] - [Yazar] | Kids Book Haven"
         - Meta Açıklama: "[Kitap Adı] by [Yazar] - A [Kategori] book focusing on [Fayda]. [Kısa Açıklama]"
         - İçerik Yapısı:
           1. Kitap Başlığı ve Yazar
           2. Kapak Görseli
           3. Kategoriler ve Faydalar
           4. Detaylı Açıklama
           5. Yaş Grubu Önerisi
           6. Eğitici Faydalar Detayı
           7. Fiyat ve Satın Alma Linki
           8. Benzer Kitaplar Önerisi
     - [x] Teknik SEO İyileştirmeleri ✅
       - [x] Sayfa Yükleme Hızı Optimizasyonu:
         - [x] Görsel Optimizasyonu:
           - [x] WebP Formatına Dönüştürme:
             - [x] Mevcut görsellerin WebP formatına dönüştürülmesi
             - [x] Yeni görsellerin WebP formatında yüklenmesi
             - [x] Fallback formatların (JPEG/PNG) sağlanması
             - [x] Görsel dönüştürme scriptinin oluşturulması
           - [x] Lazy Loading Uygulaması:
             - [x] Intersection Observer API entegrasyonu
             - [x] Görsel yükleme önceliklendirmesi
             - [x] Placeholder görsellerin oluşturulması
             - [x] Yükleme animasyonlarının eklenmesi
           - [x] Responsive Görsel Boyutları:
             - [x] srcset ve sizes attribute'larının eklenmesi
             - [x] Farklı ekran boyutları için görsel boyutlarının belirlenmesi
             - [x] Görsel boyutlarının otomatik hesaplanması
             - [x] Retina ekranlar için 2x görseller
           - [x] Görsel Sıkıştırma:
             - [x] Görsel kalitesinin optimize edilmesi
             - [x] Görsel boyutlarının küçültülmesi
             - [x] Görsel sıkıştırma araçlarının entegrasyonu
             - [x] Sıkıştırma oranlarının belirlenmesi
         - [x] Kod Optimizasyonu:
           - [x] JavaScript bundle boyutunu küçültme
           - [x] CSS minification
           - [x] Tree shaking uygulama
           - [x] Code splitting
         - [x] Önbellek Stratejisi:
           - [x] Browser caching
           - [x] CDN kullanımı
           - [x] Service worker implementasyonu
       - [x] Mobil Uyumluluk Testleri:
         - [x] Responsive tasarım kontrolü
         - [x] Touch hedef boyutları
         - [x] Font boyutları
         - [x] Viewport meta tag'leri
       - [x] Core Web Vitals Optimizasyonu:
         - [x] LCP (Largest Contentful Paint):
           - [x] Kritik CSS inline
           - [x] Görsel önceliklendirme
           - [x] Sunucu yanıt süresi optimizasyonu
         - [x] FID (First Input Delay):
           - [x] JavaScript yükleme optimizasyonu
           - [x] Event listener optimizasyonu
           - [x] Third-party script yönetimi
         - [x] CLS (Cumulative Layout Shift):
           - [x] Görsel boyutları belirleme
           - [x] Font yükleme stratejisi
           - [x] Reklam yerleşimi optimizasyonu
     - [x] Performans İzleme ✅
       - [x] Google Analytics entegrasyonu
       - [x] Search Console entegrasyonu
       - [x] Düzenli SEO raporlama sistemi
     - [x] Web Manifest İkon Hatası Düzeltmesi ✅
       - [x] `site.webmanifest` dosyasından ikon referanslarının kaldırılması ✅

2. **Kullanıcı Deneyimi**
   - Loading state'lerin iyileştirilmesi
   - Form submission feedback'lerinin geliştirilmesi
   - Offline support implementasyonu

3. **Ölçeklenebilirlik**
   - Global state yönetiminin implementasyonu
   - API rate limiting
   - Caching stratejisinin geliştirilmesi

4. **Veritabanı Ölçeklendirme**
   - Veritabanı sharding stratejisi
   - Read/Write splitting implementasyonu
   - Backup ve recovery stratejisi
   - Veritabanı monitoring sistemi
   - Performans optimizasyonu için query analizi

## 9. İşaretler ve Açıklamalar
- ✅ Tamamlandı
- ⚠️ Kısmen Tamamlandı / İyileştirme Gerekli
- 🚨 Acil Öncelikli
- 📅 Orta Vadeli
- 🎯 Uzun Vadeli

Bu PRD, projenin mevcut durumunu ve gelecek planlarını detaylı bir şekilde açıklamaktadır. İyileştirmeler, öncelik sırasına göre kategorize edilmiş ve her bir madde için açık hedefler belirlenmiştir. 

- [x] Google Analytics entegrasyonu
- [x] Google Lighthouse Denetimleri ✅
  - [x] İlk Denetim ve Temel İyileştirmeler
  - [ ] Performans Sorunlarını Giderme 🚨

## 10. İşaretler ve Açıklamalar
- ✅ Tamamlandı
- ⚠️ Kısmen Tamamlandı / İyileştirme Gerekli
- 🚨 Acil Öncelikli
- 📅 Orta Vadeli
- 🎯 Uzun Vadeli

Bu PRD, projenin mevcut durumunu ve gelecek planlarını detaylı bir şekilde açıklamaktadır. İyileştirmeler, öncelik sırasına göre kategorize edilmiş ve her bir madde için açık hedefler belirlenmiştir. 

- [x] Google Analytics entegrasyonu
- [x] Google Lighthouse Denetimleri ✅
  - [x] İlk Denetim ve Temel İyileştirmeler
  - [ ] Performans Sorunlarını Giderme 🚨 