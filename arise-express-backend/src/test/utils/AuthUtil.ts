import store from './Store'

export function authToken() {
    return `Bearer ${store.get('token')}`
}