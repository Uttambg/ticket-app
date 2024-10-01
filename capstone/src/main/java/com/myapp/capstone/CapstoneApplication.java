package com.myapp.capstone;

import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;

import com.myapp.capstone.model.Agent;
import com.myapp.capstone.model.UserDetails;
import com.myapp.capstone.repository.AgentRepository;
import com.myapp.capstone.repository.UserRepo;

@SpringBootApplication
public class CapstoneApplication {

    public static void main(String[] args) {
        SpringApplication.run(CapstoneApplication.class, args);
    }

//    @Bean
//    CommandLineRunner runner(UserRepo repository, AgentRepository ar) {
//        return args -> {
//            //repository.save(new UserDetails(49L, "GB","bandhavi@gmail.com", "nk", "user"));
//            ar.save(new Agent("Sushmitha", "sushmitha@gmail.com"));
//        };
//    }
}
