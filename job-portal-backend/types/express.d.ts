import {IUserDocument} from '../models/User';
import express from 'express';

declare global{
    namespace Express{
        interface Request {
            user?: IUserDocument | null;
        }
    }
}