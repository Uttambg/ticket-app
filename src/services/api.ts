import axios from 'axios';

const API_URL = 'http://localhost:8888/api/auth'; // Base URL for your API

// Function to sign up a new user
export const signupUser = async (userData: {
  name: string;
  email: string;
  password: string;
  role: string;
}) => {
  try {
    const response = await axios.post(`${API_URL}/add`, userData);
    return response.data; // Assuming the success message or user data is here
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      // Check for specific status codes and set messages accordingly
      if (error.response.status === 409) {
        throw new Error("User already exists. Please use a different email."); // Specific error message
      } else {
        throw new Error("Signup failed. Please try again."); // Generic error message for other errors
      }
    } else {
      // Log the unexpected error for debugging purposes
      console.error('Unexpected error:', error);
      throw new Error("An unexpected error occurred. Please try again."); // Generic fallback error message
    }
  }
};
