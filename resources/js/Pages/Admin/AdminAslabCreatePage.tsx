import { Label } from "@/components/ui/label";
import { FormEvent, useState } from "react";
import { AdminLayout } from "@/layouts/AdminLayout";
import { Head, router } from "@inertiajs/react";
import { CardDescription, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ArrowBigLeft, Eye, EyeOff, Loader2, Shuffle } from "lucide-react";
import { z } from "zod";
import axios, { AxiosError } from "axios";
import { useToast } from "@/hooks/use-toast";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

export default function AdminAslabCreatePage() {
    const { toast } = useToast();
    type CreateForm = {
        nama: string;
        npm: string;
        username: string;
        password: string;
        noHp: string;
        showPassword: boolean;
        onSubmit: boolean;
    };
    const createFormInit: CreateForm = {
        nama: '',
        npm: '',
        username: '',
        password: '',
        noHp: '',
        showPassword: false,
        onSubmit: false
    };

    const [ createForm, setCreateForm ] = useState<CreateForm>(createFormInit);
    const handleCreateFormSubmit = (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        setCreateForm((prevState) => ({ ...prevState, onSubmit: true }));
        const { nama, npm, noHp, username, password } = createForm;
        const createSchema = z.object({
            nama: z.string({ message: 'Format nama Aslab tidak valid! '}).min(1, { message: 'Nama Aslab wajib diisi!' }),
            npm: z.string({ message: 'Format NPM Aslab tidak valid! '}).min(1, { message: 'NPM Aslab wajib diisi!' }),
            username: z.string({ message: 'Format Username Aslab tidak valid! '}).min(1, { message: 'Username Aslab wajib diisi!' }),
            password: z.string({ message: 'Format Password Aslab tidak valid! '}).min(1, { message: 'Password Aslab wajib diisi!' }),
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
        }>(route('aslab.create'), {
            nama: nama,
            npm: npm,
            no_hp: noHp,
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
                router.visit(route('admin.aslab.index'));
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
        const firstName = createForm.nama.trim().split(' ')[0].toLowerCase();
        const nim = createForm.npm.split('.').pop()?.trim();
        if (firstName && nim) {
            setCreateForm((prevState) => ({
                ...prevState,
                username: `${firstName}${nim}`
            }));
        } else {
            toast({
                variant: "destructive",
                title: "Error",
                description: "Nama atau NPM tidak valid untuk membuat username."
            });
        }
    };

    return (
        <>
            <AdminLayout>
                <Head title="Admin - Menambahkan Aslab" />
                <Button variant="ghost" size="icon" onClick={ () => router.visit(route('admin.aslab.index')) }>
                    <ArrowBigLeft />
                </Button>
                <CardTitle>
                    Menambahkan Aslab
                </CardTitle>
                <CardDescription>
                    Menambahkan data Aslab baru
                </CardDescription>
                <form className={ cn("grid items-start gap-4") } onSubmit={ handleCreateFormSubmit }>
                    <div className="flex flex-col md:flex-row md:flex-wrap gap-3 md:items-center *:grow">
                        <div className="grid gap-2 min-w-80">
                            <Label htmlFor="nama">Nama Aslab</Label>
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
                            <Label htmlFor="npm">NPM Aslab</Label>
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
                            <Label htmlFor="username">Username Aslab</Label>
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
                    <div className="grid gap-2 min-w-80">
                        <Label htmlFor="npm">No.HP atau Wangsaff Aslab (tidak wajib)</Label>
                        <Input
                            type="text"
                            name="no_hp"
                            id="no_hp"
                            placeholder="08xxxxxxxxxx"
                            value={ createForm.noHp }
                            onChange={ (event) =>
                                setCreateForm((prevState) => ({
                                    ...prevState,
                                    noHp: event.target.value.replace(/[^0-9]/g, ""),
                                }))
                            }
                        />
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
            </AdminLayout>
        </>
    );
}
