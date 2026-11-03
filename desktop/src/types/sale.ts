export type SaleStatus =
  | 'OPEN'
  | 'PENDING_PAYMENT'
  | 'COMPLETED'
  | 'PARTIALLY_PAID'
  | 'VOIDED'
  | 'PARTIALLY_RETURNED'
  | 'FULLY_RETURNED'
  | 'FAILED';

export type PaymentStatus =
  | 'UNPAID'
  | 'PARTIALLY_PAID'
  | 'PAID'
  | 'REFUND_PENDING'
  | 'PARTIALLY_REFUNDED'
  | 'REFUNDED'
  | 'FAILED';

export interface CartItem {
  id: string;
  productId: string;
  variantId?: string;
  sku: string;
  barcode?: string;
  name: string;
  quantity: number;
  unitPrice: number;
  originalUnitPrice: number;
  unitCost: number;
  discountAmount: number;
  discountPercent?: number;
  taxAmount: number;
  lineTotal: number;
  isWeighted: boolean;
  unitCode: string;
}

export interface ReceiptItem {
  id: string;
  receiptNumber: string;
  fiscalReference?: string;
  receiptHash: string;
  metadataJson?: Record<string, unknown>;
  generatedAt: string;
}

export interface SaleRecord {
  id: string;
  businessId: string;
  branchId: string;
  registerId: string;
  shiftId: string;
  cashierId: string;
  cashierName?: string;
  customerId?: string;
  customerName?: string;
  saleNumber: string;
  status: SaleStatus;
  paymentStatus: PaymentStatus;
  subtotal: number;
  discountTotal: number;
  taxTotal: number;
  total: number;
  costTotal: number;
  grossProfitSnapshot: number;
  currency: string;
  itemCount: number;
  totalQuantity: number;
  startedAt: string;
  completedAt?: string;
  createdAt: string;
  items: CartItem[];
  receipt?: ReceiptItem;
}
