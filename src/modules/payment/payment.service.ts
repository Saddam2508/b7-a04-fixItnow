import { PaymentStatus } from "../../../generated/prisma/enums";
import { prisma } from "../../lib/prisma";
import {
  TCreatePayment,
  TUpdatePayment,
  TUpdatePaymentStatus,
} from "./payment.interface";

const createPaymentIntoDB = async (payload: TCreatePayment) => {
  const existing = await prisma.payment.findUnique({
    where: { bookingId: payload.bookingId },
  });

  if (existing) {
    throw new Error("Payment already exists for this booking");
  }

  const payment = await prisma.payment.create({ data: payload });

  return payment;
};

const getAllPaymentsFromDB = async () => {
  const payments = await prisma.payment.findMany({ include: { booking: true } });

  return payments;
};

const getSinglePaymentFromDB = async (id: string) => {
  const payment = await prisma.payment.findUnique({
    where: { id },
    include: { booking: true },
  });

  if (!payment) {
    throw new Error("Payment not found");
  }

  return payment;
};

const getPaymentByBookingFromDB = async (bookingId: string) => {
  const payment = await prisma.payment.findUnique({ where: { bookingId } });

  if (!payment) {
    throw new Error("Payment not found");
  }

  return payment;
};

const updatePaymentInDB = async (id: string, payload: TUpdatePayment) => {
  await getSinglePaymentFromDB(id);

  const updatedPayment = await prisma.payment.update({
    where: { id },
    data: payload,
  });

  return updatedPayment;
};

const updatePaymentStatusInDB = async (id: string, payload: TUpdatePaymentStatus) => {
  await getSinglePaymentFromDB(id);

  const updatedPayment = await prisma.payment.update({
    where: { id },
    data: {
      status: payload.status,
      paidAt: payload.status === PaymentStatus.PAID ? new Date() : undefined,
    },
  });

  return updatedPayment;
};

const deletePaymentFromDB = async (id: string) => {
  await getSinglePaymentFromDB(id);

  const deletedPayment = await prisma.payment.delete({ where: { id } });

  return deletedPayment;
};

export const paymentService = {
  createPaymentIntoDB,
  getAllPaymentsFromDB,
  getSinglePaymentFromDB,
  getPaymentByBookingFromDB,
  updatePaymentInDB,
  updatePaymentStatusInDB,
  deletePaymentFromDB,
};
