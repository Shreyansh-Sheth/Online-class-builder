import { useForm, zodResolver } from "@mantine/form";
import { useEffect, useState } from "react";
import MainUserNavbar from "../../components/navbar/mainUser";
import {
  updateKycData,
  submitKycData,
  GENDER,
} from "@tutor/validation/lib/kyc";
import { trpc } from "../../utils/trpc";
import {
  TextInput,
  Text,
  Container,
  Stack,
  Title,
  Group,
  Divider,
  Paper,
  NumberInput,
  Grid,
  Select,
  Textarea,
  FileInput,
  Button,
  Box,
  Image,
  Loader,
  AspectRatio,
} from "@mantine/core";
import dayjs from "dayjs";

import { useDebouncedValue } from "@mantine/hooks";
import { DatePicker } from "@mantine/dates";
import axios from "axios";
import BackButton from "../../components/utils/BackButton";
export default function Kyc() {
  const { data } = trpc.user.me.useQuery(undefined, {
    onSuccess(data) {
      if (!data) return;
      setFieldValue("userId", data.id);
    },
  });
  const {
    values,
    setFieldValue,
    getInputProps,
    setValues,
    onSubmit,
    validate,
  } = useForm<typeof updateKycData["_input"]>({
    validate: zodResolver(updateKycData),
  });

  const [debounceValues] = useDebouncedValue(values, 500);
  const updateKycMutation = trpc.kyc.updateKyc.useMutation();
  const { data: kycData, isLoading } = trpc.kyc.getKyc.useQuery(undefined, {
    staleTime: Infinity,
    onSuccess(data) {
      if (data && data.data && typeof data.data === "object")
        setValues(data.data as unknown as typeof values);
    },
  });

  useEffect(() => {
    setValues(kycData?.data as unknown as typeof values);
  }, [kycData]);
  const submitKycMutation = trpc.kyc.submitKyc.useMutation();
  const submitFunction = onSubmit((data) => {
    submitKycMutation.mutate(data as typeof submitKycData["_input"]);
  });
  useEffect(() => {
    if (isLoading) return;
    validate();
    const { success } = updateKycData.safeParse(values);
    if (!success) return;

    updateKycMutation.mutate(values);
  }, [debounceValues]);

  const ImageUploadMutation = trpc.s3.getFileUploadUrl.useMutation();
  const getImageUrl = trpc.s3.getSignedUrlForKey.useMutation();
  const [uploadedImageUrl, setUploadedImageUrl] = useState("");
  useEffect(() => {
    if (values.documentImage) {
      getImageUrl.mutate(values.documentImage, {
        onSuccess(data) {
          setUploadedImageUrl(data);
        },
      });
    }
  }, [values.documentImage]);

  return (
    <>
      <MainUserNavbar showBackButton backButtonHref="/dashboard" />
      <main>
        <Container my="lg">
          <Title>Kyc</Title>
          {updateKycMutation.isLoading && (
            <Box sx={{ position: "fixed", bottom: "10px", right: "10px" }}>
              <Loader size="sm" />
            </Box>
          )}
          <Divider />
          <form onSubmit={submitFunction}>
            <Stack>
              <TextInput
                {...getInputProps("userId")}
                required
                sx={{ display: "none" }}
                value={data?.id}
              />

              <Paper p="sm" my="lg" withBorder>
                <Title order={4}>Personal Info</Title>
                <Grid grow columns={2}>
                  <Grid.Col span={2} sm={1}>
                    <TextInput
                      withAsterisk
                      {...getInputProps("firstName")}
                      label="First Name"
                    />
                  </Grid.Col>
                  <Grid.Col span={2} sm={1}>
                    <TextInput
                      withAsterisk
                      required
                      {...getInputProps("lastName")}
                      label="Last Name"
                    />
                  </Grid.Col>

                  <Grid.Col span={2} sm={1}>
                    <NumberInput
                      {...getInputProps("phone")}
                      label="phone number"
                      type="tel"
                      placeholder="911234567890"
                      hideControls
                      withAsterisk
                    />
                  </Grid.Col>
                  <Grid.Col span={2} sm={1}>
                    <TextInput
                      type="email"
                      {...getInputProps("email")}
                      label="Email"
                      withAsterisk
                    />
                  </Grid.Col>

                  <Grid.Col span={2} sm={1}>
                    <Select
                      {...getInputProps("gender")}
                      label="Gender"
                      required
                      data={[
                        { value: GENDER.MALE, label: "Male" },
                        { value: GENDER.FEMALE, label: "Female" },
                        { value: GENDER.OTHER, label: "Other" },
                        { value: GENDER.NTS, label: "Prefer Not To Say" },
                      ]}
                    />
                  </Grid.Col>
                  <Grid.Col span={2} sm={1}>
                    <DatePicker
                      label="Date of Birth"
                      value={dayjs(values.dob).toDate()}
                      onChange={(date) => {
                        if (date) setFieldValue("dob", date);
                      }}
                      maxDate={dayjs(new Date()).toDate()}
                      withAsterisk
                    />
                  </Grid.Col>
                </Grid>
              </Paper>
              <Paper withBorder p="md">
                <Title order={4}>Address</Title>
                <Grid grow columns={2}>
                  <Grid.Col span={2} sm={2}>
                    <Textarea
                      withAsterisk
                      {...getInputProps("address")}
                      label="Address "
                    />
                  </Grid.Col>
                  <Grid.Col span={2} sm={1}>
                    <TextInput
                      withAsterisk
                      {...getInputProps("city")}
                      label="City"
                    />
                  </Grid.Col>
                  <Grid.Col span={2} sm={1}>
                    <TextInput
                      withAsterisk
                      {...getInputProps("state")}
                      label="State"
                    />
                  </Grid.Col>
                  <Grid.Col span={2} sm={1}>
                    <TextInput
                      withAsterisk
                      {...getInputProps("country")}
                      label="Country"
                    />
                  </Grid.Col>
                  <Grid.Col span={2} sm={1}>
                    <TextInput
                      withAsterisk
                      {...getInputProps("zip")}
                      label="Postal Code"
                    />
                  </Grid.Col>
                </Grid>
              </Paper>
              <Paper withBorder p="md">
                <Title order={4}>Documents</Title>
                <Grid grow columns={2}>
                  <Grid.Col span={2} sm={1}>
                    <Select
                      data={[
                        { value: "aadhar", label: "Aadhar Card" },
                        {
                          value: "pan",
                          label: "Pan Card",
                        },
                      ]}
                      withAsterisk
                      {...getInputProps("documentName")}
                      label="ID Type"
                    />
                  </Grid.Col>
                  <Grid.Col span={2} sm={1}>
                    <TextInput
                      withAsterisk
                      {...getInputProps("documentNumber")}
                      label="ID Number"
                    />
                  </Grid.Col>
                  <Grid.Col span={2} sm={1}>
                    <AspectRatio ratio={3 / 2} sx={{ maxWidth: 300 }}>
                      <Image src={uploadedImageUrl} alt="" />
                    </AspectRatio>
                    <FileInput
                      accept="image/*"
                      onChange={(e) => {
                        if (!e) return;
                        ImageUploadMutation.mutate(
                          { isPrivate: true },
                          {
                            onSuccess(data) {
                              if (data) {
                                const { url, key } = data;
                                axios
                                  .put(url, e, {
                                    headers: {
                                      "Content-Type": e.type,
                                    },
                                  })
                                  .then(() => {
                                    setValues({
                                      ...values,
                                      documentImage: key,
                                    });
                                    setFieldValue("documentImage", key);
                                    // updateKycMutation.mutate({
                                    //   ...values,
                                    //   documentImage: key,
                                    // });
                                  });
                              }
                            },
                          }
                        );
                      }}
                      label="Upload Image"
                    />
                  </Grid.Col>
                </Grid>
              </Paper>
              <Paper withBorder p="md">
                <Title order={4}>Bank Details (For Payouts)</Title>
                <Grid grow columns={2}>
                  <Grid.Col span={2} sm={1}>
                    <TextInput
                      withAsterisk
                      {...getInputProps("bankName")}
                      label="Bank Name"
                    />
                  </Grid.Col>
                  <Grid.Col span={2} sm={1}>
                    <TextInput
                      withAsterisk
                      {...getInputProps("accountNumber")}
                      label="Account Number"
                    />
                  </Grid.Col>
                  <Grid.Col span={2} sm={1}>
                    <TextInput
                      withAsterisk
                      {...getInputProps("accountHolderName")}
                      label="Account Holder Name"
                    />
                  </Grid.Col>
                  <Grid.Col span={2} sm={1}>
                    <TextInput
                      withAsterisk
                      {...getInputProps("branchCode")}
                      label="IFSC Code"
                    />
                  </Grid.Col>
                </Grid>
              </Paper>
              <Button type="submit">Submit Kyc</Button>
            </Stack>
          </form>
        </Container>
      </main>
    </>
  );
}
