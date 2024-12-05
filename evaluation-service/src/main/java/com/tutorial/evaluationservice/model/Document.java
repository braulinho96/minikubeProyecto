package com.tutorial.evaluationservice.model;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor      // This allows to make a constructor without arguments
@AllArgsConstructor
public class Document {
    private Long id;
    private Long idLoan;    // Which loan is asossiated with this document
    private String name;    // Name of the document so we can differentiate it
    private byte[] content; // Content of the pdf document
}
