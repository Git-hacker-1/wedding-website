import { Router } from 'express';
import { lookupByName, getRsvpStatus, getGroupById, submitRsvp } from '../controllers/rsvpController.js';
import { asyncHandler } from '../middleware/asyncHandler.js';
import { validate } from '../middleware/validate.js';
import { lookupQuerySchema, rsvpGroupParamsSchema, submitRsvpSchema } from '../schemas/rsvp.js';

const router = Router();

// Must be before any :param routes
router.get('/lookup', validate({ query: lookupQuerySchema }), asyncHandler(lookupByName));
router.get('/status', getRsvpStatus);
router.get('/group/:groupId', validate({ params: rsvpGroupParamsSchema }), asyncHandler(getGroupById));

// Submit or update group RSVP (same endpoint for both)
router.post('/', validate({ body: submitRsvpSchema }), asyncHandler(submitRsvp));

export default router;
