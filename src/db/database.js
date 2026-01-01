import * as SQLite from 'expo-sqlite';

let db = null;

export const setupDatabase = async () => {
  db = await SQLite.openDatabaseAsync('SubTracker');

  await db.execAsync(`
    CREATE TABLE IF NOT EXISTS Categories (id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT NOT NULL UNIQUE);
    CREATE TABLE IF NOT EXISTS Subscriptions (id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT NOT NULL, amount REAL NOT NULL, nextPaymentDate DATE NOT NULL, categoryId INTEGER, frequency TEXT DEFAULT 'Monthly', FOREIGN KEY (categoryId) REFERENCES Categories (id));
    CREATE TABLE IF NOT EXISTS PaymentHistory (id INTEGER PRIMARY KEY AUTOINCREMENT, subscriptionId INTEGER, name TEXT NOT NULL, amount REAL NOT NULL, paymentDate DATE NOT NULL, categoryId INTEGER, FOREIGN KEY(subscriptionId) REFERENCES Subscriptions(id), FOREIGN KEY(categoryId) REFERENCES Categories(id));
  `);

  // Migration for existing tables
  try {
    const tableInfo = await db.getAllAsync("PRAGMA table_info(Subscriptions);");
    const hasFrequency = tableInfo.some(column => column.name === 'frequency');
    if (!hasFrequency) {
      await db.execAsync("ALTER TABLE Subscriptions ADD COLUMN frequency TEXT DEFAULT 'Monthly';");
    }
  } catch (e) {
    console.log("Migration error (column might already exist):", e);
  }
};

export const getSubscriptions = async () => {
  if (!db) throw new Error("Veritabanı henüz kurulmadı!");
  const allSubs = await db.getAllAsync(`
    SELECT s.id, s.name, s.amount, s.nextPaymentDate as next_payment_date, c.name as category_name, s.frequency
    FROM Subscriptions s
    JOIN Categories c ON s.categoryId = c.id
    ORDER BY s.id DESC
  `);
  return allSubs;
};


export const getCategories = async () => {
  if (!db) throw new Error("Veritabanı henüz kurulmadı")
  const allCategories = await db.getAllAsync('SELECT * FROM Categories')
  return allCategories
}

export const addSubscription = async (name, amount, nextPaymentDate, categoryId, frequency = 'Monthly') => {
  if (!db) throw new Error("Veritabanı henüz kurulmadı!");
  const result = await db.runAsync(
    'INSERT INTO Subscriptions (name, amount, nextPaymentDate, categoryId, frequency) VALUES (?, ?, ?, ?, ?)',
    [name, amount, nextPaymentDate, categoryId, frequency]
  );
  return result.lastInsertRowId;
};

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

export const updateSubscription = async (subscriptionId, newDate) => {
  if (!db) throw new Error("Veritabanı henüz kurulmadı!");

  return db.runAsync(
    `UPDATE Subscriptions SET nextPaymentDate = (?)
     WHERE id=(?)`, [newDate, subscriptionId]
  )
}


export const updateAmount = async (subscriptionId, newAmount) => {
  if (!db) throw new Error("Veritabanı henüz kurulmadı!");

  return db.runAsync(
    `UPDATE Subscriptions SET amount = (?)
    WHERE id=(?)`, [newAmount, subscriptionId]
  )
}

export const deleteSubscription = async (subscriptionId) => {
  if (!db) throw new Error("Veritabanı henüz kurulmadı!");
  return db.runAsync(
    `DELETE FROM Subscriptions WHERE id=(?)`, [subscriptionId]
  )
}