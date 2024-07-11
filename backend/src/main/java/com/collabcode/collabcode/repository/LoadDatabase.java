package com.collabcode.collabcode.repository;

import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import com.collabcode.collabcode.model.User;

@Component
public class LoadDatabase implements CommandLineRunner{

    UserRepository UserRepository;

    LoadDatabase(UserRepository UserRepository) {
        this.UserRepository = UserRepository;
    }

    public void run(String...args) throws Exception {
        UserRepository.save(new User("JohnDoe", "123456789"));
        UserRepository.save(new User("JohnDoe2", "987654321"));
    }
}
