import React, { useState, useEffect, useRef } from 'react';

import Card from '../UI/Card';
import './Search.css';
import useHttp from '../../hooks/http'
import ErrorModal from '../UI/ErrorModal'

const Search = React.memo(props => {

  const [enteredFilter, setEnteredFilter] = useState('');
  const { onLoadIngredients } = props;
  const inputRef = useRef();
  const { loading, data, error, sendRequest,clear } = useHttp();

  useEffect(() => {
   const timer = setTimeout(() => {
      if (enteredFilter === inputRef.current.value) {
        let query = enteredFilter.length === 0 ? '' : `?orderBy="title"&equalTo="${enteredFilter}"`

        sendRequest('https://react-hooks-demo-d6b03-default-rtdb.firebaseio.com/ingredients.json' + query
        ,'GET'
        );

      
      }
    }, 500);
    return  ()  => {
      clearTimeout(timer);
    };
  },[enteredFilter,inputRef,sendRequest] );

  useEffect( () =>{

  if(!loading && !error && data){
    const ingArr = [];  
    for (const key in data) {
        ingArr.push({ id: key, title: data[key].title, amount: data[key].amount })
      }
      onLoadIngredients(ingArr);//  setUserIngredients(ingArr);
    }

  },[data,loading,error,onLoadIngredients]);

  return (
   
    <section className="search">
       {error && <ErrorModal onClose={clear}> </ErrorModal>}
      <Card>    
        <div className="search-input">
          <label>Filter by Title</label>
          {loading && <span>loading..</span>}
          <input
            ref={inputRef}
            type="text" value={enteredFilter} onChange={(event) => setEnteredFilter(event.target.value)} />
        </div>
      </Card>
    </section>
  );
});

export default Search;
