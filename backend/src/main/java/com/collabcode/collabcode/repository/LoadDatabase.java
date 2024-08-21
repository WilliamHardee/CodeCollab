package com.collabcode.collabcode.repository;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import com.collabcode.collabcode.model.Project;
import com.collabcode.collabcode.model.User;
import com.collabcode.collabcode.service.InvitationsService;
import com.collabcode.collabcode.service.ProjectService;
import com.collabcode.collabcode.service.UserService;

import jakarta.transaction.Transactional;

@Component
public class LoadDatabase implements CommandLineRunner{

    @Autowired
    UserService userService;

    @Autowired
    ProjectService projectService;

    @Autowired
    InvitationsService invitationsService;

    @Override
    @Transactional
    public void run(String... args) throws Exception {
        if(userService.getIdByUsername("JohnDoe").isPresent()) {
            return; 
        }
        User testUser1U = new User("JohnDoe", "123456789");
        testUser1U.setAccountType("LOCAL");
        User testUser2U = new User("JohnDoe2", "987654321");
        testUser2U.setAccountType("LOCAL");
    
        Project testProject1 = projectService.create("test1", "print(hi)", "Python");
        Project testProject2 = projectService.create("test2", "print(bye)", "Python");
        Project testProject3 = projectService.create("test3", "print(bye)", "Python");
    
        User testUser1 = userService.create(testUser1U);
        User testUser2 = userService.create(testUser2U);

        userService.addProject(testUser1, testProject1);
        userService.addProject(testUser1, testProject2);
        userService.addProject(testUser1, testProject3);
        userService.addProject(testUser2, testProject1);

        invitationsService.addInvitationSetup(testUser2.getUsername(), testProject2.getId(), testUser1.getUsername());
        invitationsService.addInvitationSetup(testUser2.getUsername(), testProject3.getId(), testUser1.getUsername());
       
    
        
      

        
    }
}
