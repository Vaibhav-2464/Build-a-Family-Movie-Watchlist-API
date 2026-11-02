import express from 'express'
import bcrypt from 'bcryptjs'
import { signToken } from '../jwt.js';
import { findByUsername } from '../db.js';

const router = express.Router();

router.post("/login",async (req, res)=>{
    const { username , password}= req.body;
    if(!password || !username){
    return res.status(400).json({ error : "password or username requires "})
}

const user = findByUsername(username)
if(!user){
    return res.status(401).json({error : "username didnt exist"})
}

const isPasswordValid = await bcrypt.compare(password, user.passwordHash)

if(!isPasswordValid){
    return res.status(401).json({error :"invalid password"})
}

const token = signToken({
    "id" : user.id,
    "username": user.username,
    "role" : user.role
})
return res.status(200).json({ token });
})

export default router;