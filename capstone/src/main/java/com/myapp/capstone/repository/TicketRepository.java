package com.myapp.capstone.repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.myapp.capstone.model.Ticket;

public interface TicketRepository extends JpaRepository<Ticket, String> {
	Optional<Ticket> findById(String ticketId);
	List<Ticket> findByUser_Id(Long userId);
	Ticket findFirstByAgent_IdAndStatusOrderByCreatedAtAsc (Long agentId, String status);
	List<Ticket> findByCreatedAtBetween(LocalDateTime startDate, LocalDateTime endDate);
	List<Ticket> findByUserIdAndCreatedAtBetween(Long userId, LocalDateTime startDate, LocalDateTime endDate);
	List<Ticket> findByAssignedAgent(String name);
}
