import {IUserDocument} from '../src/models/User';
import express from 'express';

declare global{
    namespace Express{
        interface Request {
            user?: IUserDocument | null;
        }
    }
}