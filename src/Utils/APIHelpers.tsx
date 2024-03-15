
const DEFAULT_PATH = "http://localhost:5000/api"

const DEFAULT_HEADERS = {
  'Access-Control-Allow-Origin': '*'
}

export async function get(apiPath: string, body?: any, headers = DEFAULT_HEADERS) {
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
    'Access-Control-Allow-Origin': '*',
    'Authorization': 'Bearer ' + localStorage.getItem("token")
  }
  
  return await post(apiPath, body, headers)
}

export async function put(apiPath: string, body?: any, headers = DEFAULT_HEADERS) {
  const isFormData = body instanceof FormData;

  if (!isFormData) {
    body = JSON.stringify(body);
  }
  
  return await fetch(DEFAULT_PATH + apiPath, {
    method: 'PUT',
    headers: headers,
    body: body,
  })
}

export async function putAuth(apiPath: string, body?: any) {
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Authorization': 'Bearer ' + localStorage.getItem("token")
  }

  return await put(apiPath, body, headers)
}

export async function del(apiPath: string, body?: any, headers = DEFAULT_HEADERS) {
  return await fetch(DEFAULT_PATH + apiPath, {
    method: 'DELETE',
    headers: headers,
    body: JSON.stringify(body),
  })
}

export async function delAuth(apiPath: string, body?: any) {
  const headers = {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*',
    'Authorization': 'Bearer ' + localStorage.getItem("token")
  }
  return await del(apiPath, body, headers)
}