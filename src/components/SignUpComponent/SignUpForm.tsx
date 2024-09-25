import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import SuccessPopup from './SuccessPopup';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser } from '@fortawesome/free-solid-svg-icons';
import './SignUpForm.css';
import { signupUser } from '../../services/api';
import axios from 'axios';

const SignUpForm: React.FC = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('');
  const [showPopup, setShowPopup] = useState(false);
  const [errorMessage, setErrorMessage] = useState(''); // State for error message
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const userData = { name, email, password, role };

    try {
      await signupUser(userData);
      setShowPopup(true);
      setErrorMessage(''); // Clear any existing error messages
      setTimeout(() => {
        setShowPopup(false);
        navigate('/login');
      }, 2000);
    } catch (error: unknown) {
      if (axios.isAxiosError(error) && error.response) {
        // Show specific error message for user already exists above the form
        if (error.response.status === 409) {
          setErrorMessage('User already exists. Please use a different email.');
        } else {
          setErrorMessage('Signup failed. Please try again.');
        }
      } else {
        setErrorMessage('User already exists. Please use a different email.');
      }
    }
  };

  return (
    <div className="signup-container">
      {/* Error message pop-up above the form */}
      {errorMessage && (
        <div className="error-popup" style={{ color: 'white', backgroundColor: 'red' }}>
          {errorMessage}
        </div>
      )}

      {/* Success Popup */}
      {showPopup && <SuccessPopup message="You have registered successfully!" />}

      <form onSubmit={handleSubmit} className="signup-form">
        <FontAwesomeIcon icon={faUser} className="signup-logo" />
        <h2>Create Account</h2>

        <div className="form-group">
          <label htmlFor="name">Name:</label>
          <input
            type="text"
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="email">Email:</label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="password">Password:</label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="role">Role:</label>
          <select
            id="role"
            value={role}
            onChange={(e) => setRole(e.target.value)}
            required
          >
            <option value="">Select Role</option>
            <option value="admin">Admin</option>
            <option value="user">User</option>
          </select>
        </div>

        <button type="submit" className="submit-button">
          Create
        </button>
      </form>
    </div>
  );
};

export default SignUpForm;
