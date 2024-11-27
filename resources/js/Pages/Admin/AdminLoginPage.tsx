import { ChangeEvent, FormEvent, useState } from "react";
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { LogoJarkom } from "@/lib/StaticImagesLib";
import { Eye, EyeOff } from "lucide-react";
import { z } from "zod";
import { Head, router } from "@inertiajs/react";
import * as React from "react";

const loginSchema = z.object({
    username: z.string({ message: 'Username wajib diisi!' }).min(3, "Username minimal 3 karakter").max(50, "Username terlalu panjang"),
    password: z.string({ message: 'Password wajib diisi!' }).min(6, "Password minimal 6 karakter").max(100, "Password terlalu panjang"),
});
export default function AdminLoginPage() {
    const [ form, setForm ] = useState({
        username: '',
        password: '',
        onsubmit: false,
        onError: false,
        errMsg: ''
    });
    const [ passwordVisible, setPasswordVisible ] = useState(false);

    const handleFormInput = (event: ChangeEvent<HTMLInputElement>) => {
        const { name, value } = event.target;
        setForm((prevState) => ({
            ...prevState,
            [name]: value,
            onError: false,
            errMsg: ''
        }));
    };
    const handleFormSubmit = (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        const { username, password } = form;
        setForm((prev) => ({ ...prev, onsubmit: true }));
        const loginValidation = loginSchema.safeParse({
            username: username,
            password: password,
        });

        if (!loginValidation.success) {
            setForm((prevState) => ({
                ...prevState,
                onsubmit: false,
                onError: true,
                errMsg: loginValidation.error.issues[0].message
            }));
            return;
        }

    };
    const togglePasswordVisibility = () => {
        setPasswordVisible((prev) => !prev);
    };

    return (
        <>
            <Head title="Admin - Login" />
            <div className="min-h-screen bg-gradient-to-b from-muted from-70% to-muted-foreground flex items-center justify-center p-4">
                <Card className="w-full max-w-md">
                    <form onSubmit={ handleFormSubmit }>
                        <CardHeader className="space-y-1 flex flex-col items-center">
                            <img
                                src={ LogoJarkom }
                                alt="logo-jarkom"
                                width={ 160 }
                                className="mx-auto"
                            />
                            <CardTitle className="text-2xl font-bold text-center">
                                Jarkom Jaya
                            </CardTitle>
                            <CardDescription className="text-center">
                                Masuk sebagai Admin
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="username">Username</Label>
                                <Input
                                    id="username"
                                    type="text"
                                    placeholder="username"
                                    value={ form.username }
                                    onChange={ (e) =>
                                        setForm((prev) => ({
                                            ...prev,
                                            username: e.target.value,
                                        }))
                                    }
                                    required
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="password">Password</Label>
                                <div className="relative">
                                    <Input
                                        id="password"
                                        type={ passwordVisible ? "text" : "password" }
                                        placeholder="Password"
                                        value={ form.password }
                                        onChange={ (e) =>
                                            setForm((prev) => ({
                                                ...prev,
                                                password: e.target.value,
                                            }))
                                        }
                                        required
                                    />
                                    <button
                                        type="button"
                                        onClick={ togglePasswordVisibility }
                                        className="absolute inset-y-0 right-2 flex items-center text-gray-500 hover:text-gray-700"
                                    >
                                        { passwordVisible ? (
                                            <EyeOff className="w-5 h-5"/>
                                        ) : (
                                            <Eye className="w-5 h-5"/>
                                        ) }
                                    </button>
                                </div>
                            </div>
                        </CardContent>
                        <CardFooter className="pt-3 pb-8 flex flex-col gap-2.5">
                            <Button
                                className="w-full"
                                type="button"
                                disabled={ form.onsubmit || form.onError }
                                onClick={ () => router.visit(route('admin.dashboard')) }
                            >
                                { form.onsubmit ? "Memuat..." : "Masuk" }
                            </Button>
                            <p className={ `h-6 text-sm text-red-600 font-medium ${form.onError && form.errMsg ? 'opacity-100' : 'opacity-0'}` }>
                                { form.errMsg } CIHUYY
                            </p>
                        </CardFooter>
                    </form>
                </Card>
            </div>
        </>
    );
}
