import React, { useState } from 'react';
import './GenerateReport.css'; 

const GenerateReport: React.FC = () => {
    const [emails, setEmails] = useState<string>('srujanap0931@gmail.com');
    const [dateRange, setDateRange] = useState<string>('yesterday');
    const [startDate, setStartDate] = useState<string>('');
    const [endDate, setEndDate] = useState<string>('');
    const [successMessage, setSuccessMessage] = useState<string>(''); 

    const handleSendReport = () => {
        const emailList = emails.split('\n').map(email => email.trim()).filter(email => email !== '');

        if (emailList.length === 0) {
            alert('Please enter at least one valid email address.');
            return;
        }

        //  report
        console.log('Sending report to:', emailList);
        console.log('For date range:', dateRange === 'custom' ? { start: startDate, end: endDate } : dateRange);

        // success message
        setSuccessMessage('Report submitted successfully.');

        // Clear inputs after sending
        setEmails('');
        setDateRange('yesterday');
        setStartDate('');
        setEndDate('');

        // Clearing  success message after 3 seconds
        setTimeout(() => {
            setSuccessMessage('');
        }, 3000);
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

                                        {/* Date Range Dropdown */}
                                        <div className="date-range-container" style={{ marginTop: '10px' }}>
                                            <label className='label-name'>Select Date Range:</label>
                                            <select
                                                value={dateRange}
                                                onChange={(e) => {
                                                    setDateRange(e.target.value);
                                                    // Reset custom dates if date range changes
                                                    if (e.target.value !== 'custom') {
                                                        setStartDate('');
                                                        setEndDate('');
                                                    }
                                                }}
                                                className="date-range-dropdown"
                                            >
                                                <option value="yesterday">Yesterday</option>
                                                <option value="last7days">Last 7 Days</option>
                                                <option value="lastmonth">Last Month</option>
                                                <option value="custom">Custom Period</option>
                                            </select>
                                        </div>

                                        {/* Custom Date Inputs */}
                                        {dateRange === 'custom' && (
                                            <div style={{ marginTop: '20px' }}>
                                                <label>
                                                    Start Date:
                                                    <input
                                                        type="date"
                                                        value={startDate}
                                                        onChange={(e) => setStartDate(e.target.value)}
                                                        required
                                                        className='input-fields'
                                                    />
                                                </label>
                                                <label style={{ marginLeft: '20px' }}>
                                                    End Date:
                                                    <input
                                                        type="date"
                                                        value={endDate}
                                                        onChange={(e) => setEndDate(e.target.value)}
                                                        required
                                                        className='input-fields'
                                                    />
                                                </label>
                                            </div>
                                        )}

                                        {/* Email Textarea */}
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

                                        {/* Success Message */}
                                        {successMessage && (
                                            <div className="success-message" style={{ backgroundColor: 'green', color: 'white', padding: '10px', marginTop: '20px', borderRadius: '4px' }}>
                                                {successMessage}
                                            </div>
                                        )}

                                        {/* Send Report Button */}
                                        <div  style={{ marginTop: '20px' }}>
                                            <button className="send-report-button" onClick={handleSendReport}>Send Report</button>
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
