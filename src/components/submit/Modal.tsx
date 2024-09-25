import React, { useState } from 'react';
import axios from 'axios';
import { fetchAllAgents } from '../../api/apiClient';
import { DisplayAgent } from '../../types/Ticket';// Assuming DisplayAgent is in the Ticket file

interface ModalProps {
  onClose: () => void;
  onInviteComplete: (agents: DisplayAgent[]) => void; // Ensure correct typing for agents
}

const Modal: React.FC<ModalProps> = ({ onClose, onInviteComplete }) => {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // Function to validate that the email ends with @gmail.com
  const validateEmail = (email: string) => {
    const regex = /^[a-zA-Z0-9._%+-]+@gmail\.com$/;
    return regex.test(email);
  };

  const handleSubmit = async () => {
    setError(''); // Reset error state

    // Validate email
    if (!validateEmail(email)) {
      setError('Email is incorrect, please enter a valid @gmail.com email.');
      return;
    }

    setLoading(true); // Set loading state to true during the request

    try {
      // Simulating a post request to a dummy URL (replace with your actual backend URL later)
      const response = await axios.post('http://localhost:8888/api/displayagents/add', {
        email,
      });

      // Check response status or specific data
      if (response.status === 200 || response.data.includes('successfully')) {
        // Fetch the updated list of agents
        const updatedAgents: DisplayAgent[] = await fetchAllAgents();
        onInviteComplete(updatedAgents); // Pass updated agents to parent component
        onClose(); // Close modal on success
      } else {
        setError('No such agent exists');
      }
    } catch (err) {
      setError('Failed to send invitation. Try again later.');
    } finally {
      setLoading(false); // Reset loading state after the request
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg" style={{ width: '750px', height: 'auto' }}>
        {/* Modal header with title and close button */}
        <div className="flex justify-between items-center mb-4">
          <span className="text-xl font-semibold" style={{ paddingLeft: '16px' }}>Invite Agents</span>
          <span
            className="text-2xl font-bold cursor-pointer"
            onClick={onClose}
            style={{ paddingRight: '16px' }}
          >
            X
          </span>
        </div>

        {/* Email input form */}
        <form className="flex flex-col gap-4">
          <label>
            Email:
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Email"
              className="mt-1 p-2 border border-gray-300 rounded w-full focus:outline-none focus:border-blue-500"
              style={{ border: error ? '1px solid red' : '1px solid lightgray' }}
            />
          </label>

          {/* Error message */}
          {error && <span className="text-red-500 text-sm">{error}</span>}

          {/* Buttons */}
          <div className="flex justify-end gap-2 mt-4">
            <button
              type="button"
              className="px-4 py-2 bg-gray-300 rounded"
              onClick={onClose}
            >
              Close
            </button>
            <button
              type="button"
              className="px-4 py-2 bg-blue-500 text-white rounded"
              onClick={handleSubmit}
              disabled={loading}
            >
              {loading ? 'Sending...' : 'Send Invitation'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Modal;
