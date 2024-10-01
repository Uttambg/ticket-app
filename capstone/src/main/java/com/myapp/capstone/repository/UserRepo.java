package com.myapp.capstone.repository;

import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import com.myapp.capstone.model.UserDetails;

@Repository
public interface UserRepo extends JpaRepository<UserDetails, Long> {
	
    UserDetails findByEmail(String email);
	Optional<UserDetails> findById(Long id);
	
}
