import React from 'react';
import Navigation from './config/navigation';
import store from './app/store'
import { Provider } from 'react-redux'

import Amplify from 'aws-amplify';
import config from '../src/aws-exports'
Amplify.configure(config)

export default () => <Provider store={store}><Navigation /></Provider>;