package com.tutorial.registerservice.controller;

import com.tutorial.registerservice.entity.User;
import com.tutorial.registerservice.service.RegisterService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;

@RestController
@RequestMapping("/register")
public class RegisterController {

    @Autowired
    RegisterService registerService;

    @GetMapping("/{rut}")
    public ResponseEntity<User> getUserByRut(@PathVariable String rut){
        User user = registerService.getUserByRut(rut);
        return ResponseEntity.ok(user);
    }

    @PostMapping("/")
    public ResponseEntity<User> saveUser(@RequestBody User user){
        User newUser = registerService.saveUser(user);
        return ResponseEntity.ok(newUser);
    }

    @PostMapping("/login")
    public ResponseEntity<User> login(@RequestParam String rut, @RequestParam String password) {
        User user = registerService.validateUserLogin(rut, password);
        if (user != null) {
            return ResponseEntity.ok(user);
        } else {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(null);
        }
    }


}
