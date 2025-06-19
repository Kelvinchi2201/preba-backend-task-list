import path from 'node:path';
import fs from 'node:fs/promises';
import db from './db.json' with { type: 'json' };

export const writeDbJson = async (property, value) => {
  const dbPath = path.join(import.meta.dirname, 'db.json');
  const newDb = { ...db, [property]: value };
  await fs.writeFile(dbPath, JSON.stringify(newDb));
};
