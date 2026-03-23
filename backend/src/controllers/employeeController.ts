import { Request, Response } from 'express';
import { Employee } from '../models/Employee';

// Get all employees
export const getAllEmployees = async (req: Request, res: Response) => {
  try {
    const employees = await Employee.find().sort({ createdAt: -1 });
    
    res.status(200).json({
      success: true,
      data: employees,
      message: 'Employees retrieved successfully'
    });
  } catch (error) {
    console.error('Error fetching employees:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch employees',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
};

// Create a new employee
export const createEmployee = async (req: Request, res: Response) => {
  try {
    const { name, position, department, email, phone, address, employmentType } = req.body;

    // Validate required fields
    if (!name || !position) {
      return res.status(400).json({
        success: false,
        message: 'Name and position are required'
      });
    }

    // Generate employee ID
    const employeeCount = await Employee.countDocuments();
    const employeeId = `EMP${String(employeeCount + 1).padStart(4, '0')}`;

    // Create new employee
    const newEmployee = new Employee({
      employeeId,
      name: name.trim(),
      position: position.trim(),
      department: department?.trim(),
      email: email?.trim(),
      phone: phone?.trim(),
      address: address?.trim(),
      employmentType: employmentType?.trim()
    });

    const savedEmployee = await newEmployee.save();

    res.status(201).json({
      success: true,
      data: savedEmployee,
      message: 'Employee created successfully'
    });
  } catch (error) {
    console.error('Error creating employee:', error);
    
    // Handle duplicate key error
    if (error instanceof Error && error.message.includes('duplicate key')) {
      return res.status(400).json({
        success: false,
        message: 'Employee with this ID already exists'
      });
    }

    res.status(500).json({
      success: false,
      message: 'Failed to create employee',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
};

// Update an employee
export const updateEmployee = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { name, position, department, email, phone, address, employmentType } = req.body;

    const updatedEmployee = await Employee.findOneAndUpdate(
      { employeeId: id },
      {
        name: name?.trim(),
        position: position?.trim(),
        department: department?.trim(),
        email: email?.trim(),
        phone: phone?.trim(),
        address: address?.trim(),
        employmentType: employmentType?.trim()
      },
      { new: true, runValidators: true }
    );

    if (!updatedEmployee) {
      return res.status(404).json({
        success: false,
        message: 'Employee not found'
      });
    }

    res.status(200).json({
      success: true,
      data: updatedEmployee,
      message: 'Employee updated successfully'
    });
  } catch (error) {
    console.error('Error updating employee:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update employee',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
};

// Delete an employee
export const deleteEmployee = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const deletedEmployee = await Employee.findOneAndDelete({ employeeId: id });

    if (!deletedEmployee) {
      return res.status(404).json({
        success: false,
        message: 'Employee not found'
      });
    }

    res.status(200).json({
      success: true,
      data: deletedEmployee,
      message: 'Employee deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting employee:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete employee',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
};
