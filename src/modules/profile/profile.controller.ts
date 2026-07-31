import { NextFunction, Request, Response } from "express";
import httpStatus from "http-status";
import { catchAsync } from "../../utils/catchAsync";
import { sendResponse } from "../../utils/sendResponse";
import { profileService } from "./profile.service";

const createProfile = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const userId = req.user?.id as string;
    const payload = req.body;

    const profile = await profileService.createProfileIntoDB(userId, payload);

    sendResponse(res, {
      success: true,
      statusCode: httpStatus.CREATED,
      message: "Profile created successfully",
      data: { profile },
    });
  },
);

const getAllProfiles = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const profiles = await profileService.getAllProfilesFromDB();

    sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: "Profiles fetched successfully",
      data: { profiles },
    });
  },
);

const getSingleProfile = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;

    const profile = await profileService.getSingleProfileFromDB(id as string);

    sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: "Profile fetched successfully",
      data: { profile },
    });
  },
);

const updateProfile = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;
    const payload = req.body;

    const updatedProfile = await profileService.updateProfileInDB(
      id as string,
      payload,
    );

    sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: "Profile updated successfully",
      data: { updatedProfile },
    });
  },
);

const deleteProfile = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;

    const deletedProfile = await profileService.deleteProfileFromDB(
      id as string,
    );

    sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: "Profile deleted successfully",
      data: { deletedProfile },
    });
  },
);

export const profileController = {
  createProfile,
  getAllProfiles,
  getSingleProfile,
  updateProfile,
  deleteProfile,
};
