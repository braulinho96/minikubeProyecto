package com.tutorial.evaluationservice.service;

import com.tutorial.evaluationservice.model.Document;
import com.tutorial.evaluationservice.model.Loan;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpMethod;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;


import java.util.List;

@Service
public class EvaluationService {

    @Autowired
    RestTemplate restTemplate;

    // P4. For the solicitude revision
    public List<Loan> getPendingLoans(){
        List<Loan> pendingLoans = restTemplate.getForObject("http://loan-service/loans/pending", List.class);
        return pendingLoans;
    }

    public List<Document> getDocumentByIdLoan(Long idLoan){
        List<Document> documents = restTemplate.getForObject("http://loan-service/documents/" + idLoan, List.class);
        return documents;
    }

    // R1.
    public boolean R1cuoteIncomeRelation(int quota, int income) {
        // Verify the values of the quota and income
        if (quota <= 0 || income <= 0) {
            return false;
        }
        // we convert the data type to float, so we can divide them
        float relation = (float) quota / income;
        return relation <= 0.35;
    }

    // R3
    public boolean R3evaluateEmploymentStability(int yearsOfEmployment, boolean isSelfEmployed) {
        if (isSelfEmployed) {
            return yearsOfEmployment >= 2; // Case of being self-employed
        } else {
            return yearsOfEmployment >= 1; // Case of being employed
        }
    }
    // R4
    public boolean R4ratioDebsIncome(int totalDebts, int monthlyIncome) {
        float ratio = (float) totalDebts / monthlyIncome;
        return !(ratio > 0.5);
    }

    public boolean R5maxAmount(int loanAmount, int propertyValue, int propertyType) {
        double maxAllowedLoan;
        switch (propertyType) {
            case 1:  // First Home
                maxAllowedLoan = propertyValue * 0.8;
                break;
            case 2:  // Second Home
                maxAllowedLoan = propertyValue * 0.7;
                break;
            case 3:  // Commercial Properties
                maxAllowedLoan = propertyValue * 0.6;
                break;
            case 4:  // Remodelación
                maxAllowedLoan = propertyValue * 0.5;
                break;
            default:  // Invalid type of property
                throw new IllegalArgumentException("Wrong type of property");
        }
        return loanAmount <= maxAllowedLoan;
    }

    // R6
    public boolean R6ageLimit(int age, int term) {
        return (term + age) <=  70;
    }

    // R7
    public Loan R7SavingCapacity(Loan evaluatedLoan, int numberApproved) {
        if (numberApproved == 5) {
            evaluatedLoan.setSolicitudeState("E4");
        } else if (numberApproved == 3 | numberApproved == 4) {
            evaluatedLoan.setEvaluationState("R8"); // To indicate that we need an additional revision
        } else {
            evaluatedLoan.setSolicitudeState("E7");
        }

        HttpEntity<Loan> request = new HttpEntity<>(evaluatedLoan);
        ResponseEntity<Loan> response;
        response = restTemplate.exchange(
                "http://loan-service/loans/",
                HttpMethod.PUT,
                request,
                Loan.class
        );
        return response.getBody();
    }

    public Loan updateLoanEvaluation(Loan loanSolicitude){
        HttpEntity<Loan> request = new HttpEntity<>(loanSolicitude);
        ResponseEntity<Loan> response;
        response = restTemplate.exchange(
                "http://loan-service/loans/",
                HttpMethod.PUT,
                request,
                Loan.class
        );
        return response.getBody();
    }
}
