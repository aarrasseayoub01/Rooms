import express from 'express';

import {update, myRoom, create} from '../controllers/room.js'

const router = express.Router();
//les urls qu'on peut acceder concernant les users.

router.get('/:roomId', myRoom)
router.post('/', create);
router.put("/:id", update);

export default router;