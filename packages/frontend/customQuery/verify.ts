import { useQuery, useMutation } from "@tanstack/react-query";
import axios from "axios";

export function useVerifyEndUserMutation() {
  return useMutation(async (data: { token: string }) => {
    return await axios.post(
      "/api/enduser/auth/verify",
      {
        ...data,
      },
      { withCredentials: true }
    );
  });
}
