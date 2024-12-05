package com.tutorial.followupservice.service;

import com.tutorial.followupservice.model.Loan;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpMethod;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.util.List;

@Service
public class FollowupService {

    @Autowired
    RestTemplate restTemplate;

    public List<Loan> getLoanByRut(String rut) {
        List<Loan> loans = restTemplate.getForObject("http://loan-service/loans/rut?rut={rut}", List.class, rut);
        return loans;
    }

    public Loan cancelLoan(Loan cancelledLoan) {
        cancelledLoan.setSolicitudeState("E8");
        HttpEntity<Loan> request = new HttpEntity<>(cancelledLoan);
        ResponseEntity<Loan> response;
        response = restTemplate.exchange(
                "http://loan-service/loans/",
                HttpMethod.PUT,
                request,
                Loan.class
        );
        return response.getBody();
    }

    public Loan acceptLoan(Loan acceptedLoan) {
        acceptedLoan.setSolicitudeState("E5");
        HttpEntity<Loan> request = new HttpEntity<>(acceptedLoan);
        ResponseEntity<Loan> response;
        response = restTemplate.exchange(
                "http://loan-service/loans/",
                HttpMethod.PUT,
                request,
                Loan.class
        );
        return response.getBody();
    }

    public int calculateMonthlyPayment(int loanAmount, double annualInterestRate, int totalYears) {
        String url = "http://simulate-service/simulate/calculate?loanAmount=" + loanAmount
                + "&annualInterestRate=" + annualInterestRate
                + "&totalYears=" + totalYears;
        return restTemplate.getForObject(url, Integer.class);
    }


}
