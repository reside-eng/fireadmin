import * as admin from 'firebase-admin'
import * as functions from 'firebase-functions'
import { get, uniqueId } from 'lodash'
import request from 'request-promise'
import google from 'googleapis'
import { serviceAccountFromFirestorePath } from '../utils/serviceAccounts'
import { eventPathName, SCOPES } from './constants'
import { to } from '../utils/async'
import { hasAll } from '../utils'

let jwtClient = null

const serviceAccountParams = [
  'type',
  'project_id',
  'private_key_id',
  'private_key',
  'client_email',
  'client_id',
  'auth_uri',
  'token_uri'
]

/**
 * Get Google APIs auth client. Auth comes from serviceAccount.
 * @return {Promise} Resolves with JWT Auth Client (for attaching to request)
 */
async function authClientFromServiceAccount(serviceAccount) {
  if (!hasAll(serviceAccount, serviceAccountParams)) {
    throw new Error('Invalid service account')
  }
  if (jwtClient) {
    return jwtClient
  }
  jwtClient = new google.auth.JWT(
    serviceAccount.client_email,
    null,
    serviceAccount.private_key,
    SCOPES
  )
  return new Promise((resolve, reject) => {
    jwtClient.authorize(err => {
      if (!err) {
        google.options({ auth: jwtClient })
        resolve(jwtClient)
      } else {
        console.error(
          'Error authorizing with Service Account',
          err.message || err
        )
        reject(err)
      }
    })
  })
}

/**
 * Add authentication to a google request using serviceAccount
 * @param  {Object}  requestWithoutAuth - Request object without auth
 * @return {Promise} Resolves with request that has auth attached
 */
async function addServiceAccountAuthToRequest(serviceAccount, requestSettings) {
  const client = await authClientFromServiceAccount(serviceAccount)
  return {
    ...requestSettings,
    headers: {
      Authorization: `${client.credentials.token_type} ${
        client.credentials.access_token
      }`
    }
  }
}

/**
 * Request google APIs with auth attached
 * @param  {Function}  method - Google APIs method to call
 * @param  {String}  name - Name of the method (used in console messaging)
 * @param  {Object}  requestSettings - Settings for request
 * @return {Promise} Resolves with results of Goggle API request
 */
export async function googleApisRequest(serviceAccount, requestSettings) {
  const requestSettingsWithAuth = await addServiceAccountAuthToRequest(
    serviceAccount,
    requestSettings
  )
  try {
    const response = await request(requestSettingsWithAuth)
    console.log(`Google API Request completed successfully`, response.body)
    return response
  } catch (err) {
    console.error(
      `Google API Responded with an error code: ${err.statusCode} \n ${
        err.error ? err.error.message : ''
      }`
    )
    throw err.error || err
  }
}

/**
 * Call a Google API with a Service Account
 * @param  {[type]} event - Functions event
 * @return {Promise} Resolves with results of calling Google API
 */
export default async function callGoogleApi(snap, context) {
  const eventVal = snap.val()
  const eventId = get(context, 'params.pushId')
  const {
    apiUrl,
    api = 'storage',
    method = 'GET',
    body,
    apiVersion = 'v1',
    suffix = `b/${eventVal.storageBucket}`,
    projectId,
    environment
  } = eventVal
  const responseRef = admin
    .database()
    .ref(`responses/${eventPathName}/${eventId}`)

  const appName = `app-${uniqueId()}`

  let serviceAccount
  // Set to application default credentials when using compute api
  if (projectId && environment) {
    console.log(
      'Searching for service account from: ',
      `projects/${projectId}/environments/${environment}`
    )
    let getSAErr
    // Get Service Account object by decryping string from Firestore
    ;[getSAErr, serviceAccount] = await to(
      serviceAccountFromFirestorePath(
        `projects/${projectId}/environments/${environment}`,
        appName,
        { returnData: true }
      )
    )
    // Handle errors getting service account
    if (getSAErr || !serviceAccount) {
      console.error('Error getting service account:', getSAErr)
      const missingParamsErr = getSAErr
      await responseRef.set({
        completed: true,
        error: getSAErr.message || getSAErr,
        completedAt: admin.database.ServerValue.TIMESTAMP
      })
      throw missingParamsErr
    }
  } else {
    if (!functions.config().service_account) {
      throw new Error('service_account functions config variable not set')
    }
    serviceAccount = functions.config().service_account
  }

  const uri =
    apiUrl ||
    `https://www.googleapis.com/${api}/${apiVersion}/${suffix}${
      api === 'storage' ? '?cors' : ''
    }`
  // Call Google API with service account
  const [err, response] = await to(
    googleApisRequest(serviceAccount, {
      method,
      uri,
      body,
      headers: {
        'Gdata-Version': '3.0'
      },
      json: true
    })
  )

  // Handle errors calling Google API
  if (err) {
    const errorMessage = get(err, 'error.message', JSON.stringify(err))
    const errorCode = get(err, 'error.code', 500)
    console.error(`Error calling Google API: ${uri}`, err.message || err)
    await responseRef.set({
      completed: true,
      successful: false,
      error: {
        message: errorMessage,
        code: errorCode
      },
      completedAt: admin.database.ServerValue.TIMESTAMP
    })
    throw new Error(errorMessage)
  }

  console.log('Google API responsed successfully. Writing response to RTDB...')
  await responseRef.set({
    completed: true,
    responseData: response,
    completedAt: admin.database.ServerValue.TIMESTAMP
  })

  console.log('Success! Response data written to RTDB. Exiting.')
  return response
}
