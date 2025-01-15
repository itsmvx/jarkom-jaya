import { AdminLayout } from "@/layouts/AdminLayout";
import { Head, router } from "@inertiajs/react";
import { CardDescription, CardTitle } from "@/components/ui/card";
import { NotificationCard } from "@/components/notification-card";
import { ArrowUpDown, Download, Loader2, Trash2, TriangleAlert } from "lucide-react";
import { FileUploader } from "@/components/file-uploader";
import { Button } from "@/components/ui/button";
import { FormEvent, useEffect, useState } from "react";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import {
    ColumnDef,
    flexRender,
    getCoreRowModel,
    getSortedRowModel,
    SortingState,
    useReactTable
} from "@tanstack/react-table";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import * as XLSX from "xlsx";
import { useToast } from "@/hooks/use-toast";
import {
    AlertDialog,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogHeader,
    AlertDialogTitle
} from "@/components/ui/alert-dialog";
import { cn } from "@/lib/utils";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import axios, { AxiosError } from "axios";
import { z } from "zod";

type Praktikan = {
    id: string;
    npm: string;
    nama: string;
};
type Praktikum = {
    id: string;
    nama: string;
    praktikan: Praktikan[];
};
export default function AdminPraktikumPraktikanIndexPage({ praktikum }: {
    praktikum: Praktikum;
}) {
    const { toast } = useToast();

    type uploadFile = {
        file: File | null;
        onLoad: boolean;
        onInvalid: boolean;
        invalidMsg: string;
    };
    type uploadContents = {
        npm: string;
        nama: string;
    };
    type UploadErrors = {
        [key: number]: string[];
    };
    type DeletePraktikan = {
        id: string;
        nama: string;
        validation: string;
        onSubmit: boolean;
    };
    const uploadFileInit: uploadFile = {
        file: null,
        onLoad: false,
        onInvalid: false,
        invalidMsg: ''
    };
    const deletePraktikanInit: DeletePraktikan = {
        id: '',
        nama: '',
        validation: '',
        onSubmit: false,
    };

    const [uploadFile, setUploadFile] = useState<uploadFile>(uploadFileInit);
    const [uploadErrors, setUploadErrors] = useState<UploadErrors[]>([]);
    const [uploadContents, setUploadContents] = useState<uploadContents[]>([]);
    const [openUploadContents, setOpenUploadContents] = useState<boolean>(false);
    const [onFetchIdPraktikan, setOnFetchIdPraktikan] = useState(false);
    const [onSubmitUploadContents, setOnSubmitUploadContents] = useState<boolean>(false);

    const [ openDeletePraktikan, setOpenDeletePraktikan ] = useState(false);
    const [ deletePraktikan, setDeletePraktikan ] = useState<DeletePraktikan>(deletePraktikanInit);


    const handleSetUploadFile = (file: File) => {
        setUploadFile({
            file,
            onLoad: true,
            onInvalid: false,
            invalidMsg: "",
        });
    };
    const handleCancelUploadFile = () => {
        setUploadFile(uploadFileInit);
        setUploadErrors([]);
        setUploadContents([]);
        setOnFetchIdPraktikan(false);
        setOnSubmitUploadContents(false);
    };
    const handleSubmitUploadContents = (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        setOnFetchIdPraktikan(true);

        axios.get<{
            message: string;
            data: {
                id: string;
                nama: string;
                npm: string;
            }[];
        }>(route('api.praktikans', {
            npm: uploadContents.map((content) => content.npm)
        }))
            .then((res) => {
                const praktikansData = res.data.data as {
                    id: string;
                    nama: string;
                    npm: string;
                }[];
                if (!Array.isArray(praktikansData)) {
                    handleCancelUploadFile();
                    setOpenUploadContents(false);
                    toast({
                        variant: "destructive",
                        title: "Permintaan gagal diproses!",
                        description: 'Data yang didapatkan dari server tidak valid! coba lagi nanti',
                    });
                    return;
                } else if (praktikansData.length < 1) {
                    handleCancelUploadFile();
                    setOpenUploadContents(false);
                    toast({
                        variant: "destructive",
                        title: "Permintaan gagal diproses!",
                        description: 'Tidak ada Praktikan yang terdaftar di sistem dari data yang diberikan',
                    });
                    return;
                }
                setOnFetchIdPraktikan(false);
                setOnSubmitUploadContents(true);

                axios.post(route('praktikum-praktikan.create'), {
                    praktikum_id: praktikum.id,
                    praktikan_ids: uploadContents.map((content) => praktikansData.find((praktikan) => praktikan.npm === content.npm)?.id).filter((filt) => Boolean(filt))
                })
                    .then((res) => {
                        handleCancelUploadFile();
                        setOpenUploadContents(false);
                        toast({
                            variant: "default",
                            className: "bg-green-500 text-white",
                            title: "Berhasil!",
                            description: res.data.message,
                        });
                        router.reload({ only: ['praktikum' ]});
                    })
                    .catch((err: unknown) => {
                        handleCancelUploadFile();
                        setOpenUploadContents(false);
                        const errMsg: string = err instanceof AxiosError && err.response?.data?.message
                            ? err.response.data.message
                            : "Error tidak diketahui terjadi!";
                        toast({
                            variant: "destructive",
                            title: "Permintaan gagal diproses!",
                            description: errMsg,
                        });
                    });
            })
            .catch((err) => {
                setOnFetchIdPraktikan(false);
                setOnSubmitUploadContents(false);
                const errMsg: string = err instanceof AxiosError && err.response?.data?.message
                    ? err.response.data.message
                    : 'Error tidak diketahui terjadi!';
                toast({
                    variant: "destructive",
                    title: "Permintaan gagal diproses!",
                    description: errMsg,
                });
            })
    };

    const handleOpenDeletePraktikan = (praktikan: {
        id: string;
        nama: string;
    }) => {
        setDeletePraktikan((prevState) => ({
            ...prevState,
            id: praktikan.id,
            nama: praktikan.nama,
        }));
        setOpenDeletePraktikan(true);
    };
    const handleDeletePraktikanSubmit = (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        setDeletePraktikan((prevState) => ({ ...prevState, onSubmit: true }));
        const { id } = deletePraktikan;
        const deleteSchema = z.object({
            praktikan_id: z.string({ message: 'Format Praktikan tidak valid! '}).min(1, { message: 'Format Praktikan tidak valid!' }),
            praktikum_id: z.string({ message: 'Format Praktikum tidak valid! '}).min(1, { message: 'Format Praktikum tidak valid!' }),
        });
        const deleteParse = deleteSchema.safeParse({
            praktikan_id: id,
            praktikum_id: praktikum.id
        });
        if (!deleteParse.success) {
            const errMsg = deleteParse.error.issues[0]?.message;
            toast({
                variant: "destructive",
                title: "Periksa kembali Input anda!",
                description: errMsg,
            });
            setDeletePraktikan((prevState) => ({ ...prevState, onSubmit: false }));
            return;
        }

        axios.post<{
            message: string;
        }>(route('praktikum-praktikan.delete'), {
            praktikan_id: id,
            praktikum_id: praktikum.id
        })
            .then((res) => {
                setDeletePraktikan(deletePraktikanInit);
                setOpenDeletePraktikan(false);
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
                setDeletePraktikan((prevState) => ({ ...prevState, onSubmit: false }));
                toast({
                    variant: "destructive",
                    title: "Permintaan gagal diproses!",
                    description: errMsg,
                });
            });
    };

    const columns: ColumnDef<Praktikan>[] = [
        {
            accessorKey: "npm",
            header: ({ column }) => (
                <Button
                    variant="ghost"
                    onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                    className="w-full justify-start"
                >
                    NPM
                    <ArrowUpDown />
                </Button>
            ),
            cell: ({ row }) => (
                <div className="w-32 pl-4 text-left truncate">{row.getValue("npm")}</div>
            ),
        },
        {
            accessorKey: "nama",
            header: ({ column }) => (
                <Button
                    variant="ghost"
                    onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                    className="w-full justify-start"
                >
                    Nama
                    <ArrowUpDown />
                </Button>
            ),
            cell: ({ row }) => (
                <div className="w-full px-2 text-left truncate overflow-hidden whitespace-nowrap capitalize">
                    {row.getValue("nama")}
                </div>
            ),
        },
        {
            id: "actions",
            enableHiding: false,
            cell: ({ row }) => ((
                <Button size="icon" variant="ghost" className="group hover:bg-red-500/85" onClick={() => handleOpenDeletePraktikan({ id: row.original.id, nama: row.original.nama })}>
                    <Trash2 className="text-red-600 group-hover:text-white transition-colors" />
                </Button>
            ))
        },
    ];

    const [ sorting, setSorting ] = useState<SortingState>([]);
    const [ rowSelection, setRowSelection ] = useState({});

    const table = useReactTable({
        data: praktikum.praktikan,
        columns,
        onSortingChange: setSorting,
        getCoreRowModel: getCoreRowModel(),
        getSortedRowModel: getSortedRowModel(),
        onRowSelectionChange: setRowSelection,
        state: {
            sorting,
            rowSelection,
        },
    });

    useEffect(() => {
        const handleFile = async () => {
            if (uploadFile.file && uploadFile.onLoad) {
                try {
                    const arrayBuffer = await uploadFile.file.arrayBuffer();
                    const workbook = XLSX.read(arrayBuffer);
                    const worksheet = workbook.Sheets[workbook.SheetNames[0]];
                    const raw_data: any[][] = XLSX.utils.sheet_to_json(worksheet, { header: 1 });

                    if (raw_data.length > 0) {
                        const ACCEPT_HEADERS: string[] = [
                            "npm",
                            "nama",
                        ];

                        let invalidHeaders: string[] = [];
                        const receivedHeaders: string[] = raw_data[0].map((header) =>
                            (header as string)?.toLowerCase().trim()
                        );

                        const isValidHeaders = ACCEPT_HEADERS.every((expectedHeader, index) => {
                            const receivedHeader = receivedHeaders[index];
                            if (receivedHeader !== expectedHeader) {
                                invalidHeaders.push(
                                    `Kolom ${receivedHeader ? `"${receivedHeader}"` : `ke-${index+1}`} tidak valid. Ekspetasi kolom "${expectedHeader}".`
                                );
                                return false;
                            }
                            return true;
                        });

                        if (!isValidHeaders) {
                            toast({
                                variant: "destructive",
                                title: "Header file tidak valid",
                                description: invalidHeaders.join(" "),
                            });
                            return;
                        }

                        const errors: UploadErrors[] = [];
                        const sanitizedData = raw_data.slice(1).filter((row: any[], rowIndex: number) => {
                            const rowErrors: string[] = [];

                            const npm = row[0] as string | undefined;
                            if (!npm) {
                                rowErrors.push(`NPM tidak diisi.`);
                            }

                            const nama = row[1] as string | undefined;
                            if (!nama) {
                                rowErrors.push(
                                    `Nama tidak diisi'}`
                                );
                            }

                            if (rowErrors.length > 0) {
                                errors.push({
                                    [rowIndex + 1]: rowErrors,
                                });
                            }

                            return rowErrors.length === 0;
                        });

                        setUploadErrors(errors);

                        if (sanitizedData.length === 0) {
                            toast({
                                variant: "destructive",
                                title: "Gagal memproses file",
                                description: "File tidak memiliki data yang valid atau mungkin kosong.",
                            });
                            return;
                        }

                        setUploadContents(
                            sanitizedData.map((data: string[]) => ({
                                npm: data[0],
                                nama: data[1],
                            }))
                        );
                    } else {
                        toast({
                            variant: "destructive",
                            title: "Gagal membaca file",
                            description: "File kosong atau tidak memiliki data.",
                        });
                    }
                } catch (error: unknown) {
                    const errMsg =
                        error instanceof Error ? error.message : "Gagal membaca dokumen.";
                    toast({
                        variant: "destructive",
                        title: "Kesalahan saat membaca file",
                        description: errMsg,
                    });
                } finally {
                    setTimeout(() => {
                        setUploadFile((prevState) => ({
                            ...prevState,
                            onLoad: false,
                        }));
                    }, 750);
                }
            }
        };

        handleFile();
    }, [uploadFile]);

    useEffect(() => {
        if (uploadContents.length > 0 && !openUploadContents) {
            setOpenUploadContents(true);
        }
    }, [ uploadContents ]);

    return (
        <>
            <AdminLayout>
                <Head title="Admin - Praktikum|Data Praktikan"/>
                <CardTitle>Data Praktikan</CardTitle>
                <CardDescription>Menampilkan data Praktikan terdaftar pada Praktikum {praktikum.nama}</CardDescription>
                { uploadErrors.length > 0 && (
                    <NotificationCard className="max-w-full rounded-sm shadow-none bg-red-200 text-sm">
                        <div className="flex gap-1 items-center mb-2">
                            <TriangleAlert width={ 18 } color="red"/>
                            <p className="text-base font-medium">Data yang tidak dibaca karena tidak valid</p>
                        </div>
                        <ul className="list-disc ml-6">
                            { uploadErrors.map((errorObj, idx) => {
                                const baris = Object.keys(errorObj)[0];
                                const messages = errorObj[baris as unknown as number];
                                return (
                                    <li key={ idx }>
                                        Data ke-{ baris } : { messages.join(", ") }
                                    </li>
                                );
                            }) }
                        </ul>
                    </NotificationCard>
                ) }

                <Accordion type="single" collapsible className="w-full" defaultValue="item-1">
                    <AccordionItem value="item-1">
                        <AccordionTrigger>Upload Data Praktikan</AccordionTrigger>
                        <AccordionContent>
                            { uploadFile.onLoad ? (
                                <div className="flex items-center justify-center h-60">
                                    <div className="text-center">
                                        <Loader2 className="animate-spin h-10 w-10 text-blue-500 mx-auto"/>
                                        <p className="mt-2 text-gray-600">Memproses file, mohon tunggu...</p>
                                    </div>
                                </div>
                            ) : (
                                <>
                                    <FileUploader
                                        className="mt-4"
                                        onFileUpload={ (file) => handleSetUploadFile(file) }
                                    />
                                    <div
                                        className="w-full mx-auto flex gap-1 items-center justify-center text-center text-sm font-medium">
                                        Tidak memiliki file?
                                        <a href={ route('assets', 'template-upload-praktikum-praktikan.xlsx') } className="hover:text-blue-600 flex items-center gap-0.5" target="_blank">
                                            Unduh template<Download width={ 18 }/>
                                        </a>
                                    </div>
                                </>
                            ) }
                        </AccordionContent>
                    </AccordionItem>
                </Accordion>

                <h3 className="text-base font-medium !mt-5">
                    Data Praktikan Terdaftar
                </h3>
                <div className="!mt-2 mx-auto sm:mx-0 rounded-md border overflow-x-auto w-[82vw] sm:w-full">
                    <Table className="table-auto">
                        <TableHeader>
                            { table.getHeaderGroups().map((headerGroup) => (
                                <TableRow key={ headerGroup.id } className="!last:w-10">
                                    { headerGroup.headers.map((header) => {
                                        return (
                                            <TableHead key={ header.id } className="w-10">
                                                { header.isPlaceholder
                                                    ? null
                                                    : flexRender(
                                                        header.column.columnDef.header,
                                                        header.getContext()
                                                    ) }
                                            </TableHead>
                                        )
                                    }) }
                                </TableRow>
                            )) }
                        </TableHeader>
                        <TableBody>
                            { table.getRowModel().rows?.length ? (
                                table.getRowModel().rows.map((row) => (
                                    <TableRow
                                        key={ row.id }
                                        data-state={ row.getIsSelected() && "selected" }
                                    >
                                        { row.getVisibleCells().map((cell) => (
                                            <TableCell key={ cell.id }>
                                                { flexRender(
                                                    cell.column.columnDef.cell,
                                                    cell.getContext()
                                                ) }
                                            </TableCell>
                                        )) }
                                    </TableRow>
                                ))
                            ) : (
                                <TableRow>
                                    <TableCell
                                        colSpan={ columns.length }
                                        className="h-24 text-center"
                                    >
                                        Tidak ada data untuk ditampilkan
                                    </TableCell>
                                </TableRow>
                            ) }
                        </TableBody>
                    </Table>
                </div>
            </AdminLayout>

            <AlertDialog open={ openUploadContents } onOpenChange={ setOpenUploadContents }>
                <AlertDialogContent className="max-w-md sm:max-w-lg md:max-w-xl lg:max-w-3xl xl:max-w-4xl 2xl:max-w-5xl" onOpenAutoFocus={ (e) => e.preventDefault() }>
                    <AlertDialogHeader>
                        <AlertDialogTitle>
                            Konfirmasi Data Praktikan
                        </AlertDialogTitle>
                        <AlertDialogDescription>
                            Berhasil membaca { uploadContents.length } data Praktikan yang diupload
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <form className={ cn("grid items-start gap-4 h-96 xl:h-[65vh]") } onSubmit={ handleSubmitUploadContents }>
                        <div className="h-80 xl:h-full overflow-y-auto space-y-1 pr-2.5">
                            { uploadContents.map((content, index) => ((
                                <div key={ index } className="!mb-3.5 p-3 rounded border-[1.5px] border-muted-foreground/30">
                                    <h5 className="font-medium text-lg">#{index+1}</h5>
                                    <div className="space-y-1">
                                        <div className="grid gap-2">
                                            <Label htmlFor={ `npm-${ index }` }>NPM</Label>
                                            <Input
                                                type="text"
                                                name={ `npm-${ index }` }
                                                id={ `npm-${ index }` }
                                                value={ content.npm }
                                                onChange={ (event) => {
                                                    const updated = [ ...uploadContents ];
                                                    updated[index].npm = event.target.value;
                                                    setUploadContents(updated);
                                                } }
                                            />
                                        </div>
                                        <div className="grid gap-2">
                                            <Label htmlFor={ `nama-${ index }` }>Nama</Label>
                                            <Input
                                                type="text"
                                                name={ `nama-${ index }` }
                                                id={ `nama-${ index }` }
                                                value={ content.nama }
                                                onChange={ (event) => {
                                                    const updated = [ ...uploadContents ];
                                                    updated[index].nama = event.target.value;
                                                    setUploadContents(updated);
                                                } }
                                            />
                                        </div>
                                    </div>
                                </div>
                            ))) }
                        </div>
                        <Button
                            type="submit"
                            disabled={ onFetchIdPraktikan || onSubmitUploadContents || uploadContents.length < 1 || uploadFile.onLoad }
                        >
                            { onFetchIdPraktikan || onSubmitUploadContents ? (
                                <div className="flex items-center space-x-2">
                                    <Loader2 className="animate-spin h-4 w-4"/>
                                    <span>{ onFetchIdPraktikan ? 'Mengambil data Praktikan...' : 'Mengirim data Praktikan...'}</span>
                                </div>
                            ) : (
                                "Simpan euy"
                            ) }
                        </Button>
                    </form>
                    <AlertDialogCancel onClick={ handleCancelUploadFile }>Batal</AlertDialogCancel>
                </AlertDialogContent>
            </AlertDialog>

            <AlertDialog open={ openDeletePraktikan } onOpenChange={ setOpenDeletePraktikan }>
                <AlertDialogContent className="max-w-[90%] sm:max-w-[425px] rounded" onOpenAutoFocus={ (e) => e.preventDefault() }>
                    <AlertDialogHeader>
                        <AlertDialogTitle>
                            Hapus Praktikan dari Praktikum?
                        </AlertDialogTitle>
                        <AlertDialogDescription className="flex flex-col gap-0.5">
                            <span className="text-red-600 font-bold">
                                Anda akan menghapus Praktikan dari Praktikum { praktikum.nama }
                            </span>
                            <span className="*:text-red-600">
                                Semua data Nilai Praktikan <strong>{ deletePraktikan.nama }</strong> yang terkait dengan <strong>{ praktikum.nama }</strong> akan juga dihapus
                            </span>
                            <br/>
                            <span className="text-red-600">
                                Data yang terhapus tidak akan bisa dikembalikan! harap gunakan dengan hati-hati
                            </span>
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <form className={ cn("grid items-start gap-4") } onSubmit={ handleDeletePraktikanSubmit }>
                        <div className="grid gap-2">
                            <Label htmlFor="validation">Validasi aksi anda</Label>
                            <Input
                                type="text"
                                name="validation"
                                id="validation"
                                value={ deletePraktikan.validation }
                                placeholder="JARKOM JAYA"
                                onChange={ (event) =>
                                    setDeletePraktikan((prevState) => ({
                                        ...prevState,
                                        validation: event.target.value,
                                    }))
                                }
                                autoComplete="off"
                            />
                            <p>Ketik <strong>JARKOM JAYA</strong> untuk melanjutkan</p>
                        </div>
                        <Button type="submit" disabled={ deletePraktikan.onSubmit || deletePraktikan.validation !== 'JARKOM JAYA'}>
                            { deletePraktikan.onSubmit
                                ? (
                                    <>Memproses <Loader2 className="animate-spin" /></>
                                ) : (
                                    <span>Simpan</span>
                                )
                            }
                        </Button>
                        <Button
                            type="button"
                            variant="ghost"
                            className="hover:bg-red-300/70"
                            onClick={() => {
                                setDeletePraktikan(deletePraktikanInit);
                                setOpenDeletePraktikan(false);
                            }}
                        >
                            Batal
                        </Button>
                    </form>
                </AlertDialogContent>
            </AlertDialog>
        </>
    );
}


