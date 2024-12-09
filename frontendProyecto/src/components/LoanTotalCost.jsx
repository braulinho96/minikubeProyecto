import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import LoanService from '../services/loan.service';

const LoanTotalCost = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const loan = location.state?.loan;

  const [monthlyPayment, setMonthlyPayment] = useState(0);
  const [insuranceDesgravamen, setInsuranceDesgravamen] = useState(0);
  const [insuranceIncendio] = useState(20000); // Fijo
  const [adminCommission, setAdminCommission] = useState(0);
  const [totalCost, setTotalCost] = useState(0);

  useEffect(() => {
    if (loan) calculateLoanCosts(loan);
  }, [loan]);

  const calculateLoanCosts = async (loan) => {
    try {
      const { financing_amount, term, interest_rate } = loan;

      const monthlyPayment = await LoanService.calculateMonthlyPaymentFollowup(
        financing_amount,
        interest_rate,
        term
      );
      setMonthlyPayment(monthlyPayment.toFixed(2));

      // Paso 2: Cálculo de los seguros
      const insuranceDesgravamen = financing_amount * 0.0003;
      setInsuranceDesgravamen(insuranceDesgravamen.toFixed(2));

      // Paso 3: Cálculo de la comisión por administración
      const adminCommission = financing_amount * 0.01;
      setAdminCommission(adminCommission.toFixed(2));

      // Paso 4: Cálculo del costo total del préstamo
      const totalMonths = term * 12;
      const monthlyCost =
        parseFloat(monthlyPayment) + insuranceDesgravamen + insuranceIncendio;
      const totalLoanCost = monthlyCost * totalMonths + adminCommission;
      setTotalCost(totalLoanCost.toFixed(2));
    } catch (error) {
      console.error('Error calculating loan costs:', error);
    }
  };

  const handleAccept = async () => {
    try {
      await LoanService.acceptLoan({ ...loan, solicitudeState: 'E5' });
      alert('Loan accepted successfully!');
      navigate('/loan-solicitude-follow-up'); 
    } catch (error) {
      console.error('Error accepting loan:', error);
      alert('Failed to accept the loan.');
    }
  };

  const handleReject = async () => {
    try {
      await LoanService.cancelLoan({ ...loan, solicitudeState: 'E8' });
      alert('Loan rejected by the applicant.');
      navigate('/loan-solicitude-follow-up'); 
    } catch (error) {
      console.error('Error rejecting loan:', error);
      alert('Failed to reject the loan.');
    }
  };

  if (!loan) return <p>No loan data available.</p>;

  return (
    <div style={{ padding: '20px', maxWidth: '600px', margin: '0 auto' }}>
      <h2>Loan Total Cost</h2>
      <div style={{ marginTop: '20px' }}>
        <h3>Loan Details:</h3>
        <p><strong>Financing Amount:</strong> ${loan.financing_amount}</p>
        <p><strong>Years:</strong> {loan.term}</p>
        <p><strong>Annual Interest Rate:</strong> {loan.interest_rate}%</p>
      </div>

      <div style={{ marginTop: '20px' }}>
        <h3>Results:</h3>

        <h4>Step 1: Monthly Payment Calculation</h4>
        <p>The monthly payment is calculated using the provided loan parameters.</p>
        <p><strong>Calculated Monthly Payment:</strong> ${monthlyPayment}</p>

        <h4>Step 2: Insurance Calculation</h4>
        <p><strong>Desgravamen Insurance (0.03%):</strong> ${insuranceDesgravamen} per month</p>
        <p><strong>Fire Insurance:</strong> ${insuranceIncendio} per month</p>

        <h4>Step 3: Administrative Commission</h4>
        <p><strong>Administration Commission (1%):</strong> ${adminCommission} (one-time)</p>

        <h4>Step 4: Total Loan Cost</h4>
        <p>
          <strong>Total Monthly Cost:</strong> ${parseFloat(monthlyPayment) + parseFloat(insuranceDesgravamen) + insuranceIncendio}
        </p>
        <p><strong>Total Loan Cost over {loan.term} years:</strong> ${totalCost}</p>

        <div style={{ marginTop: '30px', display: 'flex', gap: '20px' }}>
          <button onClick={handleAccept} style={{ padding: '10px 20px', backgroundColor: 'green', color: 'white' }}>
            Accept
          </button>
          <button onClick={handleReject} style={{ padding: '10px 20px', backgroundColor: 'red', color: 'white' }}>
            Reject
          </button>
        </div>
      </div>
    </div>
  );
};

export default LoanTotalCost;
