import { ACTION_ADD_CHANNEL, ACTION_ADD_IP, ACTION_ADD_PORT, ACTION_ERROR_CHANNEL, ACTION_ERROR_CHANNEL_MESSAGE, ACTION_ERROR_PORT, ACTION_ERROR_PORT_MESSAGE, KEY_CHANNEL, KEY_IP_ADDRESS, KEY_PORT } from "../Constants";
import AsyncStorage from '@react-native-async-storage/async-storage';

export const setStateToAddIp = (payload) => ({
    type: ACTION_ADD_IP,
    payload
})

export const setStateToAddPort = (payload) => ({
    type: ACTION_ADD_PORT,
    payload
})

export const setStateToAddChannel = (payload) => ({
    type: ACTION_ADD_CHANNEL,
    payload
})

export const setStateToErrorPort = (payload) => ({
    type: ACTION_ERROR_PORT,
    payload
})

export const setStateToErrorPortMsg = (payload) => ({
    type: ACTION_ERROR_PORT_MESSAGE,
    payload
})

export const setStateToErrorChannel = (payload) => ({
    type: ACTION_ERROR_CHANNEL,
    payload
})

export const setStateToErrorChannelMsg = (payload) => ({
    type: ACTION_ERROR_CHANNEL_MESSAGE,
    payload
})


export const addIp = (payload) => {

    return dispatch => {
        dispatch(setStateToAddIp(payload))
    }
}

export const addPort = (payload) => {

    // validate number only
    if (/\D/.test(payload)) {
        return dispatch => {
            dispatch(setStateToErrorPort(true));
            dispatch(setStateToErrorPortMsg('Please enter number only'));
        }
    }

    if (parseInt(payload) >= 1024 && parseInt(payload) <= 65535) {
        return dispatch => {
            dispatch(setStateToAddPort(payload));
            dispatch(setStateToErrorPort(false));
            dispatch(setStateToErrorPortMsg(' '));
        }
    } else {
        return dispatch => {
            dispatch(setStateToAddPort(payload));
            dispatch(setStateToErrorPort(true));
            dispatch(setStateToErrorPortMsg('Please enter port between 1024 - 65535'));
        }
    }
}

export const addChannel = (payload) => {

    // validate number only
    if (/\D/.test(payload)) {
        return dispatch => {
            dispatch(setStateToErrorChannel(true));
            dispatch(setStateToErrorChannelMsg('Please enter number only'));
        }
    }

    if (parseInt(payload) >= 1 && parseInt(payload) <= 32) {
        return dispatch => {
            dispatch(setStateToAddChannel(payload));
            dispatch(setStateToErrorChannel(false));
            dispatch(setStateToErrorChannelMsg(' '));
        }
    } else {
        return dispatch => {
            dispatch(setStateToAddChannel(payload));
            dispatch(setStateToErrorChannel(true));
            dispatch(setStateToErrorChannelMsg('Please enter channel between 1 - 32'));
        }
    }
}

const addConfigToStorage = async (ipAddress, port, channel) => {
    await AsyncStorage.setItem(KEY_IP_ADDRESS, ipAddress)
    await AsyncStorage.setItem(KEY_PORT, port)
    await AsyncStorage.setItem(KEY_CHANNEL, channel)
}

export const getConfigFromStorage = () => {
    return async (dispatch) => {
        let ipAddress = await AsyncStorage.getItem(KEY_IP_ADDRESS)
        let port = await AsyncStorage.getItem(KEY_PORT)
        let channel = await AsyncStorage.getItem(KEY_CHANNEL)
        
        dispatch(setStateToAddIp(ipAddress))
        dispatch(setStateToAddPort(port))
        dispatch(setStateToAddChannel(channel))
    }
}

export const saveChanges = (ipAddress, port, channel) => {
    // validate ip address, port, channel is not empty
    if (ipAddress == '' || port == '' || channel == '') {
        return new Promise((resolve, reject)=> {
            resolve({
                status: false,
                title: 'Error',
                message: 'Please check your input value.'
            })
        })
    }

    // validate port and channel is integer
    if(/\D/.test(port) || /\D/.test(channel)) {
        return new Promise((resolve, reject)=> {
            resolve({
                status: false,
                title: 'Error',
                message: 'Please check your input value.'
            })
        })
    }

    // validate port value
    if (parseInt(port) < 1024 || parseInt(port) > 65535) { 
        return new Promise((resolve, reject)=> {
            resolve({
                status: false,
                title: 'Error',
                message: 'Please check your input value.'
            })
        })
    }

    // validate channel value
    if (parseInt(channel) < 1 || parseInt(channel) > 32) { 
        return new Promise((resolve, reject)=> {
            resolve({
                status: false,
                title: 'Error',
                message: 'Please check your input value.'
            })
        })
    }

    addConfigToStorage(ipAddress, port, channel)

    return new Promise((resolve, reject)=> {
        resolve({
            status: true,
            title: 'Success',
            message: 'Save complete!!'
        })
    })
}
