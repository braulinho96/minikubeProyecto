package com.tutorial.loanservice.service;

import com.tutorial.loanservice.entity.Document;
import com.tutorial.loanservice.repository.DocumentRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.ArrayList;

@Service
public class DocumentService {

    @Autowired
    DocumentRepository documentRepository;
    public ArrayList<Document> getDocumentByIdLoan(Long id){
        return documentRepository.findByIdLoan(id);
    }
    public Document saveDocument(Document uploadedDocument){
        return documentRepository.save(uploadedDocument);
    }
    public boolean deleteDocument(Long id) throws Exception{
        try{
            documentRepository.deleteById(id);
            return true;
        } catch (Exception e){
            throw new Exception(e.getMessage());
        }
    }
}
