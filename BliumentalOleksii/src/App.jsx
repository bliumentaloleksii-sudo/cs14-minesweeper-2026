import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Minesweeper from './pages/BliumentalOleksii/Minesweeper';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Minesweeper />} />
        <Route path="/bliumental-oleksii" element={<Minesweeper />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;