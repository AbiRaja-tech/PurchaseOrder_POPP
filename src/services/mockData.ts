import { PurchaseOrder, Vendor, Product, SpendingAnalytics } from '../types';

// Mock Purchase Orders
export const mockPurchaseOrders: PurchaseOrder[] = [
  {
    id: '1',
    poNumber: 'PO-2024-001',
    vendorId: 'v1',
    vendorName: 'ABC Suppliers',
    vendorEmail: 'contact@abcsuppliers.com',
    items: [
      {
        id: 'item1',
        productId: 'p1',
        productName: 'Laptop',
        productSku: 'LAP-001',
        quantity: 5,
        unitPrice: 1200,
        totalPrice: 6000,
        currency: 'USD',
      }
    ],
    subtotal: 6000,
    tax: 300,
    total: 6300,
    currency: 'USD',
    status: 'pending',
    priority: 'high',
    expectedDeliveryDate: new Date('2024-02-15'),
    createdBy: 'admin@example.com',
    createdAt: new Date('2024-01-15'),
    updatedAt: new Date('2024-01-15'),
  },
  {
    id: '2',
    poNumber: 'PO-2024-002',
    vendorId: 'v2',
    vendorName: 'XYZ Electronics',
    vendorEmail: 'sales@xyzelectronics.com',
    items: [
      {
        id: 'item2',
        productId: 'p2',
        productName: 'Monitor',
        productSku: 'MON-002',
        quantity: 10,
        unitPrice: 300,
        totalPrice: 3000,
        currency: 'USD',
      }
    ],
    subtotal: 3000,
    tax: 150,
    total: 3150,
    currency: 'USD',
    status: 'approved',
    priority: 'medium',
    expectedDeliveryDate: new Date('2024-02-20'),
    createdBy: 'admin@example.com',
    approvedBy: 'approver@example.com',
    approvedAt: new Date('2024-01-16'),
    createdAt: new Date('2024-01-14'),
    updatedAt: new Date('2024-01-16'),
  },
];

// Mock Vendors
export const mockVendors: Vendor[] = [
  {
    id: 'v1',
    name: 'ABC Suppliers',
    email: 'contact@abcsuppliers.com',
    phone: '+1-555-0123',
    address: {
      street: '123 Business Ave',
      city: 'New York',
      state: 'NY',
      zipCode: '10001',
      country: 'USA',
    },
    taxId: 'TAX123456',
    paymentTerms: 30,
    status: 'active',
    rating: 4.5,
    createdAt: new Date('2023-01-01'),
    updatedAt: new Date('2024-01-01'),
  },
  {
    id: 'v2',
    name: 'XYZ Electronics',
    email: 'sales@xyzelectronics.com',
    phone: '+1-555-0456',
    address: {
      street: '456 Tech Street',
      city: 'San Francisco',
      state: 'CA',
      zipCode: '94102',
      country: 'USA',
    },
    taxId: 'TAX789012',
    paymentTerms: 45,
    status: 'active',
    rating: 4.8,
    createdAt: new Date('2023-02-01'),
    updatedAt: new Date('2024-01-01'),
  },
];

// Mock Products
export const mockProducts: Product[] = [
  {
    id: 'p1',
    name: 'Laptop',
    description: 'High-performance laptop for business use',
    sku: 'LAP-001',
    category: 'Electronics',
    unit: 'pieces',
    price: 1200,
    currency: 'USD',
    vendorId: 'v1',
    vendorName: 'ABC Suppliers',
    minOrderQuantity: 1,
    leadTime: 7,
    status: 'active',
    createdAt: new Date('2023-01-01'),
    updatedAt: new Date('2024-01-01'),
  },
  {
    id: 'p2',
    name: 'Monitor',
    description: '24-inch LED monitor',
    sku: 'MON-002',
    category: 'Electronics',
    unit: 'pieces',
    price: 300,
    currency: 'USD',
    vendorId: 'v2',
    vendorName: 'XYZ Electronics',
    minOrderQuantity: 1,
    leadTime: 5,
    status: 'active',
    createdAt: new Date('2023-01-01'),
    updatedAt: new Date('2024-01-01'),
  },
];

// Mock Analytics
export const mockSpendingAnalytics: SpendingAnalytics = {
  totalSpent: 9450,
  totalOrders: 2,
  averageOrderValue: 4725,
  topVendors: [
    {
      vendorId: 'v1',
      vendorName: 'ABC Suppliers',
      totalSpent: 6300,
      orderCount: 1,
    },
    {
      vendorId: 'v2',
      vendorName: 'XYZ Electronics',
      totalSpent: 3150,
      orderCount: 1,
    },
  ],
  spendingByCategory: [
    {
      category: 'Electronics',
      totalSpent: 9450,
      percentage: 100,
    },
  ],
  monthlySpending: [
    {
      month: 'Jan 2024',
      totalSpent: 9450,
      orderCount: 2,
    },
  ],
};

// Mock API responses
export const createMockResponse = <T>(data: T) => ({
  success: true,
  data,
  message: 'Success',
});

export const createMockPaginatedResponse = <T>(data: T[], page: number = 1, limit: number = 10) => ({
  success: true,
  data,
  pagination: {
    page,
    limit,
    total: data.length,
    totalPages: Math.ceil(data.length / limit),
  },
  message: 'Success',
}); 