

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

const inviteModalInitialState = {
    ...baseFormState,
    username: ""
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
                        acc[key] = authFormInitialState[key];
                    }
                    return acc;
                }, {})
            }
        case "CLEAR_ERROR":
            return {
                ...state,
                errorMsg: "",
                error: false
                
            }
        case "FORM_RESET":
            return {
                ...action.payload
            }
        default:
            return state;
    }
}

export {inviteModalInitialState, createProjectInitialState, authFormInitialState, formReducer}