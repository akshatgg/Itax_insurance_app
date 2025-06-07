import firebase from "firebase/app"
import "firebase/firestore"
import "firebase/functions"
import "firebase/storage"
import type { FirebaseCollectionConfig, FirebaseDocument, FirebaseQuery } from "../types/firebase"

/**
 * Service for handling Firebase operations
 */
export class FirebaseService {
  /**
   * Sets up real-time listeners for Firestore collections
   * @param config Collection configuration with path and callback
   * @returns Unsubscribe function to stop listening
   */
  static setupRealtimeListener<T>(config: FirebaseCollectionConfig<T>): () => void {
    const { path, callback, queryConstraints = [] } = config

    let query = firebase.firestore().collection(path)

    // Apply query constraints if any
    queryConstraints.forEach((constraint) => {
      if (constraint.type === "where") {
        query = query.where(constraint.field, constraint.operator, constraint.value) as any
      } else if (constraint.type === "orderBy") {
        query = query.orderBy(constraint.field, constraint.direction) as any
      } else if (constraint.type === "limit") {
        query = query.limit(constraint.value) as any
      }
    })

    // Set up the listener
    return query.onSnapshot(
      (snapshot) => {
        const items: FirebaseDocument<T>[] = []
        snapshot.forEach((doc) => {
          items.push({
            id: doc.id,
            ...(doc.data() as T),
          })
        })
        callback(items)
      },
      (error) => {
        console.error("Firestore real-time query error:", error)
      },
    )
  }

  /**
   * Executes a Firestore query
   * @param query Query configuration
   * @returns Query result as array of documents
   */
  static async executeQuery<T>(query: FirebaseQuery): Promise<FirebaseDocument<T>[]> {
    try {
      const { collection, where = [], orderBy, limit } = query

      let firestoreQuery = firebase.firestore().collection(collection)

      // Apply where clauses
      where.forEach((clause) => {
        firestoreQuery = firestoreQuery.where(clause.field, clause.operator, clause.value) as any
      })

      // Apply orderBy if specified
      if (orderBy) {
        firestoreQuery = firestoreQuery.orderBy(orderBy.field, orderBy.direction) as any
      }

      // Apply limit if specified
      if (limit) {
        firestoreQuery = firestoreQuery.limit(limit) as any
      }

      const snapshot = await firestoreQuery.get()

      const results: FirebaseDocument<T>[] = []
      snapshot.forEach((doc) => {
        results.push({
          id: doc.id,
          ...(doc.data() as T),
        })
      })

      return results
    } catch (error) {
      console.error("Firestore query error:", error)
      throw error
    }
  }

  /**
   * Adds a document to a Firestore collection
   * @param collection Collection path
   * @param data Document data
   * @returns ID of the created document
   */
  static async addDocument<T>(collection: string, data: T): Promise<string> {
    try {
      const docRef = await firebase
        .firestore()
        .collection(collection)
        .add({
          ...data,
          createdAt: firebase.firestore.FieldValue.serverTimestamp(),
          updatedAt: firebase.firestore.FieldValue.serverTimestamp(),
        })

      return docRef.id
    } catch (error) {
      console.error("Firestore add document error:", error)
      throw error
    }
  }

  /**
   * Updates a document in a Firestore collection
   * @param collection Collection path
   * @param docId Document ID
   * @param data Document data to update
   */
  static async updateDocument<T>(collection: string, docId: string, data: Partial<T>): Promise<void> {
    try {
      await firebase
        .firestore()
        .collection(collection)
        .doc(docId)
        .update({
          ...data,
          updatedAt: firebase.firestore.FieldValue.serverTimestamp(),
        })
    } catch (error) {
      console.error("Firestore update document error:", error)
      throw error
    }
  }

  /**
   * Deletes a document from a Firestore collection
   * @param collection Collection path
   * @param docId Document ID
   */
  static async deleteDocument(collection: string, docId: string): Promise<void> {
    try {
      await firebase.firestore().collection(collection).doc(docId).delete()
    } catch (error) {
      console.error("Firestore delete document error:", error)
      throw error
    }
  }

  /**
   * Gets a document from a Firestore collection
   * @param collection Collection path
   * @param docId Document ID
   * @returns Document data
   */
  static async getDocument<T>(collection: string, docId: string): Promise<FirebaseDocument<T> | null> {
    try {
      const docSnapshot = await firebase.firestore().collection(collection).doc(docId).get()

      if (!docSnapshot.exists) {
        return null
      }

      return {
        id: docSnapshot.id,
        ...(docSnapshot.data() as T),
      }
    } catch (error) {
      console.error("Firestore get document error:", error)
      throw error
    }
  }

  /**
   * Calls a Firebase Cloud Function
   * @param functionName Name of the function
   * @param data Data to pass to the function
   * @returns Function result
   */
  static async callFunction<T, R>(functionName: string, data?: T): Promise<R> {
    try {
      const functionRef = firebase.functions().httpsCallable(functionName)
      const result = await functionRef(data)
      return result.data as R
    } catch (error) {
      console.error(`Firebase function ${functionName} error:`, error)
      throw error
    }
  }

  /**
   * Uploads a file to Firebase Storage
   * @param uri Local URI of the file
   * @param path Storage path
   * @param metadata File metadata
   * @returns Download URL of the uploaded file
   */
  static async uploadFile(uri: string, path: string, metadata?: any): Promise<string> {
    try {
      // Convert URI to blob
      const response = await fetch(uri)
      const blob = await response.blob()

      // Upload to Firebase Storage
      const storageRef = firebase.storage().ref().child(path)
      const uploadTask = storageRef.put(blob, metadata)

      // Wait for upload to complete
      await uploadTask

      // Get download URL
      const downloadURL = await storageRef.getDownloadURL()

      return downloadURL
    } catch (error) {
      console.error("Firebase Storage upload error:", error)
      throw error
    }
  }
}
