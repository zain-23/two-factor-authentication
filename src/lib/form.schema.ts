import * as z from "zod";

export const SignupFormSchema = z.object({
  fullname: z.string(),
  email: z.string().email({ message: "Please enter a valid email." }).trim(),
  password: z.string().min(8, { message: "Be at least 8 characters long" }),
});

export const SigninFormSchema = z.object({
  email: z.string().email({ message: "Please enter a valid email." }).trim(),
  password: z.string().trim().nonempty(),
});

export const CodeSchema = z.object({
  code: z.string().min(6, {
    message: "Your code must be 6 characters.",
  }),
});
