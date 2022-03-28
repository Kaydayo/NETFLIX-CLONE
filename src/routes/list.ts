import express from 'express';
import { createList, getAList, deleteList } from '../controllers/list';
import { verifyToken } from '../controllers/authUser';

const router = express.Router();

/* register */
router.get('/', verifyToken,getAList);


router.post('/', verifyToken, createList);


router.delete('/:id', verifyToken, deleteList);





export default router;