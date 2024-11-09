import React, { useState } from "react";
import { CookiesProvider, useCookies } from "react-cookie";
import { BrowserRouter as Router, Route, Routes, Navigate } from "react-router-dom";
import Login from "./components/Login";
import UserTable from "./components/UserTable";

const App = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [cookies, setCookie, removeCookie] = useCookies(["user"]);

  const handleLogin = (username, password) => {
    if ((username === "ibrahim" && password === "password1") || (username === "ahmed" && password === "password2")) {
      setCookie("user", username, { path: "/" });
      setIsLoggedIn(true);
    } else {
      alert("Invalid credentials");
    }
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    removeCookie("user");
  };

  return (
    <CookiesProvider>
      <Router>
        <Routes>
          <Route
            path="/login"
            element={
              isLoggedIn ? <Navigate to="/users" /> : <Login onLogin={handleLogin} />
            }
          />
          <Route
            path="/users"
            element={
              isLoggedIn ? <UserTable onLogout={handleLogout} /> : <Navigate to="/login" />
            }
          />
          <Route
            path="/"
            element={
              isLoggedIn ? <Navigate to="/users" /> : <Navigate to="/login" />
            }
          />
        </Routes>
      </Router>
    </CookiesProvider>
  );
};

export default App;
