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
