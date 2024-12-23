import { useEffect, useState } from "react";
import { AdminLayout } from "@/layouts/AdminLayout";
import { ExcelUploader } from "@/components/excel-uploader";
import { Head, router } from "@inertiajs/react";
import { CardDescription, CardTitle, CardContent } from "@/components/ui/card";
import { QuillEditor } from "@/components/quill-editor";
import { AnswersEditor } from "@/components/answers-editor";
import * as XLSX from "xlsx";
import { Delta } from "quill";
import { useToast } from "@/hooks/use-toast";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { z } from "zod";
import axios, { AxiosError } from "axios";

type FileUpload = {
    file: File | null;
    onLoad: boolean;
    onInvalid: boolean;
    invalidMsg: string;
};

type AnswerOption = {
    value: string;
    label: string;
};

type FileContent = {
    id_modul: string | null;
    label: string[];
    pertanyaan: Delta;
    pilihan_jawaban: AnswerOption[];
    kunci_jawaban: string;
};

export default function AdminSoalCreateUploadPage({ moduls }: {
    moduls: {
        id: string; // UUID
        nama: string;
    }[];
}) {
    const mockModuls: {
        id: string;
        nama: string;
    }[] = [
        { id: "1e9c1c1d-4c2f-4a2d-9dcb-1e8e946a97b1", nama: "Modul 1" },
        { id: "2d8a2b2e-5d3f-5b3d-0ead-2d9f957b08c2", nama: "Modul 2" },
        { id: "3f7d3c3f-6e4f-6c4e-1fad-3e0a968c19d3", nama: "Modul 3" },
        { id: "4g6e4d4g-7f5f-7d5f-2gae-4f1b979d2ae4", nama: "Modul 4" },
        { id: "5h5f5e5h-8g6g-8e6g-3hbf-5g2c980e3bf5", nama: "Modul 5" },
        { id: "6i4g6f6i-9h7h-9f7h-4icg-6h3d991f4cg6", nama: "Modul 6" },
        { id: "7j3h7g7j-0i8i-0g8i-5jdh-7i4e102g5dh7", nama: "Modul 7" },
        { id: "8k2i8h8k-1j9j-1h9j-6kei-8j5f213h6ei8", nama: "Modul 8" },
    ];
    const { toast } = useToast();

    const fileUploadInit: FileUpload = {
        file: null,
        onLoad: false,
        onInvalid: false,
        invalidMsg: ''
    };
    const formInit = {
        onSubmit: false,
        onError: false,
        onInvalid: false,
        invalidMsg: '',
        errMsg: ''
    };

    const [fileUpload, setFileUpload] = useState<FileUpload>(fileUploadInit);
    const [fileContents, setFileContents] = useState<FileContent[]>([]);
    const [form, setForm] = useState(formInit);

    const handleSetFileUpload = (file: File) => {
        setFileUpload({
            file,
            onLoad: true,
            onInvalid: false,
            invalidMsg: "",
        });
    };

    const mapDataFileToContents = (row: any[]): FileContent => ({
        id_modul: mockModuls.find((modul) => modul.nama === row[0])?.id ?? null,
        label: [],
        pertanyaan: row[1] ? { ops: [{ insert: row[1] }] } as Delta : { ops: [{ insert: '' }] } as Delta,
        pilihan_jawaban: ["A", "B", "C", "D", "E"].map((key, index) => ({
            value: key,
            label: row[2 + index] ?? "",
        })),
        kunci_jawaban: row[7]?.toUpperCase() || "",
    });

    const soalSchema = z.object({
        id_modul: z.string().uuid().nullable(),
        pertanyaan: z.object({
            ops: z.array(
                z.object({
                    insert: z.string().min(1, "Pertanyaan tidak boleh kosong"),
                })
            ).min(1, "Pertanyaan harus memiliki minimal 1 elemen"),
        }),
        pilihan_jawaban: z
            .array(
                z.object({
                    value: z.string().min(1, "Jawaban harus memiliki key"),
                    label: z.string().min(1, "Pilihan jawaban tidak boleh kosong"),
                })
            )
            .min(2, "Harus ada minimal 2 pilihan jawaban"),
        kunci_jawaban: z.string().min(1, "Kunci jawaban tidak boleh kosong"),
    });

    const handleFormSubmit = () => {
        setForm((prevState) => ({ ...prevState, onSubmit: true }));
        const soalParse = z.array(soalSchema).safeParse(fileContents);
        if (!soalParse.success) {
            const errMsg = soalParse.error.issues[0]?.message;
            toast({
                variant: "destructive",
                title: "Periksa kembali Input anda!",
                description: errMsg,
            });
            setForm((prevState) => ({ ...prevState, onSubmit: false }));
            return;
        }
        const serializedData = fileContents.map((content) => ({
            ...content,
            pertanyaan: JSON.stringify(content.pertanyaan),
            pilihan_jawaban: JSON.stringify(content.pilihan_jawaban),
        }));

        axios
            .post<{
                message: string;
            }>(route("soal.create-mass"), {
                data: serializedData,
            })
            .then((res) => {
                setForm(formInit);
                toast({
                    variant: "default",
                    className: "bg-green-500 text-white",
                    title: "Berhasil!",
                    description: res.data.message,
                });
                router.visit(route("admin.kuis.soal.index"));
            })
            .catch((err: unknown) => {
                const errMsg: string =
                    err instanceof AxiosError && err.response?.data?.message
                        ? err.response.data.message
                        : "Error tidak diketahui terjadi!";
                setForm((prevState) => ({ ...prevState, onSubmit: false }));
                toast({
                    variant: "destructive",
                    title: "Permintaan gagal diproses!",
                    description: errMsg,
                });
            });
    };

    useEffect(() => {
        const handleFile = async () => {
            if (fileUpload.file && fileUpload.onLoad) {
                try {
                    const arrayBuffer = await fileUpload.file.arrayBuffer();
                    const workbook = XLSX.read(arrayBuffer);
                    const worksheet = workbook.Sheets[workbook.SheetNames[0]];
                    const raw_data: any[] = XLSX.utils.sheet_to_json(worksheet, { header: 1 });

                    if (raw_data.length > 0) {
                        const ACCEPT_HEADERS = [
                            "id_modul",
                            "pertanyaan",
                            "a",
                            "b",
                            "c",
                            "d",
                            "e",
                            "kunci_jawaban",
                        ];

                        let invalidHeader = "";
                        const isValidHeaders = raw_data[0]
                            .map((header: string) => header?.toLowerCase().trim())
                            .every((header: string, index: number) => {
                                if (header === ACCEPT_HEADERS[index]) {
                                    return true;
                                }
                                invalidHeader = header;
                                return false;
                            });

                        if (!isValidHeaders) {
                            toast({
                                variant: "destructive",
                                title: "Permintaan gagal diproses!",
                                description: `Header tidak valid: ${invalidHeader}`,
                            });
                            return;
                        }

                        const sanitizedData = raw_data.slice(1).filter((row) => row.length >= 8);
                        if (sanitizedData.length === 0) {
                            toast({
                                variant: "destructive",
                                title: "Gagal memproses file",
                                description: "File tidak memiliki data yang valid.",
                            });
                            return;
                        }

                        setFileContents(sanitizedData.map((data) => mapDataFileToContents(data)));
                    }
                } catch (error: unknown) {
                    const errMsg =
                        error instanceof Error ? error.message : "Gagal membaca dokumen.";
                    toast({
                        variant: "destructive",
                        title: "Permintaan gagal diproses!",
                        description: errMsg,
                    });
                } finally {
                    setFileUpload((prevState) => ({
                        ...prevState,
                        onLoad: false,
                    }));
                }
            }
        };
        handleFile();
    }, [fileUpload]);

    console.log(fileContents)

    return (
        <AdminLayout>
            <Head title="Admin - Upload Soal Kuis" />
            <CardTitle>Upload Soal Kuis</CardTitle>
            <CardDescription>Upload data soal kuis (excel)</CardDescription>

            {fileUpload.onLoad ? (
                <div className="flex items-center justify-center h-64">
                    <div className="text-center">
                        <Loader2  className="animate-spin h-10 w-10 text-blue-500 mx-auto" />
                        <p className="mt-4 text-gray-600">Memproses file, mohon tunggu...</p>
                    </div>
                </div>
            ) : fileContents.length > 0 ? (
                <div className="mt-6 space-y-6">
                    {fileContents.map((content, index) => (
                        <CardContent key={index} className="p-4 border rounded-md">
                            <div className="space-y-4">
                                <h3 className="text-lg font-bold">Soal {index + 1}</h3>
                                <QuillEditor
                                    value={content.pertanyaan}
                                    onValueChange={(value) => {
                                        const updated = [...fileContents];
                                        updated[index].pertanyaan = value;
                                        setFileContents(updated);
                                    }}
                                />
                                <AnswersEditor
                                    initialOptions={content.pilihan_jawaban}
                                    onOptionsChange={(options) => {
                                        const updated = [...fileContents];
                                        if (
                                            JSON.stringify(updated[index].pilihan_jawaban) !==
                                            JSON.stringify(options)
                                        ) {
                                            updated[index].pilihan_jawaban = options;
                                            setFileContents(updated);
                                        }
                                    }}
                                    initialCorrectAnswer={content.kunci_jawaban}
                                    onSelectCorrectAnswer={(correct) => {
                                        const updated = [...fileContents];
                                        if (updated[index].kunci_jawaban !== correct) {
                                            updated[index].kunci_jawaban = correct;
                                            setFileContents(updated);
                                        }
                                    }}
                                />
                            </div>
                        </CardContent>
                    ))}
                </div>
            ) : (
                <ExcelUploader
                    className="mt-4"
                    onFileUpload={(file) => handleSetFileUpload(file)}
                />
            )}
            <div className="my-3 flex items-center justify-end">
                <Button
                    onClick={handleFormSubmit}
                    disabled={form.onSubmit || fileContents.length === 0}
                    className={`${fileContents.length > 1 ? 'inline-flex' : 'hidden'}`}
                >
                    {form.onSubmit ? (
                        <div className="flex items-center space-x-2">
                            <Loader2 className="animate-spin h-4 w-4" />
                            <span>Memproses...</span>
                        </div>
                    ) : (
                        "Simpan euy"
                    )}
                </Button>
            </div>
        </AdminLayout>
    );
}
