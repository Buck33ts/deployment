'use client';

import { useState, useEffect } from 'react';
import AppLayout from '../../components/AppLayout';
import EmployeeModal from '../../components/EmployeeModal';
import EmployeeCard, { Employee } from '../../components/EmployeeCard';

// Department name mapping - handles both lowercase and capitalized API responses
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

export default function DepartmentPage({ params }: { params: { id: string } }) {
  const departmentId = params.id;
  const departmentName = departmentNames[departmentId] || departmentId;
  
  // Debug logging
  console.log('🏢 Department Page:', {
    departmentId,
    departmentName,
    availableMappings: Object.keys(departmentNames)
  });
  
  // Capitalize for display
  const displayDepartmentName = departmentName.charAt(0).toUpperCase() + departmentName.slice(1);

  const [employees, setEmployees] = useState<Employee[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [editingEmployee, setEditingEmployee] = useState<Employee | null>(null);

  const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:1000/api/employees';

  // Calculate department counts for sidebar using department IDs
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

  // ✅ Fetch employees (ONLY ON LOAD)
  const fetchEmployees = async () => {
    try {
      setLoading(true);
      console.log('🔄 Department page fetching from:', API_BASE);
      
      const res = await fetch(API_BASE);
      
      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`);
      }
      
      const responseData = await res.json();
      console.log('📥 Department page received data:', responseData);
      
      if (responseData.success && responseData.data) {
        console.log('✅ Setting employees:', responseData.data);
        setEmployees(responseData.data);
      } else {
        console.log('❌ No data found, setting empty array');
        setEmployees([]);
      }
    } catch (err) {
      console.error('❌ Error fetching employees:', err);
      setError('Failed to fetch employees');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEmployees();
  }, []);

  // ✅ FILTER - Only show employees from this department
  const filteredEmployees = employees.filter(emp => {
    const deptKey = emp.department || '';
    const mappedDept = departmentNames[deptKey] || deptKey;
    
    // Debug logging
    console.log('🔍 Filtering:', {
      empDept: emp.department,
      deptKey,
      mappedDept,
      targetDept: departmentName,
      departmentId,
      matches: mappedDept === departmentName
    });
    
    return mappedDept === departmentName &&
    (
      emp.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      emp.position.toLowerCase().includes(searchTerm.toLowerCase())
    );
  });

  const handleDelete = async (employeeId: string) => {
    if (!window.confirm('Are you sure you want to delete this employee?')) {
      return;
    }

    try {
      setLoading(true);
      setError(null);
      setSuccess(null);

      const res = await fetch(`${API_BASE}/${employeeId}`, {
        method: 'DELETE',
      });

      if (res.ok) {
        setSuccess('Employee deleted successfully!');
        fetchEmployees();
      } else {
        throw new Error('Failed to delete employee');
      }
    } catch (err) {
      setError('Failed to delete employee');
      console.error('Error deleting employee:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (employee: Employee) => {
    setEditingEmployee(employee);
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
    setEditingEmployee(null);
  };

  const handleSubmit = async (formData: any) => {
    try {
      setLoading(true);
      const isEdit = !!editingEmployee;
      
      const res = await fetch(API_BASE, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: formData.name.trim(),
          position: formData.position.trim(),
          department: departmentName, // Always set to current department
          email: formData.email?.trim(),
          phone: formData.phone?.trim(),
          address: formData.address?.trim(),
          employmentType: formData.employmentType?.trim()
        }),
      });
      
      if (res.ok) {
        setSuccess(isEdit ? 'Employee updated successfully!' : 'Employee created successfully!');
        setModalOpen(false);
        fetchEmployees();
      } else {
        throw new Error('Failed to save employee');
      }
    } catch (err) {
      setError('Failed to save employee');
      console.error('Error saving employee:', err);
    } finally {
      setLoading(false);
    }
  };

  // Clear success message after 3 seconds
  useEffect(() => {
    if (success) {
      const timer = setTimeout(() => setSuccess(null), 3000);
      return () => clearTimeout(timer);
    }
  }, [success]);

  return (
    <AppLayout
      activeSection={departmentId}
      onSectionChange={(section) => {
        // Handle section change if needed
        console.log('Section changed to:', section);
      }}
      departmentCounts={getDepartmentCounts()}
    >
      <div className="p-6">
        {/* Header */}
        <div className="mb-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                {displayDepartmentName}
              </h1>
              <p className="text-gray-600 mt-1">
                Manage {displayDepartmentName} employees and information
              </p>
            </div>
            <div className="flex items-center space-x-3 mt-4 sm:mt-0">
              {/* Search */}
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search employees..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <svg
                  className="absolute left-3 top-2.5 h-5 w-5 text-gray-400"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>
              </div>
              {/* Add Employee Button */}
              <button
                onClick={() => setModalOpen(true)}
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2"
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
                <span>Add Employee</span>
              </button>
            </div>
          </div>
        </div>

        {/* Messages */}
        {error && <p className="text-red-500">{error}</p>}
        {success && <p className="text-green-500">{success}</p>}

        {/* List */}
        {loading ? (
          <p>Loading...</p>
        ) : (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider w-12">#</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Position</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Phone</th>
                  <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider w-24">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-100">
                {filteredEmployees.map((emp, index) => (
                  <tr key={emp._id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-gray-900 text-center">{index + 1}</td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-gray-900">{emp.name}</td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-600">{emp.position}</td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-600">{emp.email || '-'}</td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-600">{emp.phone || '-'}</td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm font-medium">
                      <div className="flex items-center justify-center space-x-1">
                        <button
                          onClick={() => handleEdit(emp)}
                          className="text-blue-600 hover:text-blue-900 p-1.5 rounded-lg hover:bg-blue-50 transition-colors"
                          title="Edit Employee"
                        >
                          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                          </svg>
                        </button>
                        <button
                          onClick={() => handleDelete(emp.employeeId)}
                          className="text-red-600 hover:text-red-900 p-1.5 rounded-lg hover:bg-red-50 transition-colors"
                          title="Delete Employee"
                        >
                          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            </div>
            {filteredEmployees.length === 0 && (
              <div className="text-center py-12 text-gray-500">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-gray-100 rounded-full mb-4">
                  <svg className="w-8 h-8 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 00-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">No employees found</h3>
                <p className="text-gray-500">
                  No employees found in {departmentName}
                </p>
              </div>
            )}
          </div>
        )}

        {/* Employee Modal */}
        <EmployeeModal
          isOpen={modalOpen}
          onClose={handleCloseModal}
          onSubmit={handleSubmit}
          loading={loading}
          employee={editingEmployee}
        />
      </div>
    </AppLayout>
  );
}
