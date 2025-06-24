import * as SQLite from 'expo-sqlite';

const db = SQLite.openDatabaseSync('funkopops.db');

// Initialize database
export const initDatabase = async () => {
  try {
    await db.execAsync(`
      CREATE TABLE IF NOT EXISTS funkopops (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        series TEXT,
        number TEXT,
        barcode TEXT,
        image_uri TEXT,
        date_added TEXT DEFAULT CURRENT_TIMESTAMP,
        notes TEXT
      );
    `);
  } catch (error) {
    throw error;
  }
};

// Add new Funko Pop
export const addFunkoPop = async (funko) => {
  try {
    const result = await db.runAsync(
      `INSERT INTO funkopops (name, series, number, barcode, image_uri, notes) 
       VALUES (?, ?, ?, ?, ?, ?)`,
      [funko.name, funko.series, funko.number, funko.barcode, funko.image_uri, funko.notes]
    );
    return result.lastInsertRowId;
  } catch (error) {
    throw error;
  }
};

// Get all Funko Pops
export const getAllFunkoPops = async () => {
  try {
    const result = await db.getAllAsync(
      'SELECT * FROM funkopops ORDER BY date_added DESC'
    );
    return result;
  } catch (error) {
    throw error;
  }
};

export const getFunkoPopById = async (id) => {
  try {
    const result = await db.getFirstAsync(
      'SELECT * FROM funkopops WHERE id = ?',
      [id]
    );
    return result;
  } catch (error) {
    throw error;
  }
};

// Delete Funko Pop
export const deleteFunkoPop = async (id) => {
  try {
    const result = await db.runAsync(
      'DELETE FROM funkopops WHERE id = ?',
      [id]
    );
    return result.changes;
  } catch (error) {
    throw error;
  }
};

// Update Funko Pop
export const updateFunkoPop = async (id, funko) => {
  try {
    const result = await db.runAsync(
      `UPDATE funkopops 
       SET name = ?, series = ?, number = ?, barcode = ?, image_uri = ?, notes = ?
       WHERE id = ?`,
      [funko.name, funko.series, funko.number, funko.barcode, funko.image_uri, funko.notes, id]
    );
    return result.changes;
  } catch (error) {
    throw error;
  }
};