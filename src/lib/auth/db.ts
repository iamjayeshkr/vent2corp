import fs from "fs";
import path from "path";

export interface UserRecord {
  id: string;
  email: string;
  name: string;
  passwordHash: string;
  createdAt: number;
}

const DATA_DIR = path.join(process.cwd(), "data");
const USERS_FILE = path.join(DATA_DIR, "users.json");

function ensureDbExists() {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }
  if (!fs.existsSync(USERS_FILE)) {
    fs.writeFileSync(USERS_FILE, JSON.stringify([]), "utf-8");
  }
}

export function getUsers(): UserRecord[] {
  try {
    ensureDbExists();
    const raw = fs.readFileSync(USERS_FILE, "utf-8");
    return JSON.parse(raw) as UserRecord[];
  } catch {
    return [];
  }
}

export function getUserByEmail(email: string): UserRecord | undefined {
  const users = getUsers();
  const lower = email.toLowerCase().trim();
  return users.find((u) => u.email.toLowerCase() === lower);
}

export function getUserById(id: string): UserRecord | undefined {
  const users = getUsers();
  return users.find((u) => u.id === id);
}

export function createUser(user: Omit<UserRecord, "id" | "createdAt">): UserRecord {
  ensureDbExists();
  const users = getUsers();
  const lowerEmail = user.email.toLowerCase().trim();

  if (users.some((u) => u.email.toLowerCase() === lowerEmail)) {
    throw new Error("User with this email already exists");
  }

  const newRecord: UserRecord = {
    id: `usr_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`,
    email: lowerEmail,
    name: user.name.trim(),
    passwordHash: user.passwordHash,
    createdAt: Date.now(),
  };

  users.push(newRecord);
  fs.writeFileSync(USERS_FILE, JSON.stringify(users, null, 2), "utf-8");
  return newRecord;
}
