import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import CarManager from "./components/CarManager";
import './App.css'
import BrandManager from './components/BrandManager';
import RentalManager from "./components/RentalManager";


function App() {
 return (
    <BrowserRouter>
      <nav style={{ marginBottom: 16 }}>
        <Link to="/cars" style={{ marginRight: 16 }}>Quản lý xe</Link>
        <Link to="/brands">Quản lý hãng xe</Link>
        <Link to="/rentals" style={{ marginLeft: 16 }}>Quản lý thuê xe</Link>
      </nav>
      <Routes>
        <Route path="/cars" element={<CarManager />} />
        <Route path="/brands" element={<BrandManager />} />
        <Route path="/rentals" element={<RentalManager />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;