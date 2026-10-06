import mongoose from 'mongoose';
import Location from '../models/Location.js';
import AppError from '../utils/AppError.js';

export const getLocations = async (req, res, next) => {
  try {
    const locations = await Location.find().sort({ name: 1 });
    res.status(200).json(locations);
  } catch (error) {
    next(error);
  }
};

export const getLocation = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      throw new AppError(400, 'Location identifier is invalid.');
    }

    const location = await Location.findById(id);

    if (!location) {
      throw new AppError(404, 'Location not found.');
    }

    res.status(200).json(location);
  } catch (error) {
    next(error);
  }
};
