
import { v4 as uuidv4 } from 'uuid';
import db from '../models/index.js';

const usersMock = [
  {
    id: uuidv4(),
    email: 'john.doe@example.com',
    password: 'password123',
    createdAt: new Date(),
  },
  {
    id: uuidv4(),
    email: 'jane.doe@example.com',
    password: 'password456',
    createdAt: new Date(),
  },
];

const categoriesMock = [
  {
    id: uuidv4(),
    name: 'Groceries',
    is_default: true,
    created_at: new Date(),
  },
  {
    id: uuidv4(),
    name: 'Utilities',
    is_default: true,
    created_at: new Date(),
  },
  {
    id: uuidv4(),
    name: 'Transport',
    is_default: false,
    user_id: usersMock[0].id,
    created_at: new Date(),
  },
];

const expensesMock = [
  {
    id: uuidv4(),
    amount: 50.25,
    expense_date: new Date(),
    is_recurrent: false,
    description: 'Weekly groceries',
    user_id: usersMock[0].id,
    category_id: categoriesMock[0].id,
  },
  {
    id: uuidv4(),
    amount: 75.0,
    expense_date: new Date(),
    is_recurrent: true,
    description: 'Monthly electricity bill',
    start_date: new Date(),
    end_date: new Date(new Date().setFullYear(new Date().getFullYear() + 1)),
    user_id: usersMock[0].id,
    category_id: categoriesMock[1].id,
  },
  {
    id: uuidv4(),
    amount: 30.0,
    expense_date: new Date(),
    is_recurrent: false,
    description: 'Bus ticket',
    user_id: usersMock[1].id,
    category_id: categoriesMock[2].id,
  },
];

const createMocks = () => {
  db.User.bulkCreate(usersMock)
  db.Category.bulkCreate(categoriesMock)
  db.Expense.bulkCreate(expensesMock)
}

export default createMocks;
