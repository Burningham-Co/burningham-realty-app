// import axios from "axios";
import {
  collection,
  getDocs,
  doc,
  updateDoc,
  arrayUnion,
} from "firebase/firestore";
import React, { useContext, useEffect, useState } from "react";
import { useQuery } from "react-query";
import { useNavigate, useParams } from "react-router-dom";
import { AuthContext } from "../auth/AuthProvider";
import CommissionForm from "../components/CommissionForm";
import Modal from "../components/Modal";
import { db } from "../firebase/config";

const TransactionDetails = () => {
  const [success, setSuccess] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [authUser, currentUser] = useContext(AuthContext);
  // const [allUsers, setAllUsers] = useState(null);
  const [agentSearch, setAgentSearch] = useState("");
  const [agentOne, setAgentOne] = useState(null);
  const [agentTwo, setAgentTwo] = useState(null);
  const [agentThree, setAgentThree] = useState(null);

  const [totalCommissionPercentage, setTotalCommissionPercentage] = useState(3);
  const navigate = useNavigate();
  let { loopId } = useParams();
  const [showAddSplit, setShowAddSplit] = useState(false);
  const getLoopDetailsUrl = `https://us-central1-burningham-realty-agent-tools.cloudfunctions.net/loopDetails?loopId=${loopId}`;

  const getLoopDetails = async () => {
    let res = await fetch(getLoopDetailsUrl);
    return res.json();
  };
  const getUsers = async () => {
    let docs = await getDocs(collection(db, "users"));

    let userList = [];
    docs.forEach((doc) => userList.push({ ...doc.data(), id: doc.id }));
    return userList;
  };
  const { data, isLoading } = useQuery("loopDetails", getLoopDetails);
  const { data: allUsers } = useQuery("userList", getUsers);

  useEffect(() => {
    if (authUser && data?.sections?.Financials?.purchasePrice) {
      setAgentOne({
        id: authUser?.uid,
        firstName: currentUser?.firstName,
        lastName: currentUser?.lastName,
        commissionSplitPercentage: 100,
        commissionTotal: getCommissionTotal(
          data?.sections?.Financials?.purchasePrice,
          totalCommissionPercentage,
          100,
          100
        ),
        brokerageFee: 100,
        commissionPercentage: totalCommissionPercentage,
        dotLoop: data,
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [authUser, data?.sections?.Financials?.purchasePrice]);

  let formatter = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  });

  const addSplit = async (e, id, first, last) => {
    e.preventDefault();
    if (agentTwo) {
      setAgentThree({
        id: id,
        firstName: first,
        lastName: last,
        commissionSplitPercentage: 0,
        commissionTotal: 0,
        brokerageFee: 100,
        commissionPercentage: totalCommissionPercentage,
        dotLoop: data,
      });
    } else {
      setAgentTwo({
        id: id,
        firstName: first,
        lastName: last,
        commissionSplitPercentage: 0,
        commissionTotal: 0,
        brokerageFee: 100,
        commissionPercentage: totalCommissionPercentage,
        dotLoop: data,
      });
    }

    setShowAddSplit(false);
  };

  const getCommissionTotal = (price, percent, fee, split) => {
    const a = reducedNumber(price);
    const b = parseFloat(percent);
    const c = parseInt(fee);
    const d = parseInt(split);
    const total = a * (b / 100) * (d / 100) - c;
    return total;
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

  const handleSearch = (e) => {
    const { value } = e.target;
    setAgentSearch(value);
  };
  let filteredAgents = allUsers?.filter(
    (user) =>
      user.firstName?.toLowerCase().indexOf(agentSearch?.toLowerCase()) !==
        -1 ||
      user.lastName?.toLowerCase().indexOf(agentSearch?.toLowerCase()) !== -1
  );

  const addCommission = (e) => {
    e.preventDefault();

    setLoading(true);
    if (agentOne) {
      updateDoc(
        doc(db, "users", agentOne.id),
        { transactions: arrayUnion(agentOne) },
        { merge: true }
      )
        .then(() => {
          if (agentTwo) {
            updateDoc(
              doc(db, "users", agentTwo.id),
              { transactions: arrayUnion(agentTwo) },
              { merge: true }
            )
              .then(() => {
                setAgentTwo(null);
                if (agentThree) {
                  updateDoc(
                    doc(db, "users", agentThree.id),
                    { transactions: arrayUnion(agentThree) },
                    { merge: true }
                  )
                    .then(() => {
                      setAgentThree(null);
                      setLoading(false);
                      setSuccess("Commission has been added successfully!");
                      setTimeout(() => {
                        setSuccess(null);
                      }, 1000);
                    })
                    .catch((err) => {
                      setLoading(false);
                      setError(
                        `Error adding ${agentOne.firstName} ${agentOne.lastName}'s commission: ${err.message}`
                      );
                    });
                } else {
                  setLoading(false);
                  setSuccess("Commission has been added successfully!");
                  setTimeout(() => {
                    setSuccess(null);
                  }, 1000);
                }
              })
              .catch((err) => {
                setLoading(false);
                setError(
                  `Error adding ${agentOne.firstName} ${agentOne.lastName}'s commission: ${err.message}`
                );
              });
          } else {
            setLoading(false);
            setSuccess("Commission has been added successfully!");
            setTimeout(() => {
              setSuccess(null);
            }, 1000);
          }
        })
        .catch((err) => {
          setLoading(false);
          setError(
            `Error adding ${agentOne.firstName} ${agentOne.lastName}'s commission: ${err.message}`
          );
        });
    }
  };

  return (
    <div className="container mx-auto">
      <button
        className="hover:font-semibold mt-1 w-20 flex justify-between"
        onClick={() => navigate("/dashboard")}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-6 w-6"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M11 19l-7-7 7-7m8 14l-7-7 7-7"
          />
        </svg>
        Back
      </button>
      {isLoading && <div>Loading...</div>}
      {data && (
        <>
          <div className=" text-center mt-5 font-semibold">
            {`${data.sections["Property Address"]?.streetNumber} ${data.sections["Property Address"]?.streetName}, ${data.sections["Property Address"]?.city}, ${data.sections["Property Address"]?.stateOrProvince} ${data.sections["Property Address"]?.postalCode}`}
          </div>
          <div className=" text-center font-semibold">
            Closing Date: {data.sections["Contract Dates"]?.closingDate}
          </div>
          <div className=" text-center font-semibold">
            Purchase Price:{" "}
            {formatter.format(
              reducedNumber(data.sections.Financials?.purchasePrice)
            )}
          </div>
          <div className="block sm:flex sm:column-2 mt-7">
            <div className="w-full p-3 text-center">
              <div className="text-center font-semibold">Buyer</div>
              <div className="">Name: {data.sections.Buyer?.Name}</div>
              <div className="">
                Agent: {data.sections["Buying Agent"]?.Name}
              </div>
            </div>
            <div className="w-full p-3 text-center">
              <div className="text-center font-semibold">Seller</div>
              <div className="">Name: {data?.sections?.Seller?.Name}</div>
              <div className="">
                Agent: {data.sections["Listing Agent"]?.Name}
              </div>
            </div>
          </div>
          <div className="flex justify-center">
            <div className="font-conf max-w-full sm:max-w-2xl w-full bg-white px-7 py-6 rounded my-5 sm:my-0 mx-2 sm:mx-0">
              <div className="text-xl relative font-semibold before:absolute before:h-1 before:left-0 before:bottom-0 before:content-[''] before:w-7 before:bg-red-900">
                Add Commission
              </div>

              <div className=" w-full mb-4 grid-rows-2 relative">
                <div className="data w-full text-center">
                  <span className="data w-full text-center">
                    Edit Total Commission Percentage
                  </span>
                </div>

                <div className="relative w-full flex justify-center">
                  <div className="absolute  right-[45%] top-1/4">%</div>

                  <input
                    name="commissionPercentage"
                    className=" w-24"
                    type="number"
                    step="0.01"
                    min={0}
                    defaultValue={3}
                    onChange={(e) =>
                      setTotalCommissionPercentage(e.target.value)
                    }
                    required
                  />
                </div>
              </div>

              {data.sections.Financials.purchasePrice ? (
                <CommissionForm
                  agent={agentOne}
                  setAgent={setAgentOne}
                  totalCommissionPercentage={totalCommissionPercentage}
                  setTotalCommissionPercentage={setTotalCommissionPercentage}
                  setError={setError}
                  agentOne={true}
                />
              ) : (
                <div>Loading...</div>
              )}
              {agentTwo && (
                <CommissionForm
                  agent={agentTwo}
                  totalCommissionPercentage={totalCommissionPercentage}
                  setAgent={setAgentTwo}
                  setError={setError}
                />
              )}
              {agentThree && (
                <CommissionForm
                  agent={agentThree}
                  totalCommissionPercentage={totalCommissionPercentage}
                  setAgent={setAgentThree}
                  setError={setError}
                />
              )}
              {showAddSplit && (
                <Modal setShow={setShowAddSplit}>
                  <div className="text-2xl relative font-semibold before:absolute before:h-1 before:left-0 before:bottom-0 before:content-[''] before:w-7 before:bg-red-900">
                    Add Agent for Split
                  </div>
                  <form id="addSplitForm" name="addSplitForm">
                    <div className="flex max-h-[300px] overflow-y-scroll sm:overflow-visible sm:max-h-full flex-wrap justify-center mx-0 mt-5 mb-3">
                      <div className="input-box ">
                        <span className="data">Search Agent Name</span>
                        <input
                          name="agent"
                          type="text"
                          placeholder="Search Agent Name"
                          onChange={handleSearch}
                          required
                        />
                      </div>
                    </div>
                  </form>
                  <div className="container mx-auto flex-row justify-center w-full max-h-[150px] overflow-y-hidden">
                    {filteredAgents?.map((agent) => (
                      <button
                        key={agent.id}
                        className="btn w-full my-1"
                        onClick={(e) =>
                          addSplit(e, agent.id, agent.firstName, agent.lastName)
                        }
                      >{`${agent.firstName} ${agent.lastName}`}</button>
                    ))}
                  </div>
                </Modal>
              )}
              {error && (
                <div className="font-bold text-red-700 text-center">
                  {error}
                </div>
              )}
              {success && (
                <div className="font-bold text-lime-700 text-center">
                  {success}
                </div>
              )}
              <div className="flex justify-end w-full">
                {!agentThree && (
                  <button onClick={() => setShowAddSplit(true)}>
                    Add Agent Split
                  </button>
                )}
              </div>
              {loading ? (
                <button className="btn h-11 w-full my-8 mx-0" disabled>
                  Loading...
                </button>
              ) : (
                <button
                  className="btn h-11 w-full my-8 mx-0"
                  onClick={addCommission}
                  disabled={error}
                >
                  Add Commission
                </button>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default TransactionDetails;
