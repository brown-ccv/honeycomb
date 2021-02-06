import firebase from 'firebase'
require('dotenv').config()

const taskName = 'test'
const config = {
    apiKey: process.env.REACT_APP_apiKey,
    authDomain: process.env.REACT_APP_authDomain,
    databaseURL: process.env.REACT_APP_databaseURL,
    projectId: process.env.REACT_APP_projectId,
    storageBucket: process.env.REACT_APP_storageBucket,
    messagingSenderId: process.env.REACT_APP_messagingSenderId,
    appId: process.env.REACT_APP_appId
};
// Get a Firestore instance
let db;
try {
    db = firebase.initializeApp(config).firestore()
} catch {
    console.log("WARNING: Firease not connected");
}

// Add data to db
const createFirebaseDocument = (patientId) => {
    db.collection(taskName).doc(patientId).set({patientId, dateCreated: new Date()})
}

// create a document in the collection with a random id
const createFirebaseDocumentRandom = () => {
    db.collection(taskName).add({dateCreated: new Date()}) 
}

const addToFirebase = (data) => {
    const patientId = data.patient_id
    db
        .collection(taskName)
        .doc(patientId)
        .collection('data')
        .doc(`trial_${data.trial_index}`)
        .set(data)

}

// Export types that exists in Firestore
// This is not always necessary, but it's used in other examples
const { TimeStamp, GeoPoint } = firebase.firestore
export { db, TimeStamp, GeoPoint, createFirebaseDocument, addToFirebase, createFirebaseDocumentRandom }


export default firebase;
