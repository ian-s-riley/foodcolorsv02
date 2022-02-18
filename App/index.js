import React from 'react';
import Navigation from './config/navigation';

import store from '../App/app/store'
import { Provider } from 'react-redux'

import {SSRProvider} from '@react-aria/ssr'; 
 
const index = () => {
    return (
        <SSRProvider>
      <Provider store={store}>
        <Navigation />
      </Provider>
      </SSRProvider>
    )
}
 
export default index