import * as SQLite from "expo-sqlite";

const db = SQLite.openDatabaseSync("march8.db");

export interface Wish {
  id?: number;
  name: string;
  message: string;
  emoji: string;
  created_at?: string;
}

export const initDB = (): Promise<void> => {
  const sql = `CREATE TABLE IF NOT EXISTS wishes (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    message TEXT NOT NULL,
    emoji TEXT DEFAULT '🌸',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  )`;
  return db.execAsync(sql);
};

export const addWish = async (wish: Wish): Promise<number> => {
  const result = await db.runAsync(
    "INSERT INTO wishes (name, message, emoji) VALUES (?, ?, ?)",
    [wish.name, wish.message, wish.emoji],
  );
  return result.lastInsertRowId;
};

export const getWishes = async (): Promise<Wish[]> => {
  const rows = await db.getAllAsync<Wish>(
    "SELECT * FROM wishes ORDER BY created_at DESC",
  );
  return rows as Wish[];
};

export const deleteWish = async (id: number): Promise<void> => {
  await db.runAsync("DELETE FROM wishes WHERE id = ?", [id]);
};
