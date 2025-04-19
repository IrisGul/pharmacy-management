import { Routes, Route } from 'react-router-dom';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import ProductList from './pages/Product-List';
import SellMedicine from "./pages/SellMedicine";
import InvoicePage from "./pages/InvoicePage";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/productlist" element={<ProductList />} />
      <Route path="/sellmedicine" element={<SellMedicine />} />
      <Route path="/invoice/:id" element={<InvoicePage />} />
    </Routes>
  );
}

export default App;
