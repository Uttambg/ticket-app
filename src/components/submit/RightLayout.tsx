import React, { useEffect, useState } from 'react';
import { DisplayAgent, Ticket } from '../../types/Ticket';

interface RightLayoutProps {
  agent: DisplayAgent | null;
}

const RightLayout: React.FC<RightLayoutProps> = ({ agent }) => {
  const [ticket, setTicket] = useState<Ticket | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (agent) {
      const fetchTicket = async () => {
        try {
          setLoading(true);
          setError(null);

          const response = await fetch(`http://localhost:8888/api/tickets/agent/${agent.id}/inprogress`);

          if (response.status === 204) {
            setTicket(null);
          } else if (response.ok) {
            const data: Ticket = await response.json();
            setTicket(data);
          } else {
            throw new Error('Failed to fetch ticket');
          }
        } catch (err: any) {
          setError(err.message);
        } finally {
          setLoading(false);
        }
      };

      fetchTicket();
    }
  }, [agent]);

  if (!agent) {
    return (
      <div className="h-full bg-white flex items-center justify-center text-gray-500">
        <span>No agent selected</span>
      </div>
    );
  }

  return (
    <div className="flex-grow h-full mb-[10px] pb-[0px] pr-2 rounded-r-lg overflow-hidden">
      <div className="h-full bg-white p-4 border border-gray-200 hover:border-gray-400 transition-all duration-300 ease-in-out flex flex-col">
        <div className="h-[50px] pl-4 pt-4 bg-white font-semibold text-lg border-b border-gray-300">
          Details
        </div>

        <div className="flex-grow bg-white p-4 overflow-hidden">
          <div className="w-full h-[64px] flex items-center p-4 border-b border-gray-300">
            <div className="flex items-center justify-center h-[64px] w-[64px] bg-blue-500 text-white rounded-full">
              {agent.email.charAt(0).toUpperCase()}
            </div>
            <div className="ml-4 flex flex-col justify-center">
              <div className="flex items-center space-x-2">
                <span className="text-lg font-semibold text-gray-800">{agent.name}</span>
                <span className={`text-xs px-2 py-1 rounded-full ${agent.role === 'Admin' ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-700'}`}>
                  {agent.role || 'Agent'}
                </span>
              </div>
              <div className="mt-1 text-sm text-gray-500">{agent.email}</div>
            </div>
          </div>
        </div>

        {loading && (
          <div className="h-full bg-white flex items-center justify-center text-gray-500">
            <span>Loading ticket...</span>
          </div>
        )}

        {!loading && error && (
          <div className="h-full bg-white flex items-center justify-center text-red-500">
            <span>Error: {error}</span>
          </div>
        )}

        {!loading && !error && (
          <>
            {ticket ? (
              <div className="flex-grow p-6 bg-white border border-gray-200 rounded-lg hover:shadow-xl transition duration-200">
                <h2 className="text-2xl font-semibold text-gray-800 mb-4">Ticket Details</h2>
                <div className="grid grid-cols-2 gap-4">
                  <p className="text-sm text-gray-600">
                    <strong className="block font-semibold text-gray-700">Subject:</strong>
                    {ticket.subject}
                  </p>
                  <p className="text-sm text-gray-600">
                    <strong className="block font-semibold text-gray-700">Priority:</strong>
                    {ticket.priority}
                  </p>
                  <p className="text-sm text-gray-600">
                    <strong className="block font-semibold text-gray-700">Status:</strong>
                    {ticket.status}
                  </p>
                  <p className="text-sm text-gray-600">
                    <strong className="block font-semibold text-gray-700">Created At:</strong>
                    {new Date(ticket.createdAt).toLocaleString()}
                  </p>
                  <p className="text-sm text-gray-600">
                    <strong className="block font-semibold text-gray-700">Updated At:</strong>
                    {new Date(ticket.updatedAt).toLocaleString()}
                  </p>
                </div>
              </div>
            ) : (
              <div className="flex items-center justify-center h-full bg-gray-100 p-6 rounded-lg shadow-md">
                <span className="text-lg text-gray-500">No tickets assigned to the agent</span>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default RightLayout;
