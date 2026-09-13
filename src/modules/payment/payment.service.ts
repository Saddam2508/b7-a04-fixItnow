import { PaymentStatus, Role } from "../../../generated/prisma/enums";
import config from "../../config";
import { prisma } from "../../lib/prisma";
import { stripe } from "../../lib/stripe";
import {
  TConfirmPayment,
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

const createCheckoutSession = async (userId: string) => {
  const transactionResult = await prisma.$transaction(async (tx) => {
    const user = await tx.user.findUniqueOrThrow({
      where: {
        id: userId,
      },
      include: {
        payments: true,
      },
    });
    const payment = user.payments.find((payment) => payment.stripeCustomerId);

    let stripeCustomerId = payment?.stripeCustomerId;

    if (!stripeCustomerId) {
      const customer = await stripe.customers.create({
        email: user.email,
        name: user.name,
        metadata: {
          userId: user.id,
        },
      });

      stripeCustomerId = customer.id;
    }
    const session = await stripe.checkout.sessions.create({
      line_items: [
        {
          price: config.stripe_price_id,
          quantity: 1,
        },
      ],
      mode: "payment",
      customer: stripeCustomerId,
      payment_method_types: ["card"],
      success_url: `${config.app_url}/premium?success=true`,
      cancel_url: `${config.app_url}/payment?success=false`,
      metadata: { userId: user.id },
    });
    return session.url;
  });
  return { paymentUrl: transactionResult };
};

const getAllPaymentsFromDB = async (userId: string, role: Role) => {
  const payments = await prisma.payment.findMany({
    where:
      role === Role.ADMIN
        ? {}
        : role === Role.TECHNICIAN
          ? { booking: { technician: { userId } } }
          : { booking: { customerId: userId } },
    include: { booking: true },
  });

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

const updatePaymentStatusInDB = async (
  id: string,
  payload: TUpdatePaymentStatus,
) => {
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

const confirmPaymentInDB = async (payload: TConfirmPayment) => {
  const payment = await prisma.payment.findUnique({
    where: { bookingId: payload.bookingId },
  });

  if (!payment) {
    throw new Error("Payment not found for this booking");
  }

  const confirmedPayment = await prisma.payment.update({
    where: { id: payment.id },
    data: {
      transactionId: payload.transactionId,
      status: payload.status,
      paidAt: payload.status === PaymentStatus.PAID ? new Date() : undefined,
    },
  });

  return confirmedPayment;
};

const deletePaymentFromDB = async (id: string) => {
  await getSinglePaymentFromDB(id);

  const deletedPayment = await prisma.payment.delete({ where: { id } });

  return deletedPayment;
};

export const paymentService = {
  createPaymentIntoDB,
  createCheckoutSession,
  getAllPaymentsFromDB,
  getSinglePaymentFromDB,
  getPaymentByBookingFromDB,
  confirmPaymentInDB,
  updatePaymentInDB,
  updatePaymentStatusInDB,
  deletePaymentFromDB,
};
