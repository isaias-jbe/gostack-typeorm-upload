import { EntityRepository, Repository } from 'typeorm';

import Transaction from '../models/Transaction';

interface Balance {
  income: number;
  outcome: number;
  total: number;
}

@EntityRepository(Transaction)
class TransactionsRepository extends Repository<Transaction> {
  private balance: Balance = { income: 0, outcome: 0, total: 0 };

  public async getBalance(): Promise<Balance> {
    const transactions = await this.find();
    const { income, outcome } = await transactions.reduce(
      (acumulator, transaction: Transaction) => {
        transaction.type === 'income'
          ? (acumulator.income += transaction.value)
          : (acumulator.outcome += transaction.value);

        return acumulator;
      },
      { income: 0, outcome: 0 },
    );

    const total = income - outcome;

    this.balance = { income, outcome, total };

    return this.balance;
  }
}

export default TransactionsRepository;
