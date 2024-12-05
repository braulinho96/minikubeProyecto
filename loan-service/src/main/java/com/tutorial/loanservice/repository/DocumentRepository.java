package com.tutorial.loanservice.repository;

import com.tutorial.loanservice.entity.Document;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.ArrayList;

@Repository
public interface DocumentRepository extends JpaRepository<Document, Long> {
    public ArrayList<Document> findByIdLoan(Long id);
}
