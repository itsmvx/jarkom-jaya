import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import { AdminLayout } from "@/layouts/AdminLayout";
import { Button } from "@/components/ui/button"
import { CardDescription, CardTitle } from "@/components/ui/card";
import {
    ColumnDef,
    SortingState,
    getCoreRowModel,
    getSortedRowModel,
    useReactTable, flexRender,
} from "@tanstack/react-table"
import { ArrowUpDown, MoreHorizontal, Plus, Loader2, Pencil, Trash2 } from "lucide-react"
import { FormEvent, useState } from "react";
import { ViewPerPage } from "@/components/view-per-page";
import { TableSearchForm } from "@/components/table-search-form";
import { cn } from "@/lib/utils";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Head, router } from "@inertiajs/react";
import { z } from "zod";
import axios, { AxiosError } from "axios";
import { useToast } from "@/hooks/use-toast";
import { PaginationData } from "@/types";
import {
    AlertDialog,
    AlertDialogCancel,
    AlertDialogContent, AlertDialogDescription,
    AlertDialogHeader,
    AlertDialogTitle, AlertDialogTrigger
} from "@/components/ui/alert-dialog";

type JenisPraktikum = {
    id: string;
    nama: string;
};

export default function AdminJenisPraktikumIndexPage({ pagination }: {
    pagination: PaginationData<JenisPraktikum[]>;
}) {
    const { toast } = useToast();
    type CreateForm = {
        nama: string;
        onSubmit: boolean;
    };
    type UpdateForm = {
        id: string;
        nama: string;
        onSubmit: boolean;
    };
    type DeleteForm = {
        id: string;
        nama: string;
        validation: string;
        onSubmit: boolean;
    };
    const createFormInit: CreateForm = {
        nama: '',
        onSubmit: false
    };
    const updateFormInit: UpdateForm = {
        id: '',
        nama: '',
        onSubmit: false
    };
    const deleteFormInit: DeleteForm = {
        id: '',
        nama: '',
        validation: '',
        onSubmit: false
    };
    const [ openCreateForm, setOpenCreateForm ] = useState(false);
    const [ openUpdateForm, setOpenUpdateForm ] = useState(false);
    const [ openDeleteForm, setOpenDeleteForm ] = useState(false);

    const [ createForm, setCreateForm ] = useState<CreateForm>(createFormInit);
    const [ updateForm, setUpdateForm ] = useState<UpdateForm>(updateFormInit);
    const [ deleteForm, setDeleteForm ] = useState<DeleteForm>(deleteFormInit);

    const columns: ColumnDef<JenisPraktikum>[] = [
        {
            accessorKey: "nama",
            header: ({ column }) => {
                return (
                    <Button
                        variant="ghost"
                        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                        className="w-full justify-start"
                    >
                        Nama Jenis Praktikum
                        <ArrowUpDown />
                    </Button>
                );
            },
            cell: ({ row }) => (
                <div className="capitalize min-w-52 px-2">
                    {row.getValue("nama")}
                </div>
            ),
        },
        {
            id: "actions",
            enableHiding: false,
            cell: ({ row }) => {
                const originalRow = row.original;
                return (
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className="h-8 w-8 p-0">
                                <span className="sr-only">Open menu</span>
                                <MoreHorizontal />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                            <DropdownMenuLabel>Aksi</DropdownMenuLabel>
                            <DropdownMenuItem onClick={ () => {
                                setOpenUpdateForm(true);
                                setUpdateForm((prevState) => ({
                                    ...prevState,
                                    id: originalRow.id,
                                    nama: originalRow.nama
                                }));
                            } }>
                                <Pencil /> Ubah data
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={ () => {
                                setOpenDeleteForm(true);
                                setDeleteForm((prevState) => ({
                                    ...prevState,
                                    id: originalRow.id,
                                    nama: originalRow.nama
                                }));
                            } }>
                                <Trash2 /> Hapus data
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                        </DropdownMenuContent>
                    </DropdownMenu>
                );
            },
        },
    ];
    const [ sorting, setSorting ] = useState<SortingState>([]);
    const [ rowSelection, setRowSelection ] = useState({});
    const table = useReactTable({
        data: pagination.data,
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
    const handleCreateFormSubmit = (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        setCreateForm((prevState) => ({ ...prevState, onSubmit: true }));
        const { nama } = createForm;
        const namaSchema = z.object({
            nama: z.string({ message: 'Format nama tidak valid! '}).min(1, { message: 'Nama Jenis Praktikum wajib diisi!' }),
        });
        const namaParse = namaSchema.safeParse({
            nama: nama
        });
        if (!namaParse.success) {
            const errMsg = namaParse.error.issues[0]?.message;
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
        }>(route('jenis-praktikum.create'), {
            nama: nama
        })
            .then((res) => {
                setCreateForm(createFormInit);
                setOpenCreateForm(false);
                toast({
                    variant: 'default',
                    className: 'bg-green-500 text-white',
                    title: "Berhasil!",
                    description: res.data.message,
                });
                router.reload({ only: ['pagination'] });
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
    const handleUpdateFormSubmit = (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        setUpdateForm((prevState) => ({ ...prevState, onSubmit: true }));
        const { id, nama } = updateForm;
        const updateSchema = z.object({
            id: z.string({ message: 'Format Jenis Praktikum tidak valid! '}).min(1, { message: 'Format Jenis Praktikum tidak valid!' }),
            nama: z.string({ message: 'Format nama tidak valid! '}).min(1, { message: 'Nama Jenis Praktikum wajib diisi!' }),
        });
        const updateParse = updateSchema.safeParse({
            id: id,
            nama: nama
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
        }>(route('jenis-praktikum.update'), {
            id: id,
            nama: nama
        })
            .then((res) => {
                setUpdateForm(updateFormInit);
                setOpenUpdateForm(false);
                toast({
                    variant: 'default',
                    className: 'bg-green-500 text-white',
                    title: "Berhasil!",
                    description: res.data.message,
                });
                router.reload({ only: ['pagination'] });
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
    const handleDeleteFormSubmit = (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        setDeleteForm((prevState) => ({ ...prevState, onSubmit: true }));
        const { id } = deleteForm;
        const deleteSchema = z.object({
            id: z.string({ message: 'Format Jenis Praktikum tidak valid! '}).min(1, { message: 'Format Jenis Praktikum tidak valid!' }),
        });
        const deleteParse = deleteSchema.safeParse({
            id: id,
        });
        if (!deleteParse.success) {
            const errMsg = deleteParse.error.issues[0]?.message;
            toast({
                variant: "destructive",
                title: "Periksa kembali Input anda!",
                description: errMsg,
            });
            setDeleteForm((prevState) => ({ ...prevState, onSubmit: false }));
            return;
        }

        axios.post<{
            message: string;
        }>(route('jenis-praktikum.delete'), {
            id: id,
        })
            .then((res) => {
                setDeleteForm(deleteFormInit);
                setOpenDeleteForm(false);
                toast({
                    variant: 'default',
                    className: 'bg-green-500 text-white',
                    title: "Berhasil!",
                    description: res.data.message,
                });
                router.reload({ only: ['pagination'] });
            })
            .catch((err: unknown) => {
                const errMsg: string = err instanceof AxiosError && err.response?.data?.message
                    ? err.response.data.message
                    : 'Error tidak diketahui terjadi!';
                setDeleteForm((prevState) => ({ ...prevState, onSubmit: false }));
                toast({
                    variant: "destructive",
                    title: "Permintaan gagal diproses!",
                    description: errMsg,
                });
            });
    };

    return (
        <AdminLayout>
            <Head title="Admin - Manajemen Jenis Praktikum" />
            <CardTitle>
                Manajemen Jenis Praktikum
            </CardTitle>
            <CardDescription>
                Data Jenis Praktikum yang terdaftar
            </CardDescription>
            <div className="flex flex-col lg:flex-row gap-2 items-start justify-between">
                <AlertDialog open={ openCreateForm } onOpenChange={ setOpenCreateForm }>
                    <AlertDialogTrigger asChild>
                        <Button className="mt-4">
                            Buat <Plus />
                        </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent className="my-alert-dialog-content" onOpenAutoFocus={ (e) => e.preventDefault() }>
                        <AlertDialogHeader>
                            <AlertDialogTitle>
                                Tambah Jenis Praktikum
                            </AlertDialogTitle>
                            <AlertDialogDescription>
                                Jenis praktikum seperti "Sistem Operasi" sesuai nama mata kuliah
                            </AlertDialogDescription>
                        </AlertDialogHeader>
                        <form className={ cn("grid items-start gap-4") } onSubmit={ handleCreateFormSubmit }>
                            <div className="grid gap-2">
                                <Label htmlFor="nama">Nama Jenis Praktikum</Label>
                                <Input
                                    type="text"
                                    name="nama"
                                    id="nama"
                                    value={ createForm.nama }
                                    onChange={ (event) => setCreateForm((prevState) => ({
                                        ...prevState,
                                        nama: event.target.value
                                    })) }
                                />
                            </div>
                            <Button type="submit" disabled={createForm.onSubmit}>
                                { createForm.onSubmit
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
                <TableSearchForm table={ table }/>
            </div>
            <div className="rounded-md border">
                <Table>
                    <TableHeader>
                        { table.getHeaderGroups().map((headerGroup) => (
                            <TableRow key={ headerGroup.id }>
                                { headerGroup.headers.map((header) => {
                                    return (
                                        <TableHead key={ header.id }>
                                            { header.isPlaceholder
                                                ? null
                                                : flexRender(
                                                    header.column.columnDef.header,
                                                    header.getContext()
                                                )}
                                        </TableHead>
                                    )
                                })}
                            </TableRow>
                        ))}
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
            <div className="flex items-center justify-end space-x-2 py-4">
                <ViewPerPage className="flex-1" />
                <div className="space-x-2">
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={ () => table.previousPage() }
                        disabled={ !table.getCanPreviousPage() }
                    >
                        Previous
                    </Button>
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={ () => table.nextPage() }
                        disabled={ !table.getCanNextPage() }
                    >
                        Next
                    </Button>
                </div>
            </div>

            {/*--UPDATE-FORM--*/}
            <AlertDialog open={ openUpdateForm } onOpenChange={ setOpenUpdateForm }>
                <AlertDialogContent className="my-alert-dialog-content" onOpenAutoFocus={ (e) => e.preventDefault() }>
                    <AlertDialogHeader>
                        <AlertDialogTitle>
                            Update Jenis Praktikum
                        </AlertDialogTitle>
                        <AlertDialogDescription>
                            Anda akan mengubah nama Jenis Praktikum
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <form className={ cn("grid items-start gap-4") } onSubmit={ handleUpdateFormSubmit }>
                        <div className="grid gap-2">
                            <Label htmlFor="nama">Nama Jenis Praktikum</Label>
                            <Input
                                type="text"
                                name="nama"
                                id="nama"
                                value={ updateForm.nama }
                                onChange={ (event) => setUpdateForm((prevState) => ({
                                    ...prevState,
                                    nama: event.target.value
                                })) }
                            />
                        </div>
                        <Button type="submit" disabled={updateForm.onSubmit}>
                            { updateForm.onSubmit
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
            {/*---UPDATE-FORM---*/}

            {/*--DELETE-FORM--*/}
            <AlertDialog open={ openDeleteForm } onOpenChange={ setOpenDeleteForm }>
                <AlertDialogContent className="my-alert-dialog-content" onOpenAutoFocus={ (e) => e.preventDefault() }>
                    <AlertDialogHeader>
                        <AlertDialogTitle>
                            Hapus Jenis Praktikum
                        </AlertDialogTitle>
                        <AlertDialogDescription className="flex flex-col gap-0.5">
                            <p className="text-red-600 font-bold">
                                Anda akan menghapus Jenis Praktikum!
                            </p>
                            <p className="*:text-red-600">
                                Semua data praktikum yang berjenis <strong>{ deleteForm.nama }</strong> akan
                                kehilangan keterangannya.
                            </p>
                            <br/>
                            <p className="text-red-600">
                                Data yang terhapus tidak akan bisa dikembalikan! harap gunakan dengan hati-hati
                            </p>
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <form className={ cn("grid items-start gap-4") } onSubmit={ handleDeleteFormSubmit }>
                        <div className="grid gap-2">
                            <Label htmlFor="validation">Validasi aksi anda</Label>
                            <Input
                                type="text"
                                name="validation"
                                id="validation"
                                value={ deleteForm.validation }
                                placeholder="JARKOM JAYA"
                                onChange={ (event) =>
                                    setDeleteForm((prevState) => ({
                                        ...prevState,
                                        validation: event.target.value,
                                    }))
                                }
                                autoComplete="off"
                            />
                            <p>Ketik <strong>JARKOM JAYA</strong> untuk melanjutkan</p>
                        </div>
                        <Button type="submit" disabled={ deleteForm.onSubmit || deleteForm.validation !== 'JARKOM JAYA'}>
                            { deleteForm.onSubmit
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
            {/*---DELETE-FORM---*/}
        </AdminLayout>
    );
}
