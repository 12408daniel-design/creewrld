export interface WhatsAppTeller {
  id: number;
  name: string;
  number: string;
}

export const WHATSAPP_TELLERS: WhatsAppTeller[] = [
  { id: 1, name: 'Teller 1 (Nairobi Central Desk)', number: '254719526649' },
  { id: 2, name: 'Teller 2 (Express Dispatch)', number: '254745820133' },
  { id: 3, name: 'Teller 3 (Archive & VIP Desk)', number: '254745820133' },
];
