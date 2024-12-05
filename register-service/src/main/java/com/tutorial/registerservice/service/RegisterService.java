package com.tutorial.registerservice.service;

import com.tutorial.registerservice.entity.User;
import com.tutorial.registerservice.repository.RegisterRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.ArrayList;

@Service
public class RegisterService {

    @Autowired
    RegisterRepository registerRepository;

    public User getUserById(Long id){ return registerRepository.findById(id).get(); }
    public User getUserByRut(String rut){
        return registerRepository.findByRut(rut);
    }

    public User saveUser(User user) {
        if (registerRepository.findByRut(user.getRut()) != null) {
            throw new IllegalArgumentException("The user is already in the database");
        }
        return registerRepository.save(user);
    }

    public boolean deleteUser(Long id) throws Exception {
        try{
            registerRepository.deleteById(id);
            return true;
        } catch (Exception e){
            throw new Exception(e.getMessage());
        }
    }

    public User validateUserLogin(String rut, String password) {
        User user = getUserByRut(rut);
        if (user != null && user.isSolicitude_state() && password.equals(user.getPassword())) {
            return user;
        }
        return null;
    }
}
