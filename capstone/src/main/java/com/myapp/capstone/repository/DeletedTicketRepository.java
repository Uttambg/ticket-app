package com.myapp.capstone.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.myapp.capstone.model.DeletedTickets;

public interface DeletedTicketRepository extends JpaRepository<DeletedTickets, String> {

	List<DeletedTickets> findByUserId(Long id);
}
