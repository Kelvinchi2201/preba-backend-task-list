import db from './index.js';

const createContactsTable = async () => {
  await db.query('DROP TABLE IF EXISTS tasks');
  await db.query(`
  CREATE TABLE tasks (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  complete BOOLEAN DEFAULT FALSE
  )  
 `);
  console.log('Tabla de Tareas creada');
};

const createTables = async () => {
  await createContactsTable();
  console.log('Tablas creadas correctamente');
  process.exit();
};

createTables();
