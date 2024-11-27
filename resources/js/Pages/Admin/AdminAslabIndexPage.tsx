import * as React from "react"
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
import { ArrowUpDown, MoreHorizontal, Clipboard, Pencil, LockKeyholeOpen } from "lucide-react"
import { useState } from "react";
import { ViewPerPage } from "@/components/view-per-page";
import { TableSearchForm } from "@/components/table-search-form";
import { Head } from "@inertiajs/react";

export type Aslab = {
    id: string;
    nama: string;
    npm: string;
    username: string;
};
const data: Aslab[] = [
    {
        "id": "b1c92c50-09c3-4c2b-b77e-5c88d8dbd598",
        "nama": "Mochamad Luthfan Rianda Putra",
        "npm": "06.2021.1.07397",
        "username": "pann"
    },
    {
        "id": "435db5f2-03f1-4c72-b032-4ef4585d5051",
        "nama": "Indy Adira Khalfani",
        "npm": "06.2021.1.07434",
        "username": "viole"
    },
    {
        "id": "d321fc94-4769-43bb-9ec6-d07c6146b6db",
        "nama": "Latiful Sirri",
        "npm": "06.2021.1.07461",
        "username": "vain"
    },
    {
        "id": "ce0631b3-52d6-486e-aebb-df2b02ff65e4",
        "nama": "Chatarina natassya putri",
        "npm": "06.2021.1.07482",
        "username": "nat"
    },
    {
        "id": "7816e3c1-5b08-42b1-9c18-c1b2dc097dbf",
        "nama": "Afzal Musyaffa Lathif Ashrafil Adam",
        "npm": "06.2022.1.07587",
        "username": "afgood"
    },
    {
        "id": "f02e5b1a-5fa8-4f69-8331-fd674379e650",
        "nama": "Windi Nitasya Lubis",
        "npm": "06.2022.1.07590",
        "username": "windi"
    },
    {
        "id": "d6492a8e-0b94-46e6-9b38-8caa6e5db879",
        "nama": "Marikh kasiful izzat",
        "npm": "06.2022.1.07610",
        "username": "tazz"
    },
    {
        "id": "7c03724f-c68c-4f65-bfb7-ec6f9cfb0988",
        "nama": "Gregoria Stefania Kue Siga",
        "npm": "06.2022.1.07626",
        "username": "greiss"
    }
]

export const columns: ColumnDef<Aslab>[] = [
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
        cell: ({ row }) => <div className="capitalize px-2 truncate">{row.getValue("nama")}</div>,
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
                            <LockKeyholeOpen /> Reset Password
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            )
        },
    },
]
export default function AdminAslabIndexPage() {
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
            <Head title="Admin - Manajemen Aslab" />
            <CardTitle>
                Manajemen Asisten Laboratorium
            </CardTitle>
            <CardDescription>
                Data Asisten Laboratorium yang terdaftar
            </CardDescription>
            <div className="w-full flex justify-end">
                <TableSearchForm table={table} />
            </div>
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
