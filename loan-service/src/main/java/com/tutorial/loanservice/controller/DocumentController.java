package com.tutorial.loanservice.controller;

import com.tutorial.loanservice.entity.Document;
import com.tutorial.loanservice.service.DocumentService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;

@RestController
@RequestMapping("/documents")
public class DocumentController {

    @Autowired
    DocumentService documentService;
    @PostMapping("/")
    public ResponseEntity<Document> uploadDocument(@RequestParam("file") MultipartFile file,
                                                         @RequestParam("name") String name,
                                                         @RequestParam("idLoan") Long idLoan){
        // bad_request to indicate that the file param is empty
        if(file.isEmpty()){
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(null);
        }
        try {
            Document newDocument = new Document();
            newDocument.setIdLoan(idLoan);
            newDocument.setName(name);
            newDocument.setContent(file.getBytes());
            Document savedDocument = documentService.saveDocument(newDocument);
            System.out.println("Document content size: " + newDocument.getContent().length); // Debug part

            return ResponseEntity.status(HttpStatus.CREATED).body(savedDocument);
        } catch (IOException e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(null);
        }

    }

    // Return list of the documents assossiated with the loan
    @GetMapping("/{idLoan}")
    public ResponseEntity<List<Document>> getDocumentByIdLoan(@PathVariable Long idLoan){
        List<Document> documents = documentService.getDocumentByIdLoan(idLoan);
        return ResponseEntity.ok(documents);
    }

}
