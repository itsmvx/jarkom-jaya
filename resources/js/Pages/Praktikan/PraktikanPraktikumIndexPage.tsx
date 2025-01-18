import { PraktikanLayout } from "@/layouts/PraktikanLayout";
import { Head, router } from "@inertiajs/react";
import { CardDescription, CardTitle } from "@/components/ui/card";
import { PageProps } from "@/types";
import { Button } from "@/components/ui/button";
import { ArrowUpDown, MoreHorizontal, Users2 } from "lucide-react";
import { TableSearchForm } from "@/components/table-search-form";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import {
    ColumnDef,
    flexRender,
    getCoreRowModel,
    getSortedRowModel,
    SortingState,
    useReactTable
} from "@tanstack/react-table";
import { ViewPerPage } from "@/components/view-per-page";
import { romanToNumber } from "@/lib/utils";
import {
    DropdownMenu,
    DropdownMenuContent, DropdownMenuItem,
    DropdownMenuLabel, DropdownMenuSeparator,
    DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import { useState } from "react";

type Praktikum = {
    id: string;
    nama: string;
    tahun: string;
    terverifikasi: boolean;
    periode: {
        nama: string;
    } | null;
};
export default function PraktikanPraktikumIndexPage({ auth, praktikums }: PageProps<{
    praktikums: Praktikum[];
}>) {
    const columns: ColumnDef<Praktikum>[] = [
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
                <div className="capitalize min-w-48 truncate px-2">
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
                    <div className="capitalize min-w-20 indent-4">
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
            accessorKey: "tahun",
            header: ({ column }) => {
                return (
                    <Button
                        variant="ghost"
                        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                        className="w-full justify-start"
                    >
                        Tahun
                        <ArrowUpDown />
                    </Button>
                );
            },
            cell: ({ row }) => (
                <div className="capitalize min-w-20 indent-4">
                    {row.getValue("tahun")}
                </div>
            ),
        },
        {
            accessorKey: "status",
            header: ({ column }) => {
                return (
                    <Button
                        variant="ghost"
                        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                        className="w-40 justify-start"
                    >
                        Status Verifikasi
                        <ArrowUpDown />
                    </Button>
                );
            },
            cell: ({ row }) => {
                return (
                    <div className="capitalize min-w-20 indent-4">
                        { row.original.terverifikasi ? 'Sudah terverifikasi' : 'Belum terverifikasi' }
                    </div>
                )
            },
            sortingFn: (rowA, rowB) => {
                const statusA = rowA.original.terverifikasi ? 1 : 0;
                const statusB = rowB.original.terverifikasi ? 1 : 0;

                return statusA - statusB;
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
                            <DropdownMenuItem disabled onClick={ () => router.visit(route('admin.praktikum.praktikan.index', { q: originalRow.id })) }>
                                <Users2 /> Detail Praktikum
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
        data: praktikums,
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
    return (
        <>
            <PraktikanLayout auth={ auth }>
                <Head title="Praktikan - Histori Praktikum"/>
                <CardTitle>
                    Histori Praktikum
                </CardTitle>
                <CardDescription>
                    Menampilkan data Praktikum yang telah terdaftar
                </CardDescription>

                <div className="flex flex-col lg:flex-row gap-2 items-start justify-end">
                    <TableSearchForm table={ table }/>
                </div>
                <div className="mx-auto sm:mx-0 rounded-md border overflow-x-auto w-[82vw] sm:w-full">
                    <Table className="table-auto">
                        <TableHeader>
                            { table.getHeaderGroups().map((headerGroup) => (
                                <TableRow key={ headerGroup.id }>
                                    { headerGroup.headers.map((header) => (
                                        <TableHead key={ header.id }>
                                            { header.isPlaceholder
                                                ? null
                                                : flexRender(
                                                    header.column.columnDef.header,
                                                    header.getContext()
                                                ) }
                                        </TableHead>
                                    )) }
                                </TableRow>
                            )) }
                        </TableHeader>
                        <TableBody>
                            { table.getRowModel().rows?.length ? (
                                table.getRowModel().rows.map((row) => (
                                    <TableRow key={ row.id } data-state={ row.getIsSelected() && "selected" }>
                                        { row.getVisibleCells().map((cell) => (
                                            <TableCell key={ cell.id }>
                                                { flexRender(cell.column.columnDef.cell, cell.getContext()) }
                                            </TableCell>
                                        )) }
                                    </TableRow>
                                ))
                            ) : (
                                <TableRow>
                                    <TableCell colSpan={ columns.length } className="h-24 text-center">
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
            </PraktikanLayout>
        </>
    );
}
