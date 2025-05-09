"use client";

import React, { useEffect, useRef } from 'react';
import InvoicePDF from './InvoicePDF';
import QuotationPDF from './QuotationPDF';

interface PDFPreviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  documentType: 'invoice' | 'quotation';
  data: any;
}

const PDFPreviewModal: React.FC<PDFPreviewModalProps> = ({ 
  isOpen, 
  onClose, 
  documentType, 
  data 
}) => {
  const modalRef = useRef<HTMLDivElement>(null);

  // Close modal when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen, onClose]);

  // Close modal when pressing Escape key
  useEffect(() => {
    const handleEscKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscKey);
    }

    return () => {
      document.removeEventListener('keydown', handleEscKey);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div 
        ref={modalRef} 
        className="bg-white rounded-lg shadow-xl w-11/12 h-5/6 max-w-6xl flex flex-col"
      >
        <div className="flex justify-between items-center p-4 border-b">
          <h2 className="text-xl font-semibold">
            {documentType === 'invoice' ? 'Performa Invoice Preview' : 'Quotation Preview'}
          </h2>
          <button 
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 text-2xl"
          >
            &times;
          </button>
        </div>
        
        <div className="flex-grow overflow-auto p-4">
          {documentType === 'invoice' ? (
            <InvoicePDF invoice={data} />
          ) : (
            <QuotationPDF quotation={data} />
          )}
        </div>
        
        <div className="p-4 border-t flex justify-end">
          <button 
            onClick={onClose}
            className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600 mr-2"
          >
            Close
          </button>
          <button 
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            Download PDF
          </button>
        </div>
      </div>
    </div>
  );
};

export default PDFPreviewModal;
