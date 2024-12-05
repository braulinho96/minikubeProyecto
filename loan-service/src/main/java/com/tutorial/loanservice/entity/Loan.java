package com.tutorial.loanservice.entity;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import javax.persistence.*;

@Entity
@Table(name = "loans")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Loan {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(unique = true, nullable = false)
    private Long id;
    private String rut;
    // First home: 1  / Second home:2 / Commercial Properties: 3  / Remodeling: 4
    private int type;
    private String evaluationState; // P4
    private String solicitudeState; // P5
    private int term;
    private float interest_rate;
    private int financing_amount;

}
