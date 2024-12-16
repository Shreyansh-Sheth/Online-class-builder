import { sign, verify } from "jsonwebtoken";
export class VerifyJWT {
  static secret =
    process.env.VERIFY_JWT ??
    "RegisterJWTSecretCODE9h21921h9bnu21&*^%^%#&!@^#&@%#";
  static signToken(email: string, isVerified: Boolean) {
    return sign({ email, isVerified }, this.secret, {
      expiresIn: "10m",
    });
  }
  static verifyToken(token: string) {
    return verify(token, this.secret);
  }
}
