import { Routes, Route } from 'react-router-dom';
import Login from './pages/Login';
import Register from './pages/Register';
import ProductList from './pages/Product-List';
import SellMedicine from "./pages/SellMedicine";
import InvoicePage from "./pages/InvoicePage";
import Layout from './pages/Layout';

// dein gemeinsames Layout

function App() {
  return (
    <Routes>
      {/* Öffentliche Seiten ohne Layout */}
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

      {/* Startseite (nach Login) – zeigt Layout mit Willkommensnachricht */}
      <Route path="/" element={<Layout />} />

      {/* Interne Seiten mit Inhalt im Layout */}
      <Route path="/productlist" element={<Layout><ProductList /></Layout>} />
      <Route path="/sellmedicine" element={<Layout><SellMedicine /></Layout>} />
      <Route path="/invoice/:id" element={<Layout><InvoicePage /></Layout>} />
    </Routes>
  );
}

export default App;
