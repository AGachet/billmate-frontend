/**
 * Resources
 */
import Cookies from 'js-cookie'

/**
 * Constants
 */
const TOKEN_KEY = 'auth_token'

/**
 * Methods
 */
export const auth = {
  getToken: () => Cookies.get(TOKEN_KEY),
  setToken: (token: string) => {
    Cookies.set(TOKEN_KEY, token, {
      expires: 7, // expire dans 7 jours
      secure: true, // HTTPS seulement
      sameSite: 'strict'
    })
  },
  removeToken: () => Cookies.remove(TOKEN_KEY),
  isAuthenticated: () => !!Cookies.get(TOKEN_KEY)
}
