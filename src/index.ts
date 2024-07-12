import { firestore } from "firebase-admin";
import {
  CollectionReference,
  DocumentSnapshot,
  Query,
} from "firebase-admin/firestore";
import { v4 } from "uuid";
import type { SearchParam, SearchParams } from "./types";

export class FirestoreORM<T> {
  protected collection: CollectionReference<T>;

  constructor(
    protected db: firestore.Firestore,
    protected modelCollection: string,
  ) {
    this.collection = db.collection(
      this.modelCollection,
    ) as CollectionReference<T>;
  }

  async add(data: T): Promise<T> {
    const id = v4();
    const dataWithId = { ...data, id } as T;
    const docRef = this.collection.doc(id);
    await docRef.set(dataWithId);
    const doc = await docRef.get();
    return this.fromFirestore(doc);
  }

  async get(id: string): Promise<T | undefined> {
    const doc = await this.collection.doc(id).get();
    if (doc.exists) {
      return this.fromFirestore(doc);
    }
    return undefined;
  }

  async update(id: string, data: Partial<T>): Promise<void> {
    await this.collection.doc(id).update(data);
  }

  async delete(id: string): Promise<void> {
    await this.collection.doc(id).delete();
  }

  async finds(searchParams: SearchParams = {}): Promise<T[]> {
    let query: Query<T> = this.collection;
    query = this.buildQuery(query, searchParams);

    const querySnapshot = await query.get();
    return querySnapshot.docs.map((doc) => this.fromFirestore(doc));
  }

  async findOne(searchParams: SearchParams): Promise<T | undefined> {
    const [result] = await this.finds(searchParams);
    return result;
  }

  protected fromFirestore(snapshot: DocumentSnapshot<T>): T {
    const data = snapshot.data();
    if (!data) {
      throw new Error(`No data found in document with id: ${snapshot.id}`);
    }
    return { ...data, id: snapshot.id } as T;
  }

  private buildQuery(query: Query<T>, searchParams: SearchParams): Query<T> {
    for (const [key, value] of Object.entries(searchParams)) {
      if (Array.isArray(value)) {
        for (const condition of value) {
          if (this.isValidCondition(condition)) {
            query = query.where(key, condition.where, condition.value);
          }
        }
      } else if (this.isValidCondition(value)) {
        query = query.where(key, value.where, value.value);
      } else {
        query = query.where(key, "==", value);
      }
    }
    return query;
  }

  private isValidCondition(condition: any): condition is SearchParam {
    return (
      typeof condition === "object" &&
      "value" in condition &&
      "where" in condition
    );
  }
}
