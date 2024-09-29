import React, { useState, useEffect, useContext } from 'react';
import './GenerateReport.css';
import { AuthContext, useAuth } from '../../authContext'; // Make sure to import AuthContext from your AuthProvider file

const GenerateReport: React.FC = () => {
    const { role, userId } = useAuth(); // Get role and userId from AuthContext
    const [emails, setEmails] = useState<string>('devatiswarup@gmail.com');
    const [dateRange, setDateRange] = useState<string>('yesterday');
    const [startDate, setStartDate] = useState<string>('');
    const [endDate, setEndDate] = useState<string>('');
    const [successMessage, setSuccessMessage] = useState<string>('');
    const [loading, setLoading] = useState<boolean>(false);

    useEffect(() => {
        const today = new Date();
        let start: Date;
        let end: Date = today;

        switch (dateRange) {
            case 'yesterday':
                start = new Date(today);
                start.setDate(today.getDate() - 1);
                end = start;
                break;
            case 'last7days':
                start = new Date(today);
                start.setDate(today.getDate() - 7);
                break;
            case 'lastmonth':
                start = new Date(today);
                start.setMonth(today.getMonth() - 1);
                break;
            default:
                start = today;
        }

        setStartDate(formatDate(start));
        setEndDate(formatDate(end));
    }, [dateRange]);

    const formatDate = (date: Date): string => {
        return date.toISOString().split('T')[0];
    };

    const handleSendReport = async () => {
        const emailList = emails
            .split('\n')
            .map(email => email.trim())
            .filter(email => email !== '');

        if (emailList.length === 0 || !emailList.every(email => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))) {
            alert('Please enter at least one valid email address.');
            return;
        }

        if (dateRange === 'custom') {
            if (!startDate || !endDate) {
                alert('Please provide both start and end dates for the custom period.');
                return;
            }
            if (new Date(startDate) > new Date(endDate)) {
                alert('Start date cannot be after the end date.');
                return;
            }
        }

        setLoading(true);

        let data;
        if (dateRange === 'custom') {
            data = {
                emails: emailList,
                dateRange: { start: startDate, end: endDate },
            };
        } else {
            const today = new Date();
            let start: Date;
            let end: Date = today;

            switch (dateRange) {
                case 'yesterday':
                    start = new Date(today);
                    start.setDate(today.getDate() - 1);
                    end = start;
                    break;
                case 'last7days':
                    start = new Date(today);
                    start.setDate(today.getDate() - 7);
                    break;
                case 'lastmonth':
                    start = new Date(today);
                    start.setMonth(today.getMonth() - 1);
                    break;
                default:
                    start = today;
            }

            data = {
                emails: emailList,
                dateRange: { start: formatDate(start), end: formatDate(end) },
            };
        }

        // Add userId if role is 'user'
        if (role === 'user') {
            data = { ...data, userId };
        }

        console.log('Data to send:', JSON.stringify(data, null, 2));

        try {
            const response = await fetch('http://localhost:8888/api/send-report', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data),
            });

            if (response.ok) {
                setSuccessMessage('Report submitted successfully.');
                setEmails('');
                setDateRange('yesterday');
                setStartDate('');
                setEndDate('');
            } else {
                const errorData = await response.json();
                alert(`Failed to send the report. ${errorData.message || 'Please try again.'}`);
            }
        } catch (error) {
            console.error('Error sending report:', error);
            alert('An error occurred while sending the report. Please check your network connection.');
        } finally {
            setLoading(false);
            setTimeout(() => {
                setSuccessMessage('');
            }, 3000);
        }
    };

    return (
        <div className="last7days-con">
            <div className="main-con">
                <div className="right-con">
                    <div className="content-report">
                        <div className="last-con">
                            <div className="heading">Generate Report</div>
                        </div>
                    </div>

                    <div className="inside-con">
                        <div className="inside-con-tickets">
                            <div className="reports-tickets-con">
                                <div className="ticket-report-container">
                                    <div className="report-content">
                                        <div className="report-header">
                                            <div className="report-title">Export and send report</div>
                                            <p>
                                                Export your data to gain in-depth insight about tickets and create custom analytics. Enter the email addresses to send the report in CSV.
                                            </p>
                                        </div>

                                        <div className="date-range-container" style={{ marginTop: '10px' }}>
                                            <label className="label-name">Select Date Range:</label>
                                            <select
                                                value={dateRange}
                                                onChange={(e) => {
                                                    setDateRange(e.target.value);
                                                }}
                                                className="date-range-dropdown"
                                            >
                                                <option value="yesterday">Yesterday</option>
                                                <option value="last7days">Last 7 Days</option>
                                                <option value="lastmonth">Last Month</option>
                                                <option value="custom">Custom Period</option>
                                            </select>
                                        </div>

                                        {dateRange === 'custom' && (
                                            <div style={{ marginTop: '20px' }}>
                                                <label>
                                                    Start Date:
                                                    <input
                                                        type="date"
                                                        value={startDate}
                                                        onChange={(e) => setStartDate(e.target.value)}
                                                        required
                                                        className="input-fields"
                                                        style={{
                                                            width: '250px',
                                                            padding: '10px',
                                                            fontSize: '16px',
                                                            marginLeft: '10px',
                                                        }}
                                                    />
                                                </label>
                                                <label style={{ marginLeft: '20px' }}>
                                                    End Date:
                                                    <input
                                                        type="date"
                                                        value={endDate}
                                                        onChange={(e) => setEndDate(e.target.value)}
                                                        required
                                                        className="input-fields"
                                                        style={{
                                                            width: '250px',
                                                            padding: '10px',
                                                            fontSize: '16px',
                                                            marginLeft: '10px',
                                                        }}
                                                    />
                                                </label>
                                            </div>
                                        )}

                                        <div className="email-textarea-container" style={{ marginTop: '20px' }}>
                                            <label htmlFor="emails">Send Report To:</label>
                                            <textarea
                                                id="emails"
                                                className="textarea"
                                                rows={5}
                                                value={emails}
                                                onChange={(e) => setEmails(e.target.value)}
                                                placeholder="Enter email addresses (one per line)"
                                                required
                                            />
                                        </div>

                                        <p>Note: This report contains sensitive data, check if the provided emails are correct.</p>

                                        {successMessage && (
                                            <div
                                                className="success-message"
                                                style={{ backgroundColor: 'green', color: 'white', padding: '10px', marginTop: '20px', borderRadius: '4px' }}
                                            >
                                                {successMessage}
                                            </div>
                                        )}

                                        <div style={{ marginTop: '20px' }}>
                                            <button
                                                className="send-report-button"
                                                onClick={handleSendReport}
                                                disabled={loading}
                                            >
                                                {loading ? 'Sending...' : 'Send Report'}
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default GenerateReport;
