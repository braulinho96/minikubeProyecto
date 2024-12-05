package com.tutorial.loanservice.repository;

import com.tutorial.loanservice.entity.Loan;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.ArrayList;
import java.util.List;

@Repository
public interface LoanRepository extends JpaRepository<Loan, Long> {
    public List<Loan> findByRut(String rut);
    List<Loan> findBySolicitudeStateNot(String solicitudeState);
}
