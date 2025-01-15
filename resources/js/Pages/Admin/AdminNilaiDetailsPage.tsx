import React, { useState } from 'react'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Edit2, Save, X, AlertTriangle } from 'lucide-react'
import { AdminLayout } from "@/layouts/AdminLayout";
import { Head } from "@inertiajs/react";
import { CardDescription, CardTitle } from "@/components/ui/card";
import { ViewPerPage } from "@/components/view-per-page";

interface Student {
    id: number
    name: string
    exams: number[]
}

interface EditState {
    studentId: number
    examIndex: number
    value: string
}
export default function AdminNilaiDetailsPage({ nilaiPraktikans }: {
    nilaiPraktikans: any
}) {

    console.log(nilaiPraktikans);
    const [students, setStudents] = useState<Student[]>([
        { id: 1, name: 'John Doe', exams: [85, 92, 78, 95, 88, 90, 86, 93] },
        { id: 2, name: 'Jane Smith', exams: [90, 88, 92, 85, 95, 89, 91, 87] },
        { id: 3, name: 'Bob Johnson', exams: [78, 82, 88, 75, 80, 85, 79, 81] },
    ])

    const [editState, setEditState] = useState<EditState | null>(null)

    const handleEdit = (studentId: number, examIndex: number, value: number) => {
        setEditState({ studentId, examIndex, value: value.toString() })
    }

    const handleCancel = () => {
        setEditState(null)
    }

    const handleChange = (value: string) => {
        if (editState) {
            const numValue = parseInt(value)
            if (!isNaN(numValue) && numValue >= 0 && numValue <= 100) {
                setEditState({ ...editState, value })
            }
        }
    }

    const handleSubmit = async () => {
        if (!editState) return

        try {
            const { studentId, examIndex, value } = editState
            const numValue = parseInt(value)

            // In a real application, you would send this to your API
            // await axios.put(`/api/students/${studentId}/exams/${examIndex}`, { score: numValue })

            setStudents(students.map(student =>
                student.id === studentId
                    ? { ...student, exams: student.exams.map((exam, index) => index === examIndex ? numValue : exam) }
                    : student
            ))
            setEditState(null)
        } catch (error) {
            console.error('Error updating exam score:', error)
        }
    }

    const getScoreColor = (score: number) => {
        if (score >= 90) return 'text-green-600'
        if (score >= 80) return 'text-blue-600'
        if (score >= 70) return 'text-yellow-600'
        return 'text-red-600'
    }

    return (
        <>
            <AdminLayout>
                <Head title="Admin - Manajemen Periode Praktikum" />
                <CardTitle>
                    Manajemen Nilai Praktikum
                </CardTitle>
                <CardDescription>
                    Data Nilai Praktikum
                </CardDescription>
                {/*<div className="flex flex-col lg:flex-row gap-2 items-start justify-between">*/}
                {/*    <AlertDialog open={ openCreateForm } onOpenChange={ setOpenCreateForm }>*/}
                {/*        <AlertDialogTrigger asChild>*/}
                {/*            <Button className="mt-4">*/}
                {/*                Buat <Plus/>*/}
                {/*            </Button>*/}
                {/*        </AlertDialogTrigger>*/}
                {/*        <AlertDialogContent className="sm:max-w-[425px]" onOpenAutoFocus={ (e) => e.preventDefault() }>*/}
                {/*            <AlertDialogHeader>*/}
                {/*                <AlertDialogTitle>*/}
                {/*                    Tambah Periode Praktikum*/}
                {/*                </AlertDialogTitle>*/}
                {/*                <AlertDialogDescription>*/}
                {/*                    Periode praktikum seperti "XXXVIII" dalam angka romawi*/}
                {/*                </AlertDialogDescription>*/}
                {/*            </AlertDialogHeader>*/}
                {/*            <form className={ cn("grid items-start gap-4") } onSubmit={ handleCreateFormSubmit }>*/}
                {/*                <div className="grid gap-2">*/}
                {/*                    <Label htmlFor="nama">Nama Periode Praktikum</Label>*/}
                {/*                    <Input*/}
                {/*                        type="text"*/}
                {/*                        name="nama"*/}
                {/*                        id="nama"*/}
                {/*                        value={ createForm.nama }*/}
                {/*                        onChange={ (event) => setCreateForm((prevState) => ({*/}
                {/*                            ...prevState,*/}
                {/*                            nama: event.target.value*/}
                {/*                        })) }*/}
                {/*                    />*/}
                {/*                </div>*/}
                {/*                <Button type="submit" disabled={createForm.onSubmit}>*/}
                {/*                    { createForm.onSubmit*/}
                {/*                        ? (*/}
                {/*                            <>Memproses <Loader2 className="animate-spin" /></>*/}
                {/*                        ) : (*/}
                {/*                            <span>Simpan</span>*/}
                {/*                        )*/}
                {/*                    }*/}
                {/*                </Button>*/}
                {/*            </form>*/}
                {/*        </AlertDialogContent>*/}
                {/*    </AlertDialog>*/}
                {/*    <TableSearchForm table={ table }/>*/}
                {/*</div>*/}
                <div className="rounded-md border overflow-x-auto">
                    <Table className="overflow-x-auto">
                        <TableHeader>
                            <TableRow>
                                <TableHead>Name</TableHead>
                                { [ 1, 2, 3, 4, 5, 6, 7, 8 ].map(examNum => (
                                    <TableHead key={ examNum } className="text-center">Exam { examNum }</TableHead>
                                )) }
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            { students.map(student => (
                                <TableRow key={ student.id }>
                                    <TableCell className="font-medium">{ student.name }</TableCell>
                                    { student.exams.map((score, index) => (
                                        <TableCell key={ index } className="text-center">
                                            <div className="flex items-center justify-center space-x-2">
                                                { editState?.studentId === student.id && editState.examIndex === index ? (
                                                    <Input
                                                        value={ editState.value }
                                                        onChange={ (e) => handleChange(e.target.value) }
                                                        className="w-16 text-center"
                                                    />
                                                ) : (
                                                    <span
                                                        className={ `font-medium ${ getScoreColor(score) }` }>{ score }</span>
                                                ) }
                                                { editState?.studentId === student.id && editState.examIndex === index ? (
                                                    <div className="space-x-1">
                                                        <Button size="icon" onClick={ handleSubmit }
                                                                className="h-8 w-8 bg-green-500 hover:bg-green-600">
                                                            <Save className="h-4 w-4"/>
                                                        </Button>
                                                        <Button size="icon" onClick={ handleCancel }
                                                                variant="outline"
                                                                className="h-8 w-8">
                                                            <X className="h-4 w-4"/>
                                                        </Button>
                                                    </div>
                                                ) : (
                                                    <Button size="icon"
                                                            onClick={ () => handleEdit(student.id, index, score) }
                                                            variant="ghost" className="h-8 w-8">
                                                        <Edit2 className="h-4 w-4"/>
                                                    </Button>
                                                ) }
                                            </div>
                                        </TableCell>
                                    )) }
                                </TableRow>
                            )) }
                        </TableBody>
                    </Table>
                    { editState && parseInt(editState.value) > 100 && (
                        <div className="mt-4 p-2 bg-yellow-100 border border-yellow-400 rounded flex items-center">
                            <AlertTriangle className="h-5 w-5 text-yellow-700 mr-2"/>
                            <span className="text-yellow-700">Warning: Score cannot exceed 100.</span>
                        </div>
                    ) }
                </div>
                <div className="flex items-center justify-end space-x-2 py-4">
                    <ViewPerPage className="flex-1"/>
                    {/*<div className="space-x-2">*/}
                    {/*    <Button*/}
                    {/*        variant="outline"*/}
                    {/*        size="sm"*/}
                    {/*        onClick={ () => table.previousPage() }*/}
                    {/*        disabled={ !table.getCanPreviousPage() }*/}
                    {/*    >*/}
                    {/*        Previous*/}
                    {/*    </Button>*/}
                    {/*    <Button*/}
                    {/*        variant="outline"*/}
                    {/*        size="sm"*/}
                    {/*        onClick={ () => table.nextPage() }*/}
                    {/*        disabled={ !table.getCanNextPage() }*/}
                    {/*    >*/}
                    {/*        Next*/}
                    {/*    </Button>*/}
                    {/*</div>*/}
                </div>
            </AdminLayout>
        </>
    );
}
