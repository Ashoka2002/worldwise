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

  async function createCity(newCity) {
    setIsLoading(true);
    fetch(`${BASE_URL}/cities`, {
      method: "POST",
      body: JSON.stringify(newCity),
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((res) => res.json())
      .then((data) => setCities((cities) => [...cities, data]))
      .catch((err) => alert("Cannot create new city!!!!"))
      .finally(() => setIsLoading(false));
  }

  async function deleteCity(id) {
    setIsLoading(true);
    fetch(`${BASE_URL}/cities/${id}`, {
      method: "DELETE",
    })
      .then(() =>
        setCities((cities) => cities.filter((city) => city.id !== id))
      )
      .catch((err) => alert("Cannot delete!!!!"))
      .finally(() => setIsLoading(false));
  }

  return (
    <CitiesContext.Provider
      value={{
        cities,
        isLoading,
        currCity,
        getCity,
        createCity,
        deleteCity,
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
