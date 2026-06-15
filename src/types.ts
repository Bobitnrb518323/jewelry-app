export interface BlockchainCertificate {
  certificateId: string;
  mintedAddress: string;
  minedSource: string;
  mineralPurity: string;
  weightCarat: number;
  cutSpecification: string;
  ethicallySourced: boolean;
  blockchainTimestamp: string;
}

export interface Review {
  id: string;
  userName: string;
  rating: number;
  comment: string;
  date: string;
}

export interface Product {
  id: string;
  name: string;
  description: string;
  priceKSh: number; // Price in Kenyan Shillings
  category: 'rings' | 'necklaces' | 'bracelets' | 'earrings';
  image: string; // URL path of high quality jewelry photo
  material: string; // e.g. "24K Gold", "950 Platinum", "18K Rose Gold"
  gemstone: string; // e.g. "Ethical Diamond", "Madagascar Sapphire", "Natural Emerald"
  stars: number;
  stock: number;
  tryOnOffset: {
    scale: number;
    rotation: number;
    yOffset: number; // X and Y position modifications in AR
    xOffset: number;
  };
  certificate: BlockchainCertificate;
  reviews: Review[];
}

export interface CartItem {
  product: Product;
  quantity: number;
}

export type OrderStatus = 'placed' | 'verified' | 'shipped' | 'delivered';

export interface TrackingEvent {
  status: OrderStatus;
  title: string;
  description: string;
  timestamp: string;
  completed: boolean;
}

export interface Order {
  id: string;
  customerName: string;
  email: string;
  phone: string;
  address: string;
  items: {
    productId: string;
    name: string;
    priceKSh: number;
    quantity: number;
  }[];
  subtotal: number;
  shipping: number;
  vat: number;
  total: number;
  date: string;
  status: OrderStatus;
  paymentMethod: 'mpesa' | 'card';
  trackingEvents: TrackingEvent[];
}

export interface Customer {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: 'customer' | 'admin';
  status: 'active' | 'suspended';
  dateJoined: string;
}

export interface AppState {
  products: Product[];
  orders: Order[];
  customers: Customer[];
  currentUser: Customer | null;
}
