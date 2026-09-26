import { useState } from 'react';
import api from '../api/api';

/**
 * Custom hook to manage Google OAuth authentication flow.
 * Sends the Google ID Token to the StockSense backend and stores the returned JWT.
 *
 * @param {Function} [onSuccessCallback] - Callback function called after successful login/signup
 */
export function useGoogleAuth(onSuccessCallback) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleGoogleSuccess = async (idToken) => {
    if (!idToken) {
      setError('No Google token received from authentication.');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await api.post('/api/auth/google', { id_token: idToken });
      const { access_token, user } = response.data;

      if (access_token) {
        localStorage.setItem('token', access_token);
      }
      if (user) {
        localStorage.setItem('user', JSON.stringify(user));
      }

      setLoading(false);

      if (onSuccessCallback && typeof onSuccessCallback === 'function') {
        onSuccessCallback(response.data);
      }

      return response.data;
    } catch (err) {
      setLoading(false);
      const errorMessage =
        err.response?.data?.detail ||
        'Google authentication failed. Please try again.';
      setError(errorMessage);
    }
  };

  const handleGoogleError = () => {
    setError('Google sign-in was cancelled or failed. Please try again.');
  };

  return {
    loading,
    error,
    setError,
    handleGoogleSuccess,
    handleGoogleError,
  };
}
