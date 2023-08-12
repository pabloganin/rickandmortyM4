import React, { useState, useEffect } from "react";
import {
  Route,
  Routes,
  useLocation,
  useNavigate,
  Navigate
} from "react-router-dom";

//Componentes
import "./App.css";
import Cards from "./components/Cards/Cards.jsx";
import NavBar from "./components/Nav/Nav";
import About from "./components/About/About";
import Detail from "./components/Detail/Detail";
import Form from "./components/Form/Form";
import Error404 from "./components/Error 404/Error404";
import Favorites from "./components/Favorites/Favorites";
import axios from "axios";

function App() {
  const [characters, setCharacters] = useState([]);
  const [access, setAccess] = useState(false);

  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    !access && navigate("/");
  }, [access]);

  const URL = "http://localhost:3001/rickandmorty/";

  async function login(userData) {
    const { email, password } = userData;

    try {
      const { data } = await axios(
        `${URL}login?email=${email}&password=${password}`
      );

      const { access } = data;

      setAccess(access);

      access && navigate("/home");
    } catch (error) {
      window.alert(error.message);
    }
  }

  function logout() {
    setAccess(false);
    navigate("/");
  }

  async function onSearch(id) {
    try {
      const { data } = await axios(
        `http://localhost:3001/rickandmorty/character/${id}`
      );
      if (data.name) {
        setCharacters((oldChars) => [...oldChars, data]);
      }
    } catch (error) {
      window.alert(error.message);
    }
  }

  function onClose(id) {
    setCharacters((oldCharacter) =>
      oldCharacter.filter((character) => character.id !== id)
    );
  }

  return (
    <div className="App" style={{ padding: "25px" }}>
      {location.pathname !== "/" && (
        <div>
          <NavBar onSearch={onSearch} logout={logout} />
          {/* renderizar aquí el botón para personajes aleatorios */}
        </div>
      )}

      <Routes>
        <Route exact path="/" element={<Form login={login} />} />
        <Route
          path="/home"
          element={<Cards characters={characters} onClose={onClose} />}
        />
        <Route path="/About" element={<About />} />
        <Route path="/detail/:id" element={<Detail />} />
        <Route path="/favorites" element={<Favorites />} />
        <Route path="/Error404" element={<Error404 />} />
        <Route path="*" element={<Navigate to="/Error404" />} />
      </Routes>
    </div>
  );
}

export default App;
