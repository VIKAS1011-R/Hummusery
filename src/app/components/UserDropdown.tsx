"use client";

import React, { useState, useRef, useEffect } from 'react';
import { ChevronDown, Settings, LogOut } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { useRouter } from 'next/navigation';

const UserDropdown: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const { user, logout } = useAuth();
  const { addToast } = useToast();
  const router = useRouter();

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSettings = () => {
    setIsOpen(false);
    router.push('/settings');
  };

  const handleLogout = async () => {
    setIsOpen(false);
    addToast('You have been logged out successfully', 'info');
    await logout();
  };

  if (!user) return null;

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center space-x-2 text-orange-500 hover:text-orange-400 transition-colors duration-200 focus:outline-none"
      >
        <span className="font-medium">{user.name}</span>
        <ChevronDown 
          className={`h-4 w-4 transition-transform duration-200 ${
            isOpen ? 'rotate-180' : ''
          }`} 
        />
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-48 bg-gray-800 rounded-lg shadow-lg border border-gray-700 py-1 z-50">
          <button
            onClick={handleSettings}
            className="flex items-center w-full px-4 py-2 text-sm text-gray-300 hover:bg-gray-700 hover:text-white transition-colors duration-200"
          >
            <Settings className="h-4 w-4 mr-3" />
            Settings
          </button>
          
          <hr className="border-gray-700 my-1" />
          
          <button
            onClick={handleLogout}
            className="flex items-center w-full px-4 py-2 text-sm text-gray-300 hover:bg-gray-700 hover:text-red-400 transition-colors duration-200"
          >
            <LogOut className="h-4 w-4 mr-3" />
            Logout
          </button>
        </div>
      )}
    </div>
  );
};

export default UserDropdown;