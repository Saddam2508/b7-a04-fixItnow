import { NextFunction, Request, Response } from "express";
import httpStatus from "http-status";
import { catchAsync } from "../../utils/catchAsync";
import { sendResponse } from "../../utils/sendResponse";
import { technicianService } from "./technician.service";

const createTechnicianProfile = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const userId = req.user?.id as string;
    const payload = req.body;

    const technicianProfile =
      await technicianService.createTechnicianProfileIntoDB(userId, payload);

    sendResponse(res, {
      success: true,
      statusCode: httpStatus.CREATED,
      message: "Technician profile created successfully",
      data: { technicianProfile },
    });
  },
);

const getAllTechnicianProfiles = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const technicians =
      await technicianService.getAllTechnicianProfilesFromDB();

    sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: "Technician profiles fetched successfully",
      data: { technicians },
    });
  },
);

const getSingleTechnicianProfile = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;

    const technician = await technicianService.getSingleTechnicianProfileFromDB(
      id as string,
    );

    sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: "Technician profile fetched successfully",
      data: { technician },
    });
  },
);

const updateTechnicianProfile = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;
    const payload = req.body;

    const updatedTechnician =
      await technicianService.updateTechnicianProfileInDB(
        id as string,
        payload,
      );

    sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: "Technician profile updated successfully",
      data: { updatedTechnician },
    });
  },
);

const deleteTechnicianProfile = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;

    const deletedTechnician =
      await technicianService.deleteTechnicianProfileFromDB(id as string);

    sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: "Technician profile deleted successfully",
      data: { deletedTechnician },
    });
  },
);

export const technicianController = {
  createTechnicianProfile,
  getAllTechnicianProfiles,
  getSingleTechnicianProfile,
  updateTechnicianProfile,
  deleteTechnicianProfile,
};
