import { useState, useRef, useEffect, useMemo } from "react";
import { useUserClient } from "./useUserClient";

/* Adapted from https://www.npmjs.com/package/react-cookie */
const useCookies = (dependencies) => {
  const { cookies } = useUserClient();

  const initialCookies = cookies.getAll();
  const [allCookies, setCookies] = useState(initialCookies);
  const previousCookiesRef = useRef(allCookies);

  useEffect(() => {
    const onChange = () => {
      const newCookies = cookies.getAll();

      if (
        shouldUpdate(
          dependencies || null,
          newCookies,
          previousCookiesRef.current
        )
      ) {
        setCookies(newCookies);
      }

      previousCookiesRef.current = newCookies;
    };

    cookies.addChangeListener(onChange);

    return () => {
      cookies.removeChangeListener(onChange);
    };
  }, [cookies]);

  const setCookie = useMemo(() => cookies.set.bind(cookies), [cookies]);
  const removeCookie = useMemo(() => cookies.remove.bind(cookies), [cookies]);

  return [allCookies, setCookie, removeCookie];
};

const shouldUpdate = (dependencies, newCookies, oldCookies) => {
  if (!dependencies) {
    return true;
  }

  for (let d of dependencies) {
    if (newCookies[d] !== oldCookies[d]) {
      return true;
    }
  }

  return false;
};

export default useCookies;
