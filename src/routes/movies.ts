import express from 'express';
import {createMovie, updateMovie, deleteMovie, randomMovie, getAMovie} from '../controllers/movie'
import { verifyToken } from '../controllers/authUser';

const router = express.Router();

/* register */
router.get('/find/:id', verifyToken,getAMovie);
router.get('/random', verifyToken,randomMovie);

router.post('/', verifyToken, createMovie);

router.put('/:id', verifyToken, updateMovie)


router.delete('/:id', verifyToken, deleteMovie);





export default router;