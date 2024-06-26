"use server";

import * as z from "zod";
import { LoginSchema } from "@/schemas";
import {signIn} from "@/auth";
import {DEFAULT_LOGIN_REDIRECT} from "@/routes";
import {AuthError} from "next-auth";

export const login = async (values: z.infer<typeof LoginSchema>) => {
    const validatedFields = LoginSchema.safeParse(values);

    if (!validatedFields.success) {
        return { error: "Invalid Fields!" };
    }

    const { email, password } = validatedFields.data;

    try {
        await signIn("credentials", {
            email,
            password,
            redirectTo: DEFAULT_LOGIN_REDIRECT
        });
    } catch (error) {
        // ตรวจสอบ error ว่าไม่ใช่ undefined ก่อนที่จะเรียกใช้งาน property ของมัน
        if (error instanceof AuthError) {
            switch (error.type) {
                case "CredentialsSignin":
                    return { error: "Invalid credentials!" };
                default:
                    return { error: "Something went wrong" };
            }
        }

        // ใช้ throw error เพื่อ throw ข้อผิดพลาดที่เกิดขึ้นจริงๆ
        throw error;
    }
};