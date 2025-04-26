import bcrypt from "bcrypt";

async function hashPassword() {
  const hashed = await bcrypt.hash("admin", 10);
  console.log(hashed);
}

hashPassword();