// 📄 InvoicePage.tsx – Vorschau einer gespeicherten Rechnung anhand der QR-Code-ID (z. B. vom Handy)

import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

interface InvoiceItem {
  productName: string;
  quantity: number;
  price: number;
}

interface InvoiceData {
  id: string;
  date: string;
  pharmacist: string;
  items: InvoiceItem[];
}

const InvoicePage = () => {
  const { invoiceId } = useParams(); // 📌 "invoiceId" statt "id" – für Klarheit
  const [invoice, setInvoice] = useState<InvoiceData | null>(null);

  useEffect(() => {
    // ✅ MOCKDATEN (🧪 Vorschau) – für Handy-Scan Test
    const mockInvoice: InvoiceData = {
      id: invoiceId || "INV-DEMO-001",
      date: new Date().toLocaleDateString("en-GB"),
      pharmacist: "Yrysgul Sydykbekova",
      items: [
        { productName: "Paracetamol 500mg", quantity: 2, price: 5.0 },
        { productName: "Vitamin C 1000mg", quantity: 1, price: 3.5 },
      ],
    };
    setInvoice(mockInvoice);

    // 🔁 SPÄTER: Von Backend laden – wenn deine Kollegin Daten speichert
    /*
    fetch(`http://128.130.247.131:7184/api/invoices/${invoiceId}`)
      .then(res => res.json())
      .then(data => setInvoice(data));
    */
  }, [invoiceId]);

  if (!invoice) return <p>Loading invoice...</p>;

  const subtotal = invoice.items.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );
  const vat = subtotal * 0.2;
  const total = subtotal + vat;

  return (
    <div
      style={{
        padding: "2rem",
        maxWidth: "600px",
        margin: "0 auto",
        fontFamily: "Arial",
      }}
    >
      <h2>🧾 Invoice</h2>
      <p>
        <strong>Farmacia Luis Ilena</strong>
        <br />
        La Sabana, Luperón 51000
        <br />
        Dominican Republic
        <br />
        Phone: +18095718573
      </p>

      <hr />

      <p>
        <strong>Invoice ID:</strong> {invoice.id}
      </p>
      <p>
        <strong>Date:</strong> {invoice.date}
      </p>
      <p>
        <strong>Pharmacist:</strong> {invoice.pharmacist}
      </p>

      <table
        style={{
          width: "100%",
          marginTop: "1rem",
          borderCollapse: "collapse",
        }}
      >
        <thead>
          <tr>
            <th style={{ textAlign: "left" }}>Product</th>
            <th style={{ textAlign: "right" }}>Qty</th>
            <th style={{ textAlign: "right" }}>Price</th>
            <th style={{ textAlign: "right" }}>Total</th>
          </tr>
        </thead>
        <tbody>
          {invoice.items.map((item, index) => (
            <tr key={index}>
              <td>{item.productName}</td>
              <td style={{ textAlign: "right" }}>{item.quantity}</td>
              <td style={{ textAlign: "right" }}>{item.price.toFixed(2)} €</td>
              <td style={{ textAlign: "right" }}>
                {(item.price * item.quantity).toFixed(2)} €
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <div style={{ marginTop: "2rem", textAlign: "right" }}>
        <p>
          <strong>Subtotal:</strong> {subtotal.toFixed(2)} €
        </p>
        <p>
          <strong>VAT (20%):</strong> {vat.toFixed(2)} €
        </p>
        <p>
          <strong>Total:</strong> {total.toFixed(2)} €
        </p>
      </div>

      <p style={{ marginTop: "2rem", fontStyle: "italic" }}>
        Thank you for your purchase!
      </p>
    </div>
  );
};

export default InvoicePage;
