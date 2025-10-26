// Bu ekran, yeni bir abonelik eklemek veya mevcut bir aboneliği düzenlemek için kullanılacak formu içerecek.
// Form Elemanları:
// - İsim (Text Input)
// - Tutar (Nümerik Text Input)
// - Kategori (Veritabanından gelen kategorileri listeleyen bir Picker/Dropdown)
// - İlk Ödeme Tarihi (Tarih Seçici / Date Picker)
// - Ödeme Döngüsü ('Haftalık', 'Aylık', 'Yıllık' seçeneklerini içeren bir Picker/Dropdown)
// - Kaydet Butonu: Form verilerini toplayıp database.js'deki addSubscription veya updateSubscription fonksiyonunu çağıracak.
// - Sil Butonu (Sadece düzenleme modunda görünür): database.js'deki deleteSubscription fonksiyonunu çağıracak.