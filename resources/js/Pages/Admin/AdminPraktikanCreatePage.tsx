import { Label } from "@/components/ui/label";
import { FormEvent, useState } from "react";
import { AppLayout } from "@/layouts/AppLayout";
import { Head, router } from "@inertiajs/react";
import { CardDescription, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Eye, EyeOff, Loader2, Shuffle } from "lucide-react";
import { z } from "zod";
import axios, { AxiosError } from "axios";
import { useToast } from "@/hooks/use-toast";
import { PageProps } from "@/types";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

export default function AdminPraktikanCreatePage() {
    const { toast } = useToast();
    type CreateForm = {
        nama: string;
        npm: string;
        username: string;
        password: string;
        showPassword: boolean;
        onSubmit: boolean;
    };
    const createFormInit: CreateForm = {
        nama: '',
        npm: '',
        username: '',
        password: '',
        showPassword: false,
        onSubmit: false
    };

    const [ createForm, setCreateForm ] = useState<CreateForm>(createFormInit);
    const handleCreateFormSubmit = (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        setCreateForm((prevState) => ({ ...prevState, onSubmit: true }));
        const { nama, npm, username, password } = createForm;
        const createSchema = z.object({
            nama: z.string({ message: 'Format nama Praktikan tidak valid! '}).min(1, { message: 'Nama Praktikan wajib diisi!' }),
            npm: z.string({ message: 'Format NPM Praktikan tidak valid! '}).min(1, { message: 'NPM Praktikan wajib diisi!' }),
            username: z.string({ message: 'Format Username Praktikan tidak valid! '}).min(1, { message: 'Username Praktikan wajib diisi!' }),
            password: z.string({ message: 'Format Password Praktikan tidak valid! '}).min(1, { message: 'Password Praktikan wajib diisi!' }),
        });
        const createParse = createSchema.safeParse({
            nama: nama,
            npm: npm,
            username: username,
            password: password
        });
        if (!createParse.success) {
            const errMsg = createParse.error.issues[0]?.message;
            toast({
                variant: "destructive",
                title: "Periksa kembali Input anda!",
                description: errMsg,
            });
            setCreateForm((prevState) => ({ ...prevState, onSubmit: false }));
            return;
        }

        axios.post<{
            message: string;
        }>(route('praktikan.create'), {
            nama: nama,
            npm: npm,
            username: username,
            password: password
        })
            .then((res) => {
                setCreateForm(createFormInit);
                toast({
                    variant: 'default',
                    className: 'bg-green-500 text-white',
                    title: "Berhasil!",
                    description: res.data.message,
                });
                router.visit(route('admin.praktikan.index'));
            })
            .catch((err: unknown) => {
                const errMsg: string = err instanceof AxiosError && err.response?.data?.message
                    ? err.response.data.message
                    : 'Error tidak diketahui terjadi!';
                setCreateForm((prevState) => ({ ...prevState, onSubmit: false }));
                toast({
                    variant: "destructive",
                    title: "Permintaan gagal diproses!",
                    description: errMsg,
                });
            });
    };
    const handleSetUsername = () => {
        const firstName: string = createForm.nama.split(' ')[0].toLowerCase();
        const nim: string | undefined = createForm.npm.split('.').pop();
        if (firstName && nim) {
            setCreateForm((prevState) => ({
                ...prevState,
                username: firstName.concat(nim)
            }));
        }
    };

    return (
        <>
            <AppLayout>
                <Head title="Admin - Menambahkan Praktikan" />
                <CardTitle>
                    Menambahkan Praktikan
                </CardTitle>
                <CardDescription>
                    Menambahkan data Praktikan baru
                </CardDescription>
                <form className={ cn("grid items-start gap-4") } onSubmit={ handleCreateFormSubmit }>
                    <div className="flex flex-col md:flex-row md:flex-wrap gap-3 md:items-center *:grow">
                        <div className="grid gap-2 min-w-80">
                            <Label htmlFor="nama">Nama Praktikan</Label>
                            <Input
                                type="text"
                                name="nama"
                                id="nama"
                                value={ createForm.nama }
                                onChange={ (event) =>
                                    setCreateForm((prevState) => ({
                                        ...prevState,
                                        nama: event.target.value,
                                    }))
                                }
                            />
                        </div>
                        <div className="grid gap-2 min-w-80">
                            <Label htmlFor="npm">NPM Praktikan</Label>
                            <Input
                                type="text"
                                name="npm"
                                id="npm"
                                placeholder="06.20xx.1.xxxx"
                                value={ createForm.npm }
                                onChange={ (event) =>
                                    setCreateForm((prevState) => ({
                                        ...prevState,
                                        npm: event.target.value,
                                    }))
                                }
                            />
                        </div>
                    </div>
                    <div className="flex flex-col md:flex-row md:flex-wrap gap-3 md:items-center *:grow">
                        <div className="grid gap-2 min-w-80">
                            <Label htmlFor="username">Username Praktikan</Label>
                            <div className="relative">
                                <Input
                                    id="username"
                                    type="text"
                                    value={ createForm.username }
                                    onChange={ (e) =>
                                        setCreateForm((prevState) => ({
                                            ...prevState,
                                            username: e.target.value,
                                        }))
                                    }
                                    required
                                />
                                <TooltipProvider>
                                    <Tooltip>
                                        <TooltipTrigger asChild>
                                            <button
                                                type="button"
                                                disabled={ !!createForm.username || !createForm.nama || !createForm.npm }
                                                onClick={ handleSetUsername }
                                                className="absolute inset-y-0 right-2 flex items-center text-gray-500 hover:text-gray-700 disabled:hover:text-gray-500"
                                            >
                                                <Shuffle/>
                                            </button>
                                        </TooltipTrigger>
                                        <TooltipContent>
                                            <p>
                                                { !createForm.nama || !createForm.npm
                                                    ? 'Isi Nama dan NPM terlebih dahulu'
                                                    : !!createForm.username
                                                        ? 'Auto-fill username tdk tersedia'
                                                        : 'Auto-fill username'
                                                }
                                            </p>
                                        </TooltipContent>
                                    </Tooltip>
                                </TooltipProvider>

                            </div>
                        </div>
                        <div className="grid gap-2 min-w-80">
                            <Label htmlFor="password">Password</Label>
                            <div className="relative">
                                <Input
                                    id="password"
                                    type={ createForm.showPassword ? "text" : "password" }
                                    placeholder="Password"
                                    value={ createForm.password }
                                    onChange={ (e) =>
                                        setCreateForm((prevState) => ({
                                            ...prevState,
                                            password: e.target.value,
                                        }))
                                    }
                                    required
                                />
                                <button
                                    type="button"
                                    onClick={ () => setCreateForm((prevState) => ({
                                        ...prevState,
                                        showPassword: !prevState.showPassword
                                    })) }
                                    className="absolute inset-y-0 right-2 flex items-center text-gray-500 hover:text-gray-700"
                                >
                                    { createForm.showPassword ? (
                                        <EyeOff className="w-5 h-5"/>
                                    ) : (
                                        <Eye className="w-5 h-5"/>
                                    ) }
                                </button>
                            </div>
                        </div>
                    </div>
                    <Button type="submit" disabled={ createForm.onSubmit || !createForm.nama || !createForm.npm || !createForm.username || !createForm.password }>
                        { createForm.onSubmit
                            ? (
                                <>Memproses <Loader2 className="animate-spin"/></>
                            ) : (
                                <span>Simpan</span>
                            )
                        }
                    </Button>
                </form>
            </AppLayout>
        </>
    );
}
