import Jwt, { JwtPayload, SignOptions } from "jsonwebtoken";

const generateAccessTokens = (
  payload: JwtPayload,
  secret: string,
  expiresIn: SignOptions,
) => {
  return Jwt.sign(payload, secret, expiresIn as SignOptions);
};

const generateRefreshTokens = (
  payload: JwtPayload,
  secret: string,
  expiresIn: SignOptions,
) => {
  return Jwt.sign(payload, secret, expiresIn as SignOptions);
};

const verifiedToken = (token: string, secret: string) => {
  try {
    const verifiedToken = Jwt.verify(token, secret);
    return {
      success: true,
      data: verifiedToken,
    };
  } catch (error) {
    throw new Error(" invalid token");
  }
};

export const jwtHelper = {
  generateAccessTokens,
  generateRefreshTokens,
  verifiedToken,
};
