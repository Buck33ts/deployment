'use client';

import { useState, useEffect } from 'react';
import AppLayout from './components/AppLayout';
import EmployeeModal from './components/EmployeeModal';
import EmployeeCard from './components/EmployeeCard';
import DashboardStats from './components/DashboardStats';
import EmployeeList from './components/EmployeeList';

// TypeScript interface for Employee
interface Employee {
  _id: string;
  employeeId: string;
  name: string;
  position: string;
  department?: string;
  email?: string;
  phone?: string;
  address?: string;
  employmentType?: string;
  createdAt: string;
  updatedAt: string;
}

// API response interface
interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}

// Department name mapping - handles both sidebar IDs and API responses
const departmentNames: { [key: string]: string } = {
  'admin': 'Administrative',
  'Admin': 'Administrative',
  'Administrative': 'Administrative',
  'engineering': 'Engineering',
  'Engineering': 'Engineering',
  'health': 'health',  // API sends 'health', keep it as is for filtering
  'Health': 'health',
  'Health Services': 'health',
  'education': 'Education',
  'Education': 'Education',
  'finance': 'Finance',
  'Finance': 'Finance',
  'social': 'Social Services',
  'Social': 'Social Services',
  'agriculture': 'Agriculture',
  'Agriculture': 'Agriculture',
  'tourism': 'Tourism',
  'Tourism': 'Tourism'
};

export default function Home() {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [filteredEmployees, setFilteredEmployees] = useState<Employee[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [activeSection, setActiveSection] = useState('all');

  // API base URL
  const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:1000/api/employees';

  // Calculate department counts using department IDs for sidebar
  const getDepartmentCounts = () => {
    const counts: { [key: string]: number } = {};
    employees.forEach(emp => {
      if (emp.department) {
        // Map API department names to sidebar IDs
        let deptId: string;
        switch(emp.department) {
          case 'Administrative': deptId = 'admin'; break;
          case 'Engineering': deptId = 'engineering'; break;
          case 'health': deptId = 'health'; break;
          case 'tourism': deptId = 'tourism'; break;
          case 'Education': deptId = 'education'; break;
          case 'Finance': deptId = 'finance'; break;
          case 'Social Services': deptId = 'social'; break;
          case 'Agriculture': deptId = 'agriculture'; break;
          default: deptId = emp.department;
        }
        counts[deptId] = (counts[deptId] || 0) + 1;
      }
    });
    return counts;
  };

  /**
   * Fetch all employees from the backend
   */
  const fetchEmployees = async () => {
    try {
      setLoading(true);
      console.log('🔄 Fetching employees from:', API_BASE);
      
      const response = await fetch(API_BASE, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error('❌ Error response:', errorText);
        throw new Error(`HTTP error! status: ${response.status}, message: ${errorText}`);
      }
      
      const result: ApiResponse<Employee[]> = await response.json();
      
      if (result.success && result.data) {
        setEmployees(result.data);
      } else {
        throw new Error(result.message || 'Failed to fetch employees');
      }
    } catch (err) {
      console.error('❌ Error fetching employees:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch employees');
    } finally {
      setLoading(false);
    }
  };

  // Fetch employees on component mount
  useEffect(() => {
    fetchEmployees();
  }, []);

  // Clear success message after 3 seconds
  useEffect(() => {
    if (success) {
      const timer = setTimeout(() => setSuccess(null), 3000);
      return () => clearTimeout(timer);
    }
  }, [success]);

  return (
    <AppLayout
      activeSection={activeSection}
      onSectionChange={setActiveSection}
      departmentCounts={getDepartmentCounts()}
    >
      <main className="p-6">
        {/* Header */}
        <div className="mb-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                {activeSection === 'all' ? 'All Employees' : activeSection}
              </h1>
              <p className="text-gray-600 mt-1">
                Manage LGU employees and department information
              </p>
            </div>
          </div>
        </div>

        {/* Success/Error Messages */}
        {error && (
          <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg">
            <div className="flex items-center">
              <svg className="w-5 h-5 text-red-400 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <p className="text-red-700">{error}</p>
            </div>
          </div>
        )}
        {success && (
          <div className="mb-4 p-4 bg-green-50 border border-green-200 rounded-lg">
            <div className="flex items-center">
              <svg className="w-5 h-5 text-green-400 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <p className="text-green-700">{success}</p>
            </div>
          </div>
        )}

        {/* Dashboard Stats */}
        {activeSection === 'all' && (
          <DashboardStats
            totalEmployees={employees.length}
            activeToday={Math.floor(employees.length * 0.8)} // Mock data
            newThisMonth={Math.floor(employees.length * 0.15)} // Mock data
            departmentCounts={getDepartmentCounts()}
            recentActivities={[]} // TODO: Implement activity tracking
          />
        )}

        {/* Employee List - Only show when NOT on dashboard */}
        {activeSection !== 'all' && (
          <EmployeeList departmentFilter={departmentNames[activeSection] || activeSection} />
        )}
      </main>
    </AppLayout>
  );
}
