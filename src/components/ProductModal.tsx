import React, { useState } from "react";
import { Product } from "../interfaces/Product";

interface ProductModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (product: Product) => void;
}

const ProductModal: React.FC<ProductModalProps> = ({ isOpen, onClose, onSave }) => {
  const [formData, setFormData] = useState<Product>({
    id: "", productName: "", description: "", batchNumber: "", expireDate: "",
    manufacturer: "", category: "", price: 0
  });

  if (!isOpen) return null;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: name === "price" ? parseFloat(value) : value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // 🛰️ BACKEND: Produkt speichern (später)
    /*
    try {
      const response = await fetch("http://localhost:7184/api/products", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error("Failed to save product");
      }

      const savedProduct = await response.json();
      onSave(savedProduct); // aus Backend übernehmen
    } catch (error) {
      console.error("Error saving product:", error);
    }
    */

    // 🔁 AKTUELL: nur lokal speichern (Frontend-State)
    onSave(formData);
    onClose();
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h3>Add New Product</h3>
        <form onSubmit={handleSubmit}>
          <input name="productName" placeholder="Product Name" onChange={handleChange} required />
          <input name="description" placeholder="Description" onChange={handleChange} required />
          <input name="batchNumber" placeholder="Batch Number" onChange={handleChange} required />
          <input name="expireDate" placeholder="Expire Date" onChange={handleChange} required />
          <input name="manufacturer" placeholder="Manufacturer" onChange={handleChange} required />
          <input name="category" placeholder="Category" onChange={handleChange} required />
          <input name="price" type="number" placeholder="Price" onChange={handleChange} required />
          <div className="modal-buttons">
            <button type="submit" className="btn-primary">Save</button>
            <button type="button" onClick={onClose} className="btn-delete">Cancel</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ProductModal;
