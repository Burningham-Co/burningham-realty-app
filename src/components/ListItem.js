import React from "react";

const ListItem = ({ children }) => {
  return (
    <div className="min-h-min border-b-2 items-center flex-row flex-wrap list">
      {children}
    </div>
  );
};

export default ListItem;
