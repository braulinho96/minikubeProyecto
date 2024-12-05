import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import LoanService from '../services/loan.service'; 
import DocumentsService from '../services/documents.service';

const loanOptions = [
  {
    type: 'First Home',
    typeNumber: 1,
    maxTerm: 30,
    interestRateRange: [3.5, 5.0],
    maxPercentage: 80.0,
    maxAmountDescription: '80% of the property value',
    requirements: [
      'Income proof',
      'Appraisal certificate',
      'Credit history',
    ],
  },
  {
    type: 'Second Home',
    typeNumber: 2,  
    maxTerm: 20,
    interestRateRange: [4.0, 6.0],
    maxPercentage: 70.0,
    maxAmountDescription: '70% of the property value',
    requirements: [
      'Income proof',
      'Appraisal certificate',
      'First home deed',
      'Credit history',
    ],
  },
  {
    type: 'Commercial Properties',
    typeNumber: 3,
    maxTerm: 25,
    interestRateRange: [5.0, 7.0],
    maxPercentage: 60.0,
    maxAmountDescription: '60% of the property value',
    requirements: [
      'Business financial statement',
      'Income proof',
      'Appraisal certificate',
      'Business plan',
    ],
  },
  {
    type: 'Remodeling',
    typeNumber: 4,
    maxTerm: 15,
    interestRateRange: [4.5, 6.0],
    maxPercentage: 50.0,
    maxAmountDescription: '50% of the property’s current value',
    requirements: [
      'Income proof',
      'Remodeling budget',
      'Updated appraisal certificate',
    ],
  },
];

const postLoanSolicitude = ({ user }) => {  
  const [selectedLoan, setSelectedLoan] = useState(null);
  const [propertyValue, setPropertyValue] = useState('');
  const [amount, setAmount] = useState('');
  const [term, setTerm] = useState('');
  const [interestRate, setInterestRate] = useState('');
  const [files, setFiles] = useState({});  

  const handleFileChange = (e, index) => {
    const file = e.target.files[0];
    if (file) {
        console.log(`Selected file: ${file.name}, size: ${file.size}`);
        const newFiles = { ...files, [index]: file };
        setFiles(newFiles);
    }
};


  const navigate = useNavigate(); 

  const uploadSolicitude = async (e) => {
    e.preventDefault();

    if (!amount || !term || !interestRate || !propertyValue) {
      alert('Please fill in all fields.');
      return;
    }

    if (Object.keys(files).length !== selectedLoan.requirements.length) {
      alert('Please upload all required documents.');
      return;
    }

    const numericPropertyValue = parseFloat(propertyValue);
    const numericAmount = parseFloat(amount);
    const maxLoanAmount = (selectedLoan.maxPercentage / 100) * numericPropertyValue;

    if (numericAmount > maxLoanAmount) {
      alert(
        `The loan amount cannot exceed ${selectedLoan.maxPercentage}% of the property value. Max allowed: ${maxLoanAmount}.`
      );
      return;
    }

    try {
      // Create the loan application with the user's RUT
      const loanResponse = await LoanService.postLoanSolicitude({
        financing_amount: numericAmount,
        term: parseInt(term),
        interest_rate: parseFloat(interestRate),
        evaluationState: 'R1',
        solicitudeState: 'E3',
        type: selectedLoan.typeNumber,
        rut: user.rut,  
      });

      const loanId = loanResponse.id; // Get the idLoan created to relate with the uploading documents

      // Upload required documents
      for (let i = 0; i < selectedLoan.requirements.length; i++) {
        const formData = new FormData();
        formData.append('file', files[i]); 
        formData.append('name', selectedLoan.requirements[i]); // Assign the document name
        formData.append('idLoan', loanId);
        console.log(formData);

        try {
          // Upload the current document to the database
          const response = await DocumentsService.uploadDocument(formData);
          console.log('Document uploaded successfully:', response);
        } catch (error) {
          console.error('Error uploading the document:', error);
          alert(`Error uploading document: ${selectedLoan.requirements[i]}`);
        }
      }
      navigate('/home');
      alert('Loan application and documents uploaded successfully.');
      

    } catch (error) {
      console.error('Error:', error);
      alert('Error processing the loan application. Please try again.');
    }
  };

  const handleLoanSelect = (e) => {
    const loan = loanOptions.find((option) => option.type === e.target.value);
    setSelectedLoan(loan);
    setFiles({});
  };

  return (
    <div style={{ textAlign: 'center' }}>
      <h2>Loan Application</h2>

      <select onChange={handleLoanSelect} defaultValue="">
        <option value="" disabled>Select loan type</option>
        {loanOptions.map((loan) => (
          <option key={loan.type} value={loan.type}>
            {loan.type}
          </option>
        ))}
      </select>

      {selectedLoan && (
        <>
          <p><strong>Maximum Term:</strong> {selectedLoan.maxTerm} years</p>
          <p>
            <strong>Interest Rate:</strong> {selectedLoan.interestRateRange[0]}% -{' '}
            {selectedLoan.interestRateRange[1]}%
          </p>
          <p><strong>Maximum Amount:</strong> {selectedLoan.maxAmountDescription}</p>
          <p><strong>Documents required:</strong></p>
          <ul>
            {selectedLoan.requirements.map((req, index) => (
              <li key={index}>{req}</li>
            ))}
          </ul>

          <form onSubmit={uploadSolicitude} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <input
              type="number"
              placeholder="Property Value"
              value={propertyValue}
              onChange={(e) => setPropertyValue(e.target.value)}
              min="1"
              required
              style={{ marginBottom: '10px' }}
            />
            <input
              type="number"
              placeholder="Loan amount"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              min="1"
              required
              style={{ marginBottom: '10px' }}
            />
            <input
              type="number"
              placeholder={`Term (maximum ${selectedLoan.maxTerm} years)`}
              value={term}
              onChange={(e) => setTerm(e.target.value)}
              min={0}
              max={selectedLoan.maxTerm}
              required
              style={{ marginBottom: '10px' }}
            />
            <input
              type="number"
              step="0.01"
              placeholder={`Interest rate (%) (${selectedLoan.interestRateRange[0]}% - ${selectedLoan.interestRateRange[1]}%)`}
              value={interestRate}
              onChange={(e) => setInterestRate(e.target.value)}
              min={selectedLoan.interestRateRange[0]}
              max={selectedLoan.interestRateRange[1]}
              required
              style={{ marginBottom: '10px' }}
            />

            <div>
              <label>Upload Documents (PDF):</label>
              {selectedLoan.requirements.map((req, index) => (
                <div key={index} style={{ marginBottom: '10px' }}>
                  <label>{req}:</label>
                  <input
                    type="file"
                    accept="application/pdf"
                    onChange={(e) => handleFileChange(e, index)}
                    required
                  />
                </div>
              ))}
            </div>
            <button type="submit">Submit Application</button>
          </form>
        </>
      )}
    </div>
  );
};

export default postLoanSolicitude;
