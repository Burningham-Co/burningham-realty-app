import React from "react";

const AddedCommission = ({ transaction }) => {
  let formatter = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  });
  if (transaction) {
    return (
      <div className="text-center">
        <div>
          Total Commission: {formatter.format(transaction[0]?.commissionTotal)}
        </div>
        <div>Commission Percent: {transaction[0]?.commissionPercentage} %</div>
        <div>
          Brokerage Fee: {formatter.format(transaction[0]?.brokerageFee)}
        </div>
        <div>
          Agent Split:{" "}
          {transaction[0]?.commissionSplitPercentage === 100
            ? "None"
            : `${transaction[0]?.commissionSplitPercentage} %`}
        </div>
      </div>
    );
  }
};

export default AddedCommission;
