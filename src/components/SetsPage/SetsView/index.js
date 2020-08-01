import React, { useEffect, useState, useRef } from "react";
import PropTypes from "prop-types";
import { getUserSets, removeSet } from "../../Firebase";
import Loading from "../../Loading";

import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import SubjectIcon from "@material-ui/icons/Subject";
import DeleteForeverIcon from "@material-ui/icons/DeleteForever";
import DoneOutlineIcon from "@material-ui/icons/DoneOutline";
import PlaylistAddCheckIcon from "@material-ui/icons/PlaylistAddCheck";
import { ListItemSecondaryAction, IconButton } from "@material-ui/core";

import { useUserClient, ACTION_TYPE } from "../../../hooks/useUserClient";

const SetsView = ({ user }) => {
  const userSetsId = useRef(user.userSetsId || null);
  const userSet = useRef(null);
  const [sets, setSets] = useState(null);
  const [isLoading, setIsLoading] = useState(sets ? false : true);
  const [userClient, userClientDispatch] = useUserClient();

  /* Update userSets state if the user prop changes */
  useEffect(() => {
    if (user != null && userSetsId != null) {
      // Grab new group of sets from db collection (user-sets)
      try {
        getUserSets(userSetsId.current).then((snapshot) => {
          if (snapshot.empty) {
            throw new Error("snapshot empty");
          }
          userSet.current = snapshot.data();

          if (shouldUpdate(userSet.current)) {
            setSets(userSet.current.sets);
          }
        });
      } catch (error) {
        console.error("Couldn't get doc from user-sets: ", error.message);
      }
    }
  }, [user]);

  const shouldUpdate = (userSet) => {
    // Could check here to see if the new group of sets is different than the old group of sets
    return true;
  };

  const onRemoveSet = (event, setId) => {
    event.preventDefault();

    if (setId && user) {
      try {
        removeSet(user.uid, setId);
      } catch (error) {
        console.log(error);
      }
    }
  };

  const onMakeSetActive = (event, setId, title = "Untitled") => {
    event.preventDefault();

    if (!setId) return;

    userClientDispatch({
      type: ACTION_TYPE.UPDATE_ACTIVE_SET,
      payload: { setId: setId, title: title },
    });
  };

  if (!isLoading) {
    return (
      <SetsList
        sets={sets}
        onRemoveSet={onRemoveSet}
        onMakeSetActive={onMakeSetActive}
      />
    );
  } else {
    return (
      <>
        <Loading />
        {sets && <SetsList sets={sets} />}
      </>
    );
  }
};

const SetsList = ({
  sets,
  onRemoveSet = (e, f) => f,
  onMakeSetActive = (f) => f,
}) => {
  const activeId = "3TThsmMvOvl6tPtjy4od";

  return (
    <List>
      {sets.map((setItem) => (
        <ListItem key={setItem.id} divider={true}>
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
          <ListItemSecondaryAction>
            <IconButton
              onClick={(e) => onMakeSetActive(e, setItem.id, setItem.title)}
            >
              <DoneOutlineIcon />
            </IconButton>
            <IconButton onClick={(e) => onRemoveSet(e, setItem.id)}>
              <DeleteForeverIcon />
            </IconButton>
          </ListItemSecondaryAction>
        </ListItem>
      ))}
    </List>
  );
};

SetsList.propTypes = {
  sets: PropTypes.array,
  onRemoveSet: PropTypes.func,
  onMakeSetActive: PropTypes.func,
};

export default SetsView;

/* const getSets = async () => {
  console.log("SetsView.js: gettings sets from set_ids");
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
} */
