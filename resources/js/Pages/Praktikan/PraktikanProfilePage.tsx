import { PraktikanLayout } from "@/layouts/PraktikanLayout";
import { AvatarUpload } from "@/components/avatar-upload";
import { PageProps } from "@/types";
import ErrorPage from "@/Pages/ErrorPage";
import { cn } from "@/lib/utils";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { FormEvent, useState } from "react";
import { z } from "zod";
import axios, { AxiosError } from "axios";
import { Head, router } from "@inertiajs/react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
    AlertDialog, AlertDialogAction, AlertDialogCancel,
    AlertDialogContent, AlertDialogDescription, AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog";

export default function PraktikanProfilePage({ auth, praktikan }: PageProps<{
    praktikan: {
        id: string;
        nama: string;
        npm: string;
        username: string;
        jenis_kelamin: string | null;
        avatar: string | null;
    };
}>) {
    const authUser = auth.user;
    if (!authUser) {
        return (
            <ErrorPage status={401} />
        );
    }
    const { toast } = useToast();
    type UpdateForm = {
        nama: string;
        npm: string;
        username: string;
        jenis_kelamin: string | null;
        onSubmit: boolean;
    };

    const [ updateForm, setUpdateForm ] = useState<UpdateForm>({
        nama: praktikan.nama,
        npm: praktikan?.npm ?? '',
        username: praktikan?.username ?? '',
        jenis_kelamin: praktikan.jenis_kelamin,
        onSubmit: false
    });
    const [ isOnChange, setIsOnChange ] = useState(false);

    const handleUpdateForm = (key: keyof UpdateForm, value: string | boolean | number | null) => {
        const payload = {
            [key]: value,
        };

        if (key === 'jenis_kelamin' && value === 'anomali') {
            setOpenAnomaliGender(true);
            handleAnomaliGender('onChallenge', true);
        }

        setUpdateForm((prevState) => {
            const newState = { ...prevState, ...payload };
            const latestState = {
                nama: praktikan.nama,
                npm: praktikan.npm,
                username: praktikan.username,
                onSubmit: false
            }
            if (JSON.stringify(newState) !== JSON.stringify(latestState)) {
                setIsOnChange(true);
            } else {
                setIsOnChange(false);
            }

            return newState;
        });
    };
    const handleUpdateFormSubmit = (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        setUpdateForm((prevState) => ({ ...prevState, onSubmit: true }));
        const { nama, npm, username } = updateForm;
        const createSchema = z.object({
            nama: z.string({ message: 'Format nama Praktikan tidak valid! '}).min(1, { message: 'Nama Praktikan wajib diisi!' }),
            npm: z.string({ message: 'Format NPM Praktikan tidak valid! '}).min(1, { message: 'NPM Praktikan wajib diisi!' }),
            username: z.string({ message: 'Format Username Praktikan tidak valid! '}).min(1, { message: 'Username Praktikan wajib diisi!' }),
        });
        const createParse = createSchema.safeParse({
            nama: nama,
            npm: npm,
            username: username,
        });
        if (!createParse.success) {
            const errMsg = createParse.error.issues[0]?.message;
            toast({
                variant: "destructive",
                title: "Periksa kembali Input anda!",
                description: errMsg,
            });
            setUpdateForm((prevState) => ({ ...prevState, onSubmit: false }));
            return;
        }

        axios.post<{
            message: string;
        }>(route('praktikan.update'), {
            id: praktikan.id,
            nama: nama,
            npm: npm,
            username: username,
        })
            .then((res) => {
                toast({
                    variant: 'default',
                    className: 'bg-green-500 text-white',
                    title: "Berhasil!",
                    description: res.data.message,
                });
                router.reload({ only: ['praktikan'] });
                setUpdateForm((prevState) => ({
                    ...prevState,
                    onSubmit: false
                }))
                setIsOnChange(false);
            })
            .catch((err: unknown) => {
                const errMsg: string = err instanceof AxiosError && err.response?.data?.message
                    ? err.response.data.message
                    : 'Error tidak diketahui terjadi!';
                setUpdateForm((prevState) => ({ ...prevState, onSubmit: false }));
                toast({
                    variant: "destructive",
                    title: "Permintaan gagal diproses!",
                    description: errMsg,
                });
            });
    };
    const handleUploadAvatar = (file: File) => {
        const formData = new FormData();
        formData.append('avatar', file);
        formData.append('id', praktikan.id);
        axios.post<{
            message: string;
            avatar_url: string;
        }>(route('praktikan.upload-avatar'), formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        })
            .then((res) => {
                toast({
                    variant: 'default',
                    className: 'bg-green-500 text-white',
                    title: "Berhasil!",
                    description: res.data.message,
                });
                router.reload({ only: ['praktikan'] });
            })
            .catch((err: unknown) => {
                const errMsg: string = err instanceof AxiosError && err.response?.data?.message
                    ? err.response.data.message
                    : 'Error tidak diketahui terjadi!';
                toast({
                    variant: "destructive",
                    title: "Permintaan gagal diproses!",
                    description: errMsg,
                });
            })
    };

    type AnomaliGender = {
        value: string;
        onChallenge: boolean;
        onSkadoosh: boolean;
    };
    const anomaliGenderInit: AnomaliGender = {
        value: '',
        onChallenge: false,
        onSkadoosh: false
    };
    const [ anomaliGender, setAnomaliGender ] = useState<AnomaliGender>(anomaliGenderInit);
    const [ openAnomaliGender, setOpenAnomaliGender ] = useState<boolean>(false);
    const [ acceptAnomaliGender, setAcceptAnomaliGender ] = useState<boolean>(false);
    const handleAnomaliGender = (key: keyof AnomaliGender, value: string | boolean) => {
        setAnomaliGender((prevState) => ({ ...prevState, [key]: value }));
    };
    const handleCancelAnomaliGender = () => {
        setAnomaliGender(anomaliGenderInit);
        handleUpdateForm('jenis_kelamin', praktikan.jenis_kelamin);
    };
    const handleAcceptAnomaliGender = () => {
        axios.post(route('praktikan.add-ban-list'), {
            id: praktikan.id,
            alasan: 'Indikasi Pelangi'
        })
            .then(() => {
                router.visit(route('ban-list'));
            })
            .catch(() => {
                setOpenAnomaliGender(false);
                handleCancelAnomaliGender();
                toast({
                    variant: "destructive",
                    title: "Internal Server error!",
                    description: 'Terjadi error ketika memproses permintaanmu King!',
                });
            })
    };

    return (
        <>
            <PraktikanLayout authUser={ authUser }>
                <Head title="Praktikan - Profil" />
                <AvatarUpload avatarSrc={praktikan.avatar ? `/storage/praktikan/${praktikan.avatar}` : undefined} onUpload={handleUploadAvatar} />
                <form className={ cn("grid items-start gap-4") } onSubmit={ handleUpdateFormSubmit }>
                    <div className="flex flex-col md:flex-row md:flex-wrap gap-3 md:items-center *:grow">
                        <div className="grid gap-2 min-w-80">
                            <Label htmlFor="nama">Nama Praktikan</Label>
                            <Input
                                type="text"
                                name="nama"
                                id="nama"
                                value={ updateForm.nama }
                                className="text-sm cursor-not-allowed"
                                readOnly
                            />
                        </div>
                        <div className="grid gap-2 min-w-80">
                            <Label htmlFor="npm">NPM Praktikan</Label>
                            <Input
                                type="text"
                                name="npm"
                                id="npm"
                                placeholder="06.20xx.1.xxxx"
                                value={ updateForm.npm }
                                className="text-sm cursor-not-allowed"
                                readOnly
                            />
                        </div>
                    </div>
                    <div className="flex flex-col md:flex-row md:flex-wrap gap-3 md:items-center *:grow">
                        <div className="grid gap-2 min-w-80">
                            <Label htmlFor="nama">Username</Label>
                            <Input
                                type="text"
                                name="username"
                                id="username"
                                value={ updateForm.username }
                                onChange={ (event) => handleUpdateForm('username', event.target.value) }
                                className="text-sm"
                                placeholder="Belum ditentukan"
                            />
                        </div>
                        <div className="grid gap-2 min-w-80">
                            <Label htmlFor="npm">Jenis kelamin</Label>
                            <Select value={updateForm.jenis_kelamin ?? ''} onValueChange={(val) => handleUpdateForm('jenis_kelamin', val)}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Pilih salah satu.." />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="Laki-Laki">Laki-Laki</SelectItem>
                                    <SelectItem value="Perempuan">Perempuan</SelectItem>
                                    <SelectItem value="anomali">Saya bukan keduanya...</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>
                    <Button type="submit" disabled={ updateForm.onSubmit || !updateForm.nama || !updateForm.npm || !updateForm.username || !isOnChange }>
                        { updateForm.onSubmit
                            ? (
                                <>Memproses <Loader2 className="animate-spin"/></>
                            ) : (
                                <span>Simpan</span>
                            )
                        }
                    </Button>
                </form>

                <AlertDialog open={openAnomaliGender} onOpenChange={ (open) => !open && handleCancelAnomaliGender() }>
                    <AlertDialogContent>
                        <AlertDialogHeader>
                            <AlertDialogTitle>{anomaliGender.onChallenge ? 'Apakah Tru brodi?' : 'Oke, Kamu dikenali sebagai apa King?'}</AlertDialogTitle>
                            <AlertDialogDescription className="min-h-16 text-gray-800 antialiased flex items-center justify-center">
                                { anomaliGender.onChallenge ? (
                                    <span>Jika iya, mohon maafkan ketidaktahuan kroco ini 😓 Silahkan melanjutkan.. tapi jangan lupa membawa mahkota mu yang terjatuh King👑</span>
                                ) : (
                                    <Input
                                        type="text"
                                        name="anomali"
                                        id="anomali"
                                        value={ anomaliGender.value }
                                        onChange={ (event) => handleAnomaliGender('value', event.target.value) }
                                        className="text-sm"
                                        placeholder="Silahkan ditulis King..."
                                    />
                                ) }
                            </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                            <AlertDialogCancel onClick={ () => setOpenAnomaliGender(false) }>Batal</AlertDialogCancel>
                            <AlertDialogAction
                                className="min-w-28"
                                disabled={ !anomaliGender.onChallenge && !anomaliGender.value }
                                onClick={ () => {
                                    if (anomaliGender.onChallenge) {
                                        handleAnomaliGender('onChallenge', false);
                                        return;
                                    }
                                    handleAcceptAnomaliGender();
                                }}
                            >
                                { anomaliGender.onChallenge ? 'Lanjutkan' : 'Submit' }
                            </AlertDialogAction>
                        </AlertDialogFooter>
                    </AlertDialogContent>
                </AlertDialog>
            </PraktikanLayout>
        </>
    );
}
