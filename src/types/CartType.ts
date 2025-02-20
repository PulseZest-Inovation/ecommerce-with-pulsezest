
export interface CartType {
  id: string;
  productTitle: string;
  price: number;
  quantity: number;
  image: string;
  slug: string;
  productId: string;
  isReadyToWear?: boolean; // Made optional if not always required
  readyToWearCharges?: number; // Made optional if not always required
}
