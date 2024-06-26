"use client";

import * as z from "zod";

import {useState, useTransition} from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { LoginSchema } from "@/schemas";

import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";

import {CardWrapper} from "@/components/auth/card-wrapper";
import {Input} from "@/components/ui/input";
import {Button} from "@/components/ui/button";
import {FormError} from "@/components/form-error";
import {FormSuccess} from "@/components/form-success";
import {login} from "@/actions/login";

export const LoginFrom = () =>{

    const [error, setError] = useState<string | undefined>("");
    const [success, setSuccess] = useState<string | undefined>("");
    // เกิด transition ใช้ useTransition
    // isPending เมือเกิด submit ให้ปุ่ม กดไม่ได้
    // disabled = {isPending}
    const [isPending, startTransition] = useTransition();
    // เกิด transition ให้ใช้ useTransition

    const form = useForm<z.infer<typeof LoginSchema>>({
        resolver : zodResolver(LoginSchema),
        defaultValues: {
            email: "",
            password: "",
        }
    });

    const onSubmit = (values: z.infer<typeof LoginSchema>) => {
        setError("");
        setSuccess("");
        // เกิด transition ให้ใช้ useTransition
        startTransition(()=>{
            // api actions.login => form.value
            login(values)
                // เอาค่าที่ได้จาก login มาเก็บไว้ที่ state
                .then((data)=> {
                    setError(data.error);
                    setSuccess(data.success);
                })
        })
    }

    return (
        <CardWrapper
            headerLabel="Welcome back"
            backButtonLabel="Don't have an account?"
            backButtonHref="/auth/register"
            showSocial
        >
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)}
                      className="space-y-6"
                >
                    <div className="space-y-4">
                        {/* email */}
                        <FormField
                            control={form.control}
                            name="email"
                            render={({ field }) =>(
                                <FormItem>
                                    <FormLabel>
                                        Email
                                    </FormLabel>
                                    <FormControl>
                                        <Input
                                            {...field}
                                            disabled={isPending}
                                            placeholder="balldev1@gmail.com"
                                            type="email"
                                        />
                                    </FormControl>
                                    {/* message */}
                                    <FormMessage/>
                                </FormItem>
                            )}
                        >
                        </FormField>

                        {/* password */}
                        <FormField
                            control={form.control}
                            name="password"
                            render={({ field }) =>(
                                <FormItem>
                                    <FormLabel>
                                        Email
                                    </FormLabel>
                                    <FormControl>
                                        <Input
                                            {...field}
                                            disabled={isPending}
                                            placeholder="*******"
                                            type="password"
                                        />
                                    </FormControl>
                                    {/* message */}
                                    <FormMessage/>
                                </FormItem>
                            )}
                        >
                        </FormField>
                    </div>
                    {/* FORM ERROR */}
                    <FormError
                        message={error}
                    />
                    <FormSuccess
                        message={success}
                    />
                    <Button
                    type="submit"
                    disabled={isPending}
                    className="w-full"
                    >
                        Login
                    </Button>
                </form>
            </Form>
        </CardWrapper>
    )
}