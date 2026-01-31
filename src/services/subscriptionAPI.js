/**
 * subscriptionAPI.js - Subscription API service
 * Handles all subscription-related API calls
 */

import axios from 'axios';

const API_BASE_URL = 'http://localhost:8080/api/subscriptions';

export const subscriptionAPI = {
  /**
   * User: Subscribe to newsletter
   */
  subscribe: async (email) => {
    try {
      const response = await axios.post(`${API_BASE_URL}/subscribe`, {
        email: email
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || { success: false, message: 'Subscription failed' };
    }
  },

  /**
   * User: Unsubscribe from newsletter
   */
  unsubscribe: async (email) => {
    try {
      const response = await axios.post(`${API_BASE_URL}/unsubscribe`, null, {
        params: { email: email }
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || { success: false, message: 'Unsubscribe failed' };
    }
  },

  /**
   * Admin: Get all subscribers (paginated)
   */
  getAllSubscribers: async (page = 0, size = 10) => {
    try {
      const response = await axios.get(`${API_BASE_URL}/admin/all`, {
        params: { page, size }
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || { success: false, message: 'Failed to fetch subscribers' };
    }
  },

  /**
   * Admin: Get subscription statistics
   */
  getStatistics: async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/admin/stats`);
      return response.data;
    } catch (error) {
      throw error.response?.data || { success: false, message: 'Failed to fetch statistics' };
    }
  },

  /**
   * Admin: Send test email
   */
  sendTestEmail: async (email) => {
    try {
      const response = await axios.post(`${API_BASE_URL}/admin/send-test`, null, {
        params: { email: email }
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || { success: false, message: 'Failed to send test email' };
    }
  }
};

export default subscriptionAPI;
