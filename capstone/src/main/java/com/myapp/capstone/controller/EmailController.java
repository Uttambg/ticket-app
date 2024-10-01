package com.myapp.capstone.controller;

import java.io.File;
import java.io.FileWriter;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.myapp.capstone.model.Ticket;
import com.myapp.capstone.repository.TicketRepository;
import com.opencsv.CSVWriter;

import jakarta.mail.internet.MimeMessage;

@RestController
@RequestMapping("/api")
public class EmailController {

    @Autowired
    private JavaMailSender mailSender;

    @Autowired
    private TicketRepository ticketRepository;

    @PostMapping("/send-report")
    public String sendReport(@RequestBody ReportRequest reportRequest) {
        try {
            DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy-MM-dd");

            LocalDate startLocalDate = LocalDate.parse(reportRequest.getDateRange().getStart(), formatter);
            LocalDate endLocalDate = LocalDate.parse(reportRequest.getDateRange().getEnd(), formatter);

            LocalDateTime startDate = startLocalDate.atStartOfDay();
            LocalDateTime endDate = endLocalDate.atTime(23, 59, 59);

            List<Ticket> tickets;

            if (reportRequest.getUserId() != null) {
                tickets = ticketRepository.findByUserIdAndCreatedAtBetween(reportRequest.getUserId(), startDate, endDate);
            } else {
                tickets = ticketRepository.findByCreatedAtBetween(startDate, endDate);
            }

            int createdCount = tickets.size();
            int solvedCount = (int) tickets.stream().filter(ticket -> ticket.getStatus().equalsIgnoreCase("Solved")).count();
            int inProgressCount = (int) tickets.stream().filter(ticket -> ticket.getStatus().equalsIgnoreCase("In Progress")).count();
            int closedCount = (int) tickets.stream().filter(ticket -> ticket.getStatus().equalsIgnoreCase("Closed")).count();
            int assignedCount = (int) tickets.stream().filter(ticket -> ticket.getAssignedAgent() != null).count();

            File csvFile = new File("ticket_report.csv");
            try (CSVWriter writer = new CSVWriter(new FileWriter(csvFile))) {
                String[] header = {"Ticket ID", "Subject", "Priority", "Status", "Assigned Agent", "Created At", "Updated At"};
                writer.writeNext(header);

                for (Ticket ticket : tickets) {
                    String[] data = {
                            ticket.getId(),
                            ticket.getSubject(),
                            ticket.getPriority(),
                            ticket.getStatus(),
                            ticket.getAssignedAgent() != null ? ticket.getAssignedAgent() : "Unassigned",
                            ticket.getCreatedAt().toString(),
                            ticket.getUpdatedAt().toString()
                    };
                    
                    writer.writeNext(data);
                }
            }

            List<String> emailAddresses = reportRequest.getEmails();

            MimeMessage message = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, true);
            helper.setFrom("310rowdychintu310@gmail.com");
            helper.setTo(emailAddresses.toArray(new String[0]));
            helper.setSubject("Your Report");
            helper.setText("Here is your requested report for the date range: " + reportRequest.getDateRange().getStart() + " to " + reportRequest.getDateRange().getEnd());

            helper.addAttachment("ticket_report.csv", csvFile);

            mailSender.send(message);

            if (csvFile.exists()) {
                csvFile.delete();
            }

            return "Report sent successfully";

        } catch (Exception e) {
            e.printStackTrace();
            return "Failed to send report";
        }
    }

    static class ReportRequest {
        private List<String> emails;
        private DateRange dateRange;
        private Long userId;

        public List<String> getEmails() {
            return emails;
        }

        public void setEmails(List<String> emails) {
            this.emails = emails;
        }

        public DateRange getDateRange() {
            return dateRange;
        }

        public void setDateRange(DateRange dateRange) {
            this.dateRange = dateRange;
        }

        public Long getUserId() { // Getter for userId
            return userId;
        }

        public void setUserId(Long userId) { // Setter for userId
            this.userId = userId;
        }
    }

    static class DateRange {
        private String start;
        private String end;

        public String getStart() {
            return start;
        }

        public void setStart(String start) {
            this.start = start;
        }

        public String getEnd() {
            return end;
        }

        public void setEnd(String end) {
            this.end = end;
        }
    }
}
