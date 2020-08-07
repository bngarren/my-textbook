import { createContext, useContext, useCallback } from "react";

import { addCard } from "../components/Firebase";

const initialState = {
  setId: null,
  userId: null,
};

export const setCardsContext = createContext(initialState);

/**
 * Uses the setCardsContext (therefore this hook must be called within this context provider)
 *
 * @return {Function} addCardToSetCards function
 */
export const useSetCards = () => {
  const { setId, userId } = useContext(setCardsContext);

  /* Usually want to memoize any function that is returned from a hook so that it doesn't have to be memoized where it's called*/
  const addCardToSetCards = useCallback(
    (side_one, side_two, callback) => {
      addCard(userId, setId, { side_one: side_one, side_two: side_two })
        .then(() => {
          if (callback && typeof callback === "function") {
            callback(true);
          }
        })
        .catch((e) => {
          console.error(`useSetCards.js: Failed to addCard: ${e.message}`);
          callback(false);
        });
    },
    [userId, setId]
  );

  /* const addCardToSetCards = (side_one, side_two, callback) => {
    addCard(userId, setId, { side_one: side_one, side_two: side_two })
      .then(() => {
        if (callback && typeof callback === "function") {
          callback(true);
        }
      })
      .catch((e) => {
        console.error(`useSetCards.js: Failed to addCard: ${e.message}`);
        callback(false);
      });
  }; */

  return addCardToSetCards;
};
