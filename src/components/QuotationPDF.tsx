"use client";

import React from 'react';
import { Document, Page, Text, View, StyleSheet, PDFViewer, Image } from '@react-pdf/renderer';
import { HEADER_IMAGE_FALLBACK, FOOTER_IMAGE_FALLBACK } from '../utils/letterheadImages';

// Helper function to format numbers in Indian style (with commas)
const formatIndianNumber = (num: number): string => {
  const numStr = num.toFixed(2);
  const parts = numStr.split('.');
  const integerPart = parts[0];
  const decimalPart = parts[1];

  // Format the integer part with commas in Indian style
  let formattedInteger = '';
  let count = 0;

  for (let i = integerPart.length - 1; i >= 0; i--) {
    count++;
    formattedInteger = integerPart[i] + formattedInteger;

    if (count === 3 && i !== 0) {
      formattedInteger = ',' + formattedInteger;
      count = 0;
    } else if (count === 2 && i !== 0 && formattedInteger.includes(',')) {
      formattedInteger = ',' + formattedInteger;
      count = 0;
    }
  }

  return `${formattedInteger}.${decimalPart}`;
};

// Helper function to format date in DD-MM-YYYY format
const formatDate = (dateString: string): string => {
  if (!dateString) return '';

  try {
    const date = new Date(dateString);
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const year = date.getFullYear();

    return `${day}-${month}-${year}`;
  } catch (error) {
    // If there's an error parsing the date, return the original string
    return dateString;
  }
};

// Define types for our quotation
interface QuotationItem {
  id: string;
  serial_no?: string;
  description: string;
  quantity: number;
  rate: number;
  amount: number;
  [key: string]: any; // Allow for dynamic custom columns
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

// Create styles
const styles = StyleSheet.create({
  page: {
    flexDirection: 'column',
    backgroundColor: '#FFFFFF',
    padding: 0,
    position: 'relative',
  },
  contentContainer: {
    padding: 30,
    paddingTop: 150, // Space for the header - adjusted for the actual header image
    paddingBottom: 150, // Space for the footer - adjusted for the actual footer image
    flexGrow: 1,
    position: 'relative',
    zIndex: 2,
  },
  headerImage: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: 'auto',
    zIndex: 1,
  },
  footerImage: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    width: '100%',
    height: 'auto',
    zIndex: 1,
  },
  section: {
    margin: 10,
    padding: 10,
  },
  header: {
    fontSize: 18,
    marginBottom: 15,
    textAlign: 'center',
    color: '#333',
    fontWeight: 'bold',
  },
  subheader: {
    fontSize: 12,
    marginBottom: 6,
    color: '#555',
    fontWeight: 'bold',
  },
  row: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#EEEEEE',
    borderBottomStyle: 'solid',
    alignItems: 'center',
    minHeight: 28,
    fontSize: 10,
    fontWeight: 'normal',
    padding: '4px 0',
  },
  serialNo: {
    width: '8%',
    paddingRight: 4,
    textAlign: 'center',
  },
  description: {
    width: '32%',
    paddingRight: 8,
  },
  qty: {
    width: '15%',
    textAlign: 'right',
    paddingRight: 8,
    fontFamily: 'Helvetica',
  },
  rate: {
    width: '15%',
    textAlign: 'right',
    paddingRight: 12,
    paddingLeft: 4,
    fontFamily: 'Helvetica',
  },
  amount: {
    width: '15%',
    textAlign: 'right',
    paddingRight: 16,
    paddingLeft: 4,
    fontFamily: 'Helvetica',
  },
  tableHeader: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#000000',
    borderBottomStyle: 'solid',
    alignItems: 'center',
    height: 30,
    fontSize: 11,
    fontWeight: 'bold',
    marginTop: 15,
    backgroundColor: '#f5f5f5',
    padding: '4px 0',
  },
  tableFooter: {
    flexDirection: 'row',
    borderTopWidth: 1,
    borderTopColor: '#000000',
    borderTopStyle: 'solid',
    alignItems: 'center',
  },
  detailsContainer: {
    flexDirection: 'row',
    marginBottom: 20,
  },
  detailsLeft: {
    width: '50%',
  },
  detailsRight: {
    width: '50%',
  },
  totalRow: {
    flexDirection: 'row',
    borderTopWidth: 1,
    borderTopColor: '#000000',
    borderTopStyle: 'solid',
    alignItems: 'center',
    height: 30,
    fontSize: 12,
    fontWeight: 'bold',
    marginTop: 4,
    backgroundColor: '#f9f9f9',
    padding: '4px 0',
  },
  totalAmount: {
    width: '15%',
    textAlign: 'right',
    fontSize: 12,
    fontWeight: 'bold',
    fontFamily: 'Helvetica',
  },
  amountInWords: {
    marginTop: 10,
    fontSize: 11,
    fontStyle: 'italic',
    color: '#333',
  },
  notes: {
    marginTop: 30,
    fontSize: 10,
    color: '#333',
  },
  terms: {
    marginTop: 30,
    fontSize: 10,
    color: '#333',
  },
  footer: {
    position: 'absolute',
    bottom: 30,
    left: 30,
    right: 30,
    fontSize: 10,
    textAlign: 'center',
    color: '#666',
    borderTopWidth: 1,
    borderTopColor: '#EEEEEE',
    borderTopStyle: 'solid',
    paddingTop: 10,
  },
});

// Create Document Component
const QuotationPDF: React.FC<{ quotation: QuotationData }> = ({ quotation }) => {
  return (
    <PDFViewer style={{ width: '100%', height: '600px' }}>
      <Document>
        <Page size="A4" style={styles.page}>
          {/* Letterhead Header */}
          <Image
            src={HEADER_IMAGE_FALLBACK}
            style={styles.headerImage}
          />

          <View style={styles.contentContainer}>
            <Text style={styles.header}>QUOTATION</Text>

            {/* Quotation Details */}
            <View style={styles.detailsContainer}>
              <View style={styles.detailsLeft}>
                <Text style={{...styles.subheader, fontSize: 11, marginBottom: 4}}>From:</Text>
                <Text style={{fontSize: 10, marginBottom: 2}}>Global Digital Connect</Text>
                <Text style={{fontSize: 10, marginBottom: 2}}>R-320 Regus, 3rd Floor</Text>
                <Text style={{fontSize: 10, marginBottom: 2}}>Maganato Mall Raipur</Text>
                <Text style={{fontSize: 10, marginBottom: 2}}>Phone: 9685047519</Text>
                <Text style={{fontSize: 10}}>Email: prateek@globaldigitalconnect.com</Text>
              </View>
              <View style={styles.detailsRight}>
                <Text style={{...styles.subheader, fontSize: 11, marginBottom: 4}}>To:</Text>
                <Text style={{fontSize: 10, marginBottom: 2}}>{quotation.customerName}</Text>
                <Text style={{fontSize: 10, marginBottom: 2}}>{quotation.customerAddress}</Text>
                <Text style={{fontSize: 10, marginBottom: 2}}>Phone: {quotation.customerPhone}</Text>
                <Text style={{fontSize: 10}}>Email: {quotation.customerEmail}</Text>
              </View>
            </View>

            <View style={{...styles.detailsContainer, marginTop: 5, marginBottom: 10, borderTop: '1px solid #eee', paddingTop: 8}}>
              <View style={styles.detailsLeft}>
                <Text style={{fontSize: 10, marginBottom: 3}}><Text style={{fontWeight: 'bold'}}>Quotation Number:</Text> {quotation.quotationNumber}</Text>
                <Text style={{fontSize: 10, marginBottom: 3}}><Text style={{fontWeight: 'bold'}}>Date:</Text> {formatDate(quotation.date)}</Text>
                <Text style={{fontSize: 10, fontWeight: 'bold'}}><Text style={{fontWeight: 'bold'}}>Valid Until:</Text> {formatDate(quotation.validUntil)}</Text>
              </View>
            </View>

            {/* Table Header */}
            <View style={styles.tableHeader}>
              <Text style={styles.serialNo}>S. No.</Text>
              <Text style={styles.description}>Description</Text>

              {/* Render custom column headers in specific order */}
              {quotation.items[0] && (() => {
                // Define the order of custom columns
                const customColumnOrder = ["size", "city"];
                
                // Filter out standard columns and sort by our predefined order
                const customColumns = Object.keys(quotation.items[0])
                  .filter(key => !["id", "serial_no", "description", "quantity", "rate", "amount"].includes(key))
                  .sort((a, b) => {
                    const indexA = customColumnOrder.indexOf(a.toLowerCase());
                    const indexB = customColumnOrder.indexOf(b.toLowerCase());
                    
                    // If both columns are in our order list, sort by that order
                    if (indexA >= 0 && indexB >= 0) {
                      return indexA - indexB;
                    }
                    // If only one is in our list, prioritize it
                    if (indexA >= 0) return -1;
                    if (indexB >= 0) return 1;
                    // Otherwise, alphabetical
                    return a.localeCompare(b);
                  });
                
                // Render the columns in the sorted order
                return customColumns.map(key => (
                  <Text key={key} style={{width: '15%', paddingRight: 4}}>
                    {key.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}
                  </Text>
                ));
              })()}

              <Text style={{...styles.qty, textAlign: 'right'}}>Quantity</Text>
              <Text style={{...styles.rate, textAlign: 'right'}}>Rate</Text>
              <Text style={{...styles.amount, textAlign: 'right'}}>Amount</Text>
            </View>

            {/* Table Rows */}
            {quotation.items.map((item) => (
              <View style={styles.row} key={item.id}>
                <Text style={styles.serialNo}>{item.serial_no || item.id}</Text>
                <Text style={{...styles.description}}>{item.description || "-"}</Text>

                {/* Render custom column values in specific order */}
                {(() => {
                  // Define the order of custom columns
                  const customColumnOrder = ["size", "city"];
                  
                  // Filter out standard columns and sort by our predefined order
                  const customColumns = Object.keys(item)
                    .filter(key => !["id", "serial_no", "description", "quantity", "rate", "amount"].includes(key))
                    .sort((a, b) => {
                      const indexA = customColumnOrder.indexOf(a.toLowerCase());
                      const indexB = customColumnOrder.indexOf(b.toLowerCase());
                      
                      // If both columns are in our order list, sort by that order
                      if (indexA >= 0 && indexB >= 0) {
                        return indexA - indexB;
                      }
                      // If only one is in our list, prioritize it
                      if (indexA >= 0) return -1;
                      if (indexB >= 0) return 1;
                      // Otherwise, alphabetical
                      return a.localeCompare(b);
                    });
                  
                  // Render the columns in the sorted order
                  return customColumns.map(key => (
                    <Text key={key} style={{width: '15%', paddingRight: 4}}>
                      {item[key] || ""}
                    </Text>
                  ));
                })()}

                <Text style={{...styles.qty, textAlign: 'right'}}>{item.quantity ? item.quantity.toString() : "0"}</Text>
                <Text style={{...styles.rate, textAlign: 'right'}}>{item.rate ? formatIndianNumber(item.rate) : "0.00"}</Text>
                <Text style={{...styles.amount, textAlign: 'right'}}>{item.amount ? formatIndianNumber(item.amount) : "0.00"}</Text>
              </View>
            ))}

            {/* Table Footer - Totals */}
            <View style={{ marginTop: 20, flexDirection: 'row', justifyContent: 'flex-end' }}>
              <View style={{ width: '60%' }}></View>
              <View style={{ width: '40%' }}>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 5 }}>
                  <Text style={{ fontSize: 10, fontWeight: 'bold' }}>Subtotal:</Text>
                  <Text style={{ fontSize: 10, fontFamily: 'Helvetica', paddingRight: 16, textAlign: 'right' }}>
                    {quotation.subtotal ? formatIndianNumber(quotation.subtotal) : "0.00"}
                  </Text>
                </View>

                <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 5 }}>
                  <Text style={{ fontSize: 10, fontWeight: 'bold' }}>GST ({quotation.gstRate || 0}%):</Text>
                  <Text style={{ fontSize: 10, fontFamily: 'Helvetica', paddingRight: 16, textAlign: 'right' }}>
                    {quotation.gstAmount ? formatIndianNumber(quotation.gstAmount) : "0.00"}
                  </Text>
                </View>

                <View style={{ flexDirection: 'row', justifyContent: 'space-between', borderTopWidth: 1, borderTopColor: '#000', paddingTop: 5 }}>
                  <Text style={{ fontSize: 12, fontWeight: 'bold' }}>Total:</Text>
                  <Text style={{ fontSize: 12, fontWeight: 'bold', fontFamily: 'Helvetica', paddingRight: 16, textAlign: 'right' }}>
                    {quotation.total ? formatIndianNumber(quotation.total) : "0.00"}
                  </Text>
                </View>
              </View>
            </View>

            <View style={{...styles.amountInWords, marginTop: 15, borderTop: '1px dashed #ccc', paddingTop: 8}}>
              <Text style={{fontSize: 10, fontStyle: 'italic'}}><Text style={{fontWeight: 'bold'}}>Amount in words:</Text> {quotation.amountInWords}</Text>
            </View>

            {/* Terms */}
            {quotation.terms && (
              <View style={{...styles.terms, marginTop: 15}}>
                <Text style={{fontSize: 11, fontWeight: 'bold', marginBottom: 4}}>Terms & Conditions:</Text>
                <Text style={{fontSize: 9}}>{quotation.terms}</Text>
              </View>
            )}

            {/* Notes */}
            {quotation.notes && (
              <View style={{...styles.notes, marginTop: 10}}>
                <Text style={{fontSize: 11, fontWeight: 'bold', marginBottom: 4}}>Notes:</Text>
                <Text style={{fontSize: 9}}>{quotation.notes}</Text>
              </View>
            )}
          </View>

          {/* Letterhead Footer */}
          <Image
            src={FOOTER_IMAGE_FALLBACK}
            style={styles.footerImage}
          />
        </Page>
      </Document>
    </PDFViewer>
  );
};

export default QuotationPDF;
