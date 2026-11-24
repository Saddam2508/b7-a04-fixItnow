import { Stripe } from "stripe";
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

// const handleWebhook = async (payload: Buffer, signature: string) => {
//   const endpointSecret = config.stripe_webhook_secret;

//   const event = stripe.webhooks.constructEvent(
//     payload,
//     signature,
//     endpointSecret,
//   );

//   switch (event.type) {
//     case "checkout.session.completed": {
//       const session = event.data.object as Stripe.Checkout.Session;

//       const userId = session.metadata?.userId;

//       const stripeCustomerId =
//         typeof session.customer === "string"
//           ? session.customer
//           : session.customer?.id;

//       const paymentIntentId =
//         typeof session.payment_intent === "string"
//           ? session.payment_intent
//           : session.payment_intent?.id;

//       if (!userId || !stripeCustomerId || !paymentIntentId) {
//         throw new Error("Payment data is incomplete");
//       }

//       if (session.payment_status !== "paid") {
//         throw new Error("Payment is not completed");
//       }

//       const payment = await prisma.payment.upsert({
//         where: {
//           userId,
//         },

//         create: {
//           userId,
//           stripeCustomerId,
//           amount: (session.amount_total ?? 0) / 100,
//           method: "STRIPE",
//           status: "PAID",
//           transactionId: paymentIntentId,
//           paidAt: new Date(),
//         },

//         update: {
//           stripeCustomerId,
//           amount: (session.amount_total ?? 0) / 100,
//           method: "STRIPE",
//           status: "PAID",
//           transactionId: paymentIntentId,
//           paidAt: new Date(),
//         },
//       });

//       break;
//     }

//     default:
//       console.log(`Unhandled event type ${event.type}.`);
//       break;
//   }
// };

const handleWebhook = async (payload: Buffer, signature: string) => {
  let event: Stripe.Event;

  // 1. Verify Stripe webhook signature
  try {
    event = stripe.webhooks.constructEvent(
      payload,
      signature,
      config.stripe_webhook_secret,
    );
  } catch (error) {
    const message =
      error instanceof Error
        ? error.message
        : "Invalid Stripe webhook signature";

    throw new Error(`Webhook Error: ${message}`);
  }

  // 2. Handle Stripe events
  switch (event.type) {
    case "checkout.session.completed": {
      const session = event.data.object as Stripe.Checkout.Session;

      const paymentId = session.metadata?.paymentId;

      if (!paymentId || session.payment_status !== "paid") {
        break;
      }

      const transactionId =
        typeof session.payment_intent === "string"
          ? session.payment_intent
          : session.payment_intent?.id;

      if (!transactionId) {
        throw new Error("Stripe payment transaction ID not found");
      }

      await prisma.payment.updateMany({
        where: {
          id: paymentId,
          status: "PENDING",
        },
        data: {
          status: "PAID",
          transactionId,
          paidAt: new Date(),
        },
      });

      break;
    }

    case "checkout.session.async_payment_failed":
    case "checkout.session.expired": {
      const session = event.data.object as Stripe.Checkout.Session;

      const paymentId = session.metadata?.paymentId;

      if (paymentId) {
        await prisma.payment.updateMany({
          where: {
            id: paymentId,
            status: "PENDING",
          },
          data: {
            status: "FAILED",
          },
        });
      }

      break;
    }

    default:
      console.log(`Unhandled event type: ${event.type}`);
      break;
  }

  // 3. Return webhook acknowledgement
  return { received: true };
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

const createBookingCheckoutSession = async (
  bookingId: string,
  userId: string,
) => {
  const booking = await prisma.booking.findUnique({
    where: { id: bookingId },
    include: {
      customer: true,
      service: true,
      payment: true,
    },
  });

  if (!booking) {
    throw new Error("Booking not found");
  }

  if (booking.customerId !== userId) {
    throw new Error("You are not authorized to pay for this booking");
  }

  if (booking.status !== "COMPLETED") {
    throw new Error("Payment is only available after service completion");
  }

  if (booking.payment?.status === "PAID") {
    throw new Error("This booking has already been paid");
  }

  if (booking.payment?.status === "PENDING") {
    throw new Error("A payment is already pending for this booking");
  }

  const user = await prisma.user.findUnique({
    where: { id: userId },
  });

  if (!user) {
    throw new Error("Customer not found");
  }

  const existingStripeCustomer = await prisma.payment.findFirst({
    where: { userId },
    select: { stripeCustomerId: true },
  });

  let customerId = existingStripeCustomer?.stripeCustomerId;

  if (!customerId) {
    const customer = await stripe.customers.create({
      email: user.email,
      name: user.name,
      metadata: {
        userId,
      },
    });

    customerId = customer.id;
  }

  // Create or reuse payment record
  const payment = booking.payment
    ? await prisma.payment.update({
        where: { id: booking.payment.id },
        data: {
          status: "PENDING",
          transactionId: null,
          paidAt: null,
          stripeCustomerId: customerId,
          amount: booking.service.price,
        },
      })
    : await prisma.payment.create({
        data: {
          bookingId,
          userId,
          stripeCustomerId: customerId,
          amount: booking.service.price,
          method: "STRIPE",
          status: "PENDING",
        },
      });

  try {
    const session = await stripe.checkout.sessions.create({
      customer: customerId,
      mode: "payment",
      line_items: [
        {
          price_data: {
            currency: "bdt",
            product_data: {
              name: booking.service.title,
              ...(booking.service.description
                ? { description: booking.service.description }
                : {}),
            },
            unit_amount: Math.round(booking.service.price * 100),
          },
          quantity: 1,
        },
      ],
      success_url: `${config.app_url}/dashboard/customer/payments/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${config.app_url}/dashboard/customer/payments/cancel`,
      metadata: {
        paymentId: payment.id,
        bookingId,
        userId,
      },
    });

    if (!session.url) {
      throw new Error("Unable to create Stripe checkout URL");
    }

    return {
      paymentUrl: session.url,
      sessionId: session.id,
    };
  } catch (error) {
    await prisma.payment.update({
      where: { id: payment.id },
      data: { status: "FAILED" },
    });

    throw error;
  }
};

const verifyBookingCheckoutSession = async (
  sessionId: string,
  userId: string,
) => {
  if (!sessionId) {
    throw new Error("Stripe session ID is required");
  }

  const session = await stripe.checkout.sessions.retrieve(sessionId);

  const paymentId = session.metadata?.paymentId;
  const bookingId = session.metadata?.bookingId;
  const sessionUserId = session.metadata?.userId;

  if (!paymentId || !bookingId || !sessionUserId) {
    throw new Error("Invalid Stripe Checkout Session metadata");
  }

  if (sessionUserId !== userId) {
    throw new Error("You are not authorized to verify this payment");
  }

  if (session.mode !== "payment" || session.payment_status !== "paid") {
    return {
      verified: false,
      message: "Stripe payment has not been completed yet.",
    };
  }

  const payment = await prisma.payment.findFirst({
    where: {
      id: paymentId,
      userId,
      bookingId,
    },
    select: {
      id: true,
      bookingId: true,
      status: true,
    },
  });

  if (!payment) {
    throw new Error("Payment record not found");
  }

  // Webhook database status PAID না করা পর্যন্ত redirect নয়।
  if (payment.status !== "PAID") {
    return {
      verified: false,
      message: "Payment is awaiting webhook confirmation.",
    };
  }

  return {
    verified: true,
    bookingId: payment.bookingId,
    paymentId: payment.id,
    status: payment.status,
  };
};

export const paymentService = {
  createPaymentIntoDB,
  createCheckoutSession,
  handleWebhook,
  getAllPaymentsFromDB,
  getSinglePaymentFromDB,
  getPaymentByBookingFromDB,
  confirmPaymentInDB,
  updatePaymentInDB,
  updatePaymentStatusInDB,
  deletePaymentFromDB,
  createBookingCheckoutSession,
  verifyBookingCheckoutSession,
};
