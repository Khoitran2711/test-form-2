
import { Feedback } from '../types';

// THAY THẾ URL NÀY BẰNG URL WEB APP CỦA BẠN TỪ GOOGLE APPS SCRIPT
const SCRIPT_URL = 'https://script.google.com/macros/s/AKfycby-265G9WOPm0Ti_IgoBB2_7PHJ_-Jr1kMptMaZ5gkx-dHv5Pp1jYQ2FbfBRbYuGVaqRg/exec';

export const sheetService = {
  async getAllFeedbacks(): Promise<Feedback[]> {
    try {
      const response = await fetch(SCRIPT_URL);
      if (!response.ok) throw new Error('Network error');
      return await response.json();
    } catch (error) {
      console.error('Error fetching from Sheets:', error);
      return [];
    }
  },

  async submitFeedback(feedback: Feedback): Promise<boolean> {
    try {
      const response = await fetch(SCRIPT_URL, {
        method: 'POST',
        body: JSON.stringify({ action: 'SUBMIT', feedback }),
      });
      return response.ok;
    } catch (error) {
      console.error('Error submitting to Sheets:', error);
      return false;
    }
  },

  async updateFeedback(feedback: Feedback): Promise<boolean> {
    try {
      const response = await fetch(SCRIPT_URL, {
        method: 'POST',
        body: JSON.stringify({ action: 'UPDATE', feedback }),
      });
      return response.ok;
    } catch (error) {
      console.error('Error updating Sheets:', error);
      return false;
    }
  }
};
