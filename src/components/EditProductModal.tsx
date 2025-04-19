import React, { useState, useEffect } from "react";
import { Product } from "../interfaces/Product";

interface EditModalProps {
  isOpen: boolean;
  product: Product | null;
  onClose: () => void;
  onSave: (updatedProduct: Product) => void;
}

const EditProductModal: React.FC<EditModalProps> = ({ isOpen, product, onClose, onSave }) => {
  const [formData, setFormData] = useState<Product | null>(null);

  useEffect(() => {
    if (product) {
      setFormData(product);
    }
  }, [product]);

  if (!isOpen || !formData) return null;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: name === "price" ? parseFloat(value) : value } as Product);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // 🛰️ BACKEND: Produkt aktualisieren (später)
    /*
    try {
      const response = await fetch(`http://localhost:7184/api/products/${formData.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error("Failed to update product");
      }

      const updated = await response.json();
      onSave(updated);
    } catch (error) {
      console.error("Error updating product:", error);
    }
    */

    // 🔁 Lokal aktualisieren
    onSave(formData);
    onClose();
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h3>Edit Product</h3>
        <form onSubmit={handleSubmit}>
          <input name="productName" value={formData.productName} onChange={handleChange} required />
          <input name="description" value={formData.description} onChange={handleChange} required />
          <input name="batchNumber" value={formData.batchNumber} onChange={handleChange} required />
          <input name="expireDate" value={formData.expireDate} onChange={handleChange} required />
          <input name="manufacturer" value={formData.manufacturer} onChange={handleChange} required />
          <input name="category" value={formData.category} onChange={handleChange} required />
          <input name="price" type="number" value={formData.price} onChange={handleChange} required />
          <div className="modal-buttons">
            <button type="submit" className="btn-primary">Save</button>
            <button type="button" onClick={onClose} className="btn-delete">Cancel</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditProductModal;
