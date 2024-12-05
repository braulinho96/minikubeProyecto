package com.tutorial.loanservice.service;

import com.tutorial.loanservice.entity.Loan;
import com.tutorial.loanservice.repository.LoanRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
public class LoanService {

    @Autowired
    LoanRepository loanRepository;

    // Getters of loans
    public List<Loan> getLoans(){ return (List<Loan>) loanRepository.findAll();}
    public Loan getLoanById(Long id){ return loanRepository.findById(id).get();}
    public List<Loan> getLoanByRut(String rut){ return loanRepository.findByRut(rut);}

    // Creation
    public Loan postLoanSolicitude(Loan loanSolicitude){return loanRepository.save(loanSolicitude);}
    // Update
    public Loan updateLoanSolicitude(Loan loanSolicitude){ return loanRepository.save(loanSolicitude);}

    // P4. For the solicitude revision
    public List<Loan> getPendingLoans(){
        return loanRepository.findBySolicitudeStateNot("E8");
    }





}
