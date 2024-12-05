package com.tutorial.followupservice.controller;
import com.tutorial.followupservice.model.Loan;
import com.tutorial.followupservice.service.FollowupService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/followup")
public class FollowupController {

    @Autowired
    FollowupService followupService;

    @GetMapping("/rut")
    public ResponseEntity<List<Loan>> getLoanByRut(@RequestParam String rut) {
        List<Loan> loan = followupService.getLoanByRut(rut);
        return ResponseEntity.ok(loan);
    }

    @PutMapping("/cancelLoan")
    public ResponseEntity<Loan> cancelLoan(@RequestBody Loan cancelLoan){
        Loan updatedLoan = followupService.cancelLoan(cancelLoan);
        return ResponseEntity.ok(updatedLoan);
    }

    @PutMapping("/acceptLoan")
    public ResponseEntity<Loan> acceptLoan(@RequestBody Loan acceptedLoan){
        Loan updatedLoan = followupService.acceptLoan(acceptedLoan);
        return ResponseEntity.ok(updatedLoan);
    }

    @GetMapping("/calculate")
    public int calculateMonthlyPayment(
            @RequestParam int loanAmount,
            @RequestParam double annualInterestRate,
            @RequestParam int totalYears) {
        return followupService.calculateMonthlyPayment(loanAmount, annualInterestRate, totalYears);
    }


}
