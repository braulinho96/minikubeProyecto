import React, { useState } from 'react';
import LoanService from '../services/loan.service'; 

const loanOptions = [
  {
    type: 'First Home',
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

const LoanSimulation = () => {
  const [selectedLoan, setSelectedLoan] = useState(null);
  const [propertyValue, setPropertyValue] = useState('');
  const [amount, setAmount] = useState('');
  const [term, setTerm] = useState('');
  const [interestRate, setInterestRate] = useState('');
  const [monthlyPayment, setMonthlyPayment] = useState(null);

  // Function to simulate the loan, verifies the input values and calls the service to calculate the monthly payment
  const simulateLoan = async (e) => {
    e.preventDefault();
    if (!amount || !term || !interestRate || !propertyValue) {
      alert('Please fill in all fields.');
      return;
    }

    // Validate the maximum loan amount based on the selected loan type 
    const maxLoanAmount = (selectedLoan.maxPercentage / 100) * propertyValue;
    console.log(`Max Loan Amount: ${maxLoanAmount}`);
  
    if (amount > maxLoanAmount) {
      console.log(`maxLoanAmount: ${maxLoanAmount}$ monto solicitado:  ${amount}$ `); 
      alert(`The loan amount cannot exceed ${selectedLoan.maxPercentage} of the properly value. Max allowed ${maxLoanAmount}.`)
      return; 
    }

    // Call the service to calculate the monthly payment
    try {
      const payment = await LoanService.calculateMonthlyPayment(
        amount,
        interestRate,
        term
      );
      setMonthlyPayment(payment);
    } catch (error) {
      alert('Error simulating the loan. Please try again.');
    }
  };

  // Function to handle loan type selection
  const handleLoanSelect = (e) => {
    const loan = loanOptions.find((option) => option.type === e.target.value);
    setSelectedLoan(loan);
    setTerm('');
    setInterestRate('');
  };

  return (
    <div style={{ textAlign: 'center' }}>
      <h2>Loan Simulation</h2>

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
          <p><strong>Documents requirements:</strong></p>
          <ul>
            {selectedLoan.requirements.map((req, index) => (
              <li key={index}>{req}</li>
            ))}
          </ul>

          <form
            onSubmit={simulateLoan}
            style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}
          >
            <input
              type="number"
              placeholder="Property Value"
              value={propertyValue}
              onChange={(e) => setPropertyValue(e.target.value)}
              min={1}
 
              required
              style={{ marginBottom: '10px' }}
            />
            <input
              type="number"
              placeholder="Loan amount"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              min={1}
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
            <button type="submit">Simulate</button>
          </form>

          {monthlyPayment && (
            <div style={{ marginTop: '20px' }}>
              <h3>Monthly Payment: ${monthlyPayment}</h3>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default LoanSimulation;
