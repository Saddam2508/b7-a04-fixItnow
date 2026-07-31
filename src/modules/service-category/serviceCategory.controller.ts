import { NextFunction, Request, Response } from "express";
import httpStatus from "http-status";
import { catchAsync } from "../../utils/catchAsync";
import { sendResponse } from "../../utils/sendResponse";
import { serviceCategoryService } from "./serviceCategory.service";

const createServiceCategory = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const payload = req.body;

    const serviceCategory =
      await serviceCategoryService.createServiceCategoryIntoDB(payload);

    sendResponse(res, {
      success: true,
      statusCode: httpStatus.CREATED,
      message: "Service category created successfully",
      data: { serviceCategory },
    });
  },
);

const getAllServiceCategories = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const serviceCategories =
      await serviceCategoryService.getAllServiceCategoriesFromDB();

    sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: "Service categories fetched successfully",
      data: { serviceCategories },
    });
  },
);

const getSingleServiceCategory = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;

    const serviceCategory =
      await serviceCategoryService.getSingleServiceCategoryFromDB(id as string);

    sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: "Service category fetched successfully",
      data: { serviceCategory },
    });
  },
);

const updateServiceCategory = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;
    const payload = req.body;

    const updatedServiceCategory =
      await serviceCategoryService.updateServiceCategoryInDB(
        id as string,
        payload,
      );

    sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: "Service category updated successfully",
      data: { updatedServiceCategory },
    });
  },
);

const deleteServiceCategory = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;

    const deletedServiceCategory =
      await serviceCategoryService.deleteServiceCategoryFromDB(id as string);

    sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: "Service category deleted successfully",
      data: { deletedServiceCategory },
    });
  },
);

export const serviceCategoryController = {
  createServiceCategory,
  getAllServiceCategories,
  getSingleServiceCategory,
  updateServiceCategory,
  deleteServiceCategory,
};
