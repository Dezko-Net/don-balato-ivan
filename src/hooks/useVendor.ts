import { createContext, useContext } from 'react';

export interface VendorInfo { vendorId: string; name: string; email: string; minPurchaseAmount: number; }

export const VendorContext = createContext<VendorInfo | null>(null);

export function useVendor() {
  return useContext(VendorContext);
}
