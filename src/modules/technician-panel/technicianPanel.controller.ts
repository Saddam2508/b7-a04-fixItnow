import { NextFunction, Request, Response } from "express";
import httpStatus from "http-status";
import { catchAsync } from "../../utils/catchAsync";
import { sendResponse } from "../../utils/sendResponse";
import { technicianService } from "../technician/technician.service";
import { availabilityService } from "../availability/availability.service";
import { bookingService } from "../booking/booking.service";

const updateMyTechnicianProfile = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const userId = req.user?.id as string;
    const payload = req.body;

    const updatedProfile =
      await technicianService.updateTechnicianProfileByUserIdInDB(
        userId,
        payload,
      );

    sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: "Technician profile updated successfully",
      data: { updatedProfile },
    });
  },
);

const updateMyAvailability = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const userId = req.user?.id as string;
    const { availability } = req.body;

    const technicianProfile =
      await technicianService.getTechnicianProfileByUserIdFromDB(userId);

    const updatedAvailability =
      await availabilityService.replaceAvailabilityForTechnicianInDB(
        technicianProfile.id,
        availability,
      );

    sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: "Availability updated successfully",
      data: { availability: updatedAvailability },
    });
  },
);

const getMyBookings = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const userId = req.user?.id as string;

    const bookings =
      await bookingService.getBookingsForTechnicianUserFromDB(userId);

    sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: "Bookings fetched successfully",
      data: { bookings },
    });
  },
);

const updateMyBookingStatus = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const userId = req.user?.id as string;
    const { id } = req.params;
    const payload = req.body;

    const updatedBooking =
      await bookingService.updateBookingStatusForTechnicianUserInDB(
        userId,
        id as string,
        payload,
      );

    sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: "Booking status updated successfully",
      data: { updatedBooking },
    });
  },
);

export const technicianPanelController = {
  updateMyTechnicianProfile,
  updateMyAvailability,
  getMyBookings,
  updateMyBookingStatus,
};
