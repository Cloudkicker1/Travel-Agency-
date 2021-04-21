import express from "express";
import { updateVacation, addVacation, getAllVacations, deleteVacation, followVacation, isUserFollowingVacation, unfollowVacation, decreaseFollowersAmount, increaseFollowersAmount } from '../vacationQueries'
import { vacationsSchema } from "../schemas/vacationsSchema";
import { SocketServer } from "../SocketIo";
import { jwtUser } from "../models/jwtUser";


const router = express.Router();

router.post('/', async (req, res) => {
    //@ts-ignore
    const { id: userId } = req.user;

    const result = vacationsSchema.validate(req.body);

    if (result.error) {
        res.status(400).send(JSON.stringify({ success: false }));
        return;
    }

    const {
        Description,
        Destination,
        Picture,
        StarDate,
        EndDate,
        Price,
    } = result.value

    const ID = await addVacation(Description, Destination, Picture, StarDate, EndDate, Price);
    const newVacation = { Description, Destination, Picture, StarDate, EndDate, Price, NumOfFollowers: 0, ID, follow: 0 }

    SocketServer().in('Users').emit('newVacation', { newVacation })

    res.send(JSON.stringify({ newVacation }))
});

router.get('/', async (req, res) => {
    //@ts-ignore
    const { id } = req.user;
    if (isNaN(Number(id))) {
        res.status(400).send('userId must be a number');
        return;
    }
    try {
        const vacations = await getAllVacations(id);
        res.send(vacations);
    } catch (e) {
        res.status(500).send('Server is unavailable, please try again later');
    }
});

router.delete('/:id', async (req, res) => {
    //@ts-ignore
    const { id: userId } = req.user;
    const { id } = req.params;
    if (isNaN(Number(userId))) {
        res.status(400).send('userId must be a number');
        return;
    }

    if (isNaN(Number(id))) {
        res.status(400).send('id must be a number');
        return;
    }
    const result = await deleteVacation(Number(id));
    res.send({ id });
    SocketServer().in('Users').emit('DeleteVacation', { ID: id });
});

router.post('/:id/toggleFollow', async (req: jwtUser, res) => {
    const { id: UserId } = req.user;
    const { id: VacationId } = req.params;

    const numberedVacationId = Number(VacationId)

    if (isNaN(Number(numberedVacationId)) && isNaN(Number(UserId))) {
        res.status(400).send(JSON.stringify({ success: false }));
        return;
    }

    const isFollowing = await isUserFollowingVacation(UserId, numberedVacationId)

    if (isFollowing) {
        unfollowVacation(UserId, numberedVacationId)
        decreaseFollowersAmount(numberedVacationId)
    } else {
        followVacation(UserId, numberedVacationId);
        increaseFollowersAmount(numberedVacationId);
    }
    res.send({ success: true, isFollowing, numberedVacationId })
    SocketServer().in('Admins').emit('ToggleFollow', { isFollowing, numberedVacationId });
});

router.put('/:id', async (req, res) => {
    //@ts-ignore
    const { id: userId } = req.user;
    const { Description, Destination, Picture, StarDate, EndDate, Price } = req.body;
    const departureFromMiliseconds = new Date(StarDate);
    const returnAtFromMiliseconds = new Date(EndDate);

    if (isNaN(Number(userId))) {
        res.status(400).send('userId must be a number');
        return;
    }
    const { id } = req.params;
    const data = { ID: +id, Description, Destination, Picture, StarDate: departureFromMiliseconds, EndDate: returnAtFromMiliseconds, Price };

    const numberedVacationId = Number(id)

    const isFollowed = await isUserFollowingVacation(userId, numberedVacationId)
    const result = await updateVacation(Number(id), data);
    if (result) {
        res.status(200).send({ data })
        SocketServer().in('Users').emit('UpdateDetails', { data, isFollowed });
    } else {
        res.status(500).send({ success: false })
    }
});


export { router as vacations };