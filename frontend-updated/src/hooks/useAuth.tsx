import { useState, useEffect } from 'react';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

interface User {
  id: string;
  email: string;
  full_name: string;
  // Add other user properties as needed
}

interface Session {
  user: User;
  token: string;
  expiresAt: number;
}

export const useAuth = () => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  // Check for existing session on mount
  useEffect(() => {
    const token = localStorage.getItem('authToken');
    const userData = localStorage.getItem('user');
    const expiresAt = localStorage.getItem('expiresAt');

    if (token && userData && expiresAt && Date.now() < Number(expiresAt)) {
      setUser(JSON.parse(userData));
      setSession({
        user: JSON.parse(userData),
        token,
        expiresAt: Number(expiresAt)
      });
    }
    setLoading(false);
  }, []);

  const signUp = async (email: string, password: string, fullName: string) => {
    try {
      const response = await fetch(`${API_URL}/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password, fullName })
      });

      const data = await response.json();

      if (!response.ok) {
        return { error: data.message || 'Registration failed' };
      }

      // Save session
      localStorage.setItem('authToken', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));
      localStorage.setItem('expiresAt', (Date.now() + 7 * 24 * 60 * 60 * 1000).toString());

      setUser(data.user);
      setSession({
        user: data.user,
        token: data.token,
        expiresAt: Date.now() + 7 * 24 * 60 * 60 * 1000 // 7 days
      });

      return { error: null };
    } catch (error) {
      return { error: error.message || 'An error occurred during registration' };
    }
  };

  const signIn = async (email: string, password: string) => {
    try {
      const response = await fetch(`${API_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });

      const data = await response.json();

      if (!response.ok) {
        return { error: data.message || 'Login failed' };
      }

      // Save session
      localStorage.setItem('authToken', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));
      localStorage.setItem('expiresAt', (Date.now() + 7 * 24 * 60 * 60 * 1000).toString());

      setUser(data.user);
      setSession({
        user: data.user,
        token: data.token,
        expiresAt: Date.now() + 7 * 24 * 60 * 60 * 1000 // 7 days
      });

      return { error: null };
    } catch (error) {
      return { error: error.message || 'An error occurred during login' };
    }
  };

  const signOut = async () => {
    try {
      // Call your API's logout endpoint if needed
      await fetch(`${API_URL}/auth/logout`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('authToken')}`,
          'Content-Type': 'application/json'
        }
      });
    } catch (error) {
      console.error('Error during logout:', error);
    } finally {
      // Clear local storage and state
      localStorage.removeItem('authToken');
      localStorage.removeItem('user');
      localStorage.removeItem('expiresAt');
      setUser(null);
      setSession(null);
    }
    return { error: null };
  };

  const resetPassword = async (email: string) => {
    try {
      const response = await fetch(`${API_URL}/auth/forgot-password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email })
      });

      const data = await response.json();

      if (!response.ok) {
        return { error: data.message || 'Failed to send reset email' };
      }

      return { error: null };
    } catch (error) {
      return { error: error.message || 'An error occurred' };
    }
  };

  const updatePassword = async (newPassword: string) => {
    try {
      const response = await fetch(`${API_URL}/auth/update-password`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('authToken')}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ newPassword })
      });

      const data = await response.json();

      if (!response.ok) {
        return { error: data.message || 'Failed to update password' };
      }

      return { error: null };
    } catch (error) {
      return { error: error.message || 'An error occurred' };
    }
  };

  return {
    user,
    session,
    loading,
    signUp,
    signIn,
    signOut,
    resetPassword,
    updatePassword,
  };
};
