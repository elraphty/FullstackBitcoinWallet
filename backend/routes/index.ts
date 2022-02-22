import express, { Router, Request, Response } from 'express';
import api from './api';

const router: Router = express.Router();

router.get("/", (req: Request, res: Response): void => {
    res.send("This is the index route")
});

router.use('/api', api);

// 404 route
router.all('*', (req: Request, res: Response): void => {
    const errorMessage = {
        message: 'You are hitting a wrong route, find the valid routes below',
        endpoints: {
            signup: 'POST /api/v1/auth/signup',
            login: 'POST /api/v1/auth/login'
        },
        success: false
    }

    res.status(404).json(errorMessage)
})

export default router;