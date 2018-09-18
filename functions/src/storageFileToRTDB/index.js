import * as functions from 'firebase-functions'
import * as admin from 'firebase-admin'
import fs from 'fs-extra'
import os from 'os'
import path from 'path'
import mkdirp from 'mkdirp-promise'

const eventPathName = 'fileToDb'

/**
 * @name storageFileToRTDB
 * Convert a JSON file from storage bucket into a data on RTDB
 * @type {functions.CloudFunction}
 */
export default functions.database
  .ref(`/requests/${eventPathName}/{pushId}`)
  .onCreate(copyFileToRTDB)

async function copyFileToRTDB(snap, context) {
  const { filePath, databasePath, keepPushKey = false } = snap.val()
  if (!filePath || !databasePath) {
    throw new Error(
      '"filePath" and "databasePath" are required to copy file to RTDB'
    )
  }
  const tempLocalFile = path.join(os.tmpdir(), filePath)
  // Create temp directory
  const tempLocalDir = path.dirname(tempLocalFile)
  await mkdirp(tempLocalDir)

  // Download file to temporary directory
  await admin
    .storage()
    .bucket()
    .file(filePath)
    .download({ destination: tempLocalFile })

  // Read the file
  const fileData = await fs.readJson(tempLocalFile)
  console.log('File data loaded, writing to database...')

  // Write File data to DB
  await snap.ref.root
    .child(`${databasePath}/${keepPushKey ? context.params.pushId : ''}`)
    .set(fileData)

  // Mark request as complete
  await snap.ref.root
    .child(`responses/${eventPathName}/${context.params.pushId}`)
    .set({
      completed: true,
      completedAt: admin.database.ServerValue.TIMESTAMP
    })
  console.log('Copying data to DB, cleaning up...')
  // Once the file data hase been added to db delete the local files to free up disk space.
  fs.unlinkSync(tempLocalFile)
  return filePath
}
