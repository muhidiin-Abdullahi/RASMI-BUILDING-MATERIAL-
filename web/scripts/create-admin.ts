import readline from "node:readline/promises";
import { stdin as input, stdout as output } from "node:process";
import { connectDatabase, disconnectDatabase } from "../src/server/db";
import { AdminUserModel, normalizeAdminEmail } from "../src/server/models/AdminUser";
import { hashPassword } from "../src/server/services/auth.service";

async function ask(question: string): Promise<string> {
  const rl = readline.createInterface({ input, output });
  const answer = await rl.question(question);
  rl.close();
  return answer;
}

async function main() {
  await connectDatabase();

  const existingCount = await AdminUserModel.countDocuments({});
  if (existingCount > 0 && process.env.FORCE_CREATE_ADMIN !== "true") {
    console.error(
      "Administrator accounts already exist. Set FORCE_CREATE_ADMIN=true to add another account.",
    );
    process.exit(1);
  }

  const name =
    process.env.INITIAL_ADMIN_NAME?.trim() || (await ask("Administrator name: "));
  const email = normalizeAdminEmail(
    process.env.INITIAL_ADMIN_EMAIL?.trim() || (await ask("Administrator email: ")),
  );
  const password =
    process.env.INITIAL_ADMIN_PASSWORD?.trim() ||
    (await ask("Password (min 12 characters): "));

  if (!name || !email || password.length < 12) {
    console.error("Name, email, and password (min 12 chars) are required.");
    process.exit(1);
  }

  if (await AdminUserModel.exists({ email })) {
    console.error("An administrator with this email already exists.");
    process.exit(1);
  }

  const role = process.env.INITIAL_ADMIN_ROLE === "ADMIN" ? "ADMIN" : "SUPER_ADMIN";
  const user = await AdminUserModel.create({
    name,
    email,
    passwordHash: await hashPassword(password),
    role,
    active: true,
  });

  console.log(`Created ${role} account: ${user.email} (${user._id.toString()})`);
  await disconnectDatabase();
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
