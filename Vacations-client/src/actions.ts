import { Actions, Action } from "./store";
import { Dispatch } from "redux";
import axios from 'axios';
import { IVacation } from "./models/vacation";
import { RegisterResult } from "./models/registerResult";
import { LoginResult } from "./models/loginResult";
import { Delete } from "./models/delete";
import { getToken, saveToken, clearToken } from "./token";
import SocketIoClient from 'socket.io-client';

const SERVER_URL = 'http://localhost:4000';

export const loginAction = (userName: string, password: string) => {
    return async (dispatch: Dispatch<Action>) => {
        try {
            const { data: result } = await axios.post<LoginResult>(`${SERVER_URL}/users/login`, {
                userName,
                password,
            });

            saveToken(result.token);
            dispatch({
                type: Actions.Login,
                payload: {
                    result,
                }
            });
            connectSI(dispatch)
        } catch (e) {
            console.log('LOGIN_ERROR', e.response.data)
            dispatch({
                type: Actions.LoginFail,
                payload: {
                    LoginFailRes: e.response.data
                }
            });

        }
    }
}

export const createGetVacationsAction = () => {
    return async (dispatch: Dispatch<Action>) => {
        dispatch({
            type: Actions.GetVacationsPending,
            payload: {},
        });
        try {
            const response = await axios.get<IVacation[]>(`${SERVER_URL}/vacations`, {
                headers: {
                    Authorization: `Bearer ${getToken()}`,
                    "Content-Type": "application/json"
                }
            });
            const vacations = response.data;
            dispatch({
                type: Actions.GetVacationsSuccess,
                payload: {
                    vacations,
                }
            });
        }
        catch {
            dispatch({
                type: Actions.GetVacationsFail,
                payload: {},
            });
        }
    }
}

export const authenticateUserAction = () => {
    return async (dispatch: Dispatch<Action>) => {
        if (!getToken()) {
            return
        }
        try {
            const { data: result } = await axios.get(`${SERVER_URL}/users/authenticate`, {
                headers: { Authorization: `Bearer ${getToken()}` }
            });
            dispatch({
                type: Actions.Login,
                payload: {
                    result,
                }
            });
            connectSI(dispatch)
        } catch{
            dispatch({
                type: Actions.LoginFail,
                payload: {}
            });

        }
    }
}

export const createVacationsAction = (Description: string, Destination: string, Picture: string, StarDate: string, EndDate: string, Price: string) => {
    const vacationDetails = { Description, Destination, Picture, StarDate, EndDate, Price }
    return async (dispatch: Dispatch<Action>) => {
        try {
            axios({
                method: 'post',
                url: `${SERVER_URL}/vacations`,
                headers: {
                    Authorization: `Bearer ${getToken()}`,
                    "Content-Type": "application/json"
                },
                data: JSON.stringify(vacationDetails)

            }).then((content) => {
                const { newVacation } = content.data;
                dispatch({
                    type: Actions.CreateVacation,
                    payload: {
                        newVacation,
                    }
                });

            })
        }
        catch {
            dispatch({
                type: Actions.PostVacationsFail,
                payload: {},
            });
        }
    }
}

export const signOutAction = () => {
    clearToken();
    return {
        type: Actions.SignOut,
        payload: {}
    }
}



export const registerAction = (firstName: string, lastName: string, userName: string, password: string) => {
    return async (dispatch: Dispatch<Action>) => {
        try {
            const { data: result } = await axios.post<RegisterResult>(`${SERVER_URL}/users/register`, {
                firstName,
                lastName,
                userName,
                password,
            });

            saveToken(result.token);
            dispatch({
                type: Actions.Register,
                payload: {}
            });
            connectSI(dispatch)
        }
        catch (err) {
            if (err.response) {
                dispatch({
                    type: Actions.RegisterFail,
                    payload: {
                        msg: 'User is already exist!'
                    }
                });

            }
        }

    }
}

export const deleteAction = (ID: number) => {
    return async (dispatch: Dispatch<Action>) => {
        const { data } = await axios.delete<Delete>(`${SERVER_URL}/vacations/${ID}`, {
            headers: {
                Authorization: `Bearer ${getToken()}`,
                "Content-Type": "application/json"
            }
        });
        dispatch({
            type: Actions.DeleteVacation,
            payload: {
                ID: data.id
            }
        });
    }
}

export const updateVacationDetailsAction = (vacationId: number, Description: string, Destination: string, Picture: string, StarDate: Date, EndDate: Date, Price: number) => {

    const newDateDeparture = new Date(StarDate)
    const departureMiliSeconds = newDateDeparture.getTime();

    const newDateReturnAt = new Date(EndDate)
    const returnAtMiliSeconds = newDateReturnAt.getTime();

    const newDetails = { Description, Destination, Picture, StarDate: departureMiliSeconds, EndDate: returnAtMiliSeconds, Price };
    return async (dispatch: Dispatch<Action>) => {
        try {
            axios({
                method: 'put',
                url: `${SERVER_URL}/vacations/${vacationId}`,
                headers: {
                    Authorization: `Bearer ${getToken()}`,
                    "Content-Type": "application/json"
                },
                data: JSON.stringify(newDetails)
            }).then((content) => {
                const { data, isFollowed } = content.data;
                dispatch({
                    type: Actions.UpdateDetails,
                    payload: {
                        data,
                        isFollowed: isFollowed,
                    }
                });
            })
        }
        catch {
            dispatch({
                type: Actions.UpdateFieldsFail,
                payload: {},
            });
        }

    }
}

export const toggleFollowAction = (ID: number) => {
    return async (dispatch: Dispatch<Action>) => {
        axios({
            method: 'post',
            url: `${SERVER_URL}/vacations/${ID}/toggleFollow`,
            headers: {
                Authorization: `Bearer ${getToken()}`,
                "Content-Type": "application/json"
            },
        }).then((content) => {
            const { isFollowing, numberedVacationId } = content.data
            dispatch({
                type: Actions.FollowVacation,
                payload: {
                    isFollowing,
                    numberedVacationId,
                }
            });

        })

    }
}


export function connectSI(dispatch: Dispatch<Action>) {
    const socket = SocketIoClient.connect('http://localhost:4000');
    socket.on('connect', () => {
        socket.emit('authenticate', { token: getToken() })
            .on('authenticated', () => {
                socket.on('newVacation', ({ newVacation }: any) => {
                    dispatch({
                        type: Actions.CreateVacation,
                        payload: { newVacation },
                    })
                })
                socket.on('ToggleFollow', ({ isFollowing, numberedVacationId }: any) => {
                    dispatch({
                        type: Actions.FollowVacation,
                        payload: {
                            isFollowing,
                            numberedVacationId,
                        }
                    });
                })
                socket.on('DeleteVacation', ({ ID }: any) => {
                    dispatch({
                        type: Actions.DeleteVacation,
                        payload: {
                            ID: ID
                        }
                    });
                })
                socket.on('UpdateDetails', ({ data }: any) => {
                    dispatch({
                        type: Actions.UpdateDetails,
                        payload: { data }
                    });
                })
            })
    })
}

