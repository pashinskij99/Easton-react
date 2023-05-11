import { useState } from "react";
import ContractCard from "./ContractCard";
import TermsCard from "./TermsCard";

const ParentComponent = () => {
  const [contractData, setContractData] = useState([]);

  const handleContractDataChange = (data) => {
    setContractData(data);
  };

  return (
    <div>
      <ContractCard onContractDataChange={handleContractDataChange} />
      <TermsCard contractData={contractData} />
    </div>
  );
};

export default ParentComponent;
