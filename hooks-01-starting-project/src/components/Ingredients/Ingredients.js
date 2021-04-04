import React, { useReducer, useState, useEffect, useCallback, useContext, useMemo } from 'react';
import { AuthContext } from '../../context/Auth-Context'
import ErrorModal from '../UI/ErrorModal'
import IngredientForm from './IngredientForm';
import IngredientList from './IngredientList'
import Search from './Search';
import useHttp from '../../hooks/http'

const ingredientReducer = (currentIngredients, action) => {

  switch (action.type) {
    case 'SET':
      return action.ingredients;
    case 'ADD':
      return [...currentIngredients, action.ingredient]
    case 'DELETE':
      return currentIngredients.filter((ing) => ing.id !== action.id)
    default:
      throw new Error('Opss!Should Never Run!');
  }
}

const Ingredients = () => {
  //will not be recreated due to use of redurers. but methods are recreated
  const [userIngredients, dispatch] = useReducer(ingredientReducer, []);//empty array is for initial state
  const {loading,data,error, sendRequest} =useHttp()
  //const [userIngredients, setUserIngredients] = useState([]);
  //const [isLoading, setIsLoading] = useState(false);
  // const [error, setError] = useState();

  const authContext = useContext(AuthContext);

  const logoutHandler = () => {
    authContext.login(false);
  };

  const filteredIngredientsHandler = useCallback((filteredIngredients) => {
    // setUserIngredients(filteredIngredients);
    dispatch({ type: 'SET', ingredients: filteredIngredients });//Action da   return action.ingredients; olduğu için : ile verdik
  }, []);

  

  useEffect(() => {
    console.log('RENDERING', userIngredients)
  }, [userIngredients]);


  const addIngredient = useCallback(ingredient => {
    // setIsLoading(true);
    //not a dependency due to use of hooks
    
  }, [])
  //
  const removeIngredient = useCallback(ingredientId => {
    // setIsLoading(true);
    sendRequest(`https://react-hooks-demo-d6b03-default-rtdb.firebaseio.com/ingredients/${ingredientId}.json`,
    'DELETE',null);
  

  }, [sendRequest]);

  const closeError = useCallback ( ()=> {
  
    // setError(null);
  },[])

  const ingList = useMemo(() => {
    return (
      <IngredientList ingredients={userIngredients} onRemoveItem={removeIngredient} />
    );
  },[userIngredients,removeIngredient])//in fact removeIngredient not chnage due to useCallback

  return (
    <div className="App">
      <div className="ingredient-form__actions">
        <button onClick={logoutHandler}>Logout</button>
      </div>
      {error && <ErrorModal onClose={closeError}> </ErrorModal>}
      <IngredientForm loading={loading} onAddIngredient={addIngredient} />
      <section>
        <Search onLoadIngredients={filteredIngredientsHandler} />
        {ingList}
        {/* Need to add list here! */}
      </section>
    </div>
  );
}

export default Ingredients;
