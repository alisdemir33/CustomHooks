import React, { useState } from 'react';
import LoadingIndicator from '../UI/LoadingIndicator'

import Card from '../UI/Card';
import './IngredientForm.css';

// addIngredient  useCallback ile eklendi ve boylece render cycle lar arasında değişmedi.
// ve react memo da bunu anlayıp recreate etmedi..
const IngredientForm = React.memo(props => {
  //difficult way of changing state due to keeping non changing values..
 // const [inputState,setInputState] = useState({ title: '', amount: '' });
  const [enteredTitle,setEnteredTitle] = useState('');
  const [enteredAmount,setEnteredAmount] = useState('');

  console.log('RENDERING INGREDIENT FORM');

  const submitHandler = event => {
    event.preventDefault();
    props.onAddIngredient({title:enteredTitle,amount:enteredAmount})
    // ...
  };

  return (
    <section className="ingredient-form">
      <Card>
        <form onSubmit={submitHandler}>
          <div className="form-control">
            <label htmlFor="title">Name</label>
            <input type="text" id="title" value={enteredTitle}
              onChange={(event) => {
                setEnteredTitle(event.target.value)
                const newTitle =event.target.value;
              /*   setInputState(prevInputState => (
                  {
                    title: newTitle,
                    amount: prevInputState.amount
                  }
                )) */
              }} />
          </div>
          <div className="form-control">
            <label htmlFor="amount">Amount</label>
            <input type="number" id="amount" value={enteredAmount}
              onChange={(event) => {
               setEnteredAmount(event.target.value);
               /*  const newAmount =event.target.value;
                setInputState(prevInputState => (
                  {
                    amount: newAmount,
                    title: prevInputState.title
                  })) */
              }} />
          </div>
          <div className="ingredient-form__actions">
            <button type="submit">Add Ingredient</button>
            {props.loading && <LoadingIndicator></LoadingIndicator>}
          </div>
        </form>
      </Card>
    </section>
  );
});
export default IngredientForm;

/*
    <div className="form-control">
            <label htmlFor="amount">Amount</label>
            <input type="number" id="amount" value={inputState.amount}
              onChange={(event) => {
                const newAmount =event.target.value;
                setInputState(prevInputState => (
                  {
                    amount: newAmount,
                    title: prevInputState.title
                  }))
              }} />
          </div>
*/
