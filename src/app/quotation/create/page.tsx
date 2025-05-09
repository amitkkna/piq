"use client";

import { useState } from "react";
import Link from "next/link";
import DynamicItemsTable from "@/components/DynamicItemsTable";
import { amountInWords } from "@/utils/numberToWords";
import PDFPreviewModal from "@/components/PDFPreviewModal";

// Define types for our quotation
interface QuotationItem {
  id: string;
  serial_no: string;
  description: string;
  quantity: number;
  rate: number;
  amount: number;
  [key: string]: any; // For dynamic custom columns
}

interface QuotationData {
  quotationNumber: string;
  date: string;
  validUntil: string;
  customerName: string;
  customerAddress: string;
  customerEmail: string;
  customerPhone: string;
  items: QuotationItem[];
  notes: string;
  terms: string;
  subtotal: number;
  gstRate: number;
  gstAmount: number;
  total: number;
  amountInWords: string;
}

export default function CreateQuotation() {
  // Initialize with default values
  const [quotation, setQuotation] = useState<QuotationData>({
    quotationNumber: `QT-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`,
    date: new Date().toISOString().split('T')[0],
    validUntil: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    customerName: "",
    customerAddress: "",
    customerEmail: "",
    customerPhone: "",
    items: [
      {
        id: "1",
        serial_no: "1",
        description: "",
        quantity: 1,
        rate: 0,
        amount: 0,
      },
    ],
    notes: "",
    terms: "This quotation is valid for 30 days from the date of issue.",
    subtotal: 0,
    gstRate: 18, // Default GST rate in India
    gstAmount: 0,
    total: 0,
    amountInWords: "Zero Rupees Only",
  });

  // Add a new item row
  const addItem = () => {
    const newItem: QuotationItem = {
      id: (quotation.items.length + 1).toString(),
      serial_no: (quotation.items.length + 1).toString(),
      description: "",
      quantity: 1,
      rate: 0,
      amount: 0,
    };
    setQuotation({
      ...quotation,
      items: [...quotation.items, newItem],
    });
  };

  // Remove an item row
  const removeItem = (id: string) => {
    setQuotation({
      ...quotation,
      items: quotation.items.filter((item) => item.id !== id),
    });
  };

  // Update item details and recalculate
  const updateItem = (id: string, field: keyof QuotationItem, value: string | number) => {
    const updatedItems = quotation.items.map((item) => {
      if (item.id === id) {
        const updatedItem = { ...item, [field]: value };

        // Recalculate amount if quantity or rate changes
        if (field === "quantity" || field === "rate") {
          updatedItem.amount = updatedItem.quantity * updatedItem.rate;
        }

        return updatedItem;
      }
      return item;
    });

    // Update quotation with new items
    const updatedQuotation = { ...quotation, items: updatedItems };

    // Recalculate totals
    recalculateTotals(updatedQuotation);
  };

  // Recalculate subtotal, GST, and total
  const recalculateTotals = (updatedQuotation: QuotationData) => {
    const subtotal = updatedQuotation.items.reduce((sum, item) => sum + item.amount, 0);
    const gstAmount = (subtotal * updatedQuotation.gstRate) / 100;
    const total = subtotal + gstAmount;
    const totalInWords = amountInWords(total);

    setQuotation({
      ...updatedQuotation,
      subtotal,
      gstAmount,
      total,
      amountInWords: totalInWords,
    });
  };

  // Handle GST rate change
  const handleGstRateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const gstRate = parseFloat(e.target.value) || 0;
    const gstAmount = (quotation.subtotal * gstRate) / 100;
    const total = quotation.subtotal + gstAmount;
    const totalInWords = amountInWords(total);

    setQuotation({
      ...quotation,
      gstRate,
      gstAmount,
      total,
      amountInWords: totalInWords,
    });
  };

  // State for PDF preview modal
  const [isPDFPreviewOpen, setIsPDFPreviewOpen] = useState(false);

  // Show PDF preview
  const generatePDF = () => {
    setIsPDFPreviewOpen(true);
  };

  // Convert to invoice (placeholder function)
  const convertToInvoice = () => {
    alert("This will convert the quotation to an invoice");
    // Implementation will be added later
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      {/* PDF Preview Modal */}
      <PDFPreviewModal
        isOpen={isPDFPreviewOpen}
        onClose={() => setIsPDFPreviewOpen(false)}
        documentType="quotation"
        data={quotation}
      />

      <div className="max-w-6xl mx-auto bg-white rounded-lg shadow-lg p-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Create New Quotation</h1>
          <div className="space-x-2">
            <button
              onClick={generatePDF}
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
            >
              Preview PDF
            </button>
            <Link
              href="/"
              className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
            >
              Cancel
            </Link>
          </div>
        </div>

        {/* Quotation Header */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <div>
            <h2 className="text-lg font-semibold mb-3">Your Company</h2>
            <div className="space-y-2">
              <div>
                <label className="block text-sm font-medium text-gray-700">Quotation Number</label>
                <input
                  type="text"
                  value={quotation.quotationNumber}
                  onChange={(e) => setQuotation({ ...quotation, quotationNumber: e.target.value })}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Date</label>
                <input
                  type="date"
                  value={quotation.date}
                  onChange={(e) => setQuotation({ ...quotation, date: e.target.value })}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Valid Until</label>
                <input
                  type="date"
                  value={quotation.validUntil}
                  onChange={(e) => setQuotation({ ...quotation, validUntil: e.target.value })}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                />
              </div>
            </div>
          </div>

          <div>
            <h2 className="text-lg font-semibold mb-3">Customer Details</h2>
            <div className="space-y-2">
              <div>
                <label className="block text-sm font-medium text-gray-700">Customer Name</label>
                <input
                  type="text"
                  value={quotation.customerName}
                  onChange={(e) => setQuotation({ ...quotation, customerName: e.target.value })}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Address</label>
                <textarea
                  value={quotation.customerAddress}
                  onChange={(e) => setQuotation({ ...quotation, customerAddress: e.target.value })}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                  rows={2}
                />
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Email</label>
                  <input
                    type="email"
                    value={quotation.customerEmail}
                    onChange={(e) => setQuotation({ ...quotation, customerEmail: e.target.value })}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Phone</label>
                  <input
                    type="text"
                    value={quotation.customerPhone}
                    onChange={(e) => setQuotation({ ...quotation, customerPhone: e.target.value })}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Quotation Items - Dynamic Table */}
        <DynamicItemsTable
          initialItems={quotation.items}
          onItemsChange={(updatedItems) => {
            const updatedQuotation = { ...quotation, items: updatedItems };
            recalculateTotals(updatedQuotation);
          }}
          calculateAmount={(item) => item.quantity * item.rate}
        />

        {/* Quotation Totals */}
        <div className="flex justify-end mb-8">
          <div className="w-full md:w-2/3">
            <div className="border rounded-md p-4 space-y-3">
              <div className="flex justify-between">
                <span>Subtotal:</span>
                <span>₹{quotation.subtotal.toFixed(2)}</span>
              </div>
              <div className="flex items-center justify-between">
                <span>GST ({quotation.gstRate}%):</span>
                <div className="flex items-center">
                  <input
                    type="number"
                    value={quotation.gstRate}
                    onChange={handleGstRateChange}
                    className="w-16 border border-gray-300 rounded p-1 mr-2"
                    min="0"
                    max="100"
                  />
                  <span>₹{quotation.gstAmount.toFixed(2)}</span>
                </div>
              </div>
              <div className="flex justify-between font-bold text-lg">
                <span>Total:</span>
                <span>₹{quotation.total.toFixed(2)}</span>
              </div>
              <div className="pt-2 border-t border-gray-200">
                <p className="text-gray-700 italic">
                  <span className="font-semibold">Amount in words:</span> {quotation.amountInWords}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Terms and Notes */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Terms & Conditions</label>
            <textarea
              value={quotation.terms}
              onChange={(e) => setQuotation({ ...quotation, terms: e.target.value })}
              className="block w-full border border-gray-300 rounded-md shadow-sm p-2"
              rows={3}
              placeholder="Terms and conditions for this quotation"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Notes</label>
            <textarea
              value={quotation.notes}
              onChange={(e) => setQuotation({ ...quotation, notes: e.target.value })}
              className="block w-full border border-gray-300 rounded-md shadow-sm p-2"
              rows={3}
              placeholder="Additional notes for the customer"
            />
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-end space-x-2">
          <button
            onClick={convertToInvoice}
            className="bg-purple-600 text-white px-6 py-2 rounded hover:bg-purple-700"
          >
            Convert to Performa Invoice
          </button>
          <button
            onClick={generatePDF}
            className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700"
          >
            Preview PDF
          </button>
          <button
            className="bg-green-600 text-white px-6 py-2 rounded hover:bg-green-700"
          >
            Save Quotation
          </button>
        </div>
      </div>
    </div>
  );
}
