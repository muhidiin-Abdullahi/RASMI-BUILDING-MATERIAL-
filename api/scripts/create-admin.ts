import "dotenv/config";
import readline from "node:readline/promises";
import { stdin as input, stdout as output } from "node:process";
import { connectDatabase, disconnectDatabase } from "../src/config/database.js";
import { loadEnv, requireMongoUri } from "../src/config/env.js";
import { AdminUserModel, normalizeAdminEmail } from "../src/models/AdminUser.js";
import { hashPassword } from "../src/services/auth.service.js";

async function promptHidden(question: string): Promise<string> {
  const rl = readline.createInterface({ input, output });
  const answer = await rl.question(question);
  rl.close();
  return answer;
}

async function main() {
  const env = loadEnv();
  await connectDatabase({ ...env, MONGODB_URI: requireMongoUri(env) });

  const existingCount = await AdminUserModel.countDocuments({});
  if (existingCount > 0 && process.env.FORCE_CREATE_ADMIN !== "true") {
    console.error(
      "Administrator accounts already exist. Set FORCE_CREATE_ADMIN=true to add another account.",
    );
    process.exit(1);
  }

  const name =
    process.env.INITIAL_ADMIN_NAME?.trim() ||
    (await promptHidden("Administrator name: "));
  const email = normalizeAdminEmail(
    process.env.INITIAL_ADMIN_EMAIL?.trim() ||
      (await promptHidden("Administrator email: ")),
  );
  const password =
    process.env.INITIAL_ADMIN_PASSWORD?.trim() ||
    (await promptHidden("Password (min 12 characters): "));

  if (!name || !email || password.length < 12) {
    console.error("Name, email, and password (min 12 chars) are required.");
    process.exit(1);
  }

  const duplicate = await AdminUserModel.exists({ email });
  if (duplicate) {
    console.error("An administrator with this email already exists.");
    process.exit(1);
  }

  const role =
    process.env.INITIAL_ADMIN_ROLE === "ADMIN" ? "ADMIN" : "SUPER_ADMIN";

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
