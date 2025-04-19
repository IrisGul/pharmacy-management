import React, { useEffect, useState } from "react";
import Papa from "papaparse";
import Layout from "./Layout";
import { Product } from "../interfaces/Product";
import productDataCSV from "../assets/product-list.csv?url";
import { useSearch } from "../context/SearchContext"; // ✅ hinzufügen
import ProductModal from "../components/ProductModal";
import EditProductModal from "../components/EditProductModal";
import DeleteConfirmModal from "../components/DeleteConfirmModal";

const ProductList = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const { searchTerm } = useSearch(); // ✅ globaler Suchbegriff

  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleSaveProduct = (newProduct: Product) => {
    setProducts([
      ...products,
      { ...newProduct, id: (products.length + 1).toString() },
    ]);
  };

  /*edit*/
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  const handleEditClick = (product: Product) => {
    setSelectedProduct(product);
    setIsEditModalOpen(true);
  };

  /*Update*/
  const handleProductUpdate = (updated: Product) => {
    const updatedList = products.map((p) =>
      p.id === updated.id ? updated : p
    );
    setProducts(updatedList);
  };
  /*Delete*/
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [productToDelete, setProductToDelete] = useState<Product | null>(null);

  const handleDeleteClick = (product: Product) => {
    setProductToDelete(product);
    setIsDeleteModalOpen(true);
  };

  const handleConfirmDelete = async (id: string) => {
    // 🛰️ BACKEND: DELETE-Request vorbereiten
    /*
  try {
    const res = await fetch(`http://localhost:7184/api/products/${id}`, {
      method: "DELETE",
    });

    if (!res.ok) {
      throw new Error("Delete failed");
    }
  } catch (err) {
    console.error("Error deleting:", err);
  }
  */

    // 🔁 Lokal aktualisieren
    const updated = products.filter((p) => p.id !== id);
    setProducts(updated);
    setIsDeleteModalOpen(false);
  };

  const userRole = localStorage.getItem("role") || "admin"; // nur "admin" kann löschen

  useEffect(() => {
    // Aktuell: CSV-Daten einlesen
    fetch(productDataCSV)
      .then((res) => res.text())
      .then((text) => {
        const parsed = Papa.parse(text, { header: true });
        const data: Product[] = parsed.data.map((row: any) => ({
          id: row["ID"],
          productName: row["Product Name"],
          description: row["Description"],
          batchNumber: row["Batch Number"],
          expireDate: row["Expire Date"],
          manufacturer: row["Manufacturer"],
          category: row["Category"],
          price: parseFloat(row["Price"]),
        }));
        setProducts(data);
      });

    // 🔁 Später: Daten vom Backend holen (z. B. über ASP.NET Core API)
    /*
    fetch("http://localhost:7184/api/products")
      .then((res) => res.json())
      .then((data: Product[]) => setProducts(data));
    */
  }, []);

  return (
    <Layout>
      <div style={{ marginBottom: "1rem" }}>
        <button className="btn-primary" onClick={() => setIsModalOpen(true)}>
          ➕ Add New Product
        </button>
      </div>

      <ProductModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSaveProduct}
      />

     <h2>
      Product List</h2>


      <table className="product-table">
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
          {products /* hier sind die beim suchen filter funktion */
            .filter(
              (p) =>
                p.productName &&
                p.productName.toLowerCase().startsWith(searchTerm.toLowerCase())
            )

            .map((p, idx) => (
              <tr key={idx}>
                <td>{p.id}</td>
                <td>{p.productName}</td>
                <td>{p.description}</td>
                <td>{p.batchNumber}</td>
                <td>{p.expireDate}</td>
                <td>{p.manufacturer}</td>
                <td>{p.category}</td>
                <td>{p.price.toFixed(2)}</td>
                <td>
                  <td>
                    {userRole === "admin" && (
                      <>
                        <button
                          className="btn-edit"
                          onClick={() => handleEditClick(p)}
                        >
                          ✏️ Edit
                        </button>
                        <button
                          className="btn-delete"
                          onClick={() => handleDeleteClick(p)}
                        >
                          🗑️ Delete
                        </button>
                      </>
                    )}
                  </td>
                </td>
              </tr>
            ))}
        </tbody>
      </table>

      {/* 🔽 Hier Modal rendern  für Edit  und Delete*/}
      <ProductModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSaveProduct}
      />

      <EditProductModal
        isOpen={isEditModalOpen}
        product={selectedProduct}
        onClose={() => setIsEditModalOpen(false)}
        onSave={handleProductUpdate}
      />

      <DeleteConfirmModal
        isOpen={isDeleteModalOpen}
        product={productToDelete}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={handleConfirmDelete}
      />
    </Layout>
  );
};

export default ProductList;
