import { Context } from "../models/Context";
import {  } from 'lodash';

export class LibraryStatistics {

    public static averageSignUpTime(context: Context): number {
        return context.libraries.reduce((signUpTimeSum, library) => signUpTimeSum + library.signupTime, 0) / context.libraries.length;
    }
}