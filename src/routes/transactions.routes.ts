import { Router } from 'express';
import multer = require('multer');
import uploadConfig from '../config/upload';
import { getCustomRepository } from 'typeorm';

import CreateCategoryService from '../services/CreateCategoryService';

import CreateTransactionService from '../services/CreateTransactionService';
import DeleteTransactionService from '../services/DeleteTransactionService';
import ImportTransactionsService from '../services/ImportTransactionsService';

import TransactionsRepository from '../repositories/TransactionsRepository';

const transactionsRouter = Router();
const upload = multer(uploadConfig);

transactionsRouter.get('/', async (request, response) => {
  const transactionsRepository = getCustomRepository(TransactionsRepository);

  const transactions = await transactionsRepository.find({
    relations: ['category'],
  });

  const balance = await transactionsRepository.getBalance();

  return response.json({ transactions, balance });
});

transactionsRouter.post('/', async (request, response) => {
  const { title, value, type, category } = request.body;

  const createCategorieyService = new CreateCategoryService();
  const category_id = await createCategorieyService.execute(category);

  const createTransactionService = new CreateTransactionService();

  const transaction = await createTransactionService.execute({
    title,
    value,
    type,
    category_id,
  });

  return response.json(transaction);
});

transactionsRouter.delete('/:id', async (request, response) => {
  const { id } = request.params;

  const deleteTransactionService = new DeleteTransactionService();
  await deleteTransactionService.execute(id);

  return response.status(204).send();
});

transactionsRouter.post(
  '/import',
  upload.single('file'),
  async (request, response) => {
    const filename = request.file.filename;

    const importTransactionsService = new ImportTransactionsService();

    const transactions = await importTransactionsService.execute({
      filename,
    });

    return response.json(transactions);
  },
);

export default transactionsRouter;
