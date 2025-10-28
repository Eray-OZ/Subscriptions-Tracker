import * as SQLite from 'expo-sqlite';

// 1. db değişkenini en üstte null olarak başlat.
let db = null;

// 2. Veritabanını kuracak ve db değişkenini dolduracak TEK bir ana fonksiyon oluştur.
export const setupDatabase = async () => {
  // Veritabanını aç ve üstteki db değişkenine ata.
  db = await SQLite.openDatabaseAsync('SubTracker');

  // CREATE TABLE ve INSERT komutlarını çalıştır (noktalı virgüllere dikkat).
  await db.execAsync(`
    CREATE TABLE IF NOT EXISTS Categories (id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT NOT NULL);
    CREATE TABLE IF NOT EXISTS Subscriptions (id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT NOT NULL, amount REAL NOT NULL, nextPaymentDate DATE NOT NULL, categoryId INTEGER, FOREIGN KEY (categoryId) REFERENCES Categories (id));
    CREATE TABLE IF NOT EXISTS PaymentHistory (id INTEGER PRIMARY KEY AUTOINCREMENT, subscriptionId INTEGER, name TEXT NOT NULL, amount REAL NOT NULL, paymentDate DATE NOT NULL, categoryId INTEGER, FOREIGN KEY(subscriptionId) REFERENCES Subscriptions(id), FOREIGN KEY(categoryId) REFERENCES Categories(id));
    `);

  const categoryCount = await db.getFirstAsync('SELECT COUNT(*) as count FROM Categories');
  if (categoryCount && categoryCount.count === 0) {
    console.log('Categories tablosu boş, başlangıç verileri ekleniyor...');
    await db.execAsync(`
        INSERT INTO Categories (name) VALUES ('Bills');
        INSERT INTO Categories (name) VALUES ('Movie Streaming');
        INSERT INTO Categories (name) VALUES ('Music');
        INSERT INTO Categories (name) VALUES ('Gaming');
        INSERT INTO Categories (name) VALUES ('Software');
        INSERT INTO Categories (name) VALUES ('Cloud');
        INSERT INTO Categories (name) VALUES ('Reading');
        INSERT INTO Categories (name) VALUES ('Shopping');
        INSERT INTO Categories (name) VALUES ('Gym');
        INSERT INTO Categories (name) VALUES ('Others');
    `);
  }
};

// 3. Diğer tüm fonksiyonlar artık db değişkeninin dolu olduğunu varsayarak çalışabilir.
// Fonksiyon: getSubscriptions
// Amaç: Tüm abonelikleri veya belirli bir sıralama/filtreleme ölçütüne göre abonelikleri veritabanından almak.
// Parametreler: sort_option (sıralama seçeneği), filter_option (filtreleme seçeneği)
// Gerekli SQL: SELECT * FROM Subscriptions ORDER BY ...
export const getSubscriptions = async () => {
  if (!db) throw new Error("Veritabanı henüz kurulmadı!");
  const allSubs = await db.getAllAsync(`
    SELECT s.id, s.name, s.amount, s.nextPaymentDate as next_payment_date, c.name as category_name
    FROM Subscriptions s
    JOIN Categories c ON s.categoryId = c.id
  `);
  return allSubs;
};


export const getCategories = async () => {
  if (!db) throw new Error("Veritabanı henüz kurulmadı")
  const allCategories = await db.getAllAsync('SELECT * FROM Categories')
  return allCategories
}

// Fonksiyon: addSubscription
// Amaç: Veritabanına yeni bir abonelik eklemek.
// Parametreler: name, amount, cycle, nextPaymentDate, categoryId
// Gerekli SQL: INSERT INTO Subscriptions (...) VALUES (...)
export const addSubscription = async (name, amount, nextPaymentDate, categoryId) => {
  if (!db) throw new Error("Veritabanı henüz kurulmadı!");
  return await db.runAsync(
    'INSERT INTO Subscriptions (name, amount, nextPaymentDate, categoryId) VALUES (?, ?, ?, ?)',
    [name, amount, nextPaymentDate, categoryId]
  );
};

// Fonksiyon: addPaymentToHistory
// Amaç: Bir ödeme yapıldığında, bu ödemeyi PaymentHistory tablosuna kaydetmek.
// Parametreler: subscriptionId, name, amount, paymentDate, categoryId
// Gerekli SQL: INSERT INTO PaymentHistory (...) VALUES (...)
export const addPaymentToHistory = async (subscriptionId, name, amount, paymentDate, categoryId) => {
  if (!db) throw new Error("Veritabanı henüz kurulmadı!");
  return await db.runAsync(
    'INSERT INTO PaymentHistory (subscriptionId, name, amount, paymentDate, categoryId) VALUES (?, ?, ?, ?, ?)',
    [subscriptionId, name, amount, paymentDate, categoryId]
  );
};


export const getPaymentHistory = async () => {
  if (!db) throw new Error("Veritabanı henüz kurulmadı!");
  return await db.runAsync(
    `SELECT * FROM PaymentHistory`
  )
}


// Fonksiyon: updateSubscription
// Amaç: Mevcut bir aboneliğin bilgilerini güncellemek.
// Parametreler: id, name, amount, cycle, nextPaymentDate, categoryId
// Gerekli SQL: UPDATE Subscriptions SET ... WHERE id = ?
export const updateSubscription = async (subscriptionId, newDate) => {
  if (!db) throw new Error("Veritabanı henüz kurulmadı!");

  return db.runAsync(
    `UPDATE Subscriptions SET nextPaymentDate = (?)
     WHERE id=(?)`, [newDate, subscriptionId]
  )
}

// Fonksiyon: deleteSubscription
// Amaç: Belirli bir aboneliği veritabanından silmek.
// Parametreler: id
// Gerekli SQL: DELETE FROM Subscriptions WHERE id = ?

export const deleteSubscription = async (subscriptionId) => {
  if (!db) throw new Error("Veritabanı henüz kurulmadı!");
  return db.runAsync(
    `DELETE FROM Subscriptions WHERE id=(?)`, [subscriptionId]
  )
}

// Fonksiyon: getMonthlySpending
// Amaç: Belirli bir ay ve yıl için yapılan toplam harcamayı hesaplamak.
// Parametreler: month, year
// Gerekli SQL: SELECT SUM(amount) FROM PaymentHistory WHERE strftime('%Y-%m', paymentDate) = 'YYYY-MM'
