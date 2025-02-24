import React, { useState, ReactNode, useEffect } from 'react';
import { User, Mail, Phone, Lock, Eye, EyeOff, CheckCircle, XCircle } from 'lucide-react';
import { Sidebar } from './Sidebar';
import axios from 'axios';
import { baseurl } from '../../Constant/Base';
import { useGetToken } from '../../Token/getToken';
import ExtractToken from '../../Token/Extract';
import { toast } from 'react-hot-toast';


interface CardProps {
  children: ReactNode;
  className?: string;
}

interface CardHeaderProps {
  children: ReactNode;
}

interface CardTitleProps {
  children: ReactNode;
  className?: string;
}

interface CardContentProps {
  children: ReactNode;
}

const Card: React.FC<CardProps> = ({ children, className = '' }) => (
  <div className={`bg-white rounded-xl shadow-sm border border-gray-100 ${className}`}>
    {children}
  </div>
);

const CardHeader: React.FC<CardHeaderProps> = ({ children }) => (
  <div className="p-4 sm:p-6 border-b border-gray-100">
    {children}
  </div>
);

const CardTitle: React.FC<CardTitleProps> = ({ children, className = '' }) => (
  <h3 className={`text-lg sm:text-xl font-semibold text-gray-800 ${className}`}>
    {children}
  </h3>
);

const CardContent: React.FC<CardContentProps> = ({ children }) => (
  <div className="p-4 sm:p-6">
    {children}
  </div>
);

interface PasswordForm {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

interface UserData {
  name: string;
  email: string;
  INR: string;
  DXB: string;
  status: boolean;
}

const DashboardPage: React.FC = () => {
  const [showCurrentPassword, setShowCurrentPassword] = useState<boolean>(false);
  const [showNewPassword, setShowNewPassword] = useState<boolean>(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [passwordForm, setPasswordForm] = useState<PasswordForm>({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  const [userData, setUserData] = useState<UserData>({
    name: '',
    email: '',
    INR: '',
    DXB: '',
    status: false
  });

  const [editForm, setEditForm] = useState<UserData>({
    name: '',
    email: '',
    INR: '',
    DXB: '',
    status: false
  });

  const api = axios.create({
    baseURL: baseurl,
  });

  const token = useGetToken("sellerToken");
  const sellerId = ExtractToken(token);

  const getSeller = async () => {
    try {
      const response = await api.get(`/admin/get-seller/${sellerId.userId}`);
      setUserData(response.data);
      setEditForm(response.data);
    } catch (error) {
      toast.error('Failed to fetch user data');
    }
  };

  useEffect(() => {
    getSeller();
  }, []);

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      toast.error('New passwords do not match');
      return;
    }

    setIsLoading(true);
    try {
      const response = await api.post(`/seller/reset-password/${sellerId.userId}`, {
        currentPassword: passwordForm.currentPassword,
        newPassword: passwordForm.newPassword
      });
      
      if (response.data) {
        toast.success('Password updated successfully');
        setPasswordForm({
          currentPassword: '',
          newPassword: '',
          confirmPassword: ''
        });
      }
    } catch (error) {
      toast.error('Failed to update password');
    } finally {
      setIsLoading(false);
    }
  };

  const handleProfileUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const response = await api.put(`/seller/update-profile/${sellerId.userId}`, {
        name: editForm.name,
        email: editForm.email,
        INR: editForm.INR,
        DXB: editForm.DXB
      });
      
      if (response.data) {
        toast.success('Profile updated successfully');
        setUserData({
          ...editForm,
          email: userData.email,
          status: userData.status
        });
        setIsEditing(false);
      }
    } catch (error) {
      toast.error('Failed to update profile');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-gray-50">
      <Sidebar />
      
      <main className="flex-1 p-4 sm:p-8">
        <header className="mb-6 sm:mb-8">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-800">
                My Profile
              </h1>
              <p className="text-sm sm:text-base text-gray-600 mt-2">Manage your account settings</p>
            </div>
            <div className="flex items-center gap-2">
              {userData.status ? (
                <div className="flex items-center gap-2 text-green-600">
                  <CheckCircle className="h-5 w-5" />
                  <span className="font-medium">Approved Seller</span>
                </div>
              ) : (
                <div className="flex items-center gap-2 text-red-600">
                  <XCircle className="h-5 w-5" />
                  <span className="font-medium">Pending Approval</span>
                </div>
              )}
            </div>
          </div>
        </header>

        <div className="grid gap-4 sm:gap-6 md:grid-cols-2">
          <Card className="w-full">
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle className="flex items-center gap-2">
                  <User className="h-5 w-5" />
                  Profile Information
                </CardTitle>
                <button
                  onClick={() => setIsEditing(!isEditing)}
                  className="text-blue-600 hover:text-blue-700 text-sm sm:text-base"
                >
                  {isEditing ? 'Cancel' : 'Edit'}
                </button>
              </div>
            </CardHeader>
            <CardContent>
              {isEditing ? (
                <form onSubmit={handleProfileUpdate} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Name
                    </label>
                    <input
                      type="text"
                      value={editForm.name}
                      onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                      className="w-full px-3 sm:px-4 py-2 border border-gray-300 rounded-lg"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Email (Read Only)
                    </label>
                    <input
                      type="email"
                      value={userData.email}
                      className="w-full px-3 sm:px-4 py-2 border border-gray-300 rounded-lg bg-gray-50"
                      readOnly
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Indian Phone Number
                    </label>
                    <input
                      type="tel"
                      value={editForm.INR}
                      onChange={(e) => setEditForm({ ...editForm, INR: e.target.value })}
                      placeholder="+91"
                      className="w-full px-3 sm:px-4 py-2 border border-gray-300 rounded-lg"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Dubai Phone Number
                    </label>
                    <input
                      type="tel"
                      value={editForm.DXB}
                      onChange={(e) => setEditForm({ ...editForm, DXB: e.target.value })}
                      placeholder="+971"
                      className="w-full px-3 sm:px-4 py-2 border border-gray-300 rounded-lg"
                    />
                  </div>
                  <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 text-sm sm:text-base"
                  >
                    {isLoading ? 'Updating Profile...' : 'Update Profile'}
                  </button>
                </form>
              ) : (
                <div className="space-y-4">
                  <div className="flex items-center gap-4 p-3 sm:p-4 bg-gray-50 rounded-lg">
                    <User className="h-5 w-5 text-gray-500 flex-shrink-0" />
                    <div className="min-w-0">
                      <p className="text-sm text-gray-500">Name</p>
                      <p className="font-medium truncate">{userData.name}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-4 p-3 sm:p-4 bg-gray-50 rounded-lg">
                    <Mail className="h-5 w-5 text-gray-500 flex-shrink-0" />
                    <div className="min-w-0">
                      <p className="text-sm text-gray-500">Email</p>
                      <p className="font-medium truncate">{userData.email}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-4 p-3 sm:p-4 bg-gray-50 rounded-lg">
                    <Phone className="h-5 w-5 text-gray-500 flex-shrink-0" />
                    <div className="min-w-0">
                      <p className="text-sm text-gray-500">Indian Phone Number</p>
                      <p className="font-medium truncate">{userData.INR || 'Not set'}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-4 p-3 sm:p-4 bg-gray-50 rounded-lg">
                    <Phone className="h-5 w-5 text-gray-500 flex-shrink-0" />
                    <div className="min-w-0">
                      <p className="text-sm text-gray-500">Dubai Phone Number</p>
                      <p className="font-medium truncate">{userData.DXB || 'Not set'}</p>
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          <Card className="w-full">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Lock className="h-5 w-5" />
                Reset Password
              </CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handlePasswordChange} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Current Password
                  </label>
                  <div className="relative">
                    <input
                      type={showCurrentPassword ? "text" : "password"}
                      value={passwordForm.currentPassword}
                      onChange={(e) => setPasswordForm({
                        ...passwordForm,
                        currentPassword: e.target.value
                      })}
                      className="w-full px-3 sm:px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 pr-10"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                      className="absolute right-3 top-2.5 text-gray-400 hover:text-gray-600"
                    >
                      {showCurrentPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    New Password
                  </label>
                  <div className="relative">
                    <input
                      type={showNewPassword ? "text" : "password"}
                      value={passwordForm.newPassword}
                      onChange={(e) => setPasswordForm({
                        ...passwordForm,
                        newPassword: e.target.value
                      })}
                      className="w-full px-3 sm:px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 pr-10"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowNewPassword(!showNewPassword)}
                      className="absolute right-3 top-2.5 text-gray-400 hover:text-gray-600"
                    >
                      {showNewPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Confirm New Password
                  </label>
                  <div className="relative">
                    <input
                      type={showConfirmPassword ? "text" : "password"}
                      value={passwordForm.confirmPassword}
                      onChange={(e) => setPasswordForm({
                        ...passwordForm,
                        confirmPassword: e.target.value
                      })}
                      className="w-full px-3 sm:px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 pr-10"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute right-3 top-2.5 text-gray-400 hover:text-gray-600"
                    >
                      {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                    </button>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 text-sm sm:text-base"
                  >
                    {isLoading ? 'Updating Password...' : 'Update Password'}
                  </button>
                </form>
              </CardContent>
            </Card>
          </div>
        </main>
      </div>
    );
  };
  
  export default DashboardPage;