import React, { useState, useEffect } from 'react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft, faTrash, faChevronLeft, faChevronRight } from '@fortawesome/free-solid-svg-icons';
import { fetchTickets, getMessagesForTicket, addMessageToTicket, deleteTicket } from '../api/apiClient';
import Modal from './Modal';
import { Message } from '../types/Ticket';
import { useNavigate } from 'react-router-dom';
import NotificationPopup from './NotificationPopup';

type DescriptionProps = {
  text: string;
};

interface MessageBoxProps {
  ticketId: string; 
}

const GreyDiv: React.FC<DescriptionProps> = ({ text }) => {
  return (
    <div className="bg-white p-3 mb-4 rounded-md border border-gray-300 shadow">
      <div className="bg-blue-700 p-2 mb-2 rounded-t-md">
        <p className="text-white font-semibold">Description</p>
      </div>
      <div className="bg-gray-100 p-2 rounded-b-md">
        
        <div dangerouslySetInnerHTML={{ __html: text }} />
      </div>
    </div>
  );
};

const MessageBox: React.FC<MessageBoxProps> = ({ ticketId }) => {
  const [input, setInput] = useState('');
  const [descriptions, setDescriptions] = useState<string[]>([]);
  const [ticketIds, setTicketIds] = useState<string[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false); 
  const [isDeleting, setIsDeleting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const [notificationMessage, setNotificationMessage] = useState<string | null>(null); // State for notification message

  const navigate = useNavigate();

  useEffect(() => {
    const fetchAllTickets = async () => {
      try {
        const tickets = await fetchTickets();
        const ids = tickets.map((ticket) => ticket.id);
        setTicketIds(ids);
      } catch (error) {
        console.error('Error fetching tickets:', error);
      }
    };

    fetchAllTickets();
  }, []);

  useEffect(() => {
    const fetchMessages = async () => {
      if (!ticketId) return;
      try {
        const messages = await getMessagesForTicket(ticketId);
        const messageContents = messages.map((message) => message.content);
        setDescriptions(messageContents);
      } catch (error) {
        console.error('Error fetching messages:', error);
        alert('Failed to load messages.');
      }
    };

    fetchMessages();
  }, [ticketId]);

  const handleSubmit = async () => {
    if (input.trim()) {
      const newMessage: Message = {
        id: 0, 
        content: input.trim(),
        ticketId, 
        attachment: null,
        attachmentType: null,
        attachmentName: null,
      };
  
      try {
        const addedMessage = await addMessageToTicket(ticketId, newMessage);
        setDescriptions((prevDescriptions) => [...prevDescriptions, addedMessage.content]);
        setInput('');
        setNotificationMessage('Message has been updated.'); // Show notification
      } catch (error) {
        console.error('Error adding message:', error);
        alert('Failed to send the message.');
      }
    }
  };

  const handleDelete = async () => {
    setIsDeleting(true);
    setErrorMessage('');
    try {
      await deleteTicket(ticketId);
      setNotificationMessage('Ticket has been deleted.'); 
      navigate('/sidebar');
    } catch (error) {
      console.error('Error deleting ticket:', error);
      setErrorMessage('Failed to delete the ticket. Please try again.');
    } finally {
      setIsDeleting(false);
    }
  };

  const goToPreviousTicket = () => {
    const currentIndex = ticketIds.indexOf(ticketId);
    if (currentIndex > 0) {
      const previousTicketId = ticketIds[currentIndex - 1];
      navigate(`/ticket/${previousTicketId}`);
    }
  };

  const goToNextTicket = () => {
    const currentIndex = ticketIds.indexOf(ticketId);
    if (currentIndex < ticketIds.length - 1) {
      const nextTicketId = ticketIds[currentIndex + 1];
      navigate(`/ticket/${nextTicketId}`);
    }
  };
  
  return (
    <div className="left-panel bg-white h-[100vh] border border-gray-300">
      <div className="flex flex-col h-full pb-4 m-0">
        <div className="bg-white h-[52px] w-full p-0 m-0 flex items-center justify-between  border-gray-300">
        <button className="text-gray-600 ml-4 p-2 rounded-full hover:bg-blue-500 hover:text-white transition duration-200 shadow-md hover:shadow-lg transform hover:scale-105"
            onClick={() => navigate('/sidebar')}>
            <FontAwesomeIcon icon={faArrowLeft} />
        </button>
          
        </div>

        
        <div className="bg-white flex flex-row h-[52px] w-full p-0 m-0 flex justify-between items-center border-b border-blue-300">
        <div className="flex items-center ml-4 cursor-pointer text-gray-600 hover:text-red-600 transition-colors duration-200"
        onClick={() => setIsModalOpen(true)}
          >
  <FontAwesomeIcon icon={faTrash} className="mr-2 transform hover:scale-110 transition-transform duration-200" />
  <span className="hover:underline">Delete ticket</span>
</div>
<div className="flex items-center">
  
  <button
    onClick={goToPreviousTicket}
    disabled={ticketIds.indexOf(ticketId) === 0} 
    className="mx-2 p-2 rounded-full bg-gray-300 hover:bg-blue-500 hover:text-white disabled:bg-gray-200 disabled:cursor-not-allowed transition duration-200 shadow-md hover:shadow-lg transform hover:scale-105 disabled:scale-100"
  >
    <FontAwesomeIcon icon={faChevronLeft} />
  </button>
  <button
    onClick={goToNextTicket}
    disabled={ticketIds.indexOf(ticketId) === ticketIds.length - 1} 
    className="mx-2 p-2 rounded-full bg-gray-300 hover:bg-blue-500 hover:text-white disabled:bg-gray-200 disabled:cursor-not-allowed transition duration-200 shadow-md hover:shadow-lg transform hover:scale-105 disabled:scale-100"
  >
    <FontAwesomeIcon icon={faChevronRight} />
  </button>
</div>

        </div>

        <div className="bg-white min-h-[250px] w-full relative overflow-y-auto p-4 rounded-md border-t border-gray-300">
          <div className="flex flex-col space-y-4">
            {descriptions.map((desc, index) => (
              <GreyDiv key={index} text={desc} />
            ))}
          </div>
        </div>

        <div className="bg-white p-4 mt-4 rounded-md border-t border-blue-500 w-full">
          <ReactQuill
            theme="snow"
            value={input}
            onChange={setInput}
            modules={{ toolbar: [['bold', 'italic', 'underline'], [{ 'list': 'bullet' }]] }}
            placeholder="Write the description here..."
          />

          <div className="flex items-center mt-4">
            <button
              className={`ml-4 px-4 py-2 rounded-md ${input.trim() ? 'bg-blue-600 text-white' : 'bg-gray-300 text-gray-500 cursor-not-allowed'}`}
              disabled={!input.trim()}
              onClick={handleSubmit}
            >
              Send
            </button>
          </div>
        </div>

        <Modal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onConfirm={handleDelete}
          title="Delete ticket?"
          message="You're about to delete a ticket forever, and it cannot be undone. Are you sure you want to delete it?"
          confirmText={isDeleting ? 'Deleting...' : 'Delete forever'}
          cancelText="Cancel"
          isLoading={isDeleting}
        />

        
        {notificationMessage && (
          <NotificationPopup 
            message={notificationMessage} 
            onClose={() => setNotificationMessage(null)} 
          />
        )}

      </div>
    </div>
  );
};

export default MessageBox;
