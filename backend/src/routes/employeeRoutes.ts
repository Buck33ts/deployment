import { Router } from 'express';
import {
  getAllEmployees,
  createEmployee,
  updateEmployee,
  deleteEmployee
} from '../controllers/employeeController';

const router = Router();

// GET /api/employees - Get all employees
router.get('/', getAllEmployees);

// POST /api/employees - Create a new employee
router.post('/', createEmployee);

// PUT /api/employees/:id - Update an employee
router.put('/:id', updateEmployee);

// DELETE /api/employees/:id - Delete an employee
router.delete('/:id', deleteEmployee);

export default router;
