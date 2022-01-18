import React from 'react'
import { registerRootComponent } from 'expo';
import App from './App.js'

import store from './src/app/store'
import { Provider } from 'react-redux'
 
const NewRootComponent = () => {
    return (
      <Provider store={store}>
        <App />
      </Provider>
    )
}
 
export default registerRootComponent(NewRootComponent);