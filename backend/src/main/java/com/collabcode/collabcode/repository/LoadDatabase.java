package com.collabcode.collabcode.repository;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import com.collabcode.collabcode.model.Project;
import com.collabcode.collabcode.model.User;
import com.collabcode.collabcode.service.ProjectService;
import com.collabcode.collabcode.service.UserService;

@Component
public class LoadDatabase implements CommandLineRunner{

    UserService userService;
    ProjectService projectService;

    @Autowired
    LoadDatabase(UserService UserService, ProjectService projectService) {
        this.userService = UserService;
        this.projectService = projectService;
    }   

    public void run(String...args) throws Exception {
        User testUser1 = new User("JohnDoe", "123456789");
        User testUser2 = new User("JohnDoe2", "987654321");

        Project testProject1 = new Project("test1", "print(hi)", "Python");
        Project testProject2 = new Project("test2", "print(bye)", "Python");

        userService.addProject(testUser1, testProject1);
        userService.addProject(testUser1, testProject2);
        userService.addProject(testUser2, testProject2);

        userService.create(testUser1);
        userService.create(testUser2);

    }
}
