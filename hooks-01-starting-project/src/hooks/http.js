
import { useReducer,useCallback } from 'react'
const httpReducer = (httpPrevState, action) => {

    switch (action.type) {
        case 'SEND':
            return { loading: true, error: null, data: null };
        case 'RESPONSE':
            return { ...httpPrevState, loading: false, data: action.responseData }
        case 'ERROR':
            return { loading: false, error: action.errorData }
        case 'CLEAR':
            return { ...httpPrevState, error: null }
        default:
            throw new Error('Opss!Should Never Run!');
    }

}


//will re run every rerender cycle when the componet using this hook rerenders.
//because of that we put the reducer etc. outisde the hook function code.

const useHttp = () => {

    const [httpState, dispatchHttp] = useReducer(httpReducer,
        {
            loading: false,
            error: false,
            data: null,
        })

    const sendRequest = useCallback( (url, method, body) => {
        // fetch(`https://react-hooks-demo-d6b03-default-rtdb.firebaseio.com/ingredients/${ingredientId}.json`,

        dispatchHttp({ type: 'SEND' })
        fetch(url,
            {
                method: method,
                body: body,
                headers: { 'Content-Type': 'application-json' }
            }).then(response => {
                return response.json();
            }).then(responseData => {
                dispatchHttp({ type: 'RESPONSE', responseData: responseData })
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
         sendRequest:sendRequest
      
        }
}

export default useHttp;