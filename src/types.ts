/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export type SupportCategory =
  | 'Food'
  | 'Education'
  | 'Employment'
  | 'Groceries'
  | 'Medical Aid'
  | 'Dresses'
  | 'Financial';

export interface NeedRequest {
  id: string;
  category: SupportCategory;
  title: string;
  description: string;
  location: string;
  beneficiaryName: string;
  urgency: 'Low' | 'Medium' | 'High';
  status: 'Pending' | 'Pledged' | 'Fulfilled';
  requestedAt: string;
  pledgedBy?: string;
  verificationPhoto?: string;
  fulfillmentDetails?: string;
}

export interface VolunteerDrive {
  id: string;
  title: string;
  description: string;
  date: string;
  time: string;
  location: string;
  category: SupportCategory;
  spotsMax: number;
  spotsRegistered: number;
  coordinatorName: string;
  coordinatorPhone: string;
}

export interface VolunteerSignup {
  id: string;
  driveId: string;
  name: string;
  email: string;
  phone: string;
  status: 'Confirmed' | 'Cancelled';
}

export interface Campaign {
  id: string;
  title: string;
  category: SupportCategory;
  description: string;
  targetAmount: number;
  currentAmount: number;
  unit: string; // e.g. "Meals", "Uniform Kits", "Scholarships", "Rupees"
  costPerUnit: number; // Cost in INR to sponsor 1 unit
  image: string;
}

export interface FinancialDonation {
  id: string;
  donorName: string;
  amount: number;
  category: SupportCategory | 'General';
  message?: string;
  timestamp: string;
  transactionHash: string; // Simulated cryptographic hash for ledger transparency
  frequency?: 'one-time' | 'monthly' | 'quarterly';
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'model';
  text: string;
  timestamp: string;
}

export interface ImpactStory {
  id: string;
  title: string;
  category: SupportCategory;
  description: string;
  statText: string;
  imageUrl: string;
}
