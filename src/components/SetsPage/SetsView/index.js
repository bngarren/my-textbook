import React, { useEffect, useState, useRef } from "react";
import { Link } from "react-router-dom";
import PropTypes from "prop-types";
import { getDocFromUserSets, removeSet } from "../../Firebase";
import Loading from "../../Loading";

import { makeStyles } from "@material-ui/core/styles";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import DeleteForeverIcon from "@material-ui/icons/DeleteForever";
import { ListItemSecondaryAction, IconButton } from "@material-ui/core";

import { SET_PAGE } from "../../../constants/routes";
import { useUserClient, ACTION_TYPE } from "../../../hooks/useUserClient";

import AddSetForm from "../AddSet";

const useStyles = makeStyles({
  setViewRoot: {
    flexGrow: "1",
    minWidth: "350px",
    maxWidth: "800px",
    display: "flex",
    flexDirection: "column",
  },
  addSetFormDiv: {
    alignSelf: "flex-end",
    width: "325px",
    display: "flex",
    justifyContent: "flex-end",
  },
  noSetsDiv: {
    alignSelf: "center",
    padding: "30px 0",
  },
  setsListRoot: {},
  setsListItem: {
    borderLeft: "3px solid transparent",
    "&:hover": {
      borderLeft: "3px solid rgb(43, 140, 236)",
    },
  },
});

const SetsView = ({ user }) => {
  const classes = useStyles();
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

  /* Helper function that takes the 'sets' field from the database document
   * which is an Object with a bunch of key-value entries for each set and
   * turns it into an array of each set object that is easier to iterate
   */
  const setsArrayFromObject = (setsObject) => {
    // get key-value pairs
    const entries = Object.entries(setsObject);
    // result array
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

  const triggerIsLoading = () => {
    setIsLoading(true);
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
      setIsLoading(true);
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

  /* --- RETURN () --- --- --- --- --- --- --- */
  if (!isLoading) {
    return (
      <div className={classes.setViewRoot}>
        <div className={classes.addSetFormDiv}>
          <AddSetForm
            user={user}
            onPreAdd={triggerIsLoading}
            onPostAdd={onNewSetAdded}
          />
        </div>

        {sets != null && sets.length > 0 ? (
          <SetsList sets={sets} onRemoveSet={onRemoveSet} />
        ) : (
          <div className={classes.noSetsDiv}>
            You have no sets. Add your first set!
          </div>
        )}
      </div>
    );
  } else {
    return (
      <div className={classes.setViewRoot}>
        <Loading type="smallGrey" />
        {/*sets != null && sets.length > 1 ? <SetsList sets={sets} /> : null*/}
      </div>
    );
  }
};

const getDateStringFromTimestamp = (timestamp) => {
  const date = new Date(timestamp.seconds * 1000);
  return date.toLocaleDateString();
};

const SetsList = ({ sets, onRemoveSet = (e, f) => f }) => {
  const classes = useStyles();
  return (
    <List className={classes.setsListRoot}>
      {sets.map((setItem) => (
        <ListItem
          key={setItem.setId}
          divider={true}
          component={Link}
          to={`${SET_PAGE}/${setItem.setId}`}
          classes={{
            container: classes.setsListItem,
          }}
        >
          <ListItemText
            primary={setItem.data.title}
            secondary={getDateStringFromTimestamp(setItem.data.created_on)}
          ></ListItemText>
          <ListItemSecondaryAction>
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
