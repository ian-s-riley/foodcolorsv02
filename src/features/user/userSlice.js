import { createSlice } from '@reduxjs/toolkit'

//AWS Amplify GraphQL libraries
import { API, graphqlOperation } from 'aws-amplify';
import {
    createServing as createServingMutation,
    deleteServing as deleteServingMutation,
    createUser as createUserMutation,
    updateUser as updateUserMutation,
} from '../../graphql/mutations';
import {
    listServings,
    listUsers,
} from '../../graphql/queries';

export const userSlice = createSlice({
    name: 'user',
    initialState: {
        id: "",
        username: "",
        password: "",
        status: "",
        phoneNumber: "",
        email: "",
        name: "",
        icon: "",
        diet: "",
        currentDate: "",
        isToday: false,
        currentIngredient: "",
        green: 0,
        yellow: 0,
        orange: 0,
        red: 0,
        purple: 0,
        blue: 0,
        servings: [],
    },
    reducers: {
        updateUser: (state, action) => {
            console.log('userSlice.js - updateUser - action.payload', action.payload)
            state.id = action.payload.id
            state.username = action.payload.username
            state.password = action.payload.password
            state.status = action.payload.status
            state.phoneNumber = action.payload.phoneNumber
            state.email = action.payload.email
            state.name = action.payload.name
            state.icon = action.payload.icon
            state.diet = action.payload.diet
            state.currentDate = action.payload.currentDate
            state.isToday = action.payload.isToday
        },
        updateCurrentDate: (state, action) => {
            state.currentDate = action.payload.currentDate
            state.isToday = action.payload.isToday
        },
        updateServings: (state, action) => {
            state.servings = action.payload.servings
        },
        updateColors: (state, action) => {
            state.green = action.payload.green
            state.yellow = action.payload.yellow
            state.orange = action.payload.orange
            state.red = action.payload.red
            state.purple = action.payload.purple
            state.blue = action.payload.blue
        },
        updateCurrentIngredient: (state, action) => {
            state.currentIngredient = action.payload.currentIngredient
        },
    },
})

// Action creators are generated for each case reducer function
export const { updateUser, updateCurrentDate, updateServings, updateColors } = userSlice.actions

export const getUserAsync = user => dispatch => {
    console.log('getUserAsync - user', user)
    API.graphql(
        graphqlOperation(listUsers, {
            filter: {
                username: { eq: user.username }
            },
        })).then(
            response => {
                //update the user info
                let thisUser = response.data.listUsers.items[0]
                console.log('getUserAsync - thisUser', thisUser)
                thisUser && dispatch(updateUser({ ...user, id: thisUser.id, "username": thisUser.username, "password": thisUser.password, "status": thisUser.status, "phoneNumber": thisUser.phoneNumber, "email": thisUser.email, "name": thisUser.name, "icon": thisUser.icon, "diet": thisUser.diet }))                
            },
            error => console.log('Load User Error', error)
        )
};

export const getServingsAsync = user => dispatch => {
    console.log('getServingsAsync - user', user)
    API.graphql(
        graphqlOperation(listServings, {
            filter: {
                userId: { eq: user.id },
                datetime: { eq: user.currentDate },
            },
        })).then(
            response => {
                //update the user state with their servings for today
                const myServings = response.data.listServings.items
                let red = myServings.filter(serving => serving.color === 'red').length
                let orange = myServings.filter(serving => serving.color === 'orange').length
                let yellow = myServings.filter(serving => serving.color === 'yellow').length
                let green = myServings.filter(serving => serving.color === 'green').length
                let purple = myServings.filter(serving => serving.color === 'purple').length
                let blue = myServings.filter(serving => serving.color === 'blue').length
                dispatch(updateColors({ ...user, "green": green, "yellow": yellow, "orange": orange, "red": red, "purple": purple, "blue": blue, }))
                dispatch(updateServings({ ...user, "servings": myServings }))
            },
            error => console.log('Load User Servings Error', error)
        )
};

export const addServingAsync = user => dispatch => {
    console.log('addServingAsync - user.newServing', user.newServing)

    //save the serving to the DB for this user
    API.graphql(graphqlOperation(createServingMutation, { input: user.newServing }))

    //add it to the list of servings in the state
    let newServings = Object.assign([], user.servings);
    newServings.push(user.newServing)
    dispatch(updateServings({ ...user, "servings": newServings }))
};

export const addUserAsync = user => dispatch => {
    //save the serving to the DB for this user
    API.graphql(graphqlOperation(createUserMutation, { input: user.newUser }))
    dispatch(updateUser(user.newUser))
};

export const updateUserAsync = user => dispatch => {
    //console.log('updateUserAsync - user', user)
    API.graphql({
        query: updateUserMutation,
        variables: {
            input: {
                id: user.id,
                username: user.username,
                password: user.password,
                status: user.status,
                countryCode: user.countryCode,
                phoneNumber: user.phoneNumber,
                email: user.email,
                name: user.name,
                icon: user.icon,
                diet: user.diet,
            }
        }
    })
    dispatch(updateUser(user));
};

export const deleteServingAsync = user => dispatch => {
    //console.log('deleteServingAsync - user.servingId', user.servingId)
    API.graphql(graphqlOperation(deleteServingMutation, { input: { id: user.servingId } }))
};

// The function below is called a selector and allows us to select a value from
// the state. Selectors can also be defined inline where they're used instead of
// in the slice file. For example: `useSelector((state) => state.counter.value)`
export const selectUser = state => state.user;

export default userSlice.reducer