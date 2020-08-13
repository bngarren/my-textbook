import React, { useState, useEffect } from "react";

import Typography from "@material-ui/core/Typography";

const LastSaveTime = ({ date }) => {
  const [dateTime, setDateTime] = useState({
    date: "",
    time: "",
  });

  useEffect(() => {
    const [d, t] = date.toLocaleString().split(",");
    const [t2, amPm] = t.trim().split(" ");
    const t3 = t2.substring(0, t2.length - 3);

    setDateTime({ date: d, time: `${t3} ${amPm}` });
  }, [date]);

  return (
    <span style={{ fontVariant: "proportional-nums", fontStyle: "italic" }}>
      <Typography variant="subtitle2">
        Last saved: {dateTime.date} at {dateTime.time}
      </Typography>
    </span>
  );
};

export default LastSaveTime;
