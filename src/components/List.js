import React from "react";

const List = ({ children, className }) => {
  return <div className={`container border-t-2 ${className}`}>{children}</div>;
};

export default List;
