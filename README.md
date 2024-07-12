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
import { FirestoreORM } from "firestore-db-orm";
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
    email: { where: "==", value: "email@asd.com" },
  });
})();
```

## Examples of `finds` Method

### Example 1: Simple Search

Find documents where `age` is equal to 25.

```typescript
const searchParams1: SearchParams = {
  age: 25,
};

const result1 = await userORM.finds(searchParams1);
console.log(result1);
```

### Example 2: Search with Simple Condition

Find documents where `age` is greater than 18.

```typescript
const searchParams2: SearchParams = {
  age: {
    value: 18,
    where: ">",
  },
};

const result2 = await userORM.finds(searchParams2);
console.log(result2);
```

### Example 3: Search with Multiple Conditions for the Same Field

Find documents where `age` is greater than 10 and less than 30.

```typescript
const searchParams3: SearchParams = {
  age: [
    {
      value: 10,
      where: ">",
    },
    {
      value: 30,
      where: "<",
    },
  ],
};

const result3 = await userORM.finds(searchParams3);
console.log(result3);
```

### Example 4: Search with Multiple Fields and Conditions

Find documents where `age` is greater than 18 and `name` is equal to "Juan".

```typescript
const searchParams4: SearchParams = {
  age: {
    value: 18,
    where: ">",
  },
  name: "Juan",
};

const result4 = await userORM.finds(searchParams4);
console.log(result4);
```

### Example 5: Search with Multiple Fields and Multiple Conditions

Find documents where `age` is within certain ranges and `name` is equal to "Ana".

```typescript
const searchParams5: SearchParams = {
  age: [
    {
      value: 10,
      where: ">",
    },
    {
      value: 30,
      where: "<",
    },
  ],
  name: "Ana",
};

const result5 = await userORM.finds(searchParams5);
console.log(result5);
```

### Example 6: Complex Search with Several Fields and Conditions

Find documents where `age` is greater than 10 and less than 30, `name` is "Pedro", and `active` is true.

```typescript
const searchParams6: SearchParams = {
  age: [
    {
      value: 10,
      where: ">",
    },
    {
      value: 30,
      where: "<",
    },
  ],
  name: "Pedro",
  active: true,
};

const result6 = await userORM.finds(searchParams6);
console.log(result6);
```

## License

[MPL-2.0](https://www.mozilla.org/en-US/MPL/2.0/)
