import React from "react";
import { Route, Routes } from "react-router-dom";

import Navbar from './components/layouts/navbar'
import Home from "./pages/Home";
import Films from "./pages/Films/Films";
import Film from "./pages/Films/Film";

function App() {
  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/films" element={<Films />} />
        <Route path="/films/:id" element={<Film />} />
      </Routes>
    </>
  );
}

export default App;