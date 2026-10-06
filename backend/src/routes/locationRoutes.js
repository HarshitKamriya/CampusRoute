import express from 'express';
import { getLocation, getLocations } from '../controllers/locationController.js';

const router = express.Router();

router.get('/', getLocations);
router.get('/:id', getLocation);

export default router;
