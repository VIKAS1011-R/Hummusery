import React from "react";
import { Edit, Trash2, Leaf, Beef } from "lucide-react";

interface MenuItem {
  _id: string;
  name: string;
  ingredients: string;
  isVeg: boolean;
  price: number;
  category?: string;
  isAvailable: boolean;
  createdAt: Date;
  updatedAt: Date;
}

interface MenuItemCardProps {
  item: MenuItem;
  onEdit?: (item: MenuItem) => void;
  onDelete?: (itemId: string) => void;
}

export default function MenuItemCard({ item, onEdit, onDelete }: MenuItemCardProps) {
  return (
    <div className="bg-gray-800 rounded-lg p-6 border border-gray-700 hover:border-gray-600 transition-colors">
      {/* Header */}
      <div className="flex justify-between items-start mb-4">
        <h3 className="text-lg font-semibold text-white pr-4">{item.name}</h3>
        <div className="flex items-center gap-2 flex-shrink-0">
          {item.isVeg ? (
            <div className="flex items-center justify-center w-6 h-6 bg-green-500 rounded border-2 border-green-400 shadow-sm">
              <Leaf className="h-3 w-3 text-white" />
            </div>
          ) : (
            <div className="flex items-center justify-center w-6 h-6 bg-red-500 rounded border-2 border-red-400 shadow-sm">
              <Beef className="h-3 w-3 text-white" />
            </div>
          )}
          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
            item.isAvailable 
              ? "bg-green-500/10 text-green-400 border border-green-500/20"
              : "bg-red-500/10 text-red-400 border border-red-500/20"
          }`}>
            {item.isAvailable ? "Available" : "Unavailable"}
          </span>
        </div>
      </div>
      
      {/* Ingredients */}
      <p className="text-gray-300 text-sm mb-4 leading-relaxed">
        {item.ingredients}
      </p>
      
      {/* Footer */}
      <div className="flex justify-between items-center">
        <div>
          <span className="text-orange-400 font-bold text-lg">
            ₹{item.price.toLocaleString('en-IN')}
          </span>
          {item.category && (
            <p className="text-gray-400 text-sm">{item.category}</p>
          )}
        </div>
        
        {/* Action Buttons */}
        <div className="flex gap-2">
          {onEdit && (
            <button
              onClick={() => onEdit(item)}
              className="p-2 bg-gray-700 text-gray-300 rounded hover:bg-gray-600 hover:text-white transition-colors"
              title="Edit menu item"
            >
              <Edit className="h-4 w-4" />
            </button>
          )}
          {onDelete && (
            <button
              onClick={() => onDelete(item._id)}
              className="p-2 bg-gray-700 text-gray-300 rounded hover:bg-red-600 hover:text-white transition-colors"
              title="Delete menu item"
            >
              <Trash2 className="h-4 w-4" />
            </button>
          )}
        </div>
      </div>
      
      {/* Metadata */}
      <div className="mt-4 pt-4 border-t border-gray-700">
        <p className="text-gray-500 text-xs">
          Added: {new Date(item.createdAt).toLocaleDateString()}
          {item.updatedAt !== item.createdAt && (
            <span className="ml-2">
              • Updated: {new Date(item.updatedAt).toLocaleDateString()}
            </span>
          )}
        </p>
      </div>
    </div>
  );
}