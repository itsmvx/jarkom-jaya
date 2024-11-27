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
import { AppLayout } from "@/layouts/AppLayout";
import { Button } from "@/components/ui/button"
import { CardDescription, CardTitle } from "@/components/ui/card";
import {
    ColumnDef,
    ColumnFiltersState,
    SortingState,
    VisibilityState,
    flexRender,
    getCoreRowModel,
    getFilteredRowModel,
    getSortedRowModel,
    useReactTable,
} from "@tanstack/react-table"
import { ArrowUpDown, MoreHorizontal, Clipboard, Pencil, Plus } from "lucide-react"
import { ComponentProps, useState } from "react";
import { ViewPerPage } from "@/components/view-per-page";
import { TableSearchForm } from "@/components/table-search-form";
import { cn, romanToNumber } from "@/lib/utils";
import { DialogDrawer } from "@/components/dialog-drawer";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { YearPicker } from "@/components/year-picker";
import { Head } from "@inertiajs/react";
import * as React from "react";

type PeriodePraktikum = {
    id: string;
    nama: string;
};

const data: PeriodePraktikum[] = [
    {
        id: "c0df6d81-9074-4f8e-b983-3e5abf8c3dbb",
        nama: "XXXVI",
    },
    {
        id: "3c9c0a8c-d190-4e4b-91e7-54f0de743abc",
        nama: "XXXVII",
    },
    {
        id: "ab63b3d9-91d2-459b-818f-6024f17e29b2",
        nama: "XXXVIII",
    },
    {
        id: "dc7b2435-92f1-47f9-a4be-f7f98b5f56d3",
        nama: "XXXIX",
    }
];

export const columns: ColumnDef<PeriodePraktikum>[] = [
    {
        accessorKey: "nama",
        header: ({ column }) => {
            return (
                <Button
                    variant="ghost"
                    onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                    className="w-full justify-start"
                >
                    Nama Periode Praktikum
                    <ArrowUpDown />
                </Button>
            );
        },
        cell: ({ row }) => {
            return (
                <div className="capitalize min-w-40 indent-4">
                    {row.getValue<string>("nama")}
                </div>
            );
        },
        sortingFn: (rowA, rowB) => {
            const valueA = romanToNumber(rowA.getValue<string>("nama"));
            const valueB = romanToNumber(rowB.getValue<string>("nama"));
            return valueA - valueB;
        },
    },
    {
        id: "actions",
        enableHiding: false,
        cell: ({ row }) => {
            const action = row.original;
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
                        <DropdownMenuItem>
                            <Pencil /> Ubah data
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem onClick={() => navigator.clipboard.writeText(action.id)}>
                            <Clipboard /> Salin ID
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            );
        },
    },
];
export default function AdminAslabIndexPage({ currentDate }: {
    currentDate: string;
}) {
    const [ sorting, setSorting ] = useState<SortingState>([]);
    const [ columnFilters, setColumnFilters ] = useState<ColumnFiltersState>([]);
    const [ columnVisibility, setColumnVisibility ] = useState<VisibilityState>({});
    const [ rowSelection, setRowSelection ] = useState({});
    const [ selectedYear, setSelectedYear ] = useState(new Date(currentDate).getFullYear());


    const table = useReactTable({
        data,
        columns,
        onSortingChange: setSorting,
        onColumnFiltersChange: setColumnFilters,
        getCoreRowModel: getCoreRowModel(),
        getSortedRowModel: getSortedRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
        onColumnVisibilityChange: setColumnVisibility,
        onRowSelectionChange: setRowSelection,
        state: {
            sorting,
            columnFilters,
            columnVisibility,
            rowSelection,
        },
    });
    const CreateForm = ({ className }: ComponentProps<"form">) => {
        return (
            <form className={cn("grid items-start gap-4", className)}>
                <div className="grid gap-2">
                    <Label htmlFor="nama">Nama Periode Praktikum</Label>
                    <Input type="text" id="nama" />
                </div>
                <div className="grid gap-2 [&_button]:w-full">
                    <Label htmlFor="nama">Tahun Periode Praktikum</Label>
                    <YearPicker value={selectedYear} onValueChange={setSelectedYear} />
                </div>
                <Button type="submit">Simpan</Button>
            </form>
        );
    };

    return (
        <AppLayout>
            <Head title="Admin - Manajemen Periode Praktikum" />
            <CardTitle>
                Manajemen Periode Praktikum
            </CardTitle>
            <CardDescription>
                Data Periode Praktikum yang terdaftar
            </CardDescription>
            <div className="flex flex-col lg:flex-row gap-2 items-start justify-between">
                <DialogDrawer
                    headerTitle="Tambah Periode Praktikum"
                    headerDescription={ `Periode praktikum seperti "XXXVIII" dalam angka romawi` }
                    triggerEl={ (
                        <Button className="mt-4">
                            Buat <Plus/>
                        </Button>
                    ) }
                >
                    <CreateForm/>
                </DialogDrawer>
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
                <ViewPerPage className="flex-1"/>
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
        </AppLayout>
    );
}
