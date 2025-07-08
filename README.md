# Firestore DB ORM

`firestore-db-orm` is a lightweight, TypeScript-first Object-Relational Mapper (ORM) for Google Firestore. It simplifies interactions with your Firestore database by providing an intuitive, promise-based API for common CRUD (Create, Read, Update, Delete) operations and flexible querying.

## Table of Contents

- [Features](#features)
- [Installation](#installation)
- [Instantiate the ORM](#instantiate-the-orm)
- [CRUD Operations](#crud-operations)
  - [`add(data: T): Promise<T>`](#adddata-t-promiset)
  - [`get(id: string): Promise<T | undefined>`](#getid-string-promiset--undefined)
  - [`update(id: string, data: Partial<T>): Promise<void>`](#updateid-string-data-partialt-promisevoid)
  - [`delete(id: string): Promise<void>`](#deleteid-string-promisevoid)
  - [`findOne(searchParams: SearchParams): Promise<T | undefined>`](#findonesearchparams-searchparams-promiset--undefined)
- [Finding Multiple Documents (`finds` Method)](#finding-multiple-documents-finds-method)
  - [Examples of `finds` Method](#examples-of-finds-method)
- [Advanced Usage (Future Enhancements)](#advanced-usage-future-enhancements)
- [Contributing](#contributing)
- [License](#license)

## Features

*   **Type-Safe:** Leverages TypeScript for strong typing of your data models.
*   **Simple API:** Easy-to-understand methods for CRUD operations.
*   **Flexible Querying:** Supports various query conditions for finding documents.
*   **Automatic ID Generation:** Automatically handles `id` generation for new documents (using `uuid`).
*   **Promise-based:** Asynchronous operations using Promises for modern JavaScript.

## Installation

Install `firestore-db-orm` using your preferred package manager:

**bun**
```bash
bun add firestore-db-orm
```

**npm**
```bash
npm install firestore-db-orm
```

**yarn**
```bash
yarn add firestore-db-orm
```

## Instantiate the ORM

```typescript
import { initializeApp, cert } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';
import { FirestoreORM } from "firestore-db-orm";
import type { IUser } from "./user.interface"; // Your data model interface

// Initialize Firebase Admin SDK
// Ensure you have your service account key JSON file
// (e.g., serviceAccountKey.json) in your project.
// Replace with your actual service account key path and project details.
const serviceAccount = require('./path/to/your/serviceAccountKey.json');

initializeApp({
  credential: cert(serviceAccount),
  // databaseURL: 'https://<YOUR_PROJECT_ID>.firebaseio.com' // Optional: if not using default
});

// Get Firestore instance
const db = getFirestore();

// Instantiate the ORM
// Parameters:
// 1. db: The Firestore instance.
// 2. modelCollection: The name of the Firestore collection (e.g., "users").
const userORM = new FirestoreORM<IUser>(db, "users");

export default userORM;
```

**Explanation:**

*   **`IUser`**: This is a TypeScript interface defining the structure of your data (e.g., for a "users" collection). You should replace this with your actual data model.
*   **`db`**: This is your initialized Firestore database instance. The example shows how to initialize it using `firebase-admin`. Make sure you have the `firebase-admin` package installed and configured with your Firebase project credentials.
*   **`"users"`**: This string is the name of the Firestore collection where your data will be stored. Replace `"users"` with the actual name of your collection.

## CRUD Operations

The ORM provides methods for common Create, Read, Update, and Delete (CRUD) operations.

### `add(data: T): Promise<T>`

Adds a new document to the collection. The `id` field is automatically generated (using `uuid`) and added to the data before saving.

```typescript
import userORM from "./user.orm"; // Assuming user.orm.ts is set up as shown above
import { v4 } from "uuid"; // Or use any ID generation strategy

(async () => {
  try {
    const newUser = await userORM.add({
      // id: v4(), // ID is auto-generated, but you can pre-define if needed for your model
      email: "test@example.com",
      password: "securepassword123",
      // Add other fields as per your IUser interface
    });
    console.log("New user created:", newUser);
  } catch (error) {
    console.error("Error adding user:", error);
  }
})();
```

### `get(id: string): Promise<T | undefined>`

Retrieves a document by its ID. Returns the document data if found, otherwise `undefined`.

```typescript
import userORM from "./user.orm";

(async () => {
  try {
    const userId = "some-user-id"; // Replace with an actual ID
    const user = await userORM.get(userId);

    if (user) {
      console.log("User found:", user);
    } else {
      console.log("User not found.");
    }
  } catch (error) {
    console.error("Error getting user:", error);
  }
})();
```

### `update(id: string, data: Partial<T>): Promise<void>`

Updates an existing document with the provided data. `Partial<T>` means you can provide only the fields you want to change.

```typescript
import userORM from "./user.orm";

(async () => {
  try {
    const userIdToUpdate = "some-user-id"; // Replace with an actual ID
    await userORM.update(userIdToUpdate, { email: "updated.email@example.com" });
    console.log("User updated successfully.");

    // You can verify by getting the user
    const updatedUser = await userORM.get(userIdToUpdate);
    if (updatedUser) {
      console.log("Updated user data:", updatedUser);
    }
  } catch (error) {
    console.error("Error updating user:", error);
  }
})();
```

### `delete(id: string): Promise<void>`

Deletes a document by its ID.

```typescript
import userORM from "./user.orm";

(async () => {
  try {
    const userIdToDelete = "some-user-id"; // Replace with an actual ID
    await userORM.delete(userIdToDelete);
    console.log("User deleted successfully.");

    // You can verify by trying to get the user
    const deletedUser = await userORM.get(userIdToDelete);
    if (!deletedUser) {
      console.log("User confirmed deleted.");
    }
  } catch (error) {
    console.error("Error deleting user:", error);
  }
})();
```

### `findOne(searchParams: SearchParams): Promise<T | undefined>`

Finds a single document that matches the search criteria. Returns the first matching document or `undefined`.
The `searchParams` object allows you to specify field conditions.

```typescript
import userORM from "./user.orm";

(async () => {
  try {
    const user = await userORM.findOne({
      email: { where: "==", value: "test@example.com" },
    });

    if (user) {
      console.log("User found by email:", user);
    } else {
      console.log("User with that email not found.");
    }
  } catch (error) {
    console.error("Error finding one user:", error);
  }
})();
```

## Finding Multiple Documents (`finds` Method)

The `finds(searchParams: SearchParams = {}): Promise<T[]>` method allows you to retrieve multiple documents based on complex query conditions.

**`SearchParams` Type:**

The `searchParams` object is a key-value map where:
*   **Key**: The field name in your document (e.g., `age`, `name`).
*   **Value**: Can be one of the following:
    *   A direct value (e.g., `25`, `"Juan"`): This implies an "equals" (`==`) condition.
    *   A `SearchParam` object: `{ value: any; where: WhereFilterOp }` for specifying conditions like greater than (`>`), less than (`<`), etc. `WhereFilterOp` is a string type from Firebase (`<`, `<=`, `==`, `!=`, `>=`, `>`, `array-contains`, `in`, `not-in`, `array-contains-any`).
    *   An array of `SearchParam` objects: For applying multiple conditions to the same field (e.g., age > 10 AND age < 30).

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

## Advanced Usage (Future Enhancements)

Currently, the ORM focuses on providing straightforward CRUD operations. Future enhancements could include:

*   **Transactions:** Support for Firestore transactions to perform multiple operations atomically.
*   **Batch Writes:** Enabling batch operations (e.g., multiple `set`, `update`, or `delete` calls in a single request) for efficiency.
*   **Custom Data Transformers:** Hooks or methods to transform data when reading from or writing to Firestore (e.g., for date conversions, encryption/decryption).
*   **Real-time Listeners:** Integration with Firestore's real-time data synchronization capabilities.

If you have specific needs or ideas for advanced features, please feel free to open an issue or contribute to the project!

## Contributing

Contributions are welcome! If you'd like to contribute, please follow these steps:

1.  **Fork the repository.**
2.  **Create a new branch:** `git checkout -b my-feature-branch`
3.  **Make your changes.**
4.  **Commit your changes:** `git commit -m 'Add some feature'`
5.  **Push to the branch:** `git push origin my-feature-branch`
6.  **Open a pull request.**

Please make sure to update tests as appropriate and follow the existing code style.

## License

This project is licensed under the MPL-2.0 License. See the [LICENSE](LICENSE) file for details.
