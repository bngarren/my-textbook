import React, { useState, useEffect } from "react";

const EnumState = ({ currentStatus, forStatus, children }) => {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    setVisible(currentStatus === forStatus);
  }, [currentStatus, forStatus]);

  return <>{visible && children}</>;
};

export default EnumState;
