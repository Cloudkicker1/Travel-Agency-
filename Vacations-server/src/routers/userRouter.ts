import { SECRET } from "./secret";
import express from "express";
import jwt from "jsonwebtoken";
import { checkUserExists, register, login, authenticateUser } from '../userQueries';
import { registerSchema } from '../schemas/registerSchema';
import { loginSchema } from '../schemas/loginSchema';
import { jwtUser } from "../models/jwtUser";

const router = express.Router();

router.post('/register', async (req, res) => {
    const { firstName, lastName, userName, password } = req.body;
    const { error } = registerSchema.validate({ firstName, lastName, userName, password });
    if (error) {
        res.status(400).send(error.details[0].message);
        return;
    }
    if (await checkUserExists(userName)) {
        res.status(400).send('User already exists');
        return;
    }

    const isAdmin = false;
    const userId = await register(firstName, lastName, userName, password, isAdmin);
    const currentUser = await authenticateUser(userId as number);
    const token = generateToken(userId, 'user');

    res.send({ success: true, msg: 'welcome!', token, currentUser });
});

router.post('/login', async (req, res) => {
    const { userName, password } = req.body;


    const { error } = loginSchema.validate({ userName, password });
    if (error) {
        res.status(400).send(error.details[0].message);
        return;
    }

    const userNameId = await login(userName, password);
    if (!userNameId) {
        return res.status(401).send("username or password don't match");
    }
    const currentUser = await authenticateUser(userNameId)
    const currentUserType = currentUser.isAdmin ? 'admin' : 'user';
    const token = generateToken(userNameId, currentUserType);
    res.send({ success: true, token, currentUser });
});


router.get('/authenticate', async (req: jwtUser, res) => {
    const { id: userId, currentUserType } = req.user;

    const currentUser = await authenticateUser(userId);


    res.send({ success: true, currentUser });
})



export function generateToken(userId: number | null, currentUserType: string) {
    return jwt.sign({ id: userId, currentUserType }, SECRET);
}

export { router as users };