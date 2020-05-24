import fs from 'fs';
import path from 'path';

import uploadConfig from '../config/upload';
import Transaction from '../models/Transaction';
import AppError from '../errors/AppError';

import CreateCategoryService from './CreateCategoryService';
import CreateTransactionService from './CreateTransactionService';
import LoadCsvService from './LoadCsvService';

interface Request {
  filename: string;
}

class ImportTransactionsService {
  async execute({ filename }: Request): Promise<Transaction[]> {
    if (!filename) {
      throw new AppError('Import a file (Importe um arquivo).');
    }

    const importCsvFilePath = path.join(uploadConfig.directory, filename);
    const importCsvFileExists = await fs.promises.stat(importCsvFilePath);

    if (!importCsvFileExists) {
      throw new AppError(
        'File import failed (Falha na importação do arquivo).',
      );
    }

    if (!importCsvFileExists) {
      throw new AppError(
        'File import failed (Falha na importação do arquivo).',
      );
    }

    const csvFilePath = path.resolve(uploadConfig.directory, filename);

    const createCategoryService = new CreateCategoryService();
    const createTransactionService = new CreateTransactionService();
    const loadCsvService = new LoadCsvService();

    const transactions: Transaction[] = [];

    const dataCsv = await loadCsvService.execute(csvFilePath);

    for (let index = 0; index < dataCsv.length; index++) {
      const title = dataCsv[index][0];
      const value = dataCsv[index][2];
      const type = dataCsv[index][1];
      const category_id = await createCategoryService.execute(
        dataCsv[index][3],
      );

      const transaction = await createTransactionService.execute({
        title,
        value,
        type,
        category_id,
      });

      transactions.push(transaction);
    }

    return transactions;
  }
}

export default ImportTransactionsService;
