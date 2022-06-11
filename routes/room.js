import express from 'express';

import {update, myRoom, create, getRooms, allRooms} from '../controllers/room.js'

const router = express.Router();
//les urls qu'on peut acceder concernant les users.

router.get("/allrooms",allRooms);
router.get('/:roomId', myRoom);
router.get('/a/:userId', getRooms);
router.post('/', create);
router.put("/:id", update);

export default router;