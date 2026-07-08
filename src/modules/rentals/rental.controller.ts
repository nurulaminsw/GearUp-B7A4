import { Request, Response } from "express";

const createRental = async (req: Request, res: Response) => {
  res.status(200).json({
    success: true,
    message: "createRental controller working (not implemented yet)",
  });
};

const getMyRentals = async (req: Request, res: Response) => {
  res.status(200).json({
    success: true,
    message: "getMyRentals controller working (not implemented yet)",
  });
};

const getRentalDetails = async (req: Request, res: Response) => {
  res.status(200).json({
    success: true,
    message: "getRentalDetails controller working (not implemented yet)",
    id: req.params.id,
  });
};

export const rentalController = {
  createRental,
  getMyRentals,
  getRentalDetails,
};