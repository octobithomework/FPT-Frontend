
const DEFAULT_PATH = "http://localhost:5000/api"

const DEFAULT_HEADERS = {
  'Content-Type': 'application/json',
  'Access-Control-Allow-Origin': '*'
}

const GET_DEFAULT_HEADERS = {
  'Access-Control-Allow-Origin': '*'
}

export async function get(apiPath: string, body?: any, headers = GET_DEFAULT_HEADERS) {
  return await fetch(DEFAULT_PATH + apiPath, {
    method: 'GET',
    headers: headers
  })
}

export async function getAuth(apiPath: string, body?: any) {
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Authorization': 'Bearer ' + localStorage.getItem("token")
  }
  return await get(apiPath, body, headers)
}

export async function post(apiPath: string, body?: any, headers = DEFAULT_HEADERS) {
  return await fetch(DEFAULT_PATH + apiPath, {
    method: 'POST',
    headers: headers,
    body: JSON.stringify(body),
  })
}

export async function postAuth(apiPath: string, body?: any) {
  const headers = {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*',
    'Authorization': 'Bearer ' + localStorage.getItem("token")
  }
  return await post(apiPath, body, headers)
}