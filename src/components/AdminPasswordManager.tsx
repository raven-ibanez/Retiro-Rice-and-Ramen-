import React, { useState, useEffect } from 'react';
import { Lock, Save, Eye, EyeOff, Check, X } from 'lucide-react';
import { supabase } from '../lib/supabase';

const AdminPasswordManager: React.FC = () => {
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);
  const [storedPassword, setStoredPassword] = useState('');

  useEffect(() => {
    fetchCurrentPassword();
  }, []);

  const fetchCurrentPassword = async () => {
    try {
      const { data, error } = await supabase
        .from('site_settings')
        .select('value')
        .eq('id', 'admin_password')
        .single();

      if (error) throw error;
      setStoredPassword(data?.value || 'RetiroRiceandRamen@Admin!2025');
    } catch (err) {
      console.error('Error fetching admin password:', err);
      setStoredPassword('RetiroRiceandRamen@Admin!2025'); // Fallback to default
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage(null);
    setIsLoading(true);

    try {
      // Validate current password
      if (currentPassword !== storedPassword) {
        throw new Error('Current password is incorrect');
      }

      // Validate new password
      if (newPassword.length < 8) {
        throw new Error('New password must be at least 8 characters long');
      }

      // Validate password confirmation
      if (newPassword !== confirmPassword) {
        throw new Error('New password and confirmation do not match');
      }

      // Update password in database
      const { error } = await supabase
        .from('site_settings')
        .update({ 
          value: newPassword,
          updated_at: new Date().toISOString()
        })
        .eq('id', 'admin_password');

      if (error) throw error;

      // Update local state
      setStoredPassword(newPassword);
      
      // Show success message
      setMessage({ type: 'success', text: 'Password changed successfully!' });
      
      // Clear form
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
      
      // Clear message after 5 seconds
      setTimeout(() => setMessage(null), 5000);
    } catch (err) {
      setMessage({ 
        type: 'error', 
        text: err instanceof Error ? err.message : 'Failed to change password'
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-2 flex items-center">
          <Lock className="w-6 h-6 mr-2" />
          Change Admin Password
        </h2>
        <p className="text-gray-600 mb-6">Update your admin dashboard password for security</p>

        {message && (
          <div className={`mb-6 p-4 rounded-lg flex items-start space-x-2 ${
            message.type === 'success' 
              ? 'bg-green-50 border border-green-200' 
              : 'bg-red-50 border border-red-200'
          }`}>
            {message.type === 'success' ? (
              <Check className="w-5 h-5 text-green-600 mt-0.5" />
            ) : (
              <X className="w-5 h-5 text-red-600 mt-0.5" />
            )}
            <p className={message.type === 'success' ? 'text-green-800' : 'text-red-800'}>
              {message.text}
            </p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Current Password */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Current Password *
            </label>
            <div className="relative">
              <input
                type={showCurrentPassword ? 'text' : 'password'}
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                className="w-full px-3 py-2 pr-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-retiro-red focus:border-transparent"
                required
              />
              <button
                type="button"
                onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                {showCurrentPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
          </div>

          {/* New Password */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              New Password *
            </label>
            <div className="relative">
              <input
                type={showNewPassword ? 'text' : 'password'}
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="w-full px-3 py-2 pr-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-retiro-red focus:border-transparent"
                required
                minLength={8}
              />
              <button
                type="button"
                onClick={() => setShowNewPassword(!showNewPassword)}
                className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                {showNewPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
            <p className="text-xs text-gray-500 mt-1">Minimum 8 characters</p>
          </div>

          {/* Confirm New Password */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Confirm New Password *
            </label>
            <div className="relative">
              <input
                type={showConfirmPassword ? 'text' : 'password'}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full px-3 py-2 pr-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-retiro-red focus:border-transparent"
                required
                minLength={8}
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
          </div>

          {/* Submit Button */}
          <div className="flex space-x-3 pt-4">
            <button
              type="submit"
              disabled={isLoading}
              className="flex items-center px-6 py-3 bg-retiro-red text-white rounded-lg hover:bg-retiro-kimchi transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Save className="w-4 h-4 mr-2" />
              {isLoading ? 'Changing Password...' : 'Change Password'}
            </button>
          </div>
        </form>
      </div>

      {/* Security Tips */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <h3 className="font-semibold text-blue-900 mb-2">Password Security Tips</h3>
        <ul className="text-sm text-blue-700 space-y-1 list-disc list-inside">
          <li>Use at least 8 characters</li>
          <li>Include uppercase and lowercase letters</li>
          <li>Include numbers and special characters</li>
          <li>Avoid common words or personal information</li>
          <li>Change your password regularly</li>
        </ul>
      </div>
    </div>
  );
};

export default AdminPasswordManager;
