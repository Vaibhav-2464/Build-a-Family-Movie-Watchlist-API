import express from 'express'
import { authenticate } from '../../middleware/authenticate.js';
import { authorizeModification } from '../../middleware/authorize.js';

import {
    getWatchlist,
    addMovie,
    updateMovie,
    deleteMovie
} from '../db.js';

const router = express.Router();


router.get("/:userId", authenticate,(req, res)=>{
const { userId } = req.params
const watchlist = getWatchlist(Number(userId));
return res.status(200).json(watchlist)
})


router.post("/:userId/movies", authenticate, authorizeModification, (req, res) => {
const { userId }= req.params
const { title , genre} = req.body
if (!title || !genre) {
    return res.status(400).json({ error: "Title and genre are required" });
}
const movie = addMovie(Number(userId), { title, genre });
return res.status(201).json(movie)
})

router.put("/:userId/movies/:movieId", authenticate, authorizeModification, (req, res) => {
    const { userId,movieId } = req.params
    const  updates = req.body
const movieUpdate = updateMovie(
    Number(userId),
    Number(movieId),
    updates
);
    if(movieUpdate === null){
      return res.status(404).json({ error: "Movie not found" });
    }
    else{ 
        return res.status(200).json(movieUpdate);
    }
})

router.delete("/:userId/movies/:movieId", authenticate, authorizeModification, (req, res) => {
    const { userId, movieId } = req.params;
    
const deleted = deleteMovie(Number(userId), Number(movieId));

    if (deleted === null) {
        return res.status(404).json({ error: "Movie not found" });
    }

    return res.status(200).json({ message: "Movie deleted successfully" });
});

export default router;