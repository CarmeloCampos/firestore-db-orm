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
