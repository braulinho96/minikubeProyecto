package com.tutorial.loanservice.controller;

import com.tutorial.loanservice.entity.Loan;
import com.tutorial.loanservice.service.LoanService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;

@RestController
@RequestMapping("/loans")
public class LoanController {

    @Autowired
    LoanService loanService;

    @PostMapping("/")
    public ResponseEntity<Loan> saveLoanSolicitude(@RequestBody Loan loanSolicitude){
        Loan Newloan = loanService.postLoanSolicitude(loanSolicitude);
        return ResponseEntity.ok(Newloan);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Loan> getLoanById(@PathVariable Long id) {
        Loan loan = loanService.getLoanById(id);
        return ResponseEntity.ok(loan);
    }
    @GetMapping("/rut")
    public ResponseEntity<List<Loan>> getLoanByRut(@RequestParam String rut) {
        List<Loan> loan = loanService.getLoanByRut(rut);
        return ResponseEntity.ok(loan);
    }

    @PutMapping("/")
    public ResponseEntity<Loan> updateLoanSolicitude(@RequestBody Loan loanSolicitude) {
        Loan updatedLoan = loanService.updateLoanSolicitude(loanSolicitude);
        return ResponseEntity.ok(updatedLoan);
    }

    @GetMapping("/pending")
    public ResponseEntity<List<Loan>> getLoanByRut() {
        List<Loan> loan = loanService.getPendingLoans();
        return ResponseEntity.ok(loan);
    }

}
