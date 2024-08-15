

const baseFormState = {
    loading: false,
    error: false,
    errorMsg: "",
    isValid: false,
}

const authFormInitialState = {
    ...baseFormState,
    username: "",
    password: "",
    
}

const createProjectInitialState = {
    ...baseFormState,
    language: "",
    projectName: ""

}

function formReducer(state, action) {
    switch(action.type) {
        case "VALID":
            return {
                ...state,
                isValid: true
            }
        case "INVALID":
            return {
                ...state,
                isValid: false
            }
        case "UPDATE_FIELD":
            return {
                ...state,
                [action.payload.name]: action.payload.value
            }
        case "FETCH_START":
            return {
                ...state,
                loading: true,
                error: false, 
                errorMsg: "", 
            }
        case "FETCH_ERROR":
            return {
                ...state,
                error: true,
                errorMsg: action.payload,
                isValid: false
            }
        case "FETCH_END":
            return {
                ...state,
                loading: false
            }
        case "CLEAR":
            return {
                ...state,
                ...Object.keys(authFormInitialState).reduce((acc, key) => {
                    if (!(key in baseFormState)) {
                        console.log(key)
                        acc[key] = authFormInitialState[key];
                    }
                    return acc;
                }, {})
            }
        default:
            return state;
    }
}

export {createProjectInitialState, authFormInitialState, formReducer}