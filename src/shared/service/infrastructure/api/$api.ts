/* eslint-disable */
// prettier-ignore
import { AspidaClient } from 'aspida'
// prettier-ignore
import { Methods as Methods0 } from './v1/users'

// prettier-ignore
const api = <T>({ baseURL, fetch }: AspidaClient<T>) => {
  const prefix = (baseURL === undefined ? 'http://localhost:3000/api' : baseURL).replace(/\/$/, '')
  const PATH0 = '/v1/users'
  const GET = 'GET'
  const PUT = 'PUT'

  return {
    v1: {
      users: {
        get: (option?: { config?: T }) =>
          fetch<Methods0['get']['resBody']>(prefix, PATH0, GET, option).json(),
        $get: (option?: { config?: T }) =>
          fetch<Methods0['get']['resBody']>(prefix, PATH0, GET, option).json().then(r => r.body),
        put: (option: { body: Methods0['put']['reqBody'], config?: T }) =>
          fetch<Methods0['put']['resBody']>(prefix, PATH0, PUT, option).json(),
        $put: (option: { body: Methods0['put']['reqBody'], config?: T }) =>
          fetch<Methods0['put']['resBody']>(prefix, PATH0, PUT, option).json().then(r => r.body),
        $path: () => `${prefix}${PATH0}`
      }
    }
  }
}

// prettier-ignore
export type ApiInstance = ReturnType<typeof api>
// prettier-ignore
export default api
