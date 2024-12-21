import { Label } from "@/components/ui/label";
import { YearPicker } from "@/components/year-picker";
import { FormEvent, useState } from "react";
import { AdminLayout } from "@/layouts/AdminLayout";
import { Head, router } from "@inertiajs/react";
import { CardDescription, CardTitle } from "@/components/ui/card";
import { cn, romanToNumber } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ArrowBigLeft, Check, Loader2, X } from "lucide-react";
import { z } from "zod";
import axios, { AxiosError } from "axios";
import { useToast } from "@/hooks/use-toast";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { IconSwitch } from "@/components/icon-switch";

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
            </AdminLayout>
        </>
    );
}
