import mongoose, { Schema, Document } from 'mongoose';

// Employee interface
export interface IEmployee extends Document {
  employeeId: string;
  name: string;
  position: string;
  department?: string;
  email?: string;
  phone?: string;
  address?: string;
  employmentType?: string;
  createdAt: Date;
  updatedAt: Date;
}

// Employee schema
const EmployeeSchema: Schema = new Schema({
  employeeId: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    index: true  // Only define index here
  },
  name: {
    type: String,
    required: true,
    trim: true
  },
  position: {
    type: String,
    required: true,
    trim: true
  },
  department: {
    type: String,
    trim: true
  },
  email: {
    type: String,
    trim: true,
    lowercase: true
  },
  phone: {
    type: String,
    trim: true
  },
  address: {
    type: String,
    trim: true
  },
  employmentType: {
    type: String,
    trim: true
  }
}, {
  timestamps: true,
  collection: 'employees'
});

// Additional indexes (excluding employeeId since it's already indexed)
EmployeeSchema.index({ department: 1 });
EmployeeSchema.index({ name: 1 });

// Export the model
export const Employee = mongoose.model<IEmployee>('Employee', EmployeeSchema);
