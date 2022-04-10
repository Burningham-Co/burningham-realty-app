import React, { useContext, useEffect, useState } from "react";
import { useQuery } from "react-query";

import { AuthContext } from "../auth/AuthProvider";
import List from "../components/List";
import ListItem from "../components/ListItem";

const Dashboard = () => {
  const [authUser, currentUser] = useContext(AuthContext);
  const [usersLoops, setUsersLoops] = useState(null);
  const [page, setPage] = useState(1);

  const getLoops = (page = 1) =>
    fetch(
      `https://us-central1-burningham-realty-agent-tools.cloudfunctions.net/allLoops?page=${page}`
    ).then((res) => res.json());

  const { data, isLoading } = useQuery(
    ["allLoops", page],
    () => getLoops(page),
    { keepPreviousData: true }
  );

  useEffect(() => {
    if (data && currentUser) {
      let filteredLoops = data.filter(
        (loop) => loop.createdBy === parseInt(currentUser.dotloopNumber)
      );
      let sortedLoops = filteredLoops.sort(
        (a, b) => new Date(b.created) - new Date(a.created)
      );
      setUsersLoops(sortedLoops);
    }
  }, [data, currentUser]);

  return (
    <div className="container mx-auto">
      <div className=" font-bold text-xl text-center">
        Welcome {authUser?.displayName}
      </div>
      <div className="columns-3 w-full mt-20 mb-5 py-2">
        <div className="flex justify-start items-baseline">
          <button
            className="btn my-auto"
            onClick={() => setPage((old) => Math.max(old - 1, 1))}
            disabled={page === 1}
          >
            Newer
          </button>
        </div>
        <div className="flex items-center justify-center">
          <h1 className="text-center text-lg font-bold">Sold Properties</h1>
        </div>
        <div className="flex justify-end items-baseline mt-5">
          <button
            className="btn my-auto"
            onClick={() => {
              setPage((old) => old + 1);
            }}
            disabled={usersLoops?.length === 0}
          >
            Older
          </button>
        </div>
      </div>

      <div className=" max-h-96 overflow-y-scroll">
        <List className="container mx-auto sm:mx-0 max-w-sm sm:max-w-full">
          {usersLoops ? (
            usersLoops.map((loop) => (
              <ListItem key={loop.loopId}>
                <a href={`/transaction/${loop.loopViewId}`}>
                  <h1 className=" hover:font-semibold text-lg font-medium">
                    {loop.loopName}
                  </h1>
                </a>
                <h3 className=" text-lg">{loop.transactionType}</h3>
                <h3>Loop ID: {loop.loopId}</h3>
                <h3>{loop.loopStatus}</h3>
              </ListItem>
            ))
          ) : (
            <ListItem>{isLoading ? "Loading..." : "No Sales Yet"}</ListItem>
          )}
          {usersLoops?.length === 0 && (
            <div className="text-center mt-40 font-semibold text-xl">
              End Of List
            </div>
          )}
        </List>
      </div>
    </div>
  );
};

export default Dashboard;
