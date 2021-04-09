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
  const { loading, data, error, sendRequest, reqExtra,reqIdentifier,clear } = useHttp()
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
     console.log('RENDERING', reqIdentifier)
    if (!loading && !error && reqIdentifier === 'REMOVE_INGREDIENT') {
      dispatch({ type: 'DELETE', id: reqExtra })
    } else if  (!loading && !error && reqIdentifier === 'ADD_INGREDIENT'){
      dispatch({ type: 'ADD', ingredient: { id: Math.floor(Math.random() * 1000), ...reqExtra } });
    }
  }, [data, reqExtra,loading,error]);


  const addIngredientHandler = useCallback(ingredient => {
    sendRequest('https://react-hooks-demo-d6b03-default-rtdb.firebaseio.com/ingredients.json'
      , 'POST'
      , JSON.stringify(ingredient)
      , ingredient
      ,'ADD_INGREDIENT'
    )
    // setIsLoading(true);
    //not a dependency due to use of hooks

  }, [sendRequest])
  //
  const removeIngredientHandler = useCallback(ingredientId => {
    // setIsLoading(true);
    sendRequest(`https://react-hooks-demo-d6b03-default-rtdb.firebaseio.com/ingredients/${ingredientId}.json`
      ,'DELETE'
      , null
      ,ingredientId
      ,'REMOVE_INGREDIENT');


  }, [sendRequest]);

  

  const ingList = useMemo(() => {
    return (
      <IngredientList ingredients={userIngredients} onRemoveItem={removeIngredientHandler} />
    );
  }, [userIngredients, removeIngredientHandler])//in fact removeIngredient not chnage due to useCallback

  return (
    <div className="App">
      <div className="ingredient-form__actions">
        <button onClick={logoutHandler}>Logout</button>
      </div>
      {error && <ErrorModal onClose={clear}> </ErrorModal>}
      <IngredientForm loading={loading} onAddIngredient={addIngredientHandler} />
      <section>
        <Search onLoadIngredients={filteredIngredientsHandler} />
        {ingList}
        {/* Need to add list here! */}
      </section>
    </div>
  );
}

export default Ingredients;
