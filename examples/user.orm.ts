import { FirestoreORM } from "../src";
import { db } from "./firestore";
import { IUser } from "./user.interface";

const userORM = new FirestoreORM<IUser>(db, "users");

export default userORM;
