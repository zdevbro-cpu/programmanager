import { AlertTriangle, X } from "lucide-react";

interface ConfirmModalProps {
  isOpen: boolean;
  title: string;
  message: string;
  onConfirm: () => void;
  onCancel: () => void;
}

export function ConfirmModal({ isOpen, title, message, onConfirm, onCancel }: ConfirmModalProps) {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-container mini">
        <div className="modal-header">
          <div className="modal-title-with-icon">
            <AlertTriangle className="alert-icon" />
            <h3>{title}</h3>
          </div>
          <button type="button" className="close-btn" onClick={onCancel}>
            <X size={18} />
          </button>
        </div>
        <div className="modal-body">
          <p>{message}</p>
        </div>
        <div className="modal-footer">
          <button type="button" className="ghost" onClick={onCancel}>
            취소
          </button>
          <button 
            type="button" 
            className="danger-btn" 
            onClick={() => {
              onConfirm();
            }}
          >
            삭제하기
          </button>
        </div>
      </div>
    </div>
  );
}
