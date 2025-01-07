import { Button } from "@/components/ui/button"
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
import { CardDescription, CardTitle } from "@/components/ui/card";
import {
    ColumnDef,
    SortingState,
    flexRender,
    getCoreRowModel,
    getSortedRowModel,
    useReactTable,
} from "@tanstack/react-table"
import { ArrowUpDown, MoreHorizontal, Pencil, Trash2, Plus, Loader2 } from "lucide-react"
import { FormEvent, useState } from "react";
import { ViewPerPage } from "@/components/view-per-page";
import { TableSearchForm } from "@/components/table-search-form";
import { Head, router } from "@inertiajs/react";
import { PaginationData } from "@/types";
import { useToast } from "@/hooks/use-toast";
import axios, { AxiosError } from "axios";
import { useIsMobile } from "@/hooks/use-mobile";
import {
    Drawer, DrawerClose,
    DrawerContent,
    DrawerDescription,
    DrawerFooter,
    DrawerHeader,
    DrawerTitle
} from "@/components/ui/drawer";
import { cn } from "@/lib/utils";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { z } from "zod";
import { format } from "date-fns";
import { id as localeId } from "date-fns/locale";

type Kuis = {
    id: string;
    kuis_nama: string;
    pertemuan_nama: string;
    praktikum_nama: string;
    waktu_mulai: string;
    waktu_selesai: string;
};
export default function AdminKuisIndexPage({ pagination }: {
    pagination: PaginationData<Kuis[]>;
}) {

    const { toast } = useToast();
    type DeleteForm = {
        id: string;
        nama: string;
        validation: string;
        onSubmit: boolean;
    };
    const deleteFormInit: DeleteForm = {
        id: '',
        nama: '',
        validation: '',
        onSubmit: false
    };
    const [ openDeleteForm, setOpenDeleteForm ] = useState(false);
    const [ deleteForm, setDeleteForm ] = useState<DeleteForm>(deleteFormInit);

    const columns: ColumnDef<Kuis>[] = [
        {
            accessorKey: "kuis_nama",
            header: ({ column }) => {
                return (
                    <Button
                        variant="ghost"
                        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                        className="w-full justify-start "
                    >
                        Nama Kuis
                        <ArrowUpDown />
                    </Button>
                )
            },
            cell: ({ row }) => <div className="capitalize min-w-52 px-2">{row.getValue("kuis_nama")}</div>,
        },
        {
            accessorKey: "praktikum_nama",
            header: () => <div className="select-none">Praktikum</div>,
            cell: ({ row }) => <div className="capitalize min-w-36">{row.getValue("praktikum_nama") ?? '-'}</div>,
        },
        {
            accessorKey: "pertemuan_nama",
            header: () => <div className="select-none">Pertemuan</div>,
            cell: ({ row }) => <div className="capitalize min-w-28">{row.getValue("pertemuan_nama") ?? '-'}</div>,
        },
        {
            accessorKey: "waktu_mulai",
            header: () => <div className="select-none">Waktu Mulai</div>,
            cell: ({ row }) => {
                const waktuMulai = format(new Date(row.original.waktu_mulai), "PPP hh:mm", { locale: localeId });
                return (
                    <div className="capitalize min-w-36">
                        { waktuMulai }
                    </div>
                );
            }
        },
        {
            accessorKey: "waktu_selesai",
            header: () => <div className="select-none">Waktu Selesai</div>,
            cell: ({ row }) => {
                const waktuSelesai = format(new Date(row.original.waktu_selesai), "PPP hh:mm", { locale: localeId });
                return (
                    <div className="capitalize min-w-36">
                        { waktuSelesai }
                    </div>
                );
            }
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
                            <DropdownMenuItem onClick={ () => router.visit(route('admin.aslab.update', { q: originalRow.id })) }>
                                <Pencil /> Ubah data
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={ () => {
                                setOpenDeleteForm(true);
                                setDeleteForm((prevState) => ({
                                    ...prevState,
                                    id: originalRow.id,
                                    nama: originalRow.kuis_nama
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

    const handleDeleteFormSubmit = (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        setDeleteForm((prevState) => ({ ...prevState, onSubmit: true }));
        const { id } = deleteForm;
        const deleteSchema = z.object({
            id: z.string({ message: 'Format Kuis tidak valid! '}).min(1, { message: 'Format Kuis tidak valid!' }),
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
        }>(route('kuis.delete'), {
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

    console.log(pagination.data);

    return (
        <AdminLayout>
            <Head title="Admin - Manajemen Kuis" />
            <CardTitle>
                Manajemen Kuis
            </CardTitle>
            <CardDescription>
                Data Kuis
            </CardDescription>
            <div className="flex flex-col lg:flex-row gap-2 items-start justify-between">
                <Button className="mt-4" onClick={ () => router.visit(route('admin.kuis.create')) }>
                    Buat <Plus />
                </Button>
                <TableSearchForm table={ table }/>
            </div>
            <div className="mx-auto sm:mx-0 rounded-md border overflow-x-auto w-[82vw] sm:w-full">
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

            {/*--DELETE-FORM--*/ }
            { useIsMobile() ? (
                <Drawer open={ openDeleteForm } onOpenChange={ setOpenDeleteForm } dismissible={ false }>
                    <DrawerContent onOpenAutoFocus={ (e) => e.preventDefault() }>
                        <DrawerHeader className="text-left">
                            <DrawerTitle>
                                Hapus Kuis
                            </DrawerTitle>
                            <DrawerDescription>
                                <span className="text-red-600 font-bold">
                                    Anda akan menghapus Kuis!
                                </span>
                                <span className="*:text-red-600">
                                    Semua data Kuis <strong>{ deleteForm.nama }</strong> seperti nilai kuis dan sebagainya akan juga terhapus
                                </span>
                                <br/>
                                <span className="text-red-600">
                                    Data yang terhapus tidak akan bisa dikembalikan! harap gunakan dengan hati-hati
                                </span>
                            </DrawerDescription>
                        </DrawerHeader>
                        <div className="p-5">
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
                                <Button type="submit"
                                        disabled={ deleteForm.onSubmit || deleteForm.validation !== 'JARKOM JAYA' }>
                                    { deleteForm.onSubmit
                                        ? (
                                            <>Memproses <Loader2 className="animate-spin"/></>
                                        ) : (
                                            <span>Simpan</span>
                                        )
                                    }
                                </Button>
                            </form>
                        </div>
                        <DrawerFooter className="pt-2">
                            <DrawerClose asChild>
                                <Button variant="outline" onClick={ () => setOpenDeleteForm(false) }>
                                    Batal
                                </Button>
                            </DrawerClose>
                        </DrawerFooter>
                    </DrawerContent>
                </Drawer>
            ) : (
                <Dialog open={ openDeleteForm } onOpenChange={ setOpenDeleteForm }>
                    <DialogContent className="sm:max-w-[425px]" onOpenAutoFocus={ (e) => e.preventDefault() }>
                        <DialogHeader>
                            <DialogTitle>
                                Hapus Kuis
                            </DialogTitle>
                            <DialogDescription className="flex flex-col gap-0.5">
                                <span className="text-red-600 font-bold">
                                    Anda akan menghapus Kuis!
                                </span>
                                <span className="*:text-red-600">
                                    Semua data Kuis <strong>{ deleteForm.nama }</strong> seperti nilai kuis dan sebagainya akan juga terhapus
                                </span>
                                <br/>
                                <span className="text-red-600">
                                    Data yang terhapus tidak akan bisa dikembalikan! harap gunakan dengan hati-hati
                                </span>
                            </DialogDescription>
                        </DialogHeader>
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
                            <Button type="submit"
                                    disabled={ deleteForm.onSubmit || deleteForm.validation !== 'JARKOM JAYA' }>
                                { deleteForm.onSubmit
                                    ? (
                                        <>Memproses <Loader2 className="animate-spin"/></>
                                    ) : (
                                        <span>Simpan</span>
                                    )
                                }
                            </Button>
                        </form>
                    </DialogContent>
                </Dialog>
            ) }
            {/*---DELETE-FORM---*/ }
        </AdminLayout>
    );
}
