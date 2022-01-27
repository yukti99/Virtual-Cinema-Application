import React, { useState, useEffect, Fragment } from "react";

const AutoExpire = ({ children }) => {
  const [isExpired, setisExpired] = useState(false);
  useEffect(() => {
    setTimeout(() => {
      setisExpired(true);
    }, 4000);
  }, []);
  if (isExpired) {
    return null;
  }
  return <Fragment>{children}</Fragment>;
};

export default AutoExpire;
