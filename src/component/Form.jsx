// "https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=0&longitude=0"

import { useEffect, useState } from "react";

import styles from "./Form.module.css";
import Button from "./Button";
import Message from "./Message";
import BackBtn from "./BackBtn";
import Spinner from "./Spinner";
import { useUrlPosition } from "../hooks/useUrlPosition";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { useLocalCities } from "../contexts/LocalCitiesContext";
import { Flag } from "./Flag.jsx";
import { useNavigate, useSearchParams } from "react-router-dom";

export function convertToEmoji(countryCode) {
  const codePoints = countryCode
    .toUpperCase()
    .split("")
    .map((char) => 127397 + char.charCodeAt());
  return String.fromCodePoint(...codePoints);
}

const BASE_URL = "https://api.bigdatacloud.net/data/reverse-geocode-client";

function Form() {
  const [lat, lng] = useUrlPosition();
  const { createCity, getCity, currentCity, updateCity } = useLocalCities();
  const [isLoadingGeocoding, setIsLoadingGeocoding] = useState(false);

  const navigate = useNavigate();
  const [cityName, setCityName] = useState("");
  const [country, setCountry] = useState("");
  const [date, setDate] = useState(new Date());
  const [notes, setNotes] = useState("");
  const [countryCode, setCountryCode] = useState("");
  const [geocodingError, setGeocodingError] = useState("");

  const [searchParams] = useSearchParams();
  const isInput = searchParams.get("mode") === "input";
  const isEdit = searchParams.get("mode") === "edit";
  const id = searchParams.get("id");

  if (!isInput && !isEdit) throw new Error("Invalid mode");

  function resetForm() {
    setCityName("");
    setCountry("");
    setCountryCode("");
    setDate(new Date());
    setNotes("");
  }

  useEffect(
    function () {
      if (!isInput) return;
      if (!lat && !lng) return;

      resetForm();

      async function fetchCityData() {
        try {
          setIsLoadingGeocoding(true);
          setGeocodingError("");
          const res = await fetch(
            `${BASE_URL}?latitude=${lat}&longitude=${lng}`
          );
          const data = await res.json();

          if (!data.countryCode) {
            throw new Error(
              "That doesn't seem to be a city. Click somewhere else 😉"
            );
          }

          setCityName(data.city || data.locality || "");
          setCountry(data.countryName || "");
          setCountryCode(data.countryCode || "");
        } catch (err) {
          setGeocodingError(err.message);
        } finally {
          setIsLoadingGeocoding(false);
        }
      }

      fetchCityData();
    },
    [isInput, lat, lng]
  );

  useEffect(
    function () {
      if (!isEdit) return;
      if (!id) return;

      getCity(id);

      const { cityName, country, countryCode, date, notes } = currentCity;
      setCityName(cityName);
      setCountry(country);
      setCountryCode(countryCode);
      setDate(new Date(date));
      setNotes(notes);
    },
    [isEdit, id, getCity, currentCity]
  );

  function handleSubmit(e) {
    e.preventDefault();

    if (!cityName || !date) return;

    const newCity = {
      cityName,
      country,
      countryCode,
      date,
      notes,
      position: { lat, lng },
    };

    if (isEdit) {
      updateCity(id, newCity);
    }
    if (isInput) {
      createCity(newCity);
    }

    resetForm();
    navigate("/app/cities");
  }

  if (isLoadingGeocoding) return <Spinner />;
  if (!lat && !lng)
    return <Message message="Start by click somewhere on the map" />;
  if (geocodingError) return <Message message={geocodingError} />;

  return (
    <form className={styles.form} onSubmit={handleSubmit}>
      <div className={styles.row}>
        <label htmlFor="cityName">City name</label>
        <input
          id="cityName"
          onChange={(e) => setCityName(e.target.value)}
          value={cityName}
          readOnly
        />
        <span className={styles.flag}>
          <Flag countryCode={countryCode} />
        </span>
      </div>

      <div className={styles.row}>
        <label htmlFor="date">When did you go to {cityName}?</label>
        <DatePicker
          id="date"
          onChange={(date) => setDate(date)}
          selected={date}
          dateFormat="dd/MM/yyyy"
          required
        />
      </div>

      <div className={styles.row}>
        <label htmlFor="notes">Notes about your trip to {cityName}</label>
        <textarea
          id="notes"
          onChange={(e) => setNotes(e.target.value)}
          value={notes}
          maxLength="200"
        />
      </div>

      <div className={styles.buttons}>
        {isInput ? (
          <Button type="primary">Add</Button>
        ) : (
          <Button type="primary">Update</Button>
        )}
        <BackBtn />
      </div>
    </form>
  );
}

export default Form;
