// Bu bileşen, bir abonelik için "Ödendi" butonuna tıklandığında ortaya çıkacak olan modal (popup) penceresini temsil eder.
// İçerik:
// - Bir başlık (örn: "Ödemeyi Onayla")
// - Ödemenin yapıldığı tarihi seçmek için bir Tarih Seçici (Date Picker).
// - "Onayla" Butonu:
//   - Seçilen tarihi alır.
//   - database.js'deki addPaymentToHistory fonksiyonunu çağırarak ödemeyi geçmişe kaydeder.
//   - DateService'i kullanarak bir sonraki ödeme tarihini hesaplar.
//   - database.js'deki updateSubscription fonksiyonunu çağırarak aboneliğin gelecek ödeme tarihini günceller.
//   - Modalı kapatır.
// - "İptal" Butonu: Modalı kapatır.