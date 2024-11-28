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
import { PaginationData } from "@/types";

type Praktikan = {
    id: string;
    nama: string;
    npm: string;
    username: string;
};

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
export default function AdminPraktikanIndexPage({ pagination }: {
    pagination: PaginationData<Praktikan[]>;
}) {
    const [ sorting, setSorting ] = useState<SortingState>([])
    const [ columnFilters, setColumnFilters ] = useState<ColumnFiltersState>([])
    const [ columnVisibility, setColumnVisibility ] = useState<VisibilityState>({})
    const [ rowSelection, setRowSelection ] = useState({})

    const table = useReactTable({
        data: pagination.data,
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
            <div className="w-full flex justify-end">
                <TableSearchForm table={ table }/>
            </div>
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
