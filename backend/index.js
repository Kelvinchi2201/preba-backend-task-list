import express from 'express';
import tasksRouter from './src/modules/tasks/tasks.routes.js';
import { ZodError } from 'zod/v4';
import { ErrorWithStatus } from './src/utils/errorTypes.js';
import { DatabaseError } from 'pg';
const app = express();

app.use(express.json());

app.get('/', (req, res) => {
  res.json({ hola: 'adioss' });
});

app.use('/tasks', tasksRouter);

app.use((err, req, res, _next) => {
  if (err instanceof ZodError) {
    const messages = err.issues.map((ZodError) => ZodError.message);
    const message = messages.join(',\n');
    return res.status(400).json({ error: message });
  }

  if (err instanceof ErrorWithStatus) {
    return res.status(err.status).json({ error: err.message });
  }

  if (err instanceof DatabaseError) {
    if (err.code === '22P02') {
      return res.status(400).json({ error: 'Hubo un error. Contacte con el administrador' });
    }
  }
  res.json({ error: 'HUBO UN ERROR' });
});

app.listen(3000, (error) => {
  if (error) console.log(error);
  console.log('server running in http://localhost:3000');
});
