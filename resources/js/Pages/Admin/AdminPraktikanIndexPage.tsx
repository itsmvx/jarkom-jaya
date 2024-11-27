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
import { AppLayout } from "@/layouts/AppLayout";
import { Card, CardDescription, CardTitle } from "@/components/ui/card";
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
import { ArrowUpDown, MoreHorizontal, Clipboard, Pencil, BookMarked } from "lucide-react"
import { useState } from "react";
import { ViewPerPage } from "@/components/view-per-page";
import { TableSearchForm } from "@/components/table-search-form";
import { Head } from "@inertiajs/react";
import * as React from "react";

export type Praktikan = {
    id: string;
    nama: string;
    npm: string;
};
const data: Praktikan[] = [
    { id: "1e6806a0-4d3e-11ec-81d3-0242ac130003", nama: "Elaina Annisa Zahra", npm: "06.2024.1.01234" },
    { id: "1e680790-4d3e-11ec-81d3-0242ac130003", nama: "Zenitsu Kaori Rahayu", npm: "06.2024.1.01235" },
    { id: "1e680852-4d3e-11ec-81d3-0242ac130003", nama: "Shinobu Dhiwangkara Sari", npm: "06.2024.1.01236" },
    { id: "1e680914-4d3e-11ec-81d3-0242ac130003", nama: "Chizuru Fadillah Ayu", npm: "06.2024.1.01237" },
    { id: "1e6809d6-4d3e-11ec-81d3-0242ac130003", nama: "Tatsuya Galang Perdana", npm: "06.2024.1.01238" },
    { id: "1e680a98-4d3e-11ec-81d3-0242ac130003", nama: "Yui Rahma Suci", npm: "06.2024.1.01239" },
    { id: "1e680b5a-4d3e-11ec-81d3-0242ac130003", nama: "Kagome Risa Yuki", npm: "06.2024.1.01240" },
    { id: "1e680c1c-4d3e-11ec-81d3-0242ac130003", nama: "Hikaru Rachma Fira", npm: "06.2024.1.01241" },
    { id: "1e680cde-4d3e-11ec-81d3-0242ac130003", nama: "Nana Aina Larasati", npm: "06.2024.1.01242" },
    { id: "1e680da0-4d3e-11ec-81d3-0242ac130003", nama: "Kanao Putri Indah", npm: "06.2024.1.01243" },
    { id: "1e680e62-4d3e-11ec-81d3-0242ac130003", nama: "Asuka Zella Ayuningtyas", npm: "06.2024.1.01244" },
    { id: "1e680f24-4d3e-11ec-81d3-0242ac130003", nama: "Satsuki Aiko Damayanti", npm: "06.2024.1.01245" },
    { id: "1e680fe6-4d3e-11ec-81d3-0242ac130003", nama: "Rei Siti Khairunnisa", npm: "06.2024.1.01246" },
    { id: "1e6810a8-4d3e-11ec-81d3-0242ac130003", nama: "Makoto Aulia Safira", npm: "06.2024.1.01247" },
    { id: "1e68116a-4d3e-11ec-81d3-0242ac130003", nama: "Miyuki Shinta Lestari", npm: "06.2024.1.01248" },
    { id: "1e6811cc-4d3e-11ec-81d3-0242ac130003", nama: "Akihiko Rizky Alfian", npm: "06.2024.1.01249" },
    { id: "1e68128e-4d3e-11ec-81d3-0242ac130003", nama: "Nanami Lintang Rani", npm: "06.2024.1.01250" },
    { id: "1e681350-4d3e-11ec-81d3-0242ac130003", nama: "Yoshiko Nura Gita", npm: "06.2024.1.01251" },
    { id: "1e681412-4d3e-11ec-81d3-0242ac130003", nama: "Hinata Arunika Pratiwi", npm: "06.2024.1.01252" },
    { id: "1e6814d4-4d3e-11ec-81d3-0242ac130003", nama: "Kazuki Lintang Raharjo", npm: "06.2024.1.01253" },
    { id: "1e681596-4d3e-11ec-81d3-0242ac130003", nama: "Emiko Citra Harum", npm: "06.2024.1.01254" },
    { id: "1e681658-4d3e-11ec-81d3-0242ac130003", nama: "Kenta Azumi Riana", npm: "06.2024.1.01255" },
    { id: "1e68171a-4d3e-11ec-81d3-0242ac130003", nama: "Mizuki Putri Rhapsody", npm: "06.2024.1.01256" },
    { id: "1e6817dc-4d3e-11ec-81d3-0242ac130003", nama: "Haru Siti Rahma", npm: "06.2024.1.01257" },
    { id: "1e68189e-4d3e-11ec-81d3-0242ac130003", nama: "Akira Dwi Anggun", npm: "06.2024.1.01258" }
];


export const columns: ColumnDef<Praktikan>[] = [
    {
        accessorKey: "nama",
        header: ({ column }) => {
            return (
                <Button
                    variant="ghost"
                    onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                    className="w-full justify-start "
                >
                    Nama
                    <ArrowUpDown />
                </Button>
            )
        },
        cell: ({ row }) => <div className="capitalize min-w-52 px-2">{row.getValue("nama")}</div>,
    },
    {
        accessorKey: "npm",
        header: ({ column }) => {
            return (
                <Button
                    variant="ghost"
                    onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                    className="w-full justify-start items-start"
                >
                    NPM
                    <ArrowUpDown />
                </Button>
            )
        },
        cell: ({ row }) => <div className="lowercase min-w-20">{row.getValue("npm")}</div>,
    },
    {
        accessorKey: "username",
        header: () => <div className="">Username</div>,
        cell: ({ row }) => <div className={ `lowercase min-w-20 ${row.getValue('username') ? 'indent-0' : 'indent-4'}` }>{row.getValue("username") ?? '-'}</div>,
    },
    {
        id: "actions",
        enableHiding: false,
        cell: ({ row }) => {
            const action = row.original

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
                        <DropdownMenuItem onClick={() => navigator.clipboard.writeText(action.npm)}>
                            <Clipboard /> Salin NPM
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                            <BookMarked /> Histori Nilai
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            )
        },
    },
]
export default function AdminPraktikanIndexPage() {
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
                Manajemen Praktikan
            </CardTitle>
            <CardDescription>
                Data Praktikan
            </CardDescription>
            <TableSearchForm table={table} />
            <div className="rounded-md border">
                <Table>
                    <TableHeader>
                        {table.getHeaderGroups().map((headerGroup) => (
                            <TableRow key={headerGroup.id} className="!last:w-10">
                                {headerGroup.headers.map((header) => {
                                    return (
                                        <TableHead key={header.id} className="w-10">
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
