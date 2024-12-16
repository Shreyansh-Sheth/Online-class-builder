import { sign, verify } from "jsonwebtoken";
import { addMinutes } from "date-fns";
export class AuthToken {
  static refetchTimeInMins = 1;
  static secret = process.env.AUTH_JWT ?? "secret";
  static getToken(userData: Object) {
    return sign(
      {
        ...userData,
        refetchTime: addMinutes(
          new Date(),
          this.refetchTimeInMins
        ).toISOString(),
      },
      this.secret
    );
  }
  static verifyToken(token: string) {
    return verify(token, "secret");
  }
}
