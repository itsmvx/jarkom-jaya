import { Label } from "@/components/ui/label";
import { FormEvent, useState } from "react";
import { AdminLayout } from "@/layouts/AdminLayout";
import { Head, router } from "@inertiajs/react";
import { CardDescription, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ArrowBigLeft, Check, Loader2, Shuffle, X } from "lucide-react";
import { z } from "zod";
import axios, { AxiosError } from "axios";
import { useToast } from "@/hooks/use-toast";
import { PageProps } from "@/types";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { IconSwitch } from "@/components/icon-switch";

type Kuis = {
    id: string;
    nama: string;
    npm: string;
    no_hp: string | null;
    username: string;
    aktif: boolean;
    jabatan: string;
};

export default function AdminKuisUpdatePage({ aslab  }: PageProps<{
    aslab: Kuis;
}>) {
    const { toast } = useToast();
    type UpdateForm = {
        nama: string;
        npm: string;
        no_hp: string;
        username: string;
        aktif: boolean;
        jabatan: string;
        onSubmit: boolean;
    };

    const [ updateForm, setUpdateForm ] = useState<UpdateForm>({
        nama: aslab.nama,
        npm: aslab.npm,
        no_hp: aslab.no_hp ?? '',
        username: aslab.username,
        aktif: aslab.aktif,
        jabatan: aslab.jabatan ?? '',
        onSubmit: false
    });
    const [ isOnChange, setIsOnChange ] = useState(false);

    const handleUpdateForm = (key: keyof UpdateForm, value: string | boolean | number) => {
        setUpdateForm((prevState) => {
            const newState = { ...prevState, [key]: value };
            setIsOnChange(
                newState.nama !== aslab.nama ||
                newState.npm !== aslab.npm ||
                newState.no_hp !== (aslab.no_hp ?? '') ||
                newState.username !== aslab.username ||
                newState.aktif !== aslab.aktif ||
                newState.jabatan !== aslab.jabatan
            );
            return newState;
        });
    };

    const handleUpdateFormSubmit = (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        setUpdateForm((prevState) => ({ ...prevState, onSubmit: true }));
        const { nama, npm, no_hp, username, jabatan, aktif } = updateForm;
        const createSchema = z.object({
            nama: z.string({ message: 'Format nama Kuis tidak valid! '}).min(1, { message: 'Nama Kuis wajib diisi!' }),
            npm: z.string({ message: 'Format NPM Kuis tidak valid! '}).min(1, { message: 'NPM Kuis wajib diisi!' }),
            username: z.string({ message: 'Format Username Kuis tidak valid! '}).min(1, { message: 'Username Kuis wajib diisi!' }),
            no_hp: z.string().regex(/^\d{10,15}$/, { message: "Nomor HP harus berupa angka 08xxx 10-15 digit." }).nullable(),
            jabatan: z.string({ message: 'Format Jabatan Kuis tidak valid! '}).min(1, { message: 'Jabatan Kuis wajib diisi!' }),
        });
        const createParse = createSchema.safeParse({
            nama: nama,
            npm: npm,
            no_hp: no_hp ?? null,
            username: username,
            jabatan: jabatan
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
        }>(route('aslab.update'), {
            id: aslab.id,
            nama: nama,
            npm: npm,
            username: username,
            no_hp: no_hp ?? null,
            jabatan: jabatan,
            aktif: aktif
        })
            .then((res) => {
                toast({
                    variant: 'default',
                    className: 'bg-green-500 text-white',
                    title: "Berhasil!",
                    description: res.data.message,
                });
                router.reload({ only: ['aslab'] });
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
        const firstName = updateForm.nama.trim().split(' ')[0].toLowerCase();
        const nim = updateForm.npm.split('.').pop()?.trim();
        if (firstName && nim) {
            setUpdateForm((prevState) => ({
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
                <Head title="Admin - Memperbarui Kuis" />
                <Button variant="ghost" size="icon" onClick={ () => router.visit(route('admin.aslab.index')) }>
                    <ArrowBigLeft />
                </Button>
                <CardTitle>
                    Memperbarui data Kuis
                </CardTitle>
                <CardDescription>
                    ...
                </CardDescription>
                <form className={ cn("grid items-start gap-4") } onSubmit={ handleUpdateFormSubmit }>
                    <div className="flex flex-col md:flex-row md:flex-wrap gap-3 md:items-center *:grow">
                        <div className="grid gap-2 min-w-80">
                            <Label htmlFor="nama">Nama Kuis</Label>
                            <Input
                                type="text"
                                name="nama"
                                id="nama"
                                value={ updateForm.nama }
                                onChange={ (event) => handleUpdateForm('nama', event.target.value) }
                            />
                        </div>
                        <div className="grid gap-2 min-w-80">
                            <Label htmlFor="npm">NPM Kuis</Label>
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
                            <Label htmlFor="username">Username Kuis</Label>
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
                        <div className="grid gap-2 min-w-80">
                            <Label htmlFor="npm">No.HP atau Wangsaff Kuis (tidak wajib)</Label>
                            <Input
                                type="text"
                                name="no_hp"
                                id="no_hp"
                                placeholder="08xxxxxxxxxx"
                                value={ updateForm.no_hp }
                                onChange={ (event) => handleUpdateForm('no_hp', event.target.value.replace(/[^0-9]/g, "")) }
                            />
                        </div>
                    </div>
                    <div className="flex flex-col md:flex-row md:flex-wrap gap-3 md:items-center *:grow">
                        <div className="grid gap-2 min-w-80">
                            <Label htmlFor="jabatan">Jabatan</Label>
                            <Input
                                type="text"
                                name="jabatan"
                                id="jabatan"
                                placeholder="08xxxxxxxxxx"
                                value={ updateForm.jabatan }
                                onChange={ (event) => handleUpdateForm('jabatan', event.target.value)}
                            />
                        </div>
                        <div className="min-w-80 flex-1 grid gap-2">
                            <Label htmlFor="status-switch">
                                Status Kuis
                            </Label>
                            <div className="basis-1/2 flex flex-row gap-1.5 items-center">
                                <IconSwitch
                                    id="status-switch"
                                    checkedIcon={ <Check className="w-4 h-4 text-green-500" /> }
                                    uncheckedIcon={ <X className="w-4 h-4 text-red-600" /> }
                                    checked={ updateForm.aktif }
                                    onCheckedChange={(checked) => handleUpdateForm('aktif', checked)}
                                    aria-label="Status Kuis"
                                    className="max-w-sm data-[state=checked]:bg-green-500"
                                />
                                <p className="basis-3/4 text-sm md:text-base">
                                    Kuis <strong>{ updateForm.aktif ? 'Aktif' : 'Nonaktif' }</strong>
                                </p>
                            </div>
                        </div>
                    </div>
                    <Button type="submit"
                            disabled={ updateForm.onSubmit || !updateForm.nama || !updateForm.npm || !updateForm.username || !isOnChange || !updateForm.jabatan }>
                        { updateForm.onSubmit ? (
                            <>
                                Memproses <Loader2 className="animate-spin"/>
                            </>
                        ) : (
                            "Simpan"
                        ) }
                    </Button>

                </form>
            </AdminLayout>
        </>
    );
}
