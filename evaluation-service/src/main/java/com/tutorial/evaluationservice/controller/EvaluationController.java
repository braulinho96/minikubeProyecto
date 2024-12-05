package com.tutorial.evaluationservice.controller;

import com.tutorial.evaluationservice.model.Document;
import com.tutorial.evaluationservice.model.Loan;
import com.tutorial.evaluationservice.service.EvaluationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/evaluate")
public class EvaluationController {

    @Autowired
    EvaluationService evaluationService;

    // P4.
    @GetMapping("/pending")
    public List<Loan> getPendingLoans() {
        return evaluationService.getPendingLoans();
    }

    @GetMapping("/documents/{idLoan}")
    public ResponseEntity<List<Document>> getDocumentByIdLoan(@PathVariable Long idLoan){
        List<Document> documents = evaluationService.getDocumentByIdLoan(idLoan);
        return ResponseEntity.ok(documents);
    }

    @PostMapping("/R1")
    public ResponseEntity<Boolean> R1evaluateCuoteIncome(@RequestParam int quota, @RequestParam int income) {
        boolean result = evaluationService.R1cuoteIncomeRelation(quota, income);
        return ResponseEntity.ok(result);
    }

    @PostMapping("/R3")
    public ResponseEntity<Boolean> R3evaluateEmploymentStability(@RequestParam int yearsOfEmployment, @RequestParam boolean isSelfEmployed) {
        boolean isStable = evaluationService.R3evaluateEmploymentStability(yearsOfEmployment, isSelfEmployed);
        return ResponseEntity.ok(isStable);
    }

    @PostMapping("/R4")
    public ResponseEntity<Boolean> R4ratioDebsIncome(
            @RequestParam int totalDebts,
            @RequestParam int monthlyIncome) {
        boolean isApproved = evaluationService.R4ratioDebsIncome(totalDebts, monthlyIncome);
        return ResponseEntity.ok(isApproved);
    }

    @PostMapping("/R5")
    public ResponseEntity<Boolean> R5maxAmount(
            @RequestParam int loanAmount,
            @RequestParam int propertyValue,
            @RequestParam int propertyType) {

        boolean isApproved = evaluationService.R5maxAmount(loanAmount, propertyValue, propertyType);
        return ResponseEntity.ok(isApproved);
    }

    @PostMapping("/R6")
    public ResponseEntity<Boolean> R6ageLimit(
            @RequestParam int age,
            @RequestParam int term) {

        boolean isApproved = evaluationService.R6ageLimit(age, term);
        return ResponseEntity.ok(isApproved);
    }

    @PostMapping("/R7")
    public ResponseEntity<Loan> R7SavingCapacity(@RequestBody Loan loanSolicitude, @RequestParam int numberApproved){
        Loan updatedLoan = evaluationService.R7SavingCapacity(loanSolicitude, numberApproved );
        return ResponseEntity.ok(updatedLoan);
    }

    @PutMapping("/update")
    public Loan updateLoanEvaluation(@RequestBody Loan loanSolicitude){
        return evaluationService.updateLoanEvaluation(loanSolicitude);
    }



}
