import { createContext, useContext, useEffect, useState } from "react";

const CitiesContext = createContext();

const BASE_URL = "http://localhost:8000";

function CitiesPovider({ children }) {
  const [cities, setCities] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [currCity, setCurrCity] = useState({});

  useEffect(() => {
    setIsLoading(true);
    fetch(`${BASE_URL}/cities`)
      .then((res) => res.json())
      .then((data) => setCities(data))
      .catch((err) => alert("Cannot Fetch!!!!"))
      .finally(() => setIsLoading(false));
  }, []);

  async function getCity(id) {
    setIsLoading(true);
    fetch(`${BASE_URL}/cities/${id}`)
      .then((res) => res.json())
      .then((data) => setCurrCity(data))
      .catch((err) => alert("Cannot Fetch!!!!"))
      .finally(() => setIsLoading(false));
  }

  return (
    <CitiesContext.Provider
      value={{
        cities,
        isLoading,
        currCity,
        getCity,
      }}
    >
      {children}
    </CitiesContext.Provider>
  );
}

function useCities() {
  const context = useContext(CitiesContext);
  if (context === undefined)
    throw new Error("CitiesContext used outside of CitiesProvider !!!");
  return context;
}

export { CitiesPovider, useCities };
