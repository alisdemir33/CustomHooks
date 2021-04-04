import React, { useReducer, useState, useEffect, useCallback, useContext, useMemo } from 'react';
import { AuthContext } from '../../context/Auth-Context'
import ErrorModal from '../UI/ErrorModal'
import IngredientForm from './IngredientForm';
import IngredientList from './IngredientList'
import Search from './Search';

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
const httpReducer = (httpPrevState, action) => {

  switch (action.type) {
    case 'SEND':
      return { loading: true, error: null };
    case 'RESPONSE':
      return { ...httpPrevState, loading: false }
    case 'ERROR':
      return { loading: false, error: action.errorData }
    case 'CLEAR':
      return { ...httpPrevState, error: null }
    default:
      throw new Error('Opss!Should Never Run!');
  }

}


const Ingredients = () => {
  //will not be recreated due to use of redurers. but methods are recreated
  const [userIngredients, dispatch] = useReducer(ingredientReducer, []);//empty array is for initial state
  const [httpState, dispatchHttp] = useReducer(httpReducer, { loading: false, error: false })
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

  //CAUSES unnecessary render, because search component already RENDER..
  /*  useEffect(() => {
     fetch('https://react-hooks-demo-d6b03-default-rtdb.firebaseio.com/ingredients.json')
   .then(response =>response.json())
   .then(responseData =>{
     const ingArr= [];
     for (const key in responseData){
         ingArr.push({id:key, title: responseData[key].title, amount:responseData[key].amount})
     }
    setUserIngredients(ingArr);
    console.log('FETCHED ')
   })
   },[]);  */

  useEffect(() => {
    console.log('RENDERING', userIngredients)
  }, [userIngredients]);


  const addIngredient = useCallback(ingredient => {
    // setIsLoading(true);
    //not a dependency due to use of hooks
    dispatchHttp({ type: 'SEND' })
    fetch('https://react-hooks-demo-d6b03-default-rtdb.firebaseio.com/ingredients.json',
      {
        method: 'POST',
        body: JSON.stringify(ingredient),
        headers: { 'Content-Type': 'application-json' }
      }).then(response => {

        //  setIsLoading(false);
        /*   setUserIngredients(prevIngredients => {
            return [...prevIngredients, { id: Math.floor(Math.random() * 1000), ...ingredient }]
          }); */
        //id olmadan eklendiği için aynı şekilde id üretip bize ekrandan gelen ingredient in ... ile kopyasını aldık..
        dispatchHttp({ type: 'RESPONSE' })
        dispatch({ type: 'ADD', ingredient: { id: Math.floor(Math.random() * 1000), ...ingredient } })

      }
      ).catch(error => {
        //setError(error.message)
        dispatchHttp({ type: 'ERROR', errorData: error.message })
      });
  }, [])
  //
  const removeIngredient = useCallback(ingredientId => {
    // setIsLoading(true);
    dispatchHttp({ type: 'SEND' })
    fetch(`https://react-hooks-demo-d6b03-default-rtdb.firebaseio.com/ingredients/${ingredientId}.json`,
      {
        method: 'DELETE',
        headers: { 'Content-Type': 'application-json' }
      }).then(response => {
        dispatchHttp({ type: 'RESPONSE' })
        dispatch({ type: 'DELETE', id: ingredientId })
        // setIsLoading(false);
        /*   setUserIngredients(prevIngredients => {
           console.log(prevIngredients.length);
           return prevIngredients.filter((ingredient) => {
             return ingredient.id !== id;
           });
         }); */


      }).catch(error => {
        //  setIsLoading(false);
        //  setError(error.message)
        dispatchHttp({ type: 'ERROR', errorData: error })
      });;
  }, []);

  const closeError = useCallback ( ()=> {
    dispatchHttp({ type: 'CLEAR' });
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
      {httpState.error && <ErrorModal onClose={closeError}> </ErrorModal>}
      <IngredientForm loading={httpState.loading} onAddIngredient={addIngredient} />
      <section>
        <Search onLoadIngredients={filteredIngredientsHandler} />
        {ingList}
        {/* Need to add list here! */}
      </section>
    </div>
  );
}

export default Ingredients;
