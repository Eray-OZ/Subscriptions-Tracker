import * as SQLite from 'expo-sqlite';

let db = null;

export const setupDatabase = async () => {
  db = await SQLite.openDatabaseAsync('SubTracker');

  await db.execAsync(`
    CREATE TABLE IF NOT EXISTS Categories (id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT NOT NULL UNIQUE);
    CREATE TABLE IF NOT EXISTS Subscriptions (id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT NOT NULL, amount REAL NOT NULL, nextPaymentDate DATE NOT NULL, categoryId INTEGER, frequency TEXT DEFAULT 'Monthly', isTrial INTEGER DEFAULT 0, trialEndDate DATE, FOREIGN KEY (categoryId) REFERENCES Categories (id));
    CREATE TABLE IF NOT EXISTS PaymentHistory (id INTEGER PRIMARY KEY AUTOINCREMENT, subscriptionId INTEGER, name TEXT NOT NULL, amount REAL NOT NULL, paymentDate DATE NOT NULL, categoryId INTEGER, FOREIGN KEY(subscriptionId) REFERENCES Subscriptions(id), FOREIGN KEY(categoryId) REFERENCES Categories(id));
  `);

  // Migration for existing tables
  try {
    const tableInfo = await db.getAllAsync("PRAGMA table_info(Subscriptions);");
    
    const hasFrequency = tableInfo.some(column => column.name === 'frequency');
    if (!hasFrequency) {
      await db.execAsync("ALTER TABLE Subscriptions ADD COLUMN frequency TEXT DEFAULT 'Monthly';");
    }

    const hasIsTrial = tableInfo.some(column => column.name === 'isTrial');
    if (!hasIsTrial) {
      await db.execAsync("ALTER TABLE Subscriptions ADD COLUMN isTrial INTEGER DEFAULT 0;");
      await db.execAsync("ALTER TABLE Subscriptions ADD COLUMN trialEndDate DATE;");
    }

    const hasReminderDays = tableInfo.some(column => column.name === 'reminderDaysBefore');
    if (!hasReminderDays) {
      await db.execAsync("ALTER TABLE Subscriptions ADD COLUMN reminderDaysBefore INTEGER DEFAULT 1;");
    }

    const hasReminderHour = tableInfo.some(column => column.name === 'reminderHour');
    if (!hasReminderHour) {
      await db.execAsync("ALTER TABLE Subscriptions ADD COLUMN reminderHour INTEGER DEFAULT 11;");
      await db.execAsync("ALTER TABLE Subscriptions ADD COLUMN reminderMinute INTEGER DEFAULT 30;");
    }

    const hasCardName = tableInfo.some(column => column.name === 'cardName');
    if (!hasCardName) {
      await db.execAsync("ALTER TABLE Subscriptions ADD COLUMN cardName TEXT;");
    }

    // Seed Categories if empty
    const categoryCount = await db.getFirstAsync('SELECT COUNT(*) as count FROM Categories');
    if (categoryCount.count === 0) {
      await db.execAsync(`
        INSERT INTO Categories (name) VALUES 
        ('Bills'), ('Movie Streaming'), ('Music'), ('Gaming'), ('Software'), 
        ('Cloud'), ('Reading'), ('Shopping'), ('Gym'), ('Others');
      `);
    }
  } catch (e) {
    console.log("Migration or seeding error:", e);
  }
};

export const getSubscriptions = async () => {
  if (!db) throw new Error("Veritabanı henüz kurulmadı!");
  const allSubs = await db.getAllAsync(`
    SELECT s.id, s.name, s.amount, s.nextPaymentDate as next_payment_date, s.categoryId, c.name as category_name, s.frequency, s.isTrial, s.trialEndDate, s.reminderDaysBefore, s.reminderHour, s.reminderMinute, s.cardName
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

export const addSubscription = async (name, amount, nextPaymentDate, categoryId, frequency = 'Monthly', isTrial = 0, trialEndDate = null, reminderDaysBefore = 1, reminderHour = 11, reminderMinute = 30, cardName = null) => {
  if (!db) throw new Error("Veritabanı henüz kurulmadı!");
  const result = await db.runAsync(
    'INSERT INTO Subscriptions (name, amount, nextPaymentDate, categoryId, frequency, isTrial, trialEndDate, reminderDaysBefore, reminderHour, reminderMinute, cardName) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
    [name, amount, nextPaymentDate, categoryId, frequency, isTrial ? 1 : 0, trialEndDate, reminderDaysBefore, reminderHour, reminderMinute, cardName]
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
  return await db.getAllAsync(
    `SELECT * FROM PaymentHistory ORDER BY paymentDate DESC`
  )
}

export const getPaymentHistoryBySubscription = async (subscriptionId) => {
  if (!db) throw new Error("Veritabanı henüz kurulmadı!");
  return await db.getAllAsync(
    `SELECT * FROM PaymentHistory WHERE subscriptionId = ? ORDER BY paymentDate DESC`,
    [subscriptionId]
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

export const updateFullSubscription = async (subscriptionId, name, amount, nextPaymentDate, categoryId, frequency, isTrial, trialEndDate, reminderDaysBefore, reminderHour, reminderMinute, cardName) => {
  if (!db) throw new Error("Veritabanı henüz kurulmadı!");
  return db.runAsync(
    `UPDATE Subscriptions SET name = ?, amount = ?, nextPaymentDate = ?, categoryId = ?, frequency = ?, isTrial = ?, trialEndDate = ?, reminderDaysBefore = ?, reminderHour = ?, reminderMinute = ?, cardName = ? WHERE id = ?`,
    [name, amount, nextPaymentDate, categoryId, frequency, isTrial ? 1 : 0, trialEndDate, reminderDaysBefore, reminderHour, reminderMinute, cardName, subscriptionId]
  );
}
 
export const convertTrialToSubscription = async (subscriptionId) => {
  if (!db) throw new Error("Veritabanı henüz kurulmadı!");
  return db.runAsync(
    `UPDATE Subscriptions SET isTrial = 0, trialEndDate = NULL WHERE id=(?)`,
    [subscriptionId]
  );
}

export const deleteSubscription = async (subscriptionId) => {
  if (!db) throw new Error("Veritabanı henüz kurulmadı!");
  return db.runAsync(
    `DELETE FROM Subscriptions WHERE id=(?)`, [subscriptionId]
  )
}