import React from "react";
import { Product } from "../interfaces/Product";

interface DeleteConfirmModalProps {
  isOpen: boolean;
  product: Product | null;
  onClose: () => void;
  onConfirm: (id: string) => void;
}

const DeleteConfirmModal: React.FC<DeleteConfirmModalProps> = ({ isOpen, product, onClose, onConfirm }) => {
  if (!isOpen || !product) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h3>Delete Product</h3>
        <p>Are you sure you want to delete <strong>{product.productName}</strong>?</p>
        <div className="modal-buttons">
          <button onClick={() => onConfirm(product.id)} className="btn-delete">Yes, Delete</button>
          <button onClick={onClose} className="btn-primary">Cancel</button>
        </div>
      </div>
    </div>
  );
};

export default DeleteConfirmModal;
