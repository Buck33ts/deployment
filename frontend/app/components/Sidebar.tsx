'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
  activeSection: string;
  onSectionChange: (section: string) => void;
  departmentCounts: { [key: string]: number };
}

const departments = [
  { id: 'admin', name: 'Administrative' },
  { id: 'engineering', name: 'Engineering' },
  { id: 'health', name: 'Health Services' },
  { id: 'education', name: 'Education' },
  { id: 'finance', name: 'Finance' },
  { id: 'social', name: 'Social Services' },
  { id: 'agriculture', name: 'Agriculture' },
  { id: 'tourism', name: 'Tourism' }
];

export default function Sidebar({ 
  isOpen, 
  onClose, 
  activeSection, 
  onSectionChange, 
  departmentCounts 
}: SidebarProps) {
  const router = useRouter();
  
  const handleSectionClick = (sectionId: string) => {
    onSectionChange(sectionId);
    
    // Navigate to the appropriate URL
    if (sectionId === 'all') {
      router.push('/');
    } else {
      router.push(`/department/${sectionId}`);
    }
    
    if (window.innerWidth < 1024) { // Close on mobile
      onClose();
    }
  };

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-gray-900 bg-opacity-50 z-20 lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <div className={`
        fixed inset-y-0 left-0 z-30 w-72 bg-white shadow-xl transform transition-transform duration-300 ease-in-out
        lg:translate-x-0 lg:static lg:inset-0 h-screen
        ${isOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between h-20 px-8 border-b border-gray-100">
            <div>
              <h2 className="text-xl font-bold text-gray-900">Menu</h2>
              <p className="text-sm text-gray-500">Navigation</p>
            </div>
            <button
              onClick={onClose}
              className="lg:hidden p-2 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors"
            >
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Navigation */}
          <nav className="flex-1 px-6 py-8 space-y-8 overflow-y-auto">
            {/* Dashboard */}
            <button
              onClick={() => handleSectionClick('all')}
              className={`
                w-full flex items-center justify-between px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200
                ${activeSection === 'all' 
                  ? 'bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-lg shadow-blue-500/25' 
                  : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900'
                }
              `}
            >
              <div className="flex items-center">
                <div className={`
                  w-10 h-10 rounded-lg flex items-center justify-center mr-4
                  ${activeSection === 'all' ? 'bg-white/20' : 'bg-blue-50 text-blue-600'}
                `}>
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                  </svg>
                </div>
                <span className="font-semibold">Dashboard</span>
              </div>
              <span className={`
                px-3 py-1 text-xs rounded-full font-medium
                ${activeSection === 'all' 
                  ? 'bg-white/20 text-white' 
                  : 'bg-gray-100 text-gray-600'
                }
              `}>
                {Object.values(departmentCounts).reduce((sum, count) => sum + count, 0)}
              </span>
            </button>

            {/* Departments */}
            <div>
              <h3 className="px-4 text-xs font-bold text-gray-400 uppercase tracking-wider mb-4">
                Departments
              </h3>
              <div className="space-y-2">
                {departments.map((dept) => (
                  <button
                    key={dept.id}
                    onClick={() => handleSectionClick(dept.id)}
                    className={`
                      w-full flex items-center justify-between px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200
                      ${activeSection === dept.id 
                        ? 'bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-lg shadow-blue-500/25' 
                        : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900'
                      }
                    `}
                  >
                    <div className="flex items-center">
                      <div className={`
                        w-10 h-10 rounded-lg flex items-center justify-center mr-4
                        ${activeSection === dept.id ? 'bg-white/20' : 'bg-gray-100 text-gray-600'}
                      `}>
                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                        </svg>
                      </div>
                      <span className="font-semibold">{dept.name}</span>
                    </div>
                    <span className={`
                      px-3 py-1 text-xs rounded-full font-medium
                      ${activeSection === dept.id 
                        ? 'bg-white/20 text-white' 
                        : 'bg-gray-100 text-gray-600'
                      }
                    `}>
                      {departmentCounts[dept.id] || 0}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          </nav>

          {/* Footer */}
          <div className="border-t border-gray-100 p-6">
            <div className="text-xs text-gray-400 text-center">
              <div className="font-semibold text-gray-600 mb-1">LGU Employee System</div>
              <div>Version 1.0.0</div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
