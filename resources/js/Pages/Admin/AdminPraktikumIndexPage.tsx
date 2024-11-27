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
import { ArrowUpDown, MoreHorizontal, Clipboard, Pencil } from "lucide-react"
import { useState } from "react";
import { ViewPerPage } from "@/components/view-per-page";
import { TableSearchForm } from "@/components/table-search-form";
import { romanToNumber } from "@/lib/utils";
import { Head } from "@inertiajs/react";
import * as React from "react";

type Praktikum = {
    id: string;
    nama: string;
    jenis_praktikum: {
        nama: string;
    } | null;
    periode: {
        nama: string;
    } | null;
};

const data: Praktikum[] = [
    {
        id: "c0df6d82-9072-4f8e-b983-3e5abf8c3dbb",
        nama: "Sistem Operasi XXXVI",
        jenis_praktikum: { nama: "Sistem Operasi" },
        periode: { nama: "XXXVI" }
    },
    {
        id: "7c9c0a8c-d890-4e4b-91e7-54f0de743abc",
        nama: "Sistem Operasi XXXVII",
        jenis_praktikum: { nama: "Sistem Operasi" },
        periode: { nama: "XXXVII" }
    },
    {
        id: "ab63b3d8-91d3-459b-818f-6024f17e29b2",
        nama: "Sistem Operasi XXXVIII",
        jenis_praktikum: { nama: "Sistem Operasi" },
        periode: { nama: "XXXVIII" }
    },
    {
        id: "dc7b2435-92f1-47f6-a1be-f7f98b5f56d3",
        nama: "Sistem Operasi XXXIX",
        jenis_praktikum: { nama: "Sistem Operasi" },
        periode: { nama: "XXXIX" }
    },
    {
        id: "42d8c1cb-7756-4b77-bc32-e4931c77d553",
        nama: "Jaringan Komputer XXXVI",
        jenis_praktikum: { nama: "Jaringan Komputer" },
        periode: { nama: "XXXVI" }
    },
    {
        id: "f94b17e4-2d3e-47b1-bd7c-f21bc2eb58c4",
        nama: "Jaringan Komputer XXXVII",
        jenis_praktikum: { nama: "Jaringan Komputer" },
        periode: { nama: "XXXVII" }
    },
    {
        id: "60a9b352-3d9f-4761-822c-c5c634bf1727",
        nama: "Jaringan Komputer XXXVIII",
        jenis_praktikum: { nama: "Jaringan Komputer" },
        periode: { nama: "XXXVIII" }
    },
    {
        id: "e8af4935-dff9-4315-8778-b79fbad6d7c7",
        nama: "Jaringan Komputer XXXIX",
        jenis_praktikum: { nama: "Jaringan Komputer" },
        periode: { nama: "XXXIX" }
    }
];

export const columns: ColumnDef<Praktikum>[] = [
    {
        accessorKey: "nama",
        header: ({ column }) => {
            return (
                <Button
                    variant="ghost"
                    onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                    className="w-full justify-start"
                >
                    Praktikum
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
        accessorFn: (row) => row.periode?.nama || "-",
        id: "periode.nama",
        header: ({ column }) => {
            return (
                <Button
                    variant="ghost"
                    onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                    className="w-full justify-start"
                >
                    Periode
                    <ArrowUpDown />
                </Button>
            );
        },
        cell: ({ row }) => {
            return (
                <div className="capitalize min-w-40 indent-4">
                    {row.getValue<string>("periode.nama")}
                </div>
            );
        },
        sortingFn: (rowA, rowB) => {
            const valueA = romanToNumber(rowA.getValue<string>("periode.nama"));
            const valueB = romanToNumber(rowB.getValue<string>("periode.nama"));
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
export default function AdminPraktikumIndexPage() {

    const [ sorting, setSorting ] = useState<SortingState>([])
    const [ columnFilters, setColumnFilters ] = useState<ColumnFiltersState>([])
    const [ columnVisibility, setColumnVisibility ] = useState<VisibilityState>({})
    const [ rowSelection, setRowSelection ] = useState({})

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
    })

    return (
        <AppLayout>
            <Head title="Admin - Manajemen Praktikan" />
            <CardTitle>
                Manajemen Praktikum
            </CardTitle>
            <CardDescription>
                Data Praktikum yang terdaftar
            </CardDescription>
            <TableSearchForm table={table} />
            <div className="rounded-md border">
                <Table>
                    <TableHeader>
                        {table.getHeaderGroups().map((headerGroup) => (
                            <TableRow key={headerGroup.id}>
                                {headerGroup.headers.map((header) => {
                                    return (
                                        <TableHead key={header.id}>
                                            {header.isPlaceholder
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
        </AppLayout>
    );
}
