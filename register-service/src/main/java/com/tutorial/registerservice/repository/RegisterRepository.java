package com.tutorial.registerservice.repository;

import com.tutorial.registerservice.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.ArrayList;

@Repository
public interface RegisterRepository extends JpaRepository<User, Long> {
    public User findByRut(String rut);


}
