import React, { useEffect, useState } from 'react';
import LoanService from '../services/loan.service';
import { useNavigate } from 'react-router-dom'; 

const LoanSolicitudeFollowUp = ({ user }) => {
  const [loans, setLoans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  
  useEffect(() => {
    const fetchLoans = async () => {
      try {
        const response = await LoanService.getUserLoansByRut(user.rut);
        setLoans(response);
      } catch (err) {
        console.error('Error fetching loans:', err);
        setError('Failed to load loans. Please try again later.');
      } finally {
        setLoading(false);
      }
    };
    fetchLoans();
  }, [user.rut]);

  
  const getSolicitudeStatusMessage = (solicitudeState, evaluationState) => {
    if (!solicitudeState) return 'Unknown State';
    // Case when the loan solicitude is rejected, we show the reason why it was rejected
    if (solicitudeState === 'E7') {
      switch(evaluationState) {
        case 'R1': return 'The applicant has not met the R1 requirement regarding cuote-to-income ratio.';
        case 'R2': return 'The applicant has not met the R2 requirement regarding credit history.';
        case 'R3': return 'The applicant has not met the R3 requirement regarding employment stability.';
        case 'R4': return 'The applicant has not met the R4 requirement regarding debt-to-income ratio.';
        case 'R5': return 'The applicant has not met the R5 requirement regarding the maximum property value allowed.';
        case 'R6': return 'The applicant has not met the R6 requirement regarding the age limit.';
        case 'R7': return 'The applicant has not met the R7 requirement regarding the capacity of savings.';
        default: return `Unknown status`;
      }
    }
    switch (solicitudeState) {
      case 'E1': return 'Under Initial Review';
      case 'E2': return 'Pending Documentation';
      case 'E3': return 'Under Evaluation';
      case 'E4': return 'Pre-Approved';
      case 'E5': return 'Under Final Approval';
      case 'E6': return 'Approved';
      case 'E8': return 'Canceled by the Customer';
      case 'E9': return 'Under Disbursement';
      default: return 'Unknown status';
    }
  };

  // Button to cancel the solicitude and update the state of the loan to E8
  const handleCancelLoan = async (loan) => {
    try {
      await LoanService.cancelLoan({ ...loan, solicitudeState: 'E8' });
      alert('Loan canceled successfully!');
      navigate('/loan-solicitude-follow-up');
    } catch (error) {
      console.error('Error canceling loan:', error);
      alert('Failed to cancel the loan.');
    }
  };

  // Button to evaluate the loan and navigate to the loan descripion page
  const handleEvaluate = (loan) => {
    navigate('/loan-total-cost', { state: { loan } });
  };

  if (loading) return <p>Loading loans...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div>
      <h2>My Loans</h2>
      {loans.length > 0 ? (
        <table>
          <thead>
            <tr>
              <th>Loan ID</th>
              <th>Financing Amount</th>
              <th>Current State</th>
              <th>Evaluation State</th>
              <th>Status Message</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {loans.map((loan) => (
              <tr key={loan.id}>
                <td>{loan.id}</td>
                <td>{loan.financing_amount}</td>
                <td>{loan.solicitudeState}</td>
                <td>{loan.evaluationState}</td>
                <td>{getSolicitudeStatusMessage(loan.solicitudeState, loan.evaluationState)}</td>
                <td>
                  <button onClick={() => handleCancelLoan(loan)}>Cancel Loan</button>
                </td>
                <td>
                  {loan.solicitudeState === 'E4' && (
                    <button onClick={() => handleEvaluate(loan)}>View Cost</button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p>No loans found.</p>
      )}
    </div>
  );
};

export default LoanSolicitudeFollowUp;
