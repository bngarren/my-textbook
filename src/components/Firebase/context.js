import React, { useContext } from "react";

/* use React's Context API to provide a Firebase instance once at the top-level of your component hierarchy */

const FirebaseContext = React.createContext(null);

// useFirebase hook that allows us to access our FirebaseContext
export const useFirebase = () => {
  return useContext(FirebaseContext);
};

export default FirebaseContext;

// Higher order component
/* The HOC takes the original Component as its parameter and it returns an updated component
export const withFirebase = (Component) => (props) => (
  <FirebaseContext.Consumer>
    {(firebase) => <Component {...props} firebase={firebase} />}
  </FirebaseContext.Consumer>
);
*/

/*
Similar to writing:

export const withFirebase = function(OriginalComponent) {
    return (
        const NewComponent = function(props) {
            return (
                <Context>
                    <OrginalComponent newProps=newProps />
                </ Context>
            )
        }
        return NewComponent
    )
}


*/
