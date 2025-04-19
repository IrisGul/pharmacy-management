export interface Product {
    id: string;
    productName: string;
    description: string;
    batchNumber: string;
    expireDate: string;
    manufacturer: string;
    category: string;
    price: number;
  }
  

  // für Rechnung

export interface CartItem {
    id: string;
    productName: string;
    price: number;
    quantity: number;
  }
  