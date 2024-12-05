package com.tutorial.simulateservice.controller;
import com.tutorial.simulateservice.service.SimulateService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/simulate")
public class SimulateController {

    @Autowired
    SimulateService simulateService;

    @GetMapping("/calculate")
    public int calculateMonthlyPayment(
            @RequestParam int loanAmount,
            @RequestParam double annualInterestRate,
            @RequestParam int totalYears) {
        return simulateService.calculateMonthlyLoanPayment(loanAmount, annualInterestRate, totalYears);
    }

}
