import React, { useEffect, useState, useRef } from "react";
import PropTypes from "prop-types";
import { getDocFromUserSets, removeSet } from "../../Firebase";
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

import AddSetForm from "../AddSet";

const SetsView = ({ user }) => {
  const userSetsDoc = useRef(null);
  const [sets, setSets] = useState(null);
  const [refresh, setRefresh] = useState(false); // used to trigger re-render for SetsView
  const [isLoading, setIsLoading] = useState(sets ? false : true);
  const [userClient, userClientDispatch] = useUserClient();

  /* Update userSet state if the user prop changes */
  useEffect(() => {
    if (user != null) {
      // Grab new group of sets from db collection (user-sets)
      setIsLoading(true);
      getDocFromUserSets(user.uid)
        .then((snapshot) => {
          if (!snapshot.exists) {
            console.debug(
              "SetsView.js: getDocFromUserSets() did not return a document (i.e. this user has no sets, or this is an error!)"
            );
            setIsLoading(false);
            return;
          }

          userSetsDoc.current = snapshot.data();
          console.debug(
            "SetsView.js: getDocFromUserSets (database), snapshot.data() = ",
            snapshot.data()
          );

          const res = setsArrayFromObject(snapshot.data().sets);

          console.debug("SetsView.js: res = ", res);

          if (shouldUpdate(userSetsDoc.current)) {
            setSets(res);
            setIsLoading(false);
          }
        })
        .catch((e) => {
          console.error(
            "SetsView.js: Couldn't get doc from user-sets: ",
            e.message
          );
        });
    }
  }, [user, refresh]);

  const setsArrayFromObject = (setsObject) => {
    const entries = Object.entries(setsObject);

    let res = [];

    for (const [key, value] of entries) {
      res.push({ setId: key, data: value });
    }

    return res;
  };

  const shouldUpdate = (userSetsDoc) => {
    // Could check here to see if the new group of sets is different than the old group of sets
    return true;
  };

  const onNewSetAdded = (updatedUserSetsDoc) => {
    if (updatedUserSetsDoc) {
      setRefresh(!refresh);
    }
  };

  // REMOVE SET
  const onRemoveSet = (event, setId) => {
    event.preventDefault();

    if (setId != null) {
      removeSet(user.uid, setId)
        .then(() => {
          // send refresh signal to re-render
          setRefresh(!refresh);
          // now we need to change the active set if this set we deleted was active
          if (userClient.activeSet.setId === setId) {
            userClientDispatch({
              type: ACTION_TYPE.CLEAR_ACTIVE_SET,
            });
          }
        })
        .catch((error) => {
          console.error("SetsView.js: Couldn't remove set: ", error.message);
        });
    }
  };

  // TOGGLE ACTIVE SET
  const onToggleActiveSet = (event, setId, title = "!Error!") => {
    event.preventDefault();

    if (!setId) return;

    // If this set is already active, toggle it off (i.e. clear the active set)
    if (userClient.activeSet.setId === setId) {
      userClientDispatch({
        type: ACTION_TYPE.CLEAR_ACTIVE_SET,
      });
    } else {
      userClientDispatch({
        type: ACTION_TYPE.UPDATE_ACTIVE_SET,
        payload: { setId: setId, title: title },
      });
    }
  };

  if (!isLoading) {
    return (
      <>
        <AddSetForm user={user} onNewSetAdded={onNewSetAdded} />

        {sets != null && sets.length > 0 ? (
          <SetsList
            sets={sets}
            onRemoveSet={onRemoveSet}
            onToggleActiveSet={onToggleActiveSet}
          />
        ) : (
          "Add your first set!"
        )}
      </>
    );
  } else {
    return (
      <>
        <Loading />
        {sets != null && sets.length > 1 ? <SetsList sets={sets} /> : null}
      </>
    );
  }
};

const SetsList = ({
  sets,
  onRemoveSet = (e, f) => f,
  onToggleActiveSet = (f) => f,
}) => {
  const activeId = "3TThsmMvOvl6tPtjy4od";

  return (
    <List>
      {sets.map((setItem) => (
        <ListItem key={setItem.setId} divider={true}>
          <ListItemIcon>
            {setItem.setId === activeId ? (
              <PlaylistAddCheckIcon color="primary" />
            ) : (
              <SubjectIcon />
            )}
          </ListItemIcon>
          <ListItemText
            primary={setItem.data.title}
            secondary={setItem.setId === activeId && "active"}
          ></ListItemText>
          <ListItemSecondaryAction>
            <IconButton
              onClick={(e) =>
                onToggleActiveSet(e, setItem.setId, setItem.data.title)
              }
            >
              <DoneOutlineIcon />
            </IconButton>
            <IconButton onClick={(e) => onRemoveSet(e, setItem.setId)}>
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
  onToggleActiveSet: PropTypes.func,
};

export default SetsView;
