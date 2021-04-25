
import { useReducer,useCallback } from 'react'

const initialState={
    loading: false,
    error: false,
    data: null,
    extra:null,
    identifier:null
}

const httpReducer = (httpPrevState, action) => {

    switch (action.type) {
        case 'SEND':
            return { loading: true, error: null, data: null , extra:null, identifier:action.identifier};
        case 'RESPONSE':
            return { ...httpPrevState, loading: false, data: action.responseData, extra:action.extra }
        case 'ERROR':
            return { loading: false, error: action.errorData }
        case 'CLEAR':
            return initialState; 
        default:
            throw new Error('Opss!Should Never Run!');
    }

}


//will re run every rerender cycle when the componet using this hook rerenders.
//because of that we put the reducer etc. outside the hook function code.

const useHttp = () => {

    const [httpState, dispatchHttp] = useReducer(httpReducer,initialState)

    const clear = useCallback( () =>{
        dispatchHttp({type:'CLEAR'})
    },[]);

    const sendRequest = useCallback ( (url, method, body,reqExtra,reqIdentifier) => {
        // fetch(`https://react-hooks-demo-d6b03-default-rtdb.firebaseio.com/ingredients/${ingredientId}.json`,

        dispatchHttp({ type: 'SEND',identifier :reqIdentifier })
        fetch(url,
            {
                method: method,
                body: body,
                headers: { 'Content-Type': 'application-json' }
            }).then(response => {
                return response.json();
            }).then(responseData => {
                dispatchHttp({ type: 'RESPONSE', responseData: responseData, extra:reqExtra,identifier:reqIdentifier })
            }).catch(error => {
                //  setIsLoading(false);
                //  setError(error.message)
                dispatchHttp({ type: 'ERROR', errorData: error })
            });;

    }, []);

    return {
        loading: httpState.loading,
        data:httpState.data,
         error: httpState.error, 
         sendRequest:sendRequest,
         reqExtra:httpState.extra,
         reqIdentifier:httpState.identifier,
        clear:clear
        }
}

export default useHttp;