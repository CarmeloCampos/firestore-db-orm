# Firestore DB ORM

`firestore-db-orm` is a simple ORM library for Firestore, designed to provide easy-to-use, TypeScript-typed CRUD
operations.

## Installation

Install firebase-db-orm with bun

```bash
bun add firebase-db-orm
```

## Instantiate the ORM

```typescript
import { FirestoreORM } from "firebase-db-orm";
import { db } from "./firestore";
import { IUser } from "./user.interface";

const userORM = new FirestoreORM<IUser>(db, "users");

export default userORM;
```

## Complete Example

```typescript
import userORM from "./user.orm";

(async () => {
  const newUser = await userORM.add({
    email: "test@example.com",
    password: "securepassword",
  });
  console.log("New user created:", newUser);

  const user = await userORM.get(newUser.id);
  if (user) {
    console.log("User found:", user);
  }

  await userORM.update(newUser.id, { email: "newemail@example.com" });

  await userORM.delete(newUser.id);
})();
```

## License

[MPL-2.0](https://www.mozilla.org/en-US/MPL/2.0/)
