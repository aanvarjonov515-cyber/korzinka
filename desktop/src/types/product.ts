export type ProductType = 'STANDARD' | 'WEIGHTED' | 'SERVICE' | 'BUNDLE' | 'COMPOSITE';
export type ProductStatus = 'DRAFT' | 'ACTIVE' | 'INACTIVE' | 'ARCHIVED';

export interface ProductVariantItem {
  id: string;
  sku: string;
  barcode?: string;
  name: string;
  attributes?: Record<string, string>;
  purchasePriceOverride?: number;
  sellingPriceOverride?: number;
}

export interface ProductItem {
  id: string;
  businessId: string;
  sku: string;
  barcode?: string;
  name: string;
  shortName?: string;
  categoryId: string;
  categoryName?: string;
  brandId?: string;
  brandName?: string;
  unitId: string;
  unitCode?: string;
  description?: string;
  productType: ProductType;
  status: ProductStatus;
  mxikCode?: string;
  taxCategory?: string;
  manufacturer?: string;
  countryOfOrigin?: string;
  isWeighted: boolean;
  requiresExpiryTracking: boolean;
  requiresBatchTracking: boolean;
  requiresSerialTracking: boolean;
  minimumStock?: number;
  reorderPoint?: number;
  defaultPurchasePrice?: number;
  defaultSellingPrice?: number;
  currency: string;
  variants?: ProductVariantItem[];
  createdAt: string;
  updatedAt: string;
}

export interface ProductCategoryItem {
  id: string;
  name: string;
  code: string;
  parentId?: string;
  status: string;
}

export interface BrandItem {
  id: string;
  name: string;
  status: string;
}

export interface UnitItem {
  id: string;
  code: string;
  name: string;
  symbol: string;
  precision: number;
}
