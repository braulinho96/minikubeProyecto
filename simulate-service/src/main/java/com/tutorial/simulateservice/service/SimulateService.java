package com.tutorial.simulateservice.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class SimulateService {

    // P1 to calculate the monthly payment of the loan
    public int calculateMonthlyLoanPayment(int loanAmount, double annualInterestRate, int totalYears) {
        int months = totalYears * 12;
        double monthlyInterestRate = annualInterestRate / 12 / 100;
        double monthlyPayment = loanAmount * ((monthlyInterestRate * Math.pow(1 + monthlyInterestRate, months)) /
                (Math.pow(1 + monthlyInterestRate, months) - 1));
        return (int) Math.ceil(monthlyPayment);
    }


}
