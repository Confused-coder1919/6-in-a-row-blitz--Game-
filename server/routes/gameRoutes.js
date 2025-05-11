import express from 'express';
import { createGame, joinGame, getAvailableGames } from '../controllers/gameController.js';

const router = express.Router();

router.post('/create', createGame);
router.post('/join', joinGame);
router.get('/available', getAvailableGames);

export default router;