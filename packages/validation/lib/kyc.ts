import { z } from "zod";

const bankDetails = z.object({
  accountNumber: z.string().min(6).max(10),
  bankName: z.string().min(3).max(50),
  branchCode: z.string().min(3).max(10),
  accountHolderName: z.string().min(3).max(50),
});
export enum GENDER {
  MALE = "MALE",
  FEMALE = "FEMALE",
  OTHER = "OTHER",
  NTS = "NTS",
}
const kycData = z
  .object({
    firstName: z.string().min(1).max(50),
    lastName: z.string().min(1).max(50),
    gender: z.nativeEnum(GENDER),
    email: z.string().email().min(1).max(50),
    phone: z.number(),
    address: z.string().min(1).max(50),
    city: z.string().min(1).max(50),
    state: z.string().min(1).max(50),
    zip: z.string().min(1).max(50),
    country: z.string().min(1).max(50),
    dob: z.date(),

    documentName: z.string(),
    documentNumber: z.string(),
    documentImage: z.string(),
  })
  .merge(bankDetails);

const userId = z.object({
  userId: z.string().cuid(),
});
export const submitKycData = kycData.merge(userId);
export const updateKycData = kycData.partial().merge(userId);
