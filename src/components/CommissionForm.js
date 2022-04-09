import React, { useEffect, useState } from "react";

const CommissionForm = ({
  agent,
  setAgent,
  totalCommissionPercentage,
  agentOne,
}) => {
  const [commissionTotal, setCommissionTotal] = useState(
    agent?.commissionTotal
  );

  useEffect(() => {
    if (agent) {
      getCommissionTotal(
        agent?.dotLoop?.sections.Financials?.purchasePrice,
        agent?.commissionPercentage,
        agent?.brokerageFee,
        agent?.commissionSplitPercentage
      );
    }

    setAgent({
      ...agent,
      commissionPercentage: totalCommissionPercentage,
      commissionTotal: commissionTotal,
    });

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    agent?.dotLoop?.sections.Financials?.purchasePrice,
    agent?.commissionPercentage,
    agent?.brokerageFee,
    agent?.commissionSplitPercentage,
    commissionTotal,
    totalCommissionPercentage,
  ]);

  const handleFormChange = (e) => {
    const { name, value } = e.target;

    setAgent({
      ...agent,
      [name]: value,
      commissionPercentage: totalCommissionPercentage,
      commissionTotal: commissionTotal,
    });
  };
  const reducedNumber = (num) => {
    let newNum;
    if (parseInt(num) > 0) {
      if (typeof num === "string") {
        newNum = num;
      } else {
        newNum = JSON.stringify(num);
      }

      if (num.includes(".")) {
        newNum = newNum.split(".")[0];
      }
      if (num.includes(",")) {
        let n = newNum.split(",");
        newNum = n[0] + n[1];
      }

      return parseInt(newNum);
    }
  };

  const getCommissionTotal = (price, percent, fee, split) => {
    const a = reducedNumber(price);
    const b = parseFloat(percent);
    const c = parseInt(fee);
    const d = parseInt(split);
    console.log(a, b, c, d);
    const total = a * (b / 100) * (d / 100) - c;
    console.log(total);
    setCommissionTotal(total);
  };

  return (
    <form
      id="createAccountForm"
      name="createAccountForm"
      onChange={handleFormChange}
    >
      <div className="flex flex-wrap justify-between mx-0 mt-5 mb-3">
        <div className="w-full font-semibold text-lg text-center">
          {`Agent: ${agent?.firstName} ${agent?.lastName}`}
        </div>
        <div className="input-box relative">
          <span className="data">Total Commission Percentage</span>
          <div className="absolute right-5 top-1/2">%</div>
          <input
            name="commissionPercentage"
            type="number"
            step="0.01"
            min={0}
            value={totalCommissionPercentage}
            required
            disabled
          />
        </div>
        <div className="input-box">
          <span className="data">Commission Total</span>
          {
            <input
              className="text-lg font-semibold text-red-900"
              id="commissionTotal"
              name="commissionTotal"
              type="number"
              value={commissionTotal}
              disabled
            />
          }
        </div>

        <div className="input-box">
          <span className="data">Agent Brokerage Fee</span>
          <select
            name="brokerageFee"
            type="number"
            defaultValue={agent?.brokerageFee}
            required
          >
            <option value={100}>$100</option>
            <option value={350}>$350</option>
            <option value={375}>$375</option>
            <option value={750}>$750</option>
            <option value={125}>Overcap $125</option>
            <option value={85}>Residential Lease $85</option>
          </select>
        </div>
        <div className="input-box relative">
          <span className="data">Agent Split Percentage</span>
          <div className="absolute right-5 top-1/2">%</div>
          <input
            name="commissionSplitPercentage"
            type="number"
            min={0}
            max={100}
            defaultValue={agent?.commissionSplitPercentage}
            required
          />
        </div>
        <div className="flex justify-end w-full text-red-900">
          {!agentOne && (
            <button onClick={() => setAgent(null)}>Remove Agent Split</button>
          )}
        </div>
      </div>
    </form>
  );
};

export default CommissionForm;
