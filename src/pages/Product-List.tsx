import React, { useEffect, useState } from "react";
import Papa from "papaparse";
import { Product } from "../interfaces/Product";
import productDataCSV from "../assets/product-list.csv?url";
import { useSearch } from "../context/SearchContext";
import ProductModal from "../components/ProductModal";
import EditProductModal from "../components/EditProductModal";
import DeleteConfirmModal from "../components/DeleteConfirmModal";

const ProductList = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const { searchTerm } = useSearch();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  const handleSaveProduct = (newProduct: Product) => {
    setProducts([
      ...products,
      { ...newProduct, id: (products.length + 1).toString() },
    ]);
  };

  // 🔍 Suche
 const filteredProducts = products.filter((product) =>
  product.productName.toLowerCase().includes(searchTerm.toLowerCase())
);


  useEffect(() => {
    Papa.parse(productDataCSV, {
      download: true,
      header: true,
      complete: (result) => {
        setProducts(result.data as Product[]);
      },
    });
  }, []);

  return (
    <div className="product-list-page">
      <button className="add-button" onClick={() => setIsModalOpen(true)}>
        + Add New Product
      </button>

      <h2>Product List</h2>
      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Produkt Name</th>
            <th>Description</th>
            <th>Batch Number</th>
            <th>Expire Date</th>
            <th>Manufacturer</th>
            <th>Category</th>
            <th>Price (€)</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {filteredProducts.map((product, index) => (
            <tr key={index}>
              <td>{index + 1}</td>
              <td>{product.productName}</td> // ✔ korrekt nach deinem Interface
              <td>{product.description}</td>
              <td>{product.batchNumber}</td>
              <td>{product.expireDate}</td>
              <td>{product.manufacturer}</td>
              <td>{product.category}</td>
              <td>{product.price}</td>
              <td>
                <button onClick={() => { setSelectedProduct(product); setIsEditModalOpen(true); }}>Edit</button>
                <button>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <ProductModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} onSave={handleSaveProduct} />
      {selectedProduct && (
        <EditProductModal
          isOpen={isEditModalOpen}
          onClose={() => setIsEditModalOpen(false)}
          product={selectedProduct}
          onSave={(updatedProduct) => {
            setProducts(products.map(p => p.id === updatedProduct.id ? updatedProduct : p));
            setIsEditModalOpen(false);
          }}
        />
      )}
    </div>
  );
};

export default ProductList;
