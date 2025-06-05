import React, { useEffect, useState } from "react";
import Papa from "papaparse";
import { Product } from "../interfaces/Product";
import productDataCSV from "../assets/product-list.csv?url";
import { useSearch } from "../context/SearchContext"; // ✅ hinzufügen
import jsPDF from "jspdf";
// @ts-ignore
import QRCode from "qrcode";

interface CartItem extends Product {
  quantity: number;
}

const SellMedicine = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [modalOpen, setModalOpen] = useState(false);
  const { searchTerm } = useSearch(); // ✅ globaler Suchbegriff
  const [checkoutOpen, setCheckoutOpen] = useState(false); /*kasse*/
  const [paymentStep, setPaymentStep] = useState<
    "method" | "cash" | "card" | null
  >(null);
  const [checkoutStep, setCheckoutStep] = useState<
    "method" | "card" | "invoice"
  >("method");
  const [cardPaymentInProgress, setCardPaymentInProgress] = useState(false);
  const [cardPaymentSuccess, setCardPaymentSuccess] = useState(false);

  // Rechnung QRCode

  const generateInvoicePDF = async () => {
    const doc = new jsPDF();
    const invoiceId = `INV-${new Date()
      .toISOString()
      .slice(0, 10)
      .replace(/-/g, "")}-${Math.floor(Math.random() * 1000)}`;
    const date = new Date().toLocaleDateString("en-GB");
    const pharmacist = "Yrysgul Sydykbekova";

    let y = 20;

    doc.setFontSize(16);
    doc.text("Farmacia Luis Ilena", 20, y);
    doc.setFontSize(10);
    y += 6;
    doc.text("La Sabana, Luperón 51000", 20, y);
    y += 5;
    doc.text("Dominican Republic", 20, y);
    y += 5;
    doc.text("Phone: +18095718573", 20, y);
    y += 10;

    doc.setFontSize(12);
    doc.text(`Invoice ID: ${invoiceId}`, 20, y);
    y += 6;
    doc.text(`Date: ${date}`, 20, y);
    y += 6;
    doc.text(`Pharmacist: ${pharmacist}`, 20, y);
    y += 10;

    doc.text("Products:", 20, y);
    y += 6;

    let subtotal = 0;
    cart.forEach((item) => {
      const line = `${item.productName} x${item.quantity} - €${(
        item.price * item.quantity
      ).toFixed(2)}`;
      doc.text(line, 20, y);
      y += 6;
      subtotal += item.price * item.quantity;
    });

    const vat = subtotal * 0.2;
    const total = subtotal + vat;

    y += 4;
    doc.text(`Subtotal: €${subtotal.toFixed(2)}`, 20, y);
    y += 5;
    doc.text(`VAT (20%): €${vat.toFixed(2)}`, 20, y);
    y += 5;
    doc.text(`Total: €${total.toFixed(2)}`, 20, y);

    y += 10;
    doc.setFontSize(11);
    doc.text("Thank you for your purchase!", 20, y);

    // 🧾 QR-Code einfügen (optional Link oder ID)

    const qrText = `http://192.168.3.37:5182/invoice/${invoiceId}`; // Mit Handy QRCode scennen hier
    console.log("📱 QR-Link für Handy:", qrText);

    const qrDataUrl = await QRCode.toDataURL(qrText);
    doc.addImage(qrDataUrl, "PNG", 150, 20, 40, 40);
    doc.setFontSize(8);
    doc.text("Scan for invoice", 155, 65);

    doc.save(`${invoiceId}.pdf`);
  };

  useEffect(() => {
    fetch(productDataCSV)
      .then((res) => res.text()) // statt text json    später
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

    // 🔁 SPÄTER: Daten vom Backend laden
    /*
    fetch("http://localhost:7184/api/products")
      .then((res) => res.json())
      .then((data) => setProducts(data));
    */
  }, []);

  // Öffnet das Modal für ein ausgewähltes Produkt
  const openModal = (product: Product) => {
    setSelectedProduct(product);
    setQuantity(1);
    setModalOpen(true);
  };

  // Fügt das Produkt mit der festgelegten Menge dem Warenkorb hinzu
  const addToCart = () => {
    if (!selectedProduct) return;
    setCart((prev) => {
      const exists = prev.find((item) => item.id === selectedProduct.id);
      if (exists) {
        return prev.map((item) =>
          item.id === selectedProduct.id
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      }
      return [...prev, { ...selectedProduct, quantity }];
    });
    setModalOpen(false);
  };

  // Erhöht die Menge eines Produktes im Warenkorb um 1
  const increaseQuantity = (id: string) => {
    setCart((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, quantity: item.quantity + 1 } : item
      )
    );
  };

  // Verringert die Menge eines Produktes im Warenkorb um 1 (mindestens 1)
  const decreaseQuantity = (id: string) => {
    setCart((prev) =>
      prev.map((item) =>
        item.id === id
          ? { ...item, quantity: Math.max(item.quantity - 1, 1) }
          : item
      )
    );
  };

  // Entfernt das Produkt vollständig aus dem Warenkorb
  const removeFromCart = (id: string) => {
    setCart((prev) => prev.filter((item) => item.id !== id));
  };

  return (
    <>
      <div
        className="sell-medicine-container"
        style={{ display: "flex", gap: "2rem" }}
      >
        {checkoutOpen && (
          <div className="modal-overlay">
            <div className="modal-content">
              <div
                className="close-button"
                onClick={() => setCheckoutOpen(false)}
              >
                ❌
              </div>

              <h3>🧾 Bestellübersicht</h3>

              {/* Produktliste */}
              <table
                style={{
                  width: "100%",
                  fontSize: "0.95rem",
                  marginBottom: "1rem",
                }}
              >
                <thead>
                  <tr>
                    <th style={{ textAlign: "left" }}>Produkt</th>
                    <th>Menge</th>
                    <th>Preis (€)</th>
                  </tr>
                </thead>
                <tbody>
                  {cart.map((item) => (
                    <tr key={item.id}>
                      <td>{item.productName}</td>
                      <td>{item.quantity}</td>
                      <td>{(item.price * item.quantity).toFixed(2)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>

              {/* Vorübergehende Preisberechnung */}
              {(() => {
                const subtotal = cart.reduce(
                  (sum, item) => sum + item.price * item.quantity,
                  0
                );
                const vat = subtotal * 0.2;
                const total = subtotal + vat;

                return (
                  <>
                    <p>
                      <strong>Zwischensumme:</strong> {subtotal.toFixed(2)} €
                    </p>
                    <p>
                      <strong>+ 20 % MwSt:</strong> {vat.toFixed(2)} €
                    </p>
                    <p>
                      <strong>Gesamtbetrag:</strong> {total.toFixed(2)} €
                    </p>

                    {/* Zahlungsschritte */}
                    {paymentStep === null && (
                      <div
                        style={{
                          display: "flex",
                          gap: "1rem",
                          marginTop: "1rem",
                        }}
                      >
                        <button
                          className="btn-primary"
                          onClick={() => setPaymentStep("method")}
                        >
                          💳 Zahlung
                        </button>
                        <button
                          className="btn-delete"
                          onClick={() => setCheckoutOpen(false)}
                        >
                          Zurück
                        </button>
                      </div>
                    )}

                    {/* Zahlungsmethode wählen */}
                    {paymentStep === "method" && (
                      <div
                        style={{
                          display: "flex",
                          gap: "1rem",
                          marginTop: "1rem",
                        }}
                      >
                        <button
                          className="btn-primary"
                          onClick={() => setPaymentStep("cash")}
                        >
                          💶 Bar
                        </button>
                        <button
                          className="btn-primary"
                          onClick={() => setPaymentStep("card")}
                        >
                          💳 Karte
                        </button>
                      </div>
                    )}

                    {/* Barzahlung: Rechnung anzeigen */}
                    {paymentStep === "cash" && (
                      <>
                        <h4 style={{ marginTop: "1rem" }}>
                          🧾 Rechnung (Barzahlung)
                        </h4>
                        <p>Vielen Dank für Ihren Einkauf!</p>
                        <p>Gesamt: {total.toFixed(2)} €</p>

                        {/* 🔁 Später: Rechnung speichern (Backend) */}
                        {/*
                fetch("http://localhost:7184/api/sales", {
                  method: "POST",
                  headers: { "Content-Type": "application/json" },
                  body: JSON.stringify(cart),
                });
                */}

                        <button
                          className="btn-primary"
                          onClick={() => {
                            generateInvoicePDF(); // ⬅️ PDF erzeugen
                            // 🔁 Später Backend-Logik aktivieren
                            /*
                    fetch("http://localhost:7184/api/invoices", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(cart),
                    });
                    */
                            setCart([]);
                            setCheckoutOpen(false);
                            setPaymentStep(null);
                          }}
                        >
                          🧾 Download Invoice (PDF)
                        </button>

                        <br />
                        <button
                          className="btn-delete"
                          style={{ marginTop: "0.5rem" }}
                          onClick={() => setPaymentStep("method")}
                        >
                          🔙 Zurück zur Auswahl
                        </button>
                      </>
                    )}

                    {/* Kartenzahlung: Bestätigung anzeigen */}
                    {paymentStep === "card" && (
                      <div style={{ textAlign: "center", padding: "1rem" }}>
                        {!cardPaymentSuccess ? (
                          <>
                            <h4 style={{ marginTop: "1rem" }}>
                              💳 Kartenzahlung
                            </h4>
                            {!cardPaymentInProgress ? (
                              <>
                                <p>Bitte führen Sie Ihre Karte ein...</p>
                                <p>Belegsumme: {total.toFixed(2)} €</p>

                                {/* 🛰️ BACKEND-LOGIK (auskommentiert): */}
                                {/*
                            fetch("http://localhost:7184/api/cardpayment", {
                            method: "POST",
                            headers: { "Content-Type": "application/json" },
                            body: JSON.stringify({ total })
                            });
                            */}

                                <button
                                  className="btn-primary"
                                  onClick={() => {
                                    setCardPaymentInProgress(true);
                                    setTimeout(() => {
                                      setCardPaymentSuccess(true);
                                    }, 2000); // 2 Sekunden Simulation
                                  }}
                                >
                                  ➡️ Zahlung starten
                                </button>
                                <br />
                                <button
                                  className="btn-delete"
                                  style={{ marginTop: "0.5rem" }}
                                  onClick={() => setPaymentStep("method")}
                                >
                                  🔙 Zurück zur Auswahl
                                </button>
                              </>
                            ) : (
                              <p>⏳ Karte wird gelesen...</p>
                            )}
                          </>
                        ) : (
                          <>
                            <p
                              style={{
                                fontSize: "1.2rem",
                                color: "green",
                                margin: "1rem 0",
                              }}
                            >
                              ✔️ Zahlung erfolgreich!
                            </p>

                            <button
                              className="btn-primary"
                              onClick={() => {
                                alert("💳 Zahlung bestätigt");

                                generateInvoicePDF(); // 💡 Rechnung ausdrucken (PDF)  {/*Rechnung cart ausdrücken*/}

                                setCart([]);
                                setCheckoutOpen(false);
                                setPaymentStep(null);
                                setCardPaymentInProgress(false);
                                setCardPaymentSuccess(false);
                              }}
                            >
                              ✅ Zahlung abgeschlossen
                            </button>
                          </>
                        )}
                      </div>
                    )}
                  </>
                );
              })()}
            </div>
          </div>
        )}

        {/* Linke Seite – Produktliste (scrollbar & sticky Header, wie zuvor implementiert) */}
        <div
          style={{
            flex: 1,
            maxHeight: "70vh",
            overflowY: "auto",
            paddingRight: "1rem",
            borderRight: "1px solid #ddd",
            position: "relative",
          }}
        >
          <div
            style={{
              position: "sticky",
              top: 0,
              background: "white",
              zIndex: 1,
              paddingBottom: "0.5rem",
              borderBottom: "1px solid #ccc",
            }}
          >
            <h3 style={{ margin: "0", padding: "0.5rem 0" }}>
              Available Medicines
            </h3>
          </div>

          {products /*search funktion*/
            .filter((p) =>
              p.productName?.toLowerCase().includes(searchTerm.toLowerCase())
            )
            .map((p /* bis hier search*/) => (
              <div
                key={p.id}
                style={{
                  marginBottom: "0.75rem",
                  paddingBottom: "0.75rem",
                  borderBottom: "1px solid #eee",
                  fontSize: "0.95rem",
                }}
              >
                <p style={{ margin: "0 0 0.25rem 0" }}>
                  <strong>{p.productName}</strong> – {p.price.toFixed(2)} €
                </p>
                <button
                  onClick={() => openModal(p)}
                  className="btn-primary"
                  style={{ fontSize: "0.85rem" }}
                >
                  ➕ Sell
                </button>
              </div>
            ))}
        </div>

        {/* Rechte Seite – Warenkorb */}
        <div style={{ flex: 1 }}>
          <h3>Cart</h3>
          {cart.length === 0 && <p>No products selected.</p>}
          {cart.map((item) => (
            <div
              key={item.id}
              style={{
                marginBottom: "1rem",
                borderBottom: "1px solid #ddd",
                paddingBottom: "0.5rem",
              }}
            >
              <p>
                <strong>{item.productName}</strong>
              </p>
              <div
                style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}
              >
                <button
                  onClick={() => decreaseQuantity(item.id)}
                  className="btn-edit"
                  style={{ fontSize: "0.8rem" }}
                >
                  ➖
                </button>
                <span>{item.quantity}</span>
                <button
                  onClick={() => increaseQuantity(item.id)}
                  className="btn-edit"
                  style={{ fontSize: "0.8rem" }}
                >
                  ➕
                </button>
                <button
                  onClick={() => removeFromCart(item.id)}
                  className="btn-delete"
                  style={{ fontSize: "0.8rem", marginLeft: "1rem" }}
                >
                  🗑️ Delete
                </button>
              </div>
              <p>
                Sum: {(item.price * item.quantity).toFixed(2)} €
                {/* VORÜBERGEHEND: Preisberechnung erfolgt im Frontend.
                    Spätere Backend-Logik (z. B. Rabatte, dynamische Preisberechnung) wird hier auskommentiert */}
              </p>
            </div>
          ))}
          {cart.length > 0 && (
            <p>
              <strong>Total:</strong>{" "}
              {cart
                .reduce((sum, item) => sum + item.price * item.quantity, 0)
                .toFixed(2)}{" "}
              €
            </p>
          )}
          {cart.length > 0 /* Button zur kasse*/ && (
            <div style={{ marginTop: "1rem" }}>
              <button
                className="btn-primary"
                onClick={() => setCheckoutOpen(true)}
              >
                Zur Kasse
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Modal zum Festlegen der Menge und Anzeigen der Produktbeschreibung */}
      {modalOpen && selectedProduct && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h3>{selectedProduct.productName}</h3>
            <p>{selectedProduct.description}</p>
            <div style={{ display: "flex", gap: "1rem", alignItems: "center" }}>
              <button onClick={() => setQuantity(Math.max(1, quantity - 1))}>
                ➖
              </button>
              <span>{quantity}</span>
              <button onClick={() => setQuantity(quantity + 1)}>➕</button>
            </div>
            <p>
              <strong>Total:</strong>{" "}
              {(selectedProduct.price * quantity).toFixed(2)} €
              {/* VORÜBERGEHEND: Rechnung im Frontend.
                  Spätere Backend-Logik für Rabatte etc. auskommentiert */}
            </p>
            <div style={{ marginTop: "1rem", display: "flex", gap: "1rem" }}>
              <button onClick={addToCart} className="btn-primary">
                Add to Cart
              </button>
              <button
                onClick={() => setModalOpen(false)}
                className="btn-delete"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default SellMedicine;
