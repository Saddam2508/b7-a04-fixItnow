import { NextFunction, Request, Response } from "express";
import httpStatus from "http-status";
import { catchAsync } from "../../utils/catchAsync";
import { sendResponse } from "../../utils/sendResponse";
import { paymentService } from "./payment.service";
import { Role } from "../../../generated/prisma/enums";

const createPayment = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const payload = req.body;

    const payment = await paymentService.createPaymentIntoDB(payload);

    sendResponse(res, {
      success: true,
      statusCode: httpStatus.CREATED,
      message: "Payment created successfully",
      data: { payment },
    });
  },
);

const getAllPayments = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const userId = req.user?.id as string;
    const role = req.user?.role as Role;

    const payments = await paymentService.getAllPaymentsFromDB(userId, role);

    sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: "Payments fetched successfully",
      data: { payments },
    });
  },
);

const getSinglePayment = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;

    const payment = await paymentService.getSinglePaymentFromDB(id as string);

    sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: "Payment fetched successfully",
      data: { payment },
    });
  },
);

const getPaymentByBooking = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const { bookingId } = req.params;

    const payment = await paymentService.getPaymentByBookingFromDB(
      bookingId as string,
    );

    sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: "Payment fetched successfully",
      data: { payment },
    });
  },
);

const confirmPayment = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const payload = req.body;

    const confirmedPayment = await paymentService.confirmPaymentInDB(payload);

    sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: "Payment confirmed successfully",
      data: { confirmedPayment },
    });
  },
);

const updatePayment = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;
    const payload = req.body;

    const updatedPayment = await paymentService.updatePaymentInDB(
      id as string,
      payload,
    );

    sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: "Payment updated successfully",
      data: { updatedPayment },
    });
  },
);

const updatePaymentStatus = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;
    const payload = req.body;

    const updatedPayment = await paymentService.updatePaymentStatusInDB(
      id as string,
      payload,
    );

    sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: "Payment status updated successfully",
      data: { updatedPayment },
    });
  },
);

const deletePayment = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;

    const deletedPayment = await paymentService.deletePaymentFromDB(
      id as string,
    );

    sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: "Payment deleted successfully",
      data: { deletedPayment },
    });
  },
);

export const paymentController = {
  createPayment,
  confirmPayment,
  getAllPayments,
  getSinglePayment,
  getPaymentByBooking,
  updatePayment,
  updatePaymentStatus,
  deletePayment,
};
