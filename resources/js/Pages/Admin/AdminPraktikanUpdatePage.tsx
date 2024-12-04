import { Label } from "@/components/ui/label";
import { FormEvent, useState } from "react";
import { AppLayout } from "@/layouts/AppLayout";
import { Head, router } from "@inertiajs/react";
import { CardDescription, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Loader2, Shuffle } from "lucide-react";
import { z } from "zod";
import axios, { AxiosError } from "axios";
import { useToast } from "@/hooks/use-toast";
import { PageProps } from "@/types";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

type Praktikan = {
    id: string;
    nama: string;
    npm: string;
    username: string;
};

export default function AdminPraktikanUpdatePage({ praktikan  }: PageProps<{
    praktikan: Praktikan;
}>) {
    const { toast } = useToast();
    type UpdateForm = {
        nama: string;
        npm: string;
        username: string;
        onSubmit: boolean;
    };

    const [ updateForm, setUpdateForm ] = useState<UpdateForm>({
        nama: praktikan.nama,
        npm: praktikan.npm,
        username: praktikan.username,
        onSubmit: false
    });
    const [ isOnChange, setIsOnChange ] = useState(false);

    const handleUpdateForm = (key: keyof UpdateForm, value: string | boolean | number) => {
        const payload = {
            [key]: value,
        };

        setUpdateForm((prevState) => {
            const newState = { ...prevState, ...payload };
            const latestState = {
                nama: praktikan.nama,
                npm: praktikan.npm,
                username: praktikan.username,
                onSubmit: false
            }
            if (JSON.stringify(newState) !== JSON.stringify(latestState)) {
                setIsOnChange(true);
            } else {
                setIsOnChange(false);
            }

            return newState;
        });
    };
    const handleUpdateFormSubmit = (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        setUpdateForm((prevState) => ({ ...prevState, onSubmit: true }));
        const { nama, npm, username } = updateForm;
        const createSchema = z.object({
            nama: z.string({ message: 'Format nama Praktikan tidak valid! '}).min(1, { message: 'Nama Praktikan wajib diisi!' }),
            npm: z.string({ message: 'Format NPM Praktikan tidak valid! '}).min(1, { message: 'NPM Praktikan wajib diisi!' }),
            username: z.string({ message: 'Format Username Praktikan tidak valid! '}).min(1, { message: 'Username Praktikan wajib diisi!' }),
        });
        const createParse = createSchema.safeParse({
            nama: nama,
            npm: npm,
            username: username,
        });
        if (!createParse.success) {
            const errMsg = createParse.error.issues[0]?.message;
            toast({
                variant: "destructive",
                title: "Periksa kembali Input anda!",
                description: errMsg,
            });
            setUpdateForm((prevState) => ({ ...prevState, onSubmit: false }));
            return;
        }

        axios.post<{
            message: string;
        }>(route('praktikan.update'), {
            id: praktikan.id,
            nama: nama,
            npm: npm,
            username: username,
        })
            .then((res) => {
                toast({
                    variant: 'default',
                    className: 'bg-green-500 text-white',
                    title: "Berhasil!",
                    description: res.data.message,
                });
                router.reload({ only: ['praktikan'] });
                setUpdateForm((prevState) => ({
                    ...prevState,
                    onSubmit: false
                }))
                setIsOnChange(false);
            })
            .catch((err: unknown) => {
                const errMsg: string = err instanceof AxiosError && err.response?.data?.message
                    ? err.response.data.message
                    : 'Error tidak diketahui terjadi!';
                setUpdateForm((prevState) => ({ ...prevState, onSubmit: false }));
                toast({
                    variant: "destructive",
                    title: "Permintaan gagal diproses!",
                    description: errMsg,
                });
            });
    };
    const handleSetUsername = () => {
        const firstName: string = updateForm.nama.split(' ')[0].toLowerCase();
        const nim: string | undefined = updateForm.npm.split('.').pop();
        if (firstName && nim) {
            setUpdateForm((prevState) => ({
                ...prevState,
                username: firstName.concat(nim)
            }));
        }
    };

    return (
        <>
            <AppLayout>
                <Head title="Admin - Memperbarui Praktikan" />
                <CardTitle>
                    Memperbarui data Praktikan
                </CardTitle>
                <CardDescription>
                    ...
                </CardDescription>
                <form className={ cn("grid items-start gap-4") } onSubmit={ handleUpdateFormSubmit }>
                    <div className="flex flex-col md:flex-row md:flex-wrap gap-3 md:items-center *:grow">
                        <div className="grid gap-2 min-w-80">
                            <Label htmlFor="nama">Nama Praktikan</Label>
                            <Input
                                type="text"
                                name="nama"
                                id="nama"
                                value={ updateForm.nama }
                                onChange={ (event) => handleUpdateForm('nama', event.target.value) }
                            />
                        </div>
                        <div className="grid gap-2 min-w-80">
                            <Label htmlFor="npm">NPM Praktikan</Label>
                            <Input
                                type="text"
                                name="npm"
                                id="npm"
                                placeholder="06.20xx.1.xxxx"
                                value={ updateForm.npm }
                                onChange={ (event) => handleUpdateForm('npm', event.target.value) }
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
                                    value={ updateForm.username }
                                    onChange={ (event) => handleUpdateForm('username', event.target.value) }
                                    required
                                />
                                <TooltipProvider>
                                    <Tooltip>
                                        <TooltipTrigger asChild>
                                            <button
                                                type="button"
                                                disabled={ !!updateForm.username || !updateForm.nama || !updateForm.npm }
                                                onClick={ handleSetUsername }
                                                className="absolute inset-y-0 right-2 flex items-center text-gray-500 hover:text-gray-700 disabled:hover:text-gray-500"
                                            >
                                                <Shuffle/>
                                            </button>
                                        </TooltipTrigger>
                                        <TooltipContent>
                                            <p>
                                                { !updateForm.nama || !updateForm.npm
                                                    ? 'Isi Nama dan NPM terlebih dahulu'
                                                    : !!updateForm.username
                                                        ? 'Auto-fill username tdk tersedia'
                                                        : 'Auto-fill username'
                                                }
                                            </p>
                                        </TooltipContent>
                                    </Tooltip>
                                </TooltipProvider>

                            </div>
                        </div>
                    </div>
                    <Button type="submit" disabled={ updateForm.onSubmit || !updateForm.nama || !updateForm.npm || !updateForm.username || !isOnChange }>
                        { updateForm.onSubmit
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
