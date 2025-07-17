// Import React hooks for state management
import React, { useState, useContext } from 'react';
// Import React Router hook for navigation
import { useNavigate } from 'react-router-dom';
// Import authentication context for user data and login function
import { AuthContext } from '../context/AuthContext';
// Import icons for UI elements
import { 
  MdArrowBack, 
  MdPerson, 
  MdEmail, 
  MdLock,
  MdSave,
  MdEdit
} from 'react-icons/md';
// Import axios instance for API calls
import axios from '../utils/axios';

/**
 * Profile Component
 * User profile management page with edit functionality and password change
 */
const Profile = () => {
  // React Router hook for navigation
  const navigate = useNavigate();
  // Get user data and login function from authentication context
  const { user, loginUser } = useContext(AuthContext);
  // Loading state during form submission
  const [loading, setLoading] = useState(false);
  // Message state for success/error feedback
  const [message, setMessage] = useState({ type: '', text: '' });
  // Edit mode state to toggle form editing
  const [isEditing, setIsEditing] = useState(false);

  // Form data state with user information and password fields
  const [formData, setFormData] = useState({
    fullName: user?.fullName || '',
    email: user?.email || '',
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  /**
   * Handle form input changes
   * @param {Event} e - Input change event
   */
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  /**
   * Handle form submission for profile update
   * @param {Event} e - Form submission event
   */
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage({ type: '', text: '' });

    try {
      // Validate passwords if changing password
      if (formData.newPassword) {
        if (formData.newPassword !== formData.confirmPassword) {
          setMessage({ type: 'error', text: 'New passwords do not match' });
          return;
        }
        if (formData.newPassword.length < 8) {
          setMessage({ type: 'error', text: 'Password must be at least 8 characters' });
          return;
        }
      }

      // Send profile update request to backend
      const response = await axios.put('/users/profile', {
        fullName: formData.fullName,
        email: formData.email,
        currentPassword: formData.currentPassword,
        newPassword: formData.newPassword
      });

      // Update local user state with new data
      if (response.data.success) {
        loginUser(response.data.data);
        setMessage({ type: 'success', text: 'Profile updated successfully!' });
        setIsEditing(false);
        
        // Clear password fields after successful update
        setFormData(prev => ({
          ...prev,
          currentPassword: '',
          newPassword: '',
          confirmPassword: ''
        }));
      }
    } catch (error) {
      console.error('Profile update error:', error);
      setMessage({ 
        type: 'error', 
        text: error.response?.data?.message || 'Failed to update profile' 
      });
    } finally {
      setLoading(false);
    }
  };

  /**
   * Toggle edit mode and clear messages when entering edit mode
   */
  const toggleEdit = () => {
    setIsEditing(!isEditing);
    if (!isEditing) {
      setMessage({ type: '', text: '' });
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header with back navigation */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center py-4">
            <button
              onClick={() => navigate('/dashboard')}
              className="flex items-center text-gray-600 hover:text-gray-800 mr-4"
            >
              <MdArrowBack className="mr-2" />
              Back to Dashboard
            </button>
            <h1 className="text-2xl font-bold text-gray-900">Profile Settings</h1>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-lg shadow-sm p-6">
          {/* Profile Header with user info and edit button */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center">
              {/* User avatar placeholder */}
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mr-4">
                <MdPerson className="w-8 h-8 text-blue-600" />
              </div>
              <div>
                <h2 className="text-xl font-semibold text-gray-900">{user?.fullName}</h2>
                <p className="text-gray-600">{user?.email}</p>
              </div>
            </div>
            {/* Edit/Cancel button */}
            <button
              onClick={toggleEdit}
              className="flex items-center px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
            >
              <MdEdit className="w-4 h-4 mr-2" />
              {isEditing ? 'Cancel' : 'Edit Profile'}
            </button>
          </div>

          {/* Success/Error message display */}
          {message.text && (
            <div className={`mb-6 p-4 rounded-lg ${
              message.type === 'success' 
                ? 'bg-green-50 text-green-800 border border-green-200' 
                : 'bg-red-50 text-red-800 border border-red-200'
            }`}>
              {message.text}
            </div>
          )}

          {/* Profile Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Basic Information Section */}
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-4">Basic Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Full Name field */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    <MdPerson className="inline w-4 h-4 mr-1" />
                    Full Name
                  </label>
                  <input
                    type="text"
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleChange}
                    disabled={!isEditing}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-50 disabled:text-gray-500"
                    required
                  />
                </div>
                {/* Email field */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    <MdEmail className="inline w-4 h-4 mr-1" />
                    Email Address
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    disabled={!isEditing}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-50 disabled:text-gray-500"
                    required
                  />
                </div>
              </div>
            </div>

            {/* Password Change Section (only visible in edit mode) */}
            {isEditing && (
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-4">Change Password</h3>
                <p className="text-sm text-gray-600 mb-4">Leave blank if you don't want to change your password</p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Current Password field */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      <MdLock className="inline w-4 h-4 mr-1" />
                      Current Password
                    </label>
                    <input
                      type="password"
                      name="currentPassword"
                      value={formData.currentPassword}
                      onChange={handleChange}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="Enter current password"
                    />
                  </div>
                  {/* New Password field */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      <MdLock className="inline w-4 h-4 mr-1" />
                      New Password
                    </label>
                    <input
                      type="password"
                      name="newPassword"
                      value={formData.newPassword}
                      onChange={handleChange}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="Enter new password"
                    />
                  </div>
                  {/* Confirm New Password field (full width) */}
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      <MdLock className="inline w-4 h-4 mr-1" />
                      Confirm New Password
                    </label>
                    <input
                      type="password"
                      name="confirmPassword"
                      value={formData.confirmPassword}
                      onChange={handleChange}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="Confirm new password"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Submit Button (only visible in edit mode) */}
            {isEditing && (
              <div className="flex justify-end">
                <button
                  type="submit"
                  disabled={loading}
                  className={`flex items-center px-6 py-3 rounded-lg text-white font-medium transition-colors ${
                    loading 
                      ? 'bg-gray-400 cursor-not-allowed' 
                      : 'bg-blue-600 hover:bg-blue-700'
                  }`}
                >
                  {loading ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Saving...
                    </>
                  ) : (
                    <>
                      <MdSave className="w-4 h-4 mr-2" />
                      Save Changes
                    </>
                  )}
                </button>
              </div>
            )}
          </form>

          {/* Account Information Section */}
          <div className="mt-8 pt-6 border-t border-gray-200">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Account Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              {/* Member since date */}
              <div>
                <span className="text-gray-600">Member since:</span>
                <span className="ml-2 text-gray-900">
                  {user?.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'N/A'}
                </span>
              </div>
              {/* Account status */}
              <div>
                <span className="text-gray-600">Account status:</span>
                <span className="ml-2 text-green-600 font-medium">Active</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile; 