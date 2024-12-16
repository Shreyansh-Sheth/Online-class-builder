import axios from "axios";
export class Vercel {
  static VERCEL_AUTH_TOKEN = process.env.VERCEL_AUTH_TOKEN;
  static VERCEL_PROJECT_ID = process.env.VERCEL_PROJECT_ID;

  static vercelReq = axios.create({
    baseURL: "https://api.vercel.com",
    headers: {
      Authorization: `Bearer ${this.VERCEL_AUTH_TOKEN}`,
    },
  });
  static async AddDomainToProject(name: string) {
    const url = `/v9/projects/${this.VERCEL_PROJECT_ID}/domains`;
    return await this.vercelReq.post<DomainAddVerifyResponse>(url, { name });
  }

  static async getVerificationStatus(domain: string) {
    const url = `/v9/projects/${this.VERCEL_PROJECT_ID}/domains/${domain}/verify`;
    return await this.vercelReq.post<DomainAddVerifyResponse>(url);
  }

  static async removeDomainFromProject(domain: string) {
    const url = `/v9/projects/${this.VERCEL_PROJECT_ID}/domains/${domain}`;
    return await this.vercelReq.delete(url);
  }
}

interface DomainAddVerifyResponse {
  name: string;
  apexName: string;
  projectId: string;
  redirect?: string | null;
  redirectStatusCode?: (307 | 301 | 302 | 308) | null;
  gitBranch?: string | null;
  updatedAt?: number;
  createdAt?: number;
  /** `true` if the domain is verified for use with the project. If `false` it will not be used as an alias on this project until the challenge in `verification` is completed. */
  verified: boolean;
  /** A list of verification challenges, one of which must be completed to verify the domain for use on the project. After the challenge is complete `POST /projects/:idOrName/domains/:domain/verify` to verify the domain. Possible challenges: - If `verification.type = TXT` the `verification.domain` will be checked for a TXT record matching `verification.value`. */
  verification?: {
    type: string;
    domain: string;
    value: string;
    reason: string;
  }[];
}
