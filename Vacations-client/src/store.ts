import { createStore, applyMiddleware } from 'redux';
import { createLogger } from 'redux-logger';
import thunk from 'redux-thunk';
import { composeWithDevTools } from 'redux-devtools-extension';
import { User } from './models/user';
import { IVacation } from './models/vacation';
import { LoginResult } from './models/loginResult';

export interface State {
    isRegistering: boolean;
    isLoggedIn: boolean;
    user: User | null;
    isGettingVacations: boolean;
    vacations: IVacation[];
    isAdmin: boolean;
    message: string;
}


const initialState: State = {
    isRegistering: false,
    isLoggedIn: !!localStorage.getItem('token'),
    user: null,
    isGettingVacations: false,
    vacations: [],
    isAdmin: false,
    message: '',
}

export interface Action {
    type: string;
    payload: Record<string, any>;
}

export enum Actions {
    Login = 'LOGIN',
    Register = 'REGISTER',
    SignOut = 'SIGN_OUT',
    CreateVacation = 'CREATE_VACATION',
    GetVacationsPending = 'GET_Vacations_PENDING',
    GetVacationsSuccess = 'GET_Vacations_SUCCESS',
    GetVacationsFail = 'GET_Vacations_FAIL',
    PostVacationsFail = 'POST_Vacations_FAIL',
    DeleteVacation = 'DELETE_Vacation',
    UpdateVacation = 'UPDATE_Vacation',
    LoginFail = 'LOGIN_FAIL,',
    RegisterFail = 'REGISTER_FAIL',
    FollowVacation = 'FOLLOW_VACATION',
    UnfollowVacation = 'UNFOLLOW_ACTION',
    UpdateDetails = 'UPDATE_DETAILS',
    UpdateFieldsFail = 'UPDATE_FIELD_FAIL',
}

const reducer = (state: State = initialState, action: Action) => {
    switch (action.type) {
        case Actions.Register: {
            return {
                ...state,
                isLoggedIn: true,
            }
        }
        case Actions.DeleteVacation: {
            const { vacations } = state;
            const modifiedVacations = vacations.slice();
            const { ID } = action.payload;
            const cellIndexToDelete = vacations.findIndex(vacation => vacation.ID.toString() === ID);
            const newArray = modifiedVacations.splice(cellIndexToDelete, 1)
            return {
                ...state,
                isGettingVacations: false,
                vacations: modifiedVacations,
            }
        }
        case Actions.Login: {
            const { result } = action.payload
            return {
                ...state,
                isGettingVacations: false,
                isLoggedIn: true,
                isAdmin: result.currentUser.isAdmin
            }
        }
        case Actions.SignOut: {
            const { msg } = action.payload;
            return {
                ...state,
                vacations: [],
                isLoggedIn: false,
            }
        }
        case Actions.GetVacationsPending: {
            return {
                ...state,
                isGettingVacations: true,
            }
        }

        case Actions.GetVacationsFail: {
            return {
                ...state,
                isGettingVacations: false,
            }
        }
        case Actions.PostVacationsFail: {
            return {
                ...state,
                isGettingVacations: false,
            }
        }
        case Actions.LoginFail: {
            const { LoginFailRes } = action.payload;
            return {
                ...state,
                message: LoginFailRes
            }
        }
        case Actions.RegisterFail: {
            const { msg } = action.payload;
            return {
                ...state,
                message: msg
            }
        }
        case Actions.UpdateDetails: {
            const { vacations } = state;
            const { data, isFollowed } = action.payload;
            console.log('STORE_UPDATE_DETAILS', isFollowed)
            const modifiedVacations = vacations.slice();
            const cellIndexToUpdate = vacations.findIndex(vacation => vacation.ID === data.ID);
            modifiedVacations[cellIndexToUpdate].follow = isFollowed;
            modifiedVacations[cellIndexToUpdate] = data;
            return {
                ...state,
                isGettingVacations: false,
                vacations: modifiedVacations,
            }
        }

        case Actions.GetVacationsSuccess: {
            const { vacations } = action.payload;
            const modifiedVacations = vacations.slice();
            modifiedVacations.sort(sortArray)
            return {
                ...state,
                isGettingVacations: false,
                vacations: modifiedVacations,
            }
        }
        case Actions.CreateVacation: {
            const { vacations } = state;
            const { newVacation } = action.payload;
            const modifiedVacations = vacations.slice();
            modifiedVacations.push(newVacation)
            return {
                ...state,
                vacations: modifiedVacations,
            }
        }
        case Actions.FollowVacation: {
            const { vacations, isAdmin } = state;
            const { numberedVacationId, isFollowing } = action.payload;
            const modifiedVacations = vacations.slice();
            const index = modifiedVacations.findIndex(vacation => vacation.ID === numberedVacationId);
            if (isAdmin) {
                modifiedVacations[index].NumOfFollowers += isFollowing ? -1 : 1;
            } else {
                modifiedVacations[index].follow = isFollowing ? 0 : 1;
            }
            return {
                ...state,
                isGettingVacations: false,
                vacations: modifiedVacations,
            }
        }
        default: {
            return state;
        }
    }
}

function sortArray(x: IVacation, y: IVacation) {
    return x.follow === y.follow ? 0 : x.follow ? -1 : 1;
}

export function createReduxStore() {
    const logger = createLogger();
    const middleware = composeWithDevTools(applyMiddleware(thunk, logger));
    return createStore(reducer, middleware);
}