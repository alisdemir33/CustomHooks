import React from 'react';
import ReactDOM from 'react-dom';

import './index.css';
import App from './App';
import AuthContextProvider from '../src/context/Auth-Context'

ReactDOM.render(
<AuthContextProvider>
<App />
</AuthContextProvider>
, document.getElementById('root'));
