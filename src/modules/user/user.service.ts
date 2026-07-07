import bcrypt from "bcryptjs";
import config from "../../config";
import { prisma } from "../../lib/prisma";
import { UserPayload } from "./user.interface";

const creatUserFromDb = async (payload: UserPayload) => {
  const { name, email, password, role } = payload;
  const isUserExist = await prisma.user.findUnique({
    where: {
      email,
    },
  });

  if (isUserExist) {
    throw new Error("User already exists");
  }

  const passwordHash = await bcrypt.hash(
    password,
    Number(config.bcrypt_salt_rounds),
  );

  const creatUser = await prisma.user.create({
    data: {
      name,
      email,
      password: passwordHash,
      role,
    },
  });

  const user = await prisma.user.findUnique({
    where: {
      id: creatUser.id,
      email: creatUser.email,
    },
    omit: {
      password: true,
    },
  });

  return user;
};

export const userService = {
  creatUserFromDb,
};
