import { Role } from "../../../generated/prisma/client";

export interface UserPayload {
  name: string;
  email: string;
  password: string;
  role: Role;
}
