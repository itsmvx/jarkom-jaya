import { Label } from "@/components/ui/label";
import { YearPicker } from "@/components/year-picker";
import { FormEvent, useState } from "react";
import { AdminLayout } from "@/layouts/AdminLayout";
import { Head, router } from "@inertiajs/react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { cn, romanToNumber } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
    ArrowBigLeft,
    BookMarked,
    Check,
    Copy,
    FileSymlink,
    Hash,
    Loader2, Plus,
    X
} from "lucide-react";
import { z } from "zod";
import axios, { AxiosError } from "axios";
import { useToast } from "@/hooks/use-toast";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { IconSwitch } from "@/components/icon-switch";
import { Separator } from "@/components/ui/separator";
import { useIsMobile } from "@/hooks/use-mobile";
import {
    Drawer, DrawerClose,
    DrawerContent,
    DrawerDescription, DrawerFooter,
    DrawerHeader,
    DrawerTitle,
} from "@/components/ui/drawer";
import {
    AlertDialog, AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogHeader,
    AlertDialogTitle
} from "@/components/ui/alert-dialog";

type IDNama = {
    id: string;
    nama: string;
};
type Praktikum = {
    id: string;
    nama: string;
    tahun: string;
    status: 0 | 1;
    jenis: IDNama;
    periode: IDNama;
    pertemuan: {
        id: string;
        nama: string;
        modul: {
            id: string;
            nama: string;
            topik: string;
        }[];
    }[];
};
export default function AdminPraktikumUpdatePage({ praktikum, jenisPraktikums, periodePraktikums }: {
    praktikum: Praktikum;
    jenisPraktikums: IDNama[];
    periodePraktikums: IDNama[];
}) {
    const { toast } = useToast();
    type UpdateForm = {
        nama: string;
        jenis_praktikum_id: string;
        periode_praktikum_id: string;
        status: boolean;
        tahun: number;
        onSubmit: boolean;
    };

    const [ clipboard, setClipboard ] = useState<string>('');
    const handleSetClipboard = (value: string) => {
        setClipboard(value);
        navigator.clipboard.writeText(value);
    };
    const [ updateForm, setUpdateForm ] = useState<UpdateForm>({
        nama: praktikum.nama,
        jenis_praktikum_id: praktikum.jenis.id,
        periode_praktikum_id: praktikum.periode.id,
        status: Boolean(praktikum.status),
        tahun: Number(praktikum.tahun),
        onSubmit: false
    });
    const [ isOnChange, setIsOnChange ] = useState(false);
    const [ selectedYear, setSelectedYear ] = useState<number>(Number(praktikum.tahun));

    const handleUpdateForm = (key: keyof UpdateForm, value: string | boolean | number) => {
        const payload = {
            [key]: value,
        };

        setUpdateForm((prevState) => {
            const newState = { ...prevState, ...payload };
            const latestState = {
                nama: praktikum.nama,
                jenis_praktikum_id: praktikum.jenis.id,
                periode_praktikum_id: praktikum.periode.id,
                status: Boolean(praktikum.status),
                tahun: Number(praktikum.tahun),
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
        const { nama, status, jenis_praktikum_id, periode_praktikum_id } = updateForm;
        const tahun = selectedYear;
        const updateSchema = z.object({
            nama: z.string({ message: 'Format nama tidak valid! '}).min(1, { message: 'Nama Praktikum wajib diisi!' }),
            jenis_praktikum_id: z.string({ message: 'Format Jenis Praktikum tidak valid! '}).min(1, { message: 'Jenis Praktikum wajib dipilih!' }),
            periode_praktikum_id: z.string({ message: 'Format Periode Praktikum tidak valid! '}).min(1, { message: 'Periode Praktikum wajib dipilih!' }),
            tahun: z.number({ message: 'Tahun Praktikum wajib diisi!' }).min(1, { message: 'Tahun Praktikum wajib diisi!' }),
        });
        const updateParse = updateSchema.safeParse({
            nama: nama,
            jenis_praktikum_id: jenis_praktikum_id,
            periode_praktikum_id: periode_praktikum_id,
            tahun: tahun
        });
        if (!updateParse.success) {
            const errMsg = updateParse.error.issues[0]?.message;
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
        }>(route('praktikum.update'), {
            id: praktikum.id,
            nama: nama,
            jenis_praktikum_id: jenis_praktikum_id,
            periode_praktikum_id: periode_praktikum_id,
            status: status,
            tahun: tahun,
        })
            .then((res) => {
                toast({
                    variant: 'default',
                    className: 'bg-green-500 text-white',
                    title: "Berhasil!",
                    description: res.data.message,
                });
                router.reload({ only: ['praktikum'] });
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

    type CreatePertemuan = {
        nama: string;
        onSubmit: boolean;
    };
    const createPertemuanInit: CreatePertemuan = {
        nama: '',
        onSubmit: false,
    };

    const [ openCreatePertemuan, setOpenCreatePertemuan ] = useState(false);
    const [ createPertemuan, setCreatePertemuan ] = useState<CreatePertemuan>(createPertemuanInit);

    const handleCreatePertemuanSubmit = (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        setCreatePertemuan((prevState) => ({ ...prevState, onSubmit: true }));
        const { nama } = createPertemuan;
        const pertemuanSchema = z.object({
            nama: z.string({ message: 'Format nama tidak valid! '}).min(1, { message: 'Nama Pertemuan Praktikum wajib diisi!' }),
        });
        const pertemuanParse = pertemuanSchema.safeParse({
            nama: nama
        });
        if (!pertemuanParse.success) {
            const errMsg = pertemuanParse.error.issues[0]?.message;
            toast({
                variant: "destructive",
                title: "Periksa kembali Input anda!",
                description: errMsg,
            });
            setCreatePertemuan((prevState) => ({ ...prevState, onSubmit: false }));
            return;
        }

        axios.post<{
            message: string;
        }>(route('pertemuan.create'), {
            nama: nama,
            praktikum_id: praktikum.id
        })
            .then((res) => {
                setCreatePertemuan(createPertemuanInit);
                setOpenCreatePertemuan(false);
                toast({
                    variant: 'default',
                    className: 'bg-green-500 text-white',
                    title: "Berhasil!",
                    description: res.data.message,
                });
                router.reload({ only: ['praktikum'] });
            })
            .catch((err: unknown) => {
                const errMsg: string = err instanceof AxiosError && err.response?.data?.message
                    ? err.response.data.message
                    : 'Error tidak diketahui terjadi!';
                setCreatePertemuan((prevState) => ({ ...prevState, onSubmit: false }));
                toast({
                    variant: "destructive",
                    title: "Permintaan gagal diproses!",
                    description: errMsg,
                });
            });
    };

    type CreateModul = {
        nama: string;
        topik: string;
        pertemuan_id: string;
        onSubmit: boolean;
    };
    const createModulInit: CreateModul = {
        nama: '',
        topik: '',
        pertemuan_id: '',
        onSubmit: false,
    };

    const [ openCreateModul, setOpenCreateModul ] = useState(false);
    const [ createModul, setCreateModul ] = useState<CreateModul>(createModulInit);

    const handleOpenCreateModul = (pertemuan_id: string) => {
        setOpenCreateModul(true);
        setCreateModul((prevState) => ({ ...prevState, pertemuan_id: pertemuan_id }));
    };
    const handleCreateModulSubmit = (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        setCreateModul((prevState) => ({ ...prevState, onSubmit: true }));
        const { nama, topik, pertemuan_id } = createModul;
        const modulSchema = z.object({
            nama: z.string({ message: 'Format nama tidak valid! '}).min(1, { message: 'Nama Modul Praktikum wajib diisi!' }),
            topik: z.string({ message: 'Format topik tidak valid! '}).min(1, { message: 'Topik Modul Praktikum wajib diisi!' }),
            pertemuan_id: z.string({ message: 'Format Pertemuan modul tidak valid! '}).min(1, { message: 'Pertemuan Modul Praktikum wajib disertakan!' }),
        });
        const modulParse = modulSchema.safeParse({
            nama: nama,
            topik: topik,
            pertemuan_id: pertemuan_id,
        });
        if (!modulParse.success) {
            const errMsg = modulParse.error.issues[0]?.message;
            toast({
                variant: "destructive",
                title: "Periksa kembali Input anda!",
                description: errMsg,
            });
            setCreateModul((prevState) => ({ ...prevState, onSubmit: false }));
            return;
        }

        axios.post<{
            message: string;
        }>(route('modul.create'), {
            nama: nama,
            topik: topik,
            pertemuan_id: pertemuan_id,
        })
            .then((res) => {
                setCreateModul(createModulInit);
                setOpenCreateModul(false);
                toast({
                    variant: 'default',
                    className: 'bg-green-500 text-white',
                    title: "Berhasil!",
                    description: res.data.message,
                });
                router.reload({ only: ['praktikum'] });
            })
            .catch((err: unknown) => {
                const errMsg: string = err instanceof AxiosError && err.response?.data?.message
                    ? err.response.data.message
                    : 'Error tidak diketahui terjadi!';
                setCreateModul((prevState) => ({ ...prevState, onSubmit: false }));
                toast({
                    variant: "destructive",
                    title: "Permintaan gagal diproses!",
                    description: errMsg,
                });
            });
    };

    return (
        <>
            <AdminLayout>
                <Head title="Admin - Memperbarui Praktikum" />
                <Button variant="ghost" size="icon" onClick={ () => router.visit(route('admin.praktikum.index')) }>
                    <ArrowBigLeft />
                </Button>
                <CardTitle>
                    Memperbarui data Praktikum
                </CardTitle>
                <CardDescription>
                    ...
                </CardDescription>
                <form className={ cn("grid items-start gap-4") } onSubmit={ handleUpdateFormSubmit }>
                    <div className="flex flex-col md:flex-row gap-3 flex-wrap md:items-center">
                        <Label className="flex-1 min-w-72 grid gap-2">
                            Jenis Praktikum
                            <Select value={ updateForm.jenis_praktikum_id } onValueChange={(value) => handleUpdateForm('jenis_praktikum_id', value)} >
                                <SelectTrigger>
                                    <SelectValue placeholder="Pilih Jenis Praktikum"/>
                                </SelectTrigger>
                                <SelectContent>
                                    {
                                        jenisPraktikums.map((jenis, index) => ((
                                            <SelectItem key={ index } value={ jenis.id }>
                                                { jenis.nama }
                                            </SelectItem>
                                        )))
                                    }
                                </SelectContent>
                            </Select>
                        </Label>
                        <Label className="flex-1 min-w-72 grid gap-2">
                            Periode Praktikum
                            <Select value={ updateForm.periode_praktikum_id } onValueChange={(value) => handleUpdateForm('periode_praktikum_id', value)}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Pilih Periode Praktikum"/>
                                </SelectTrigger>
                                <SelectContent>
                                    {
                                        periodePraktikums.sort((a, b) => romanToNumber(a.nama) - romanToNumber(b.nama)).map((jenis, index) => ((
                                            <SelectItem key={ index } value={ jenis.id }>
                                                { jenis.nama }
                                            </SelectItem>
                                        )))
                                    }
                                </SelectContent>
                            </Select>
                        </Label>
                    </div>
                    <div className="grid gap-2">
                        <Label htmlFor="nama">Nama Praktikum</Label>
                        <Input
                            type="text"
                            name="nama"
                            id="nama"
                            value={ updateForm.nama }
                            onChange={(event) => handleUpdateForm('nama', event.target.value)}
                        />
                    </div>
                    <div className=" flex flex-col md:flex-row flex-wrap gap-3 md:gap-2 md:items-center">
                        <Label className="grid gap-2 [&_button]:w-full min-w-72 flex-1 basis-1/2">
                            Tahun Periode Praktikum
                            <YearPicker
                                value={ selectedYear }
                                onValueChange={(year) => {
                                    setSelectedYear(year);
                                    handleUpdateForm('tahun', year);
                                }}
                            />
                        </Label>
                        <div className="min-w-80 flex-1 grid gap-2">
                            <Label htmlFor="status-switch">
                                Status Praktikum
                            </Label>
                            <div className="basis-1/2 flex flex-row gap-1.5 items-center">
                                <IconSwitch
                                    id="status-switch"
                                    checkedIcon={ <Check className="w-4 h-4 text-green-500" /> }
                                    uncheckedIcon={ <X className="w-4 h-4 text-red-600" /> }
                                    checked={ updateForm.status }
                                    onCheckedChange={(checked) => handleUpdateForm('status', checked)}
                                    aria-label="Status Praktikum"
                                    className="max-w-sm data-[state=checked]:bg-green-500"
                                />
                                <p className="basis-3/4 text-sm md:text-base">
                                    Status Praktikum : <strong>{ updateForm.status ? 'Aktif' : 'Nonaktif' }</strong>
                                </p>
                            </div>
                        </div>
                    </div>
                    <Button type="submit" disabled={ updateForm.onSubmit || !updateForm.nama || !updateForm.jenis_praktikum_id || !updateForm.periode_praktikum_id || !isOnChange }>
                        { updateForm.onSubmit
                            ? (
                                <>Memproses <Loader2 className="animate-spin"/></>
                            ) : (
                                <span>Simpan</span>
                            )
                        }
                    </Button>
                </form>
                <Separator className="!my-8" />

                <CardContent className="p-0">
                    <div className="flex items-center justify-between mb-2">
                        <h3 className="text-lg font-semibold mb-4">
                            Pertemuan Praktikum
                        </h3>
                        {praktikum.pertemuan.length > 0 && (
                            <Button size="sm" className="-mt-3" onClick={() => setOpenCreatePertemuan(true)}>
                                <span className="hidden lg:block">Tambahkan</span>
                                <Plus/>
                            </Button>
                        )}
                    </div>
                    <div className="space-y-4">
                        { praktikum.pertemuan.length > 0 ? praktikum.pertemuan.map((pertemuan) => (
                            <Card key={ pertemuan.id } className="rounded-sm shadow-none border-muted-foreground/40">
                                <CardHeader>
                                    <CardTitle className="flex items-center justify-between">
                                        <span>{pertemuan.nama}</span>
                                    </CardTitle>
                                    <CardDescription className="flex items-center gap-0">
                                        <Hash width={15} />
                                        <div className="flex items-center gap-1">
                                            <p className="text-xs line-clamp-1 text-ellipsis">{pertemuan.id}</p>
                                            <Button variant="ghost" size="icon" className="w-7 h-7" onClick={() => handleSetClipboard(pertemuan.id)}>
                                                { clipboard === pertemuan.id
                                                    ? (
                                                        <Check width={15} />
                                                    ) : (
                                                        <Copy width={15} />
                                                    )
                                                }
                                            </Button>
                                        </div>
                                    </CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <div className="flex items-center justify-between mb-2">
                                        <h3 className="font-semibold mb-1">
                                            Modul
                                        </h3>
                                        <Button size="sm" className="-mt-3" onClick={ () => handleOpenCreateModul(pertemuan.id) }>
                                            <span className="hidden lg:block">Tambahkan</span>
                                            <Plus/>
                                        </Button>
                                    </div>
                                    <div className="space-y-2">
                                        { pertemuan.modul.length > 0 ? pertemuan.modul.map((modul) => (
                                            <Card key={ modul.id }
                                                  className="rounded-sm shadow-none border-muted-foreground/40">
                                                <CardContent className="p-2.5 flex justify-between items-center gap-1">
                                                    <div className="flex items-center gap-3">
                                                        <BookMarked width={ 22 }/>
                                                        <div>
                                                            <CardTitle
                                                                className="text-sm font-semibold">{ modul.nama }</CardTitle>
                                                            <CardDescription
                                                                className="text-sm">{ modul.topik }</CardDescription>
                                                        </div>
                                                    </div>
                                                    <Button>
                                                        <span className="hidden lg:block">
                                                            Data Nilai
                                                        </span>
                                                        <FileSymlink/>
                                                    </Button>
                                                </CardContent>
                                            </Card>
                                        )) : (
                                            <Card className="rounded-sm shadow-none border-muted-foreground/40">
                                                <CardContent className="p-2.5 flex justify-between items-center gap-1">
                                                    <p className="text-xs italic text-gray-500/90 font-medium">Belum ada
                                                        data modul untuk pertemuan ini</p>
                                                </CardContent>
                                            </Card>
                                        ) }
                                    </div>
                                </CardContent>
                            </Card>
                        )) : (
                            <Card
                                className="h-32 rounded-sm shadow-none border-muted-foreground/40 flex flex-col items-center justify-center gap-3">
                                <p className="text-sm">Belum ada data pertemuan praktikum</p>
                                <Button size="sm" className="mt-4" onClick={ () => setOpenCreatePertemuan(true) }>
                                    Tambahkan <Plus/>
                                </Button>
                            </Card>
                        ) }
                    </div>
                </CardContent>

                { useIsMobile() ? (
                    <Drawer open={openCreatePertemuan} onOpenChange={setOpenCreatePertemuan} dismissible={false}>
                        <DrawerContent onOpenAutoFocus={(e) => e.preventDefault()}>
                            <DrawerHeader className="text-left">
                                <DrawerTitle>
                                    Tambah Pertemuan Praktikum
                                </DrawerTitle>
                                <DrawerDescription>
                                    Pertemuan praktikum seperti "Pertemuan 1"
                                </DrawerDescription>
                            </DrawerHeader>
                            <div className="p-5">
                                <form className={ cn("grid items-start gap-4") } onSubmit={ handleCreatePertemuanSubmit }>
                                    <div className="grid gap-2">
                                        <Label htmlFor="nama">Nama Pertemuan Praktikum</Label>
                                        <Input
                                            type="text"
                                            name="nama"
                                            id="nama"
                                            value={ createPertemuan.nama }
                                            onChange={ (event) => setCreatePertemuan((prevState) => ({
                                                ...prevState,
                                                nama: event.target.value
                                            })) }
                                        />
                                    </div>
                                    <Button type="submit" disabled={createPertemuan.onSubmit}>
                                        { createPertemuan.onSubmit
                                            ? (
                                                <>Memproses <Loader2 className="animate-spin" /></>
                                            ) : (
                                                <span>Simpan</span>
                                            )
                                        }
                                    </Button>
                                </form>
                            </div>
                            <DrawerFooter className="pt-2">
                                <DrawerClose asChild>
                                    <Button
                                        variant="outline"
                                        onClick={ () => {
                                            setCreatePertemuan(createPertemuanInit);
                                            setOpenCreatePertemuan(false);
                                        } }
                                    >
                                        Batal
                                    </Button>
                                </DrawerClose>
                            </DrawerFooter>
                        </DrawerContent>
                    </Drawer>
                ) : (
                    <AlertDialog open={ openCreatePertemuan } onOpenChange={ setOpenCreatePertemuan }>
                        <AlertDialogContent className="sm:max-w-[425px]" onOpenAutoFocus={ (e) => e.preventDefault() }>
                            <AlertDialogHeader>
                                <AlertDialogTitle>
                                    Tambah Pertemuan Praktikum
                                </AlertDialogTitle>
                                <AlertDialogDescription>
                                    Pertemuan praktikum seperti "Pertemuan 1"
                                </AlertDialogDescription>
                            </AlertDialogHeader>
                            <form className={ cn("grid items-start gap-4") } onSubmit={ handleCreatePertemuanSubmit }>
                                <div className="grid gap-2">
                                    <Label htmlFor="nama">Nama Pertemuan Praktikum</Label>
                                    <Input
                                        type="text"
                                        name="nama"
                                        id="nama"
                                        value={ createPertemuan.nama }
                                        onChange={ (event) => setCreatePertemuan((prevState) => ({
                                            ...prevState,
                                            nama: event.target.value
                                        })) }
                                    />
                                </div>
                                <Button type="submit" disabled={createPertemuan.onSubmit}>
                                    { createPertemuan.onSubmit
                                        ? (
                                            <>Memproses <Loader2 className="animate-spin" /></>
                                        ) : (
                                            <span>Simpan</span>
                                        )
                                    }
                                </Button>
                            </form>
                            <AlertDialogCancel>Batal</AlertDialogCancel>
                        </AlertDialogContent>
                    </AlertDialog>
                ) }
                { useIsMobile() ? (
                    <Drawer open={openCreateModul} onOpenChange={setOpenCreateModul} dismissible={false}>
                        <DrawerContent onOpenAutoFocus={(e) => e.preventDefault()}>
                            <DrawerHeader className="text-left">
                                <DrawerTitle>
                                    Tambah Modul { praktikum.pertemuan.find((pertemuan) => pertemuan.id === createModul.pertemuan_id)?.nama ?? ''}
                                </DrawerTitle>
                                <DrawerDescription>
                                    <span>Modul praktikum seperti <strong>"Modul 1"</strong></span>
                                    <span>Topik Modul seperti <strong>"COMMAND LINE INTERFAFACE"</strong></span>
                                </DrawerDescription>
                            </DrawerHeader>
                            <div className="p-5">
                                <form className={ cn("grid items-start gap-4") } onSubmit={ handleCreateModulSubmit }>
                                    <div className="grid gap-2">
                                        <Label htmlFor="nama">Nama Modul</Label>
                                        <Input
                                            type="text"
                                            name="nama"
                                            id="nama"
                                            value={ createModul.nama }
                                            onChange={ (event) => setCreateModul((prevState) => ({
                                                ...prevState,
                                                nama: event.target.value
                                            })) }
                                        />
                                    </div>
                                    <div className="grid gap-2">
                                        <Label htmlFor="nama">Topik Modul</Label>
                                        <Input
                                            type="text"
                                            name="topik"
                                            id="topik"
                                            value={ createModul.topik }
                                            onChange={ (event) => setCreateModul((prevState) => ({
                                                ...prevState,
                                                topik: event.target.value
                                            })) }
                                        />
                                    </div>
                                    <Button type="submit" disabled={createModul.onSubmit}>
                                        { createModul.onSubmit
                                            ? (
                                                <>Memproses <Loader2 className="animate-spin" /></>
                                            ) : (
                                                <span>Simpan</span>
                                            )
                                        }
                                    </Button>
                                </form>
                            </div>
                            <DrawerFooter className="pt-2">
                                <DrawerClose asChild>
                                    <Button
                                        variant="outline"
                                        onClick={ () => {
                                            setCreateModul(createModulInit);
                                            setOpenCreateModul(false);
                                        } }
                                    >
                                        Batal
                                    </Button>
                                </DrawerClose>
                            </DrawerFooter>
                        </DrawerContent>
                    </Drawer>
                ) : (
                    <AlertDialog open={ openCreateModul } onOpenChange={ setOpenCreateModul }>
                        <AlertDialogContent className="sm:max-w-[425px]" onOpenAutoFocus={ (e) => e.preventDefault() }>
                            <AlertDialogHeader>
                                <AlertDialogTitle>
                                    Tambah Modul { praktikum.pertemuan.find((pertemuan) => pertemuan.id === createModul.pertemuan_id)?.nama ?? ''}
                                </AlertDialogTitle>
                                <AlertDialogDescription className="flex flex-col gap-0">
                                    <span>Modul praktikum seperti <strong>"Modul 1"</strong></span>
                                    <span>Topik Modul seperti <strong>"COMMAND LINE INTERFAFACE"</strong></span>
                                </AlertDialogDescription>
                            </AlertDialogHeader>
                            <form className={ cn("grid items-start gap-4") } onSubmit={ handleCreateModulSubmit }>
                                <div className="grid gap-2">
                                    <Label htmlFor="nama">Nama Modul</Label>
                                    <Input
                                        type="text"
                                        name="nama"
                                        id="nama"
                                        value={ createModul.nama }
                                        onChange={ (event) => setCreateModul((prevState) => ({
                                            ...prevState,
                                            nama: event.target.value
                                        })) }
                                    />
                                </div>
                                <div className="grid gap-2">
                                    <Label htmlFor="nama">Topik Modul</Label>
                                    <Input
                                        type="text"
                                        name="topik"
                                        id="topik"
                                        value={ createModul.topik }
                                        onChange={ (event) => setCreateModul((prevState) => ({
                                            ...prevState,
                                            topik: event.target.value
                                        })) }
                                    />
                                </div>
                                <Button type="submit" disabled={ createModul.onSubmit }>
                                    { createModul.onSubmit
                                        ? (
                                            <>Memproses <Loader2 className="animate-spin"/></>
                                        ) : (
                                            <span>Simpan</span>
                                        )
                                    }
                                </Button>
                            </form>
                            <AlertDialogCancel onClick={() => setCreateModul(createModulInit)}>
                                Batal
                            </AlertDialogCancel>
                        </AlertDialogContent>
                    </AlertDialog>
                ) }
            </AdminLayout>
        </>
    );
}
