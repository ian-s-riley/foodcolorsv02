import React from 'react'
import { registerRootComponent } from 'expo';
import App from './App.js'
 
const NewRootComponent = () => {
    return (
        <App />
    )
}
 
export default registerRootComponent(NewRootComponent);