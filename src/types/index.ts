// User Types
export type UserRole = 'admin' | 'user';

export interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  department?: string;
  createdAt: Date;
  updatedAt: Date;
}

// Vendor Types
export interface Vendor {
  id: string;
  name: string;
  email: string;
  phone: string;
  address: {
    street: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
  };
  taxId?: string;
  paymentTerms: number; // days
  status: 'active' | 'inactive';
  rating?: number;
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

// Product Types
export interface Product {
  id: string;
  name: string;
  description: string;
  sku: string;
  category: string;
  unit: string; // pieces, kg, liters, etc.
  price: number;
  currency: string;
  vendorId: string;
  vendorName: string;
  minOrderQuantity?: number;
  leadTime?: number; // days
  status: 'active' | 'inactive';
  createdAt: Date;
  updatedAt: Date;
}

// Purchase Order Types
export interface PurchaseOrderItem {
  id: string;
  productId: string;
  productName: string;
  productSku: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
  currency: string;
  notes?: string;
}

export interface PurchaseOrder {
  id: string;
  poNumber: string;
  vendorId: string;
  vendorName: string;
  vendorEmail: string;
  items: PurchaseOrderItem[];
  subtotal: number;
  tax: number;
  total: number;
  currency: string;
  status: 'draft' | 'pending' | 'approved' | 'rejected' | 'ordered' | 'received' | 'cancelled';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  expectedDeliveryDate?: Date;
  notes?: string;
  terms?: string;
  createdBy: string;
  approvedBy?: string;
  approvedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

// Invoice Types
export interface Invoice {
  id: string;
  invoiceNumber: string;
  poId: string;
  poNumber: string;
  vendorId: string;
  vendorName: string;
  items: PurchaseOrderItem[];
  subtotal: number;
  tax: number;
  total: number;
  currency: string;
  status: 'pending' | 'approved' | 'paid' | 'rejected';
  dueDate: Date;
  paidDate?: Date;
  paymentMethod?: string;
  notes?: string;
  generatedBy: string;
  approvedBy?: string;
  approvedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

// Analytics Types
export interface SpendingAnalytics {
  totalSpent: number;
  totalOrders: number;
  averageOrderValue: number;
  topVendors: Array<{
    vendorId: string;
    vendorName: string;
    totalSpent: number;
    orderCount: number;
  }>;
  spendingByCategory: Array<{
    category: string;
    totalSpent: number;
    percentage: number;
  }>;
  monthlySpending: Array<{
    month: string;
    totalSpent: number;
    orderCount: number;
  }>;
}

// AI Assistant Types
export interface AIMessage {
  id: string;
  type: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  metadata?: {
    poId?: string;
    vendorId?: string;
    productId?: string;
  };
}

export interface AIConversation {
  id: string;
  title: string;
  messages: AIMessage[];
  createdAt: Date;
  updatedAt: Date;
}

// API Response Types
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

// Filter and Search Types
export interface FilterOptions {
  status?: string[];
  vendorId?: string;
  dateRange?: {
    start: Date;
    end: Date;
  };
  priority?: string[];
  category?: string[];
}

export interface SortOptions {
  field: string;
  direction: 'asc' | 'desc';
}

// Form Types
export interface CreatePurchaseOrderForm {
  vendorId: string;
  items: Array<{
    productId: string;
    quantity: number;
    unitPrice: number;
    notes?: string;
  }>;
  expectedDeliveryDate?: Date;
  notes?: string;
  terms?: string;
  priority: 'low' | 'medium' | 'high' | 'urgent';
}

export interface CreateVendorForm {
  name: string;
  email: string;
  phone: string;
  address: {
    street: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
  };
  taxId?: string;
  paymentTerms: number;
  notes?: string;
}

export interface CreateProductForm {
  name: string;
  description: string;
  sku: string;
  category: string;
  unit: string;
  price: number;
  currency: string;
  vendorId: string;
  minOrderQuantity?: number;
  leadTime?: number;
} 