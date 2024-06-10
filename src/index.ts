import { firestore } from 'firebase-admin';
import { CollectionReference, DocumentSnapshot, Query } from 'firebase-admin/firestore';
import { v4 as uuidv4 } from 'uuid';

type FirestoreData = { [key: string]: any };

export class FirestoreORM<T extends FirestoreData> {
  protected collection: CollectionReference<T>;

  constructor(protected db: firestore.Firestore, protected modelCollection: string) {
    this.collection = db.collection(this.modelCollection) as CollectionReference<T>;
  }

  async add(data: Omit<T, 'id'>): Promise<T & { id: string }> {
    const id = uuidv4();
    const dataWithId = { ...data, id } as unknown as T;
    const docRef = this.collection.doc(id);
    await docRef.set(dataWithId);
    const doc = await docRef.get();
    return this.fromFirestore(doc);
  }

  async get(id: string): Promise<(T & { id: string }) | undefined> {
    const doc = await this.collection.doc(id).get();
    if (doc.exists) {
      return this.fromFirestore(doc);
    }
    return undefined;
  }

  async update(id: string, data: Partial<T>): Promise<void> {
    await this.collection.doc(id).update(data as firestore.UpdateData<T>);
  }

  async delete(id: string): Promise<void> {
    await this.collection.doc(id).delete();
  }

  async finds(searchParams: Partial<T> = {}): Promise<(T & { id: string })[]> {
    let query: Query<T> = this.collection;
    for (const [key, value] of Object.entries(searchParams)) {
      query = query.where(key, '==', value);
    }
    const querySnapshot = await query.get();
    return querySnapshot.docs.map((doc) => this.fromFirestore(doc));
  }

  async findOne(searchParams: Partial<T>): Promise<(T & { id: string }) | undefined> {
    const [result] = await this.finds(searchParams);
    return result;
  }

  protected fromFirestore(snapshot: DocumentSnapshot<T>): T & { id: string } {
    const data = snapshot.data();
    if (!data) {
      throw new Error(`No data found in document with id: ${snapshot.id}`);
    }
    return {
      id: snapshot.id,
      ...data
    } as T & { id: string };
  }
}