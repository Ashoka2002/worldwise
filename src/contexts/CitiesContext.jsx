import {
  createContext,
  useContext,
  useEffect,
  useReducer,
  useState,
} from "react";

const BASE_URL = "http://localhost:8000";

const CitiesContext = createContext();

const initialState = {
  cities: [],
  isLoading: false,
  currCity: {},
  error: "",
};

function reducer(state, action) {
  switch (action.type) {
    case "loading":
      return { ...state, isLoading: true };

    case "cities/loaded":
      return { ...state, isLoading: false, cities: action.payload };

    case "city/loaded":
      return { ...state, isLoading: false, currCity: action.payload };

    case "city/created":
      return {
        ...state,
        isLoading: false,
        cities: [...state.cities, action.payload],
        currCity: action.payload,
      };

    case "city/deleted":
      return {
        ...state,
        isLoading: false,
        cities: state.cities.filter((city) => city.id !== action.payload),
        currCity: {},
      };

    case "rejected":
      return { ...state, isLoading: false, error: action.payload || "error" };

    default:
      throw new Error("Unknow Action!!");
  }
}

function CitiesPovider({ children }) {
  // const [cities, setCities] = useState([]);
  // const [isLoading, setIsLoading] = useState(false);
  // const [currCity, setCurrCity] = useState({});

  const [{ cities, isLoading, currCity }, dispatch] = useReducer(
    reducer,
    initialState
  );

  useEffect(() => {
    dispatch({ type: "loading" });
    fetch(`${BASE_URL}/cities`)
      .then((res) => res.json())
      .then((data) => dispatch({ type: "cities/loaded", payload: data }))
      .catch(() =>
        dispatch({
          type: "rejected",
          payload: "There was an error loading cities.",
        })
      );
  }, []);

  async function getCity(id) {
    if (currCity.id === +id) return;
    dispatch({ type: "loading" });
    fetch(`${BASE_URL}/cities/${id}`)
      .then((res) => res.json())
      .then((data) => dispatch({ type: "city/loaded", payload: data }))
      .catch(() =>
        dispatch({
          type: "rejected",
          payload: "There was an error loading city.",
        })
      );
  }

  async function createCity(newCity) {
    dispatch({ type: "loading" });
    fetch(`${BASE_URL}/cities`, {
      method: "POST",
      body: JSON.stringify(newCity),
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((res) => res.json())
      .then((data) => dispatch({ type: "city/created", payload: data }))
      .catch(() =>
        dispatch({
          type: "rejected",
          payload: "Cannot create new city !!!",
        })
      );
  }

  async function deleteCity(id) {
    dispatch({ type: "loading" });
    fetch(`${BASE_URL}/cities/${id}`, {
      method: "DELETE",
    })
      .then(() => dispatch({ type: "city/deleted", payload: id }))
      .catch(() =>
        dispatch({
          type: "rejected",
          payload: "Cannot delete city!!!.",
        })
      );
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
