# Firestore DB ORM

`firestore-db-orm` is a simple ORM library for Firestore, designed to provide easy-to-use, TypeScript-typed CRUD
operations.

## Installation

Install firebase-db-orm with bun

```bash
bun add firestore-db-orm
```

## Instantiate the ORM

```typescript
import { FirestoreORM } from "firebase-db-orm";
import { db } from "./firestore";
import type { IUser } from "./user.interface";

const userORM = new FirestoreORM<IUser>(db, "users");

export default userORM;
```

## Complete Example

```typescript
import userORM from "./user.orm";
import { v4 } from "uuid";

(async () => {
  const newUser = await userORM.add({
    id: v4(),
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

  const otherUser = await userORM.findOne({
    email: {
      where: "==",
      value: "email@asd.com",
    },
  });
})();
```

## License

[MPL-2.0](https://www.mozilla.org/en-US/MPL/2.0/)
