import type firebase from "firebase/app"
import "firebase/firestore"

/**
 * Firebase document type with ID
 */
export interface FirebaseDocument<T> extends T {
  id: string
}

/**
 * Firebase where clause type
 */
export interface FirebaseWhereClause {
  field: string
  operator: firebase.firestore.WhereFilterOp
  value: any
}

/**
 * Firebase order by clause type
 */
export interface FirebaseOrderByClause {
  field: string
  direction: firebase.firestore.OrderByDirection
}

/**
 * Firebase limit clause type
 */
export interface FirebaseLimitClause {
  value: number
}

/**
 * Firebase query constraint types
 */
export type FirebaseQueryConstraint =
  | { type: "where"; field: string; operator: firebase.firestore.WhereFilterOp; value: any }
  | { type: "orderBy"; field: string; direction: firebase.firestore.OrderByDirection }
  | { type: "limit"; value: number }

/**
 * Firebase collection configuration type
 */
export interface FirebaseCollectionConfig<T> {
  path: string
  callback: (items: FirebaseDocument<T>[]) => void
  queryConstraints?: FirebaseQueryConstraint[]
}

/**
 * Firebase query configuration type
 */
export interface FirebaseQuery {
  collection: string
  where?: FirebaseWhereClause[]
  orderBy?: FirebaseOrderByClause
  limit?: number
}
