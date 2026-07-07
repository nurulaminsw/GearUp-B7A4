import bcrypt from "bcryptjs";
import jwt, { SignOptions } from "jsonwebtoken";
import config from "../../config";
import { prisma } from "../../lib/prisma";
import { IUserLoginPayload, UserPayload } from "./auth.interface";

const creatUserFromDb = async (payload: UserPayload) => {
  const { name, email, password, role } = payload;

  const isUserExist = await prisma.user.findUnique({
    where: { email },
  });

  if (isUserExist) {
    throw new Error("User already exists");
  }

  const passwordHash = await bcrypt.hash(
    password,
    Number(config.bcrypt_salt_rounds),
  );

  const user = await prisma.user.create({
    data: {
      name,
      email,
      password: passwordHash,
      role,
    },
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      status: true,
      createdAt: true,
      updatedAt: true,
    },
  });

  return user;
};

const userLogin = async (payload: IUserLoginPayload) => {
  const { email, password } = payload;

  const user = await prisma.user.findUniqueOrThrow({
    where: { email },
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      status: true,
      password: true,
    },
  });

  if (user.status === "SUSPENDED") {
    throw new Error("User is suspended");
  }

  const isPasswordMatched = await bcrypt.compare(password, user.password);

  if (!isPasswordMatched) {
    throw new Error("Credential is not matched");
  }

  const jwtPayload = {
    id: user.id,
    email: user.email,
    name: user.name,
    role: user.role,
  };

  const accessToken = jwt.sign(jwtPayload, config.jwt_access_secret, {
    expiresIn: config.jwt_access_expire_in,
  } as SignOptions);

  const refreshToken = jwt.sign(jwtPayload, config.jwt_refresh_secret, {
    expiresIn: config.jwt_refresh_expire_in,
  } as SignOptions);

  return { accessToken, refreshToken };
};

const refreshToken = async (token: string) => {
  const verifiedToken = jwt.verify(
    token,
    config.jwt_refresh_secret,
  ) as jwt.JwtPayload;

  const id = verifiedToken?.id as string;

  if (!id) {
    throw new Error("Invalid refresh token");
  }

  const user = await prisma.user.findUniqueOrThrow({
    where: { id },
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      status: true,
    },
  });

  if (user.status === "SUSPENDED") {
    throw new Error("User is suspended");
  }

  if (verifiedToken.role && user.role !== verifiedToken.role) {
    throw new Error("User role mismatch");
  }

  const jwtPayload = {
    id: user.id,
    email: user.email,
    name: user.name,
    role: user.role,
  };

  const newAccessToken = jwt.sign(jwtPayload, config.jwt_access_secret, {
    expiresIn: config.jwt_access_expire_in,
  } as SignOptions);

  return { accessToken: newAccessToken };
};

const getProfilefromDB = async (userId: string) => {
  const user = await prisma.user.findUniqueOrThrow({
    where: {
      id: userId,
    },
    omit: {
      password: true,
    },
  });
  return user;
};

export const userService = {
  creatUserFromDb,
  userLogin,
  getProfilefromDB,
  refreshToken,
};
