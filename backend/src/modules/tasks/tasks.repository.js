import db from '../../db/index.js';
import { ErrorWithStatus } from '../../utils/errorTypes.js';

const getAll = async () => {
  const response = await db.query('SELECT * FROM tasks');
  return response.rows;
};

const addOne = async (payload) => {
  const response = await db.query(
    `
    INSERT INTO tasks (name) 
    VALUES ($1) 
    RETURNING *
  `,
    [payload.name],
  );
  return response.rows[0];
};

const deleteOneById = async (id) => {
  const response = await db.query(
    `
   DELETE FROM tasks
   WHERE id = $1 
   RETURNING *
    `,
    [id],
  );
  if (response.rowCount === 0) {
    throw new ErrorWithStatus(404, 'El contacto no fue encontrado');
  }
  return response.rows[0];
};

const updateOneByIde = async (id, payload) => {
  const response = await db.query(
    `
    UPDATE tasks
    SET complete = $1
    WHERE id = $2
    RETURNING *
    `,
    [payload.complete, id],
  );
  if (response.rowCount === 0) {
    throw new ErrorWithStatus(404, 'El contacto no fue encontrado');
  }
  return response.rows[0];
};

const tasksRepository = { getAll, addOne, deleteOneById, updateOneByIde };

export default tasksRepository;
