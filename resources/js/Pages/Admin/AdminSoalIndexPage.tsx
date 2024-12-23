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
import { ArrowUpDown, MoreHorizontal, Pencil, Trash2, Plus, Loader2, Upload } from "lucide-react"
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
import { cn, deltaParse, RenderQuillDelta } from "@/lib/utils";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { z } from "zod";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";

type Soal = {
    id: string;
    pertanyaan: string;
    pilihan_jawaban: {
        value: string;
        label: string;
    }[];
    kunci_jawaban: string;
    label: {
        id: string;
        nama: string;
    }[];
};
export default function AdminSoalIndexPage({ pagination }: {
    pagination: PaginationData<Soal[]>;
}) {

    const { toast } = useToast();
    type DeleteForm = {
        id: string;
        validation: string;
        onSubmit: boolean;
    };
    const deleteFormInit: DeleteForm = {
        id: '',
        validation: '',
        onSubmit: false
    };
    const [ openDeleteForm, setOpenDeleteForm ] = useState(false);
    const [ deleteForm, setDeleteForm ] = useState<DeleteForm>(deleteFormInit);

    const columns: ColumnDef<Soal>[] = [
        {
            accessorKey: "label",
            header: ({ column }) => {
                return (
                    <Button
                        variant="ghost"
                        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                        className="w-full justify-start "
                    >
                        Label
                        <ArrowUpDown />
                    </Button>
                )
            },
            cell: ({ row }) => {
                const labelArr = row.original.label;
                return (
                    <div className="pl-3 flex flex-wrap gap-2 min-w-40 max-w-60 w-auto overflow-hidden">
                        { labelArr && labelArr.length > 0 ? (
                            labelArr.map((label) => (
                                <Badge key={ label.id } className="py-1 px-2 text-xs">
                                    { label.nama }
                                </Badge>
                            ))
                        ) : (
                            <span className="text-gray-500 italic">Tidak ada label</span>
                        ) }
                    </div>
                );
            },
        },
        {
            accessorKey: "pertanyaan",
            header: () => <div className="min-w-64">Pertanyaan</div>,
            cell: ({ row }) => {
                return (
                    <>
                        <Accordion type="single" collapsible className="w-full">
                            <AccordionItem value="item-1">
                                <AccordionTrigger>Lihat pertanyaan</AccordionTrigger>
                                <AccordionContent>
                                    <RenderQuillDelta
                                        delta={deltaParse(row.original.pertanyaan)}
                                        className="!items-start justify-center"
                                    />
                                </AccordionContent>
                            </AccordionItem>
                        </Accordion>

                    </>
                )
            },
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
            id: z.string({ message: 'Format Soal Kuis tidak valid! '}).min(1, { message: 'Format Soal Kuis tidak valid!' }),
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
        }>(route('soal.delete'), {
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
            <Head title="Admin - Manajemen SoalKuis" />
            <CardTitle>
                Manajemen Soal Kuis
            </CardTitle>
            <CardDescription>
                Data Soal Kuis
            </CardDescription>
            <div className="flex flex-col lg:flex-row gap-2 items-start justify-between">
                <div className="space-x-2">
                    <Button className="mt-4" onClick={ () => router.visit(route('admin.kuis.soal.create')) }>
                        Buat <Plus />
                    </Button>
                    <Button className="mt-4" onClick={ () => router.visit(route('admin.kuis.soal.create-upload')) }>
                        Upload <Upload />
                    </Button>
                </div>
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
                                Hapus SoalKuis
                            </DrawerTitle>
                            <DrawerDescription>
                                <span className="text-red-600 font-bold">
                                    Anda akan menghapus Soal Kuis!
                                </span>
                                <span className="*:text-red-600">
                                    Data Soal Kuis akan dihapus
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
                                Hapus Soal Kuis
                            </DialogTitle>
                            <DialogDescription className="flex flex-col gap-0.5">
                                <span className="text-red-600 font-bold">
                                    Anda akan menghapus Soal Kuis!
                                </span>
                                <span className="*:text-red-600">
                                    Data Soal Kuis akan dihapus
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
