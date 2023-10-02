import { createContext, useEffect, useState } from "react";

const CitiesContext = createContext();

const BASE_URL = "http://localhost:8000";

function CitiesPovider({ children }) {
  const [cities, setCities] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    setIsLoading(true);
    fetch(`${BASE_URL}/cities`)
      .then((res) => res.json())
      .then((data) => setCities(data))
      .catch((err) => alert("Cannot Fetch!!!!"))
      .finally(() => setIsLoading(false));
  }, []);

  return (
    <CitiesContext.Provider
      value={{
        cities,
        setCities,
        isLoading,
        setIsLoading,
      }}
    >
      {children}
    </CitiesContext.Provider>
  );
}
