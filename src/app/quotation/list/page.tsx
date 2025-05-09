"use client";

import { useState } from "react";
import Link from "next/link";

// Sample quotation data
const sampleQuotations = [
  {
    id: "QT-2023-1001",
    customerName: "ABC Corporation",
    date: "2023-10-15",
    validUntil: "2023-11-15",
    total: 12500.00,
    status: "Sent"
  },
  {
    id: "QT-2023-1002",
    customerName: "XYZ Enterprises",
    date: "2023-10-20",
    validUntil: "2023-11-20",
    total: 8750.50,
    status: "Accepted"
  },
  {
    id: "QT-2023-1003",
    customerName: "Global Solutions Ltd",
    date: "2023-10-25",
    validUntil: "2023-11-25",
    total: 15000.00,
    status: "Expired"
  },
  {
    id: "QT-2023-1004",
    customerName: "Tech Innovators Inc",
    date: "2023-11-01",
    validUntil: "2023-12-01",
    total: 5250.75,
    status: "Draft"
  },
  {
    id: "QT-2023-1005",
    customerName: "Sunrise Retailers",
    date: "2023-11-05",
    validUntil: "2023-12-05",
    total: 9800.25,
    status: "Rejected"
  }
];

export default function QuotationList() {
  const [quotations, setQuotations] = useState(sampleQuotations);
  const [searchTerm, setSearchTerm] = useState("");
  
  // Filter quotations based on search term
  const filteredQuotations = quotations.filter(quotation => 
    quotation.id.toLowerCase().includes(searchTerm.toLowerCase()) || 
    quotation.customerName.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  // Get status badge color
  const getStatusColor = (status: string) => {
    switch(status.toLowerCase()) {
      case 'accepted':
        return 'bg-green-100 text-green-800';
      case 'sent':
        return 'bg-blue-100 text-blue-800';
      case 'expired':
        return 'bg-red-100 text-red-800';
      case 'draft':
        return 'bg-gray-100 text-gray-800';
      case 'rejected':
        return 'bg-orange-100 text-orange-800';
      default:
        return 'bg-purple-100 text-purple-800';
    }
  };

  // Convert quotation to invoice (placeholder function)
  const convertToInvoice = (id: string) => {
    alert(`Converting quotation ${id} to invoice`);
    // Implementation will be added later
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-6xl mx-auto bg-white rounded-lg shadow-lg p-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Quotations</h1>
          <Link 
            href="/quotation/create" 
            className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
          >
            Create New Quotation
          </Link>
        </div>
        
        {/* Search and Filter */}
        <div className="mb-6">
          <div className="relative">
            <input
              type="text"
              placeholder="Search quotations by ID or customer name..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full border border-gray-300 rounded-md shadow-sm p-2 pl-10"
            />
            <div className="absolute left-3 top-2.5">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
          </div>
        </div>
        
        {/* Quotations Table */}
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Quotation #</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Customer</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Valid Until</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredQuotations.length > 0 ? (
                filteredQuotations.map((quotation) => (
                  <tr key={quotation.id}>
                    <td className="px-6 py-4 whitespace-nowrap font-medium">{quotation.id}</td>
                    <td className="px-6 py-4 whitespace-nowrap">{quotation.customerName}</td>
                    <td className="px-6 py-4 whitespace-nowrap">{quotation.date}</td>
                    <td className="px-6 py-4 whitespace-nowrap">{quotation.validUntil}</td>
                    <td className="px-6 py-4 whitespace-nowrap">₹{quotation.total.toFixed(2)}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(quotation.status)}`}>
                        {quotation.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <Link href={`/quotation/view/${quotation.id}`} className="text-blue-600 hover:text-blue-900 mr-3">
                        View
                      </Link>
                      <Link href={`/quotation/edit/${quotation.id}`} className="text-indigo-600 hover:text-indigo-900 mr-3">
                        Edit
                      </Link>
                      <button 
                        onClick={() => convertToInvoice(quotation.id)}
                        className="text-purple-600 hover:text-purple-900 mr-3"
                      >
                        Convert
                      </button>
                      <button className="text-red-600 hover:text-red-900">
                        Delete
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={7} className="px-6 py-4 text-center text-gray-500">
                    No quotations found matching your search criteria.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        
        {/* Pagination (placeholder) */}
        <div className="mt-4 flex items-center justify-between">
          <div className="text-sm text-gray-700">
            Showing <span className="font-medium">1</span> to <span className="font-medium">{filteredQuotations.length}</span> of{" "}
            <span className="font-medium">{filteredQuotations.length}</span> results
          </div>
          <div className="flex-1 flex justify-end">
            <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
              <a
                href="#"
                className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50"
              >
                Previous
              </a>
              <a
                href="#"
                className="relative inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50"
              >
                1
              </a>
              <a
                href="#"
                className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50"
              >
                Next
              </a>
            </nav>
          </div>
        </div>
      </div>
    </div>
  );
}
