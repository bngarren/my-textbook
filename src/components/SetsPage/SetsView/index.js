import React, { useEffect, useState } from "react";
import { getSetsByIds } from "../../Firebase";
import Loading from "../../Loading";

import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import SubjectIcon from "@material-ui/icons/Subject";
import DeleteForeverIcon from "@material-ui/icons/DeleteForever";
import PlaylistAddCheckIcon from "@material-ui/icons/PlaylistAddCheck";

const SetsView = ({ user }) => {
  const [setIds, setSetIds] = useState(user && user.set_ids);
  const [sets, setSets] = useState(null);
  const [isLoading, setIsLoading] = useState(sets ? false : true);

  /* set_ids is the array of set IDs that is stored in each user document */

  /* Update setIds state if the user prop changes */
  useEffect(() => {
    if (user) {
      setSetIds(user.set_ids);
    }
  }, [user]);

  /* Grab new data if the set_ids state changes */
  useEffect(() => {
    const getSets = async () => {
      console.log("SetsPage.js: gettings sets from set_ids");
      const snapshot = await getSetsByIds(setIds);
      let setsArray = [];
      snapshot.forEach((doc) => {
        setsArray.push({ ...doc.data(), id: doc.id });
      });
      setSets(setsArray);
      setIsLoading(false);
    };

    if (setIds == null || !setIds.length) {
      console.log(
        "SetsPage.js: nothing in set_id array for this user in the database"
      );
      setIsLoading(false);
      return;
    } else {
      try {
        setIsLoading(true);
        getSets();
      } catch (e) {
        console.log("SetsPage.js: error in getSets = ", e.message);
        setIsLoading(false);
      }
    }
  }, [setIds]);

  if (!isLoading) {
    return <SetsList sets={sets} />;
  } else {
    return <Loading />;
  }
};

const SetsList = ({ sets }) => {
  const activeId = "3TThsmMvOvl6tPtjy4od";
  return (
    <List>
      {sets.map((setItem) => (
        <ListItem key={setItem.id}>
          <ListItemIcon>
            {setItem.id === activeId ? (
              <PlaylistAddCheckIcon color="primary" />
            ) : (
              <SubjectIcon />
            )}
          </ListItemIcon>
          <ListItemText
            primary={setItem.title}
            secondary={setItem.id === activeId && "active"}
          ></ListItemText>
          <ListItemIcon>
            <DeleteForeverIcon />
          </ListItemIcon>
        </ListItem>
      ))}
    </List>
  );
};

export default SetsView;
