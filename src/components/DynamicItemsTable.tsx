"use client";

import { useState, useEffect } from "react";

// Define types for our table
interface Column {
  id: string;
  name: string;
  width: string;
  isRequired: boolean;
}

interface ItemRow {
  id: string;
  serial_no: string;
  description: string;
  quantity: number;
  rate: number;
  amount: number;
  [key: string]: any; // Dynamic properties for custom columns
}

interface DynamicItemsTableProps {
  initialColumns?: Column[];
  initialItems?: ItemRow[];
  onItemsChange: (items: ItemRow[]) => void;
  calculateAmount?: (item: ItemRow) => number;
}

const DynamicItemsTable = ({
  initialColumns = [],
  initialItems = [],
  onItemsChange,
  calculateAmount,
}: DynamicItemsTableProps) => {
  // Default required columns
  const defaultColumns: Column[] = [
    { id: "serial_no", name: "S. No.", width: "10%", isRequired: true },
    { id: "description", name: "Description", width: "40%", isRequired: true },
    { id: "quantity", name: "Quantity", width: "15%", isRequired: true },
    { id: "rate", name: "Rate", width: "15%", isRequired: true },
    { id: "amount", name: "Amount", width: "15%", isRequired: true },
  ];

  // State for columns and items
  const [columns, setColumns] = useState<Column[]>([
    ...defaultColumns,
    ...initialColumns.filter(col => !defaultColumns.some(defCol => defCol.id === col.id)),
  ]);

  const [items, setItems] = useState<ItemRow[]>(
    initialItems.length > 0
      ? initialItems.map((item, index) => ({
          ...item,
          serial_no: item.serial_no || (index + 1).toString()
        }))
      : [
          {
            id: "1",
            serial_no: "1",
            description: "",
            quantity: 1,
            rate: 0,
            amount: 0,
          },
        ]
  );

  // State for new column
  const [newColumnName, setNewColumnName] = useState("");
  const [showAddColumn, setShowAddColumn] = useState(false);

  // Add a new item row
  const addItem = () => {
    const newItem: ItemRow = {
      id: (items.length + 1).toString(),
      serial_no: (items.length + 1).toString(),
      description: "",
      quantity: 1,
      rate: 0,
      amount: 0
    };

    // Add default values for all columns
    columns.forEach(column => {
      if (column.id === "serial_no") {
        newItem[column.id] = (items.length + 1).toString();
      } else if (column.id === "description") {
        newItem[column.id] = "";
      } else if (column.id === "quantity") {
        newItem[column.id] = 1;
      } else if (column.id === "rate" || column.id === "amount") {
        newItem[column.id] = 0;
      } else {
        newItem[column.id] = ""; // Default value for custom columns
      }
    });

    const updatedItems = [...items, newItem];
    setItems(updatedItems);
    onItemsChange(updatedItems);
  };

  // Remove an item row
  const removeItem = (id: string) => {
    const updatedItems = items.filter(item => item.id !== id);
    setItems(updatedItems);
    onItemsChange(updatedItems);
  };

  // Update item value
  const updateItem = (id: string, field: string, value: any) => {
    const updatedItems = items.map(item => {
      if (item.id === id) {
        const updatedItem = { ...item, [field]: value };

        // Recalculate amount if quantity or rate changes and calculateAmount function is provided
        if ((field === "quantity" || field === "rate") && calculateAmount) {
          updatedItem.amount = calculateAmount(updatedItem);
        }

        return updatedItem;
      }
      return item;
    });

    setItems(updatedItems);
    onItemsChange(updatedItems);
  };

  // Add a new custom column
  const addColumn = () => {
    if (!newColumnName.trim()) return;

    const columnId = newColumnName.toLowerCase().replace(/\s+/g, '_');

    // Check if column already exists
    if (columns.some(col => col.id === columnId)) {
      alert("A column with this name already exists");
      return;
    }

    const newColumn: Column = {
      id: columnId,
      name: newColumnName,
      width: "15%",
      isRequired: false,
    };

    // Find the index of the description column
    const descriptionIndex = columns.findIndex(col => col.id === "description");

    // Insert the new column after the description column
    const updatedColumns = [...columns];
    updatedColumns.splice(descriptionIndex + 1, 0, newColumn);

    setColumns(updatedColumns);

    // Add this field to all existing items
    const updatedItems = items.map(item => ({
      ...item,
      [columnId]: "",
    }));

    setItems(updatedItems);
    onItemsChange(updatedItems);
    setNewColumnName("");
    setShowAddColumn(false);
  };

  // Remove a custom column
  const removeColumn = (columnId: string) => {
    // Don't allow removing required columns
    const column = columns.find(col => col.id === columnId);
    if (column?.isRequired) return;

    // Remove the column
    setColumns(columns.filter(col => col.id !== columnId));

    // Remove this field from all items
    const updatedItems = items.map(item => {
      const newItem = { ...item };
      delete newItem[columnId];
      return newItem;
    });

    setItems(updatedItems);
    onItemsChange(updatedItems);
  };

  return (
    <div className="mb-8">
      <div className="flex justify-between items-center mb-3">
        <h2 className="text-lg font-semibold">Items</h2>
        <div className="flex space-x-2">
          <button
            type="button"
            onClick={() => setShowAddColumn(!showAddColumn)}
            className="bg-purple-600 text-white px-3 py-1 rounded text-sm hover:bg-purple-700"
          >
            {showAddColumn ? "Cancel" : "Add Custom Column"}
          </button>
        </div>
      </div>

      {showAddColumn && (
        <div className="mb-4 flex items-center space-x-2">
          <input
            type="text"
            value={newColumnName}
            onChange={(e) => setNewColumnName(e.target.value)}
            placeholder="Enter column name"
            className="border border-gray-300 rounded-md p-2 flex-grow"
          />
          <button
            type="button"
            onClick={addColumn}
            className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
          >
            Add
          </button>
        </div>
      )}

      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              {columns.map((column) => (
                <th
                  key={column.id}
                  className="px-4 py-3 text-left text-sm font-medium text-gray-600 uppercase tracking-wider"
                  style={{ width: column.width }}
                >
                  <div className="flex items-center justify-between">
                    <span>{column.name}</span>
                    {!column.isRequired && (
                      <button
                        type="button"
                        onClick={() => removeColumn(column.id)}
                        className="text-red-500 hover:text-red-700 ml-2"
                      >
                        ×
                      </button>
                    )}
                  </div>
                </th>
              ))}
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {items.map((item) => (
              <tr key={item.id}>
                {columns.map((column) => (
                  <td key={`${item.id}-${column.id}`} className="px-4 py-3">
                    {column.id === "amount" ? (
                      // Amount is calculated and displayed as text
                      item.amount.toFixed(2)
                    ) : column.id === "quantity" || column.id === "rate" ? (
                      // Numeric input for quantity and rate
                      <input
                        type="number"
                        value={item[column.id]}
                        onChange={(e) => updateItem(
                          item.id,
                          column.id,
                          column.id === "quantity"
                            ? parseInt(e.target.value) || 0
                            : parseFloat(e.target.value) || 0
                        )}
                        className="block w-full border border-gray-200 rounded p-2 focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
                        min={column.id === "quantity" ? "1" : "0"}
                        step={column.id === "rate" ? "0.01" : "1"}
                      />
                    ) : (
                      // Text input for other fields
                      <input
                        type="text"
                        value={item[column.id] || ""}
                        onChange={(e) => updateItem(item.id, column.id, e.target.value)}
                        className="block w-full border border-gray-200 rounded p-2 focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
                        placeholder={`Enter ${column.name.toLowerCase()}`}
                      />
                    )}
                  </td>
                ))}
                <td className="px-6 py-4 whitespace-nowrap">
                  <button
                    type="button"
                    onClick={() => removeItem(item.id)}
                    className="text-red-600 hover:text-red-900"
                  >
                    Remove
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <button
        type="button"
        onClick={addItem}
        className="mt-4 bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
      >
        Add Item
      </button>
    </div>
  );
};

export default DynamicItemsTable;
