import express from 'express';
import {updateUser, deleteAUser, getAUser, getAllUser, getMonthlyStats } from '../controllers/user';
import { verifyToken } from '../controllers/authUser';

const router = express.Router();

/* register */
router.get('/', verifyToken, getAllUser)
router.get('/stats', getMonthlyStats)
router.get('/find/:id', getAUser);

router.post('/update/:id', verifyToken, updateUser);


router.delete('/delete/:id', verifyToken, deleteAUser);





export default router;