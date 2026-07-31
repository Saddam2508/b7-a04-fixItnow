import { NextFunction, Request, Response } from "express";
import httpStatus from "http-status";
import { catchAsync } from "../../utils/catchAsync";
import { sendResponse } from "../../utils/sendResponse";
import { availabilityService } from "./availability.service";

const createAvailability = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const { technicianId } = req.params;
    const payload = req.body;

    const availability = await availabilityService.createAvailabilityIntoDB(
      technicianId as string,
      payload,
    );

    sendResponse(res, {
      success: true,
      statusCode: httpStatus.CREATED,
      message: "Availability slot created successfully",
      data: { availability },
    });
  },
);

const getAvailabilityForTechnician = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const { technicianId } = req.params;

    const availability =
      await availabilityService.getAvailabilityForTechnicianFromDB(technicianId as string);

    sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: "Availability fetched successfully",
      data: { availability },
    });
  },
);

const updateAvailability = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;
    const payload = req.body;

    const updatedAvailability = await availabilityService.updateAvailabilityInDB(
      id as string,
      payload,
    );

    sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: "Availability slot updated successfully",
      data: { updatedAvailability },
    });
  },
);

const deleteAvailability = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;

    const deletedAvailability = await availabilityService.deleteAvailabilityFromDB(id as string);

    sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: "Availability slot deleted successfully",
      data: { deletedAvailability },
    });
  },
);

export const availabilityController = {
  createAvailability,
  getAvailabilityForTechnician,
  updateAvailability,
  deleteAvailability,
};
