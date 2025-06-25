import * as SQLite from "expo-sqlite";

const db = SQLite.openDatabaseSync("funkopops.db");

/**
 * Initialize the database and create the funkopops table if it doesn't exist
 * @returns {Promise<void>} Resolves when the table is created
 * @throws {Error} If the table creation fails
 */
export const initDatabase = async () => {
  try {
    await db.execAsync(`
      CREATE TABLE IF NOT EXISTS funkopops (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        series TEXT,
        number TEXT,
        purchase_price TEXT,
        barcode TEXT,
        image_uri TEXT,
        date_added TEXT DEFAULT CURRENT_TIMESTAMP,
        notes TEXT
      );
    `);

    const columns = await db.getAllAsync(`PRAGMA table_info(funkopops);`);
    const columnNames = columns.map((col) => col.name);

    if (!columnNames.includes("purchase_price")) {
      console.log("Adding purchase_price column to funkopops table");
      await db.execAsync(`ALTER TABLE funkopops ADD COLUMN purchase_price TEXT;`);
    }
  } catch (error) {
    throw error;
  }
};

/**
 * Add a new Funko Pop to the database
 *
 * @param {Funko} funko
 * @returns {Promise<number>} The id of the newly added Funko Pop
 * @throws {Error} If the insertion fails
 */
export const addFunkoPop = async (funko) => {
  try {
    const result = await db.runAsync(
      `INSERT INTO funkopops (name, series, number, purchase_price, barcode, image_uri, notes) 
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [
        funko.name,
        funko.series,
        funko.number,
        funko.purchase_price,
        funko.barcode,
        funko.image_uri,
        funko.notes,
      ]
    );
    return result.lastInsertRowId;
  } catch (error) {
    throw error;
  }
};

/**
 * Get all Funko Pops from the database
 * @returns {Promise<Funko[]>} An array of all Funko Pops in the database
 * @throws {Error} If the retrieval fails
 */
export const getAllFunkoPops = async () => {
  try {
    const result = await db.getAllAsync(
      "SELECT * FROM funkopops ORDER BY date_added DESC"
    );
    return result;
  } catch (error) {
    throw error;
  }
};

/**
 * Get a single Funko Pop by its id
 *
 * @param {string} id of the Funko Pop to retrieve
 * @returns {Funko} The Funko Pop with the specified id or null if not found
 * @throws {Error} If the retrieval fails
 */
export const getFunkoPopById = async (id) => {
  try {
    const result = await db.getFirstAsync(
      "SELECT * FROM funkopops WHERE id = ?",
      [id]
    );
    console.log('result: ', result)
    return result;
  } catch (error) {
    throw error;
  }
};

/**
 *
 * @param {string} id of the Funko Pop to delete
 * @returns {number} The number of rows delete}
 * @throws {Error} If the deletion fails
 */
export const deleteFunkoPop = async (id) => {
  try {
    const result = await db.runAsync("DELETE FROM funkopops WHERE id = ?", [
      id,
    ]);
    return result.changes;
  } catch (error) {
    throw error;
  }
};

/**
 * Update the Funko Pop in the database
 * @param {string} id
 * @param {Funko} funko
 * @returns {number} The number of rows updated
 * @throws {Error} If the update fails
 */
export const updateFunkoPop = async (id, funko) => {
  console.log('funk: ', funko)
  try {
    const result = await db.runAsync(
      `UPDATE funkopops 
       SET name = ?, series = ?, number = ?, purchase_price = ?, barcode = ?, image_uri = ?, notes = ?
       WHERE id = ?`,
      [
        funko.name,
        funko.series,
        funko.number,
        funko.purchase_price,
        funko.barcode,
        funko.image_uri,
        funko.notes,
        id,
      ]
    );
    return result.changes;
  } catch (error) {
    throw error;
  }
};
