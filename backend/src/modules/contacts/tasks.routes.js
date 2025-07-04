import express from 'express';
import tasksRepository from './tasks.repository.js';
import {
  createTaskRouteSchema,
  deleteTaskRouteSchema,
  updateTaskRouteSchema,
} from './tasks.routes.schema.js';

const tasksRouter = express.Router();

tasksRouter.get('/', async (req, res) => {
  const tasks = await tasksRepository.getAll();
  res.json(tasks);
});
tasksRouter.post('/', async (req, res) => {
  const body = createTaskRouteSchema.body.parse(req.body);
  const newTask = await tasksRepository.addOne(body);
  res.json(newTask);
});

tasksRouter.delete('/:id', async (req, res) => {
  const params = deleteTaskRouteSchema.params.parse(req.params);
  const taskDeleted = await tasksRepository.deleteOneById(params.id);
  res.json(taskDeleted);
});

tasksRouter.put('/:id', async (req, res) => {
  const body = updateTaskRouteSchema.body.parse(req.body);
  const params = updateTaskRouteSchema.params.parse(req.params);
  const taskCheck = await tasksRepository.updateOneByIde(params.id, body);
  res.json(taskCheck);
});

export default tasksRouter;
