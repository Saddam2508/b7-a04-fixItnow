import {
  PaymentMethod,
  PaymentStatus,
} from "../../../generated/prisma/enums";

export type TCreatePayment = {
  bookingId: string;
  amount: number;
  method: PaymentMethod;
  transactionId?: string;
};

export type TUpdatePayment = {
  amount?: number;
  method?: PaymentMethod;
  transactionId?: string;
};

export type TUpdatePaymentStatus = {
  status: PaymentStatus;
};
