
const session = {
    setSession(field, val) {
        sessionStorage.setItem(field, val)
    },

    getSession(field) {
        return sessionStorage.getItem(field)
    }
}

export default session