import React, { useState, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import 'react-quill/dist/quill.snow.css';
import ReactQuill from 'react-quill';
import { useAuth } from './authContext';// Import the AuthContext

export const NewTicket: React.FC = () => {
  const [message, setMessage] = useState('');
  const [subject, setSubject] = useState('');
  const [priority, setPriority] = useState('Low');
  const [errors, setErrors] = useState({ subject: '' });
  const [isImageModalOpen, setIsImageModalOpen] = useState(false);
  const [imageUrl, setImageUrl] = useState('');
  const [attachment, setAttachment] = useState<File | null>(null);
  const quillRef = useRef<ReactQuill>(null);
  const navigate = useNavigate();
  const { userId } = useAuth(); // Get userId from the AuthContext

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    let formErrors = { subject: '' };
    if (!subject) {
      formErrors.subject = 'Subject is required';
    }
    setErrors(formErrors);
    
    if (!formErrors.subject) {
      const ticketData = {
        subject,
        priority,
        userId, // Use userId from AuthContext
        messages: [
          {
            content: message,
            attachment: attachment ? await getFileAsBase64(attachment) : null,
            attachmentType: attachment ? attachment.type : null,
            attachmentName: attachment ? attachment.name : null,
          },
        ],
      };

      console.log('Submitting ticket:', ticketData); // Logging ticket data

      try {
        const response = await fetch('http://localhost:8888/api/tickets', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(ticketData),
        });

        console.log('Response:', response); // Log the response

        if (response.ok) {
          console.log('Ticket submitted successfully');
          setMessage('');
          setSubject('');
          setPriority('Low');
          setAttachment(null);
          navigate('/success');
        } else {
          console.error('Error submitting the ticket');
        }
      } catch (error) {
        console.error('Error submitting the ticket:', error);
      }
    }
  };

  const getFileAsBase64 = (file: File): Promise<string | null> => {
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        let base64String = reader.result as string;

        // Strip out the MIME type prefix
        if (base64String.startsWith('data:')) {
          base64String = base64String.substring(base64String.indexOf(',') + 1);
        }

        resolve(base64String);
      };
      reader.onerror = () => resolve(null);
      reader.readAsDataURL(file);
    });
  };

  const handleImageClick = useCallback(() => {
    setIsImageModalOpen(true);
  }, []);

  const handleImageUrlSubmit = useCallback(() => {
    if (quillRef.current && imageUrl) {
      const editor = quillRef.current.getEditor();
      editor.insertEmbed(editor.getSelection()?.index || 0, 'image', imageUrl);
    }
    setIsImageModalOpen(false);
    setImageUrl('');
  }, [imageUrl]);

  const handleFileUpload = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setAttachment(file); // Store the uploaded file
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result && quillRef.current) {
          let base64String = event.target.result as string;

          // Strip out the MIME type prefix
          if (base64String.startsWith('data:')) {
            base64String = base64String.substring(base64String.indexOf(',') + 1);
          }

          const editor = quillRef.current.getEditor();
          editor.insertEmbed(editor.getSelection()?.index || 0, 'image', event.target.result);
        }
      };
      reader.readAsDataURL(file);
    }
    setIsImageModalOpen(false);
  }, []);

  return (
    <div className="p-8 bg-gray-50 min-h-screen relative">
      <h2 className="text-2xl font-semibold mb-4">New Ticket</h2>
      <form className="bg-white p-6 rounded shadow-lg" onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block text-gray-700">Subject</label>
          <input
            type="text"
            className={`w-full border-gray-300 border rounded mt-2 p-2 ${errors.subject ? 'border-red-500' : ''}`}
            placeholder="Enter subject"
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
          />
          {errors.subject && (
            <p className="text-red-500 text-sm mt-1">{errors.subject}</p>
          )}
        </div>

        <div className="mb-4">
          <label className="block text-gray-700">Priority</label>
          <select
            className="w-full border-gray-300 border rounded mt-2 p-2"
            value={priority}
            onChange={(e) => setPriority(e.target.value)}
          >
            <option>Low</option>
            <option>Medium</option>
            <option>High</option>
            <option>Urgent</option>
          </select>
        </div>

        <div className="mb-4 relative z-10">
          <label className="block text-gray-700">Message</label>
          <ReactQuill
            ref={quillRef}
            theme="snow"
            value={message}
            onChange={setMessage}
            modules={{
              toolbar: {
                container: [
                  ['bold', 'italic', 'underline', 'strike'],
                  [{ list: 'ordered' }, { list: 'bullet' }],
                  ['link', 'image'],
                ],
                handlers: {
                  image: handleImageClick,
                },
              },
            }}
            placeholder="Enter message"
          />
        </div>

        <button className="bg-blue-500 text-white p-2 rounded" type="submit">
          Submit
        </button>
      </form>

      {isImageModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg">
            <h3 className="text-lg font-semibold mb-4">Insert Image</h3>
            <div className="mb-4">
              <label className="block text-gray-700 mb-2">Image URL</label>
              <input
                type="text"
                className="w-full border-gray-300 border rounded p-2"
                value={imageUrl}
                onChange={(e) => setImageUrl(e.target.value)}
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700 mb-2">Upload File</label>
              <input
                type="file"
                accept="image/*"
                className="w-full border-gray-300 border rounded p-2"
                onChange={handleFileUpload}
              />
            </div>
            <div className="flex justify-end">
              <button
                className="bg-blue-500 text-white p-2 rounded mr-2"
                onClick={handleImageUrlSubmit}
              >
                Insert URL
              </button>
              <button
                className="bg-gray-300 text-gray-700 p-2 rounded"
                onClick={() => setIsImageModalOpen(false)}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default NewTicket;
