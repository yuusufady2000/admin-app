
export interface User {
  id: number;
  name: string;
  email: string;
  phoneNumber: string;
  birthDate: string;
  storeName: string;
  businessCategory: string;
  country: string;
  city: string;
  address: string;
  status: "pending" | "accepted" | "rejected";
  rejectionMessage?: string;
  createdAt?: string;
  updatedAt?: string;
}

