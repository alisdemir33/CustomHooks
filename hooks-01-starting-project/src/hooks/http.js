

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

  
//will re run every rerender cycle when the componet using this hook rerenders.
//because of that we put the reducer etc. outisde the hook function code.

useHttp = () =>{


}

export default useHttp;