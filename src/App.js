import React, {useContext} from 'react';
import {AuthContext} from './context/Auth-Context'

import Ingredients from './components/Ingredients/Ingredients';
import Auth from './components/Auth'

import { render } from 'react-dom';

const App = props => {
  const authContext = useContext(AuthContext);

  console.log('custom hooks')
  
  let content =<Auth></Auth>
  if(authContext.isAuth)
  {
      content =<Ingredients></Ingredients>
  }  

  return (content);

};

export default App;
