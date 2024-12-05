import React, { useEffect, useState } from "react";
import LoanService from "../services/loan.service";
import { Navigate } from "react-router-dom";
import DocumentsService from "../services/documents.service";

const LoanEvaluation = () => {
  const [pendingLoans, setPendingLoans] = useState([]);
  const [selectedLoan, setSelectedLoan] = useState(null);
  const [monthlyQuota, setMonthlyQuota] = useState(0);
  const [monthlyIncome, setMonthlyIncome] = useState(0);
  const [evaluationResult, setEvaluationResult] = useState("");
  const [isLoanAccepted, setIsLoanAccepted] = useState(null);       
  const [yearsOfEmployment, setYearsOfEmployment] = useState(0);    
  const [isSelfEmployed, setIsSelfEmployed] = useState(false);      
  const [totalDebts, setTotalDebts] = useState(0);
  const [propertyValue, setPropertyValue] = useState(0);
  const [age, setAgeValue] = useState(0);
  const [numberAproved, setnumberAproved] = useState(0);
  const [documents, setDocuments] = useState([]);

                    
  useEffect(() => {
    fetchPendingLoans();
  }, []);

  const fetchPendingLoans = async () => {
    try {
      const loans = await LoanService.getPendingLoans();
      setPendingLoans(loans);
    } catch (error) {
      console.error("Error fetching pending loans:", error);
    }
  };

  const handleLoanSelect = async (loan) => {
    setSelectedLoan(loan);
    console.log(loan);
    try {
      const loanDocuments = await DocumentsService.getLoanDocuments(loan.id);
      setDocuments(loanDocuments);
    } catch (error) {
      console.error("Error fetching loan documents:", error);
    }
  };
  // Documents section
  const downloadDocument = (doc) => {
    console.log("Documents received:", documents);

    // Convertir el contenido base64 a un formato binario
    const byteCharacters = atob(doc.content); // Decodifica el contenido base64
    const byteNumbers = new Uint8Array(byteCharacters.length); // Crea un array de bytes

    // Rellenar el array de bytes
    for (let i = 0; i < byteCharacters.length; i++) {
        byteNumbers[i] = byteCharacters.charCodeAt(i);
    }

    // Crear un blob a partir del array de bytes
    const blob = new Blob([byteNumbers], { type: "application/pdf" });
    const url = URL.createObjectURL(blob);
    
    // Crear un enlace para descargar el documento
    const link = document.createElement("a");
    link.href = url;
    link.download = doc.name; // Usa 'doc.name' como el nombre del archivo
    document.body.appendChild(link); // Añadir el enlace al DOM
    link.click(); // Hacer clic en el enlace para iniciar la descarga
    document.body.removeChild(link); // Eliminar el enlace del DOM
    URL.revokeObjectURL(url); // Liberar el objeto URL
};

  // Exit Evaluation
  const handleExitEvaluation = () => {
    setSelectedLoan(null);
    setMonthlyQuota(0);
    setMonthlyIncome(0);
    setTotalDebts(0);
    setEvaluationResult("");
    setIsLoanAccepted(null);
    setYearsOfEmployment(0);
    setIsSelfEmployed(false);
    setPropertyValue(0);
    setAgeValue(0);
    setnumberAproved(0);
  };

  // R1 Evaluation
  const handleDebtIncomeRatio = async () => {
    try {
        const result = await LoanService.evaluateR1(monthlyQuota, monthlyIncome);
        setEvaluationResult(result ? "Debt-to-Income Ratio is acceptable." : "Debt-to-Income Ratio is too high.");
    } catch (error) {
        console.error('Error:', error);
        setEvaluationResult('An error occurred while evaluating the loan.');
    }
  };
  
  // R1 Update
  const handleEvaluateR1 = async (isAccepted) => {
    if(isAccepted){
      // Case when the loan is accepted
      try{
        const updatedLoan = { ...selectedLoan, evaluationState: "R2" };
        await LoanService.updateLoanEvaluation(updatedLoan);
        setSelectedLoan(updatedLoan);
        alert("Loan accepted: relation between quota and income is acceptable. Loan state updated to R2.");
        fetchPendingLoans();

      } catch (error) {
        console.error("Error updating loan:", error);
        alert("Error updating loan: " + error.message);
      }
    } else {
      // Case when the loan is rejected
      try{
        const updatedLoan = { ...selectedLoan, solicitudeState: "E7" };
        await LoanService.updateLoan(updatedLoan);
        setSelectedLoan(updatedLoan);
        alert("Loan rejected: relation between quota and income is too high.");
        fetchPendingLoans();

      } catch (error) {
        console.error("Error updating loan:", error);
        alert("Error updating loan: " + error.message);
      }
    }
  };
  
  // R2 Evaluation
  const handleEvaluateR2 = async (isAccepted) => {
    if(isAccepted){
      try{
        const updatedLoan = { ...selectedLoan, evaluationState: "R3"};
        await LoanService.updateLoanEvaluation(updatedLoan);
        setSelectedLoan(updatedLoan);
        alert("Loan accepted and updated to R3.");
      }catch (error){
        console.error('Error evaluating R2:', error);
        setEvaluationResult('Error during evaluation.');
      }
      fetchPendingLoans();
    } else{
      try{
        const updatedLoan = { ...selectedLoan, solicitudeState: "E7" };
        await LoanService.updateLoanEvaluation(updatedLoan);
        setSelectedLoan(updatedLoan);
        alert("Loan rejected: the applicant has a bad credit history.");
      } catch (error) {
        console.error("Error updating loan:", error);
        alert("Error updating loan: " + error.message);
      }
      fetchPendingLoans();
    }

  };

  // R3 
  const handleEvaluateR3 = async () => {
    try {
      const result = await LoanService.evaluateR3(yearsOfEmployment, isSelfEmployed);
  
      const updatedLoan = result
        ? { ...selectedLoan, evaluationState: "R4" }
        : { ...selectedLoan, solicitudeState: "E7"
          };
  
      try {
        await LoanService.updateLoanEvaluation(updatedLoan);
        setSelectedLoan(updatedLoan);
        alert(result ? "Loan accepted and updated to R4." : "Loan rejected.");
      } catch (error) {
        console.error("Error updating loan:", error);
        alert("Error updating loan: " + error.message);
      }
      fetchPendingLoans();
    } catch (error) {
      console.error("Error evaluating R3:", error);
      alert("Error during evaluation: " + error.message);
    }
  };
  
  // R4 Evaluation
  const handleEvaluateR4 = async () => {
    try {
      const result = await LoanService.evaluateR4(totalDebts, monthlyIncome);
      const updatedLoan = result
        ? { ...selectedLoan, evaluationState: "R5" }
        : { ...selectedLoan, solicitudeState: "E7"
          };

      try {
        await LoanService.updateLoanEvaluation(updatedLoan);
        setSelectedLoan(updatedLoan);
        alert(result ? "Loan accepted and updated to R5." : "Loan rejected.");
      } catch (error) {
        console.error("Error updating loan:", error);
        alert("Error updating loan: " + error.message);
      }
      fetchPendingLoans();
    } catch (error) {
      console.error("Error evaluating R4:", error);
      alert("Error during evaluation: " + error.message);
    }
  };
  
  // R5 Component
  const handleEvaluateR5 = async () => {
    try {
      const result = await LoanService.evaluateR5( selectedLoan.financing_amount, propertyValue, selectedLoan.type );
      const updatedLoan = result
        ? { ...selectedLoan, evaluationState: "R6" }
        : {...selectedLoan, solicitudeState: "E7"};

      try {
        await LoanService.updateLoanEvaluation(updatedLoan);
        setSelectedLoan(updatedLoan);
        alert(result ? "Loan accepted and updated to R6." : "Loan rejected.");
      } catch (error) {
        console.error("Error updating loan:", error);
        alert("Error updating loan: " + error.message);
      }
  
      fetchPendingLoans();
    } catch (error) {
      console.error("Error evaluating R5:", error);
      alert("Error during evaluation: " + error.message);
    }
  };
  
  // R6 Component
  const handleEvaluateR6 = async () => {
    try {
      const result = await LoanService.evaluateR6(age, selectedLoan.term);
      const updatedLoan = result ? { ...selectedLoan, evaluationState: "R7" }   
                                 : { ...selectedLoan, solicitudeState:
              "E7"
          };
      try {
        await LoanService.updateLoanEvaluation(updatedLoan);
        setSelectedLoan(updatedLoan);
        alert(result ? "Loan accepted and updated to R7." : "Loan rejected.");
      } catch (error) {
        console.error("Error updating loan:", error);
        alert("Error updating loan: " + error.message);
      }
      fetchPendingLoans();
    } catch (error) {
      console.error("Error evaluating R6:", error);
      alert("Error during evaluation: " + error.message);
    }
  };
  
  // R7 Component
  const handleEvaluateR7 = async () => {
    try{
      const updatedLoan = await LoanService.evaluateR7(selectedLoan, numberAproved);
      setSelectedLoan(updatedLoan);
      alert("Loan state updated.");
      fetchPendingLoans();
    }catch (error) {
      console.error('Error evaluating R7:', error);
      setEvaluationResult("Error during evaluation.");
    }
  };

  
  const renderSection = (state) => {
    // This is the case when the loan has already been declined and we want to show the reason
    if(selectedLoan.solicitudeState !== "E3" && selectedLoan.solicitudeState !== "E4"){
      return <div>
              <h2>The loan application has already been declined</h2> 
              <p>Reason: {selectedLoan.solicitudeState}</p> 
            </div>;
    }
    if(selectedLoan.solicitudeState === "E4"){
      return <Navigate to="/home" />;
    }

    switch (state) {
      case "R1":
        return (
          <R1 
            monthlyQuota={monthlyQuota} 
            setMonthlyQuota={setMonthlyQuota}
            monthlyIncome={monthlyIncome} 
            setMonthlyIncome={setMonthlyIncome}
            onEvaluateR1={handleDebtIncomeRatio}
            evaluationResult={evaluationResult}
            isLoanAccepted={isLoanAccepted} 
            onUpdateLoan={handleEvaluateR1} 
          />
        );
      case "R2":
        return (
          <R2 
            onUpdateLoan={handleEvaluateR2} 
            evaluationResult={evaluationResult} 
          />
        );
      case "R3":
        return (
          <R3 
            yearsOfEmployment={yearsOfEmployment}
            setYearsOfEmployment={setYearsOfEmployment}
            isSelfEmployed={isSelfEmployed}
            setIsSelfEmployed={setIsSelfEmployed}
            onEvaluateR3={handleEvaluateR3} 
            evaluationResult={evaluationResult} 
          />
        );
      case "R4":
        return (
          <R4 
            totalDebts={totalDebts}
            setTotalDebts={setTotalDebts}
            monthlyIncome={monthlyIncome}
            setMonthlyIncome={setMonthlyIncome}
            onEvaluateR4={handleEvaluateR4}
            evaluationResult={evaluationResult}
          />
        );
      case "R5":
          return (
            <R5 
              propertyValue={propertyValue}
              setPropertyValue={setPropertyValue}
              onEvaluateR5={handleEvaluateR5} 
            />
          );
      case "R6":
        return (
            <R6 
              age={age}
              setAgeValue={setAgeValue}
              onEvaluateR6={handleEvaluateR6}
            />
         );
      case "R7":
        return (
            <R7 
              numberAproved={numberAproved}
              setnumberAproved={setnumberAproved}
              onEvaluateR7={handleEvaluateR7}
            />
        );
      default:
        return <p>Unknown state</p>;
    }
  };
  return (
    <div>
      <h1>Loan Evaluation</h1>
      {selectedLoan === null ? (
        <div className="table-container">
          {pendingLoans.length > 0 ? (
            <table>
              <thead>
                <tr>
                  <th>RUT</th>
                  <th>Loan Type</th>
                  <th>Evaluation State</th>
                  <th>Solicitude State</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {pendingLoans.map((loan) => (
                  <tr key={loan.id}>
                    <td>{loan.rut}</td>
                    <td>{getLoanType(loan.type)}</td>
                    <td>{loan.evaluationState}</td>
                    <td>{loan.solicitudeState}</td>
                    <td>
                      <button onClick={() => handleLoanSelect(loan)}>Evaluate</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <p>No pending loans for evaluation.</p>
          )}
        </div>
      ) : (
        <div>
          <button
            onClick={handleExitEvaluation}
            style={{
              margin: "10px",
              marginTop: "10px",
              marginRight: "700px",
              position: "relative",
              top: "10px",
              left: "10px",
            }}
          >
            Back to Loan Table
          </button>
          <h2>Evaluating Loan:</h2>
          {renderSection(selectedLoan.evaluationState)}
  
          {/* Sección de documentos */}
          <div className="documents-container">
            <h3>Associated Documents</h3>
            {documents.length > 0 ? (
              <ul>
                {documents.map((doc) => (
                  <li key={doc.id}>
                    {doc.name}{" "}
                    <button onClick={() => downloadDocument(doc)}>
                      Download
                    </button>
                  </li>
                ))}
              </ul>
            ) : (
              <p>No documents available for this loan.</p>
            )}
          </div>
        </div>
      )}
    </div>
  );  
};

const R1 = ({ monthlyQuota, setMonthlyQuota, monthlyIncome, setMonthlyIncome, onEvaluateR1, evaluationResult, isLoanAccepted, onUpdateLoan }) => (
  <div>
    <p>R1. Debt-to-Income Ratio</p>
    <div>
      <label>
        Monthly Quota:
        <input
          type="number"
          value={monthlyQuota}
          onChange={(e) => setMonthlyQuota(Number(e.target.value))}
        />
      </label>
      <label>
        Monthly Income:
        <input
          type="number"
          value={monthlyIncome}
          onChange={(e) => setMonthlyIncome(Number(e.target.value))}
        />
      </label>
      <button onClick={onEvaluateR1}>Evaluate R1</button>
      
      {evaluationResult && <p>Result: {evaluationResult}</p>}
      
      {/* Aquí mostramos los botones de aceptación y rechazo independientemente del resultado */}
      {evaluationResult && (
        <div style={{ marginTop: "20px" }}>
      <button onClick={() => onUpdateLoan(false)} style={{ marginLeft: "10px" }}>Reject Loan</button>
      <button onClick={() => onUpdateLoan(true)} style={{ marginLeft: "10px" }}>Accept Loan</button>
    </div>
      )}
    </div>
  </div>
);

const R2 = ({ onUpdateLoan, evaluationResult }) => (
  <div>
    <h2>R2. Customer Credit History</h2>
    <p>The customer's credit history is reviewed in DICOM (Commercial Information Directory).</p>
    <p>If the customer has a good credit history (without delinquencies or recent unpaid debts), they can proceed in the process.</p>
    <p>If there are serious delinquencies or a high amount of outstanding debts, the application is rejected.</p>

    <div style={{ marginTop: "20px" }}>
      <button onClick={() => onUpdateLoan(false)} style={{ marginLeft: "10px" }}>Reject Loan</button>
      <button onClick={() => onUpdateLoan(true)} style={{ marginLeft: "10px" }}>Accept Loan</button>
    </div>
  </div>
);

const R3 = ({ yearsOfEmployment, setYearsOfEmployment, isSelfEmployed, setIsSelfEmployed, onEvaluateR3, evaluationResult, onUpdateLoan }) => (
  <div>
    <h2>R3. Employment Stability</h2>
    <div>
      <label>
        Years of Employment:
        <input
          type="number"
          value={yearsOfEmployment}
          onChange={(e) => setYearsOfEmployment(Number(e.target.value))}
        />
      </label>
      <label>
        Are you self-employed?
        <input
          type="checkbox"
          checked={isSelfEmployed}
          onChange={(e) => setIsSelfEmployed(e.target.checked)}
        />
      </label>
      <button onClick={onEvaluateR3}>Evaluate R3</button>
    </div>
  </div>
);

const R4 = ({ totalDebts, setTotalDebts, monthlyIncome, onEvaluateR4, setMonthlyIncome,  evaluationResult }) => (
  <div>
    <p>R4. Total Debt to Income Ratio</p>
    <div>
      <label>
        Total Debts:
        <input
          type="number"
          value={totalDebts}
          min={0}
          onChange={(e) => setTotalDebts(Number(e.target.value))}
        />
      </label>
      <label>
        Monthly Income:
        <input
          type="number"
          value={monthlyIncome}
          min={0}
          onChange={(e) => setMonthlyIncome(Number(e.target.value))}
        />
      </label>
      <button onClick={onEvaluateR4}>Evaluate R4</button>
    </div>
  </div>
);

const R5 = ({ propertyValue,  setPropertyValue,  onEvaluateR5 }) => (
  <div>
    <h2>R5. Property Value Evaluation</h2>
    <div>
      <label>
        Property Value:
        <input
          type="number"
          value={propertyValue}
          onChange={(e) => setPropertyValue(Number(e.target.value))}
        />
      </label>
    </div>

    <button onClick={onEvaluateR5} style={{ marginTop: "20px" }}>
      Evaluate R5
    </button>
  </div>
);

const R6 = ({age, setAgeValue, onEvaluateR6}) => (
  <div>
    <h2>R6. Age limit </h2>
    <div>
      <label>
        Age of the applicant:
        <input
          type="number"
          value={age}
          min={18}
          onChange={(e) => setAgeValue(Number(e.target.value))}
        />
      </label>
    </div>
    <button onClick={onEvaluateR6} style={{ marginTop: "20px" }}>
      Evaluate R5
    </button>
    </div>
);

const R7 = ({ numberAproved, setnumberAproved, onEvaluateR7 }) => (
  <div>
    <h2>R7. Saving Capacity</h2>
    <div>
      <label>
        R71: Minimum Required Balance - 10% of the loan amount
        <input
          type="checkbox"
          onChange={(e) =>
            setnumberAproved((prev) => (e.target.checked ? prev + 1 : prev - 1))
          }
        />
      </label>
    </div>

    <div>
      <label>
        R72: Consistent Saving History - 12 months without significant withdrawals
        <input
          type="checkbox"
          onChange={(e) =>
            setnumberAproved((prev) => (e.target.checked ? prev + 1 : prev - 1))
          }
        />
        
      </label>
    </div>

    <div>
      <label>
        R73: Periodic Deposits - At least 5% of monthly income
        <input
          type="checkbox"
          onChange={(e) =>
            setnumberAproved((prev) => (e.target.checked ? prev + 1 : prev - 1))
          }
        />
      </label>
    </div>

    <div>
      <label>
        R74: Balance-to-Age Relationship - 10% or 20% depending on account age
        <input
          type="checkbox"
          onChange={(e) =>
            setnumberAproved((prev) => (e.target.checked ? prev + 1 : prev - 1))
          }
        />
        
      </label>
    </div>

    <div>
      <label>
      R75: Recent Withdrawals - Less than 30% in the last 6 months
        <input
          type="checkbox"
          onChange={(e) =>
            setnumberAproved((prev) => (e.target.checked ? prev + 1 : prev - 1))
          }
        />
      </label>
    </div>

    <div>
      <p>Number of Approved Points: {numberAproved}</p>
      <button onClick={onEvaluateR7}>Evaluate R7</button>
    </div>
  </div>
);


const getLoanType = (type) => {
  switch (type) {
    case 1:
      return "First Home";
    case 2:
      return "Second Home";
    case 3:
      return "Auto Loan";
    case 4:
      return "Personal Loan";
    default:
      return "Unknown Type";
  }
};

export default LoanEvaluation;
