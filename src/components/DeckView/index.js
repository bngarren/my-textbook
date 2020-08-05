import React, { useState, useEffect } from "react";

import { makeStyles } from "@material-ui/core/styles";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";

import CardView from "./CardView";

import { getDocFromSetCards, removeCard } from "../Firebase";

const useStyles = makeStyles({
  listItemCardView: {
    padding: "0px 2px",
    marginBottom: "20px",
  },
});

const DeckView = ({ setId }) => {
  const classes = useStyles();
  const [deckInfo, setDeckInfo] = useState(null);
  const [cards, setCards] = useState(null);
  const [isLoading, setIsLoading] = useState(cards ? false : true);
  const [refresh, setRefresh] = useState(false); // to trigger re-render

  useEffect(() => {
    if (setId == null || setId.trim() === "") {
      return;
    }

    // Get doc from 'set-cards' collection that contains the cards for this set
    setIsLoading(true);
    getDocFromSetCards(setId)
      .then((snapshot) => {
        if (!snapshot.exists) {
          throw new Error(
            `No document found in 'set-cards' for setId ${setId}`
          );
        }

        setDeckInfo({
          setTitle: snapshot.data().setTitle,
          cards_count: snapshot.data().cards_count,
          last_modified: snapshot.data().last_modified,
        });

        if (!("cards" in snapshot.data())) {
          throw new Error(
            "Data model error, there is no 'cards' object in this document!"
          );
        }

        // Try to extract the cards object from the document
        // see if cards object contains any cardId's
        let res = [];
        if (Object.keys(snapshot.data().cards).length > 0) {
          res = cardsArrayFromObject(snapshot.data().cards);

          if (res && res.length > 0) {
            setCards(res);
          }
        } else {
          setCards(null);
        }
        setIsLoading(false);
      })
      .catch((error) => {
        console.error(
          "DeckView.js: Failed to retrive doc from 'set-cards': ",
          error.message
        );
        setIsLoading(false);
      });
  }, [setId, refresh]);

  const cardsArrayFromObject = (cardsObject) => {
    const entries = Object.entries(cardsObject);
    let res = [];
    for (const [key, value] of entries) {
      res.push({ cardId: key, data: value });
    }
    return res;
  };

  const onDeleteCard = (cardId) => {
    try {
      if (cardId == null || cardId.trim() === "") {
        console.error(
          "DeckView.js: Cannot perform onDeleteCard because cardId is null/empty"
        );
        return;
      }
      removeCard(cardId, setId).then((res) => {
        setRefresh(!refresh);
      });
    } catch (error) {
      console.error(`DeckView.js: Could not remove card: ${error.message}`);
    }
  };

  if (!isLoading) {
    return (
      <>
        {cards !== null && (
          <List>
            {cards.map((card) => (
              <ListItem key={card.cardId} className={classes.listItemCardView}>
                <CardView
                  card={{ cardId: card.cardId, ...card.data }}
                  onDeleteCard={onDeleteCard}
                />
              </ListItem>
            ))}
          </List>
        )}
      </>
    );
  } else {
    return <></>;
  }
};

export default DeckView;
