import { useState, useEffect, ReactNode } from 'react';
import { Bell } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Glacio, Havoc, Spectro } from "@/lib/StaticImagesLib";

export const AppLayout = ({ children }: {
    children: ReactNode;
}) => {
    const [isOpen, setIsOpen] = useState(false);

    useEffect(() => {
        const hasVisited = localStorage.getItem('hasVisited')
        if (!hasVisited) {
            setIsOpen(true)
            localStorage.setItem('hasVisited', 'true')
        }
    }, []);

    return (
        <>
            { children }
            <Dialog open={isOpen} onOpenChange={setIsOpen}>
                <DialogContent className="sm:max-w-[425px]">
                    <DialogHeader>
                        <DialogTitle className="flex items-center gap-2">
                            <Bell className="h-6 w-6 text-blue-600" />
                            Selamat Datang di Jarkom Jaya!
                        </DialogTitle>
                        <DialogDescription className="!mt-4 text-gray-900 font-medium">
                            Website ini masih dalam pengembangan, mohon masukan dan sarannya juga untuk pengembangan website ini😁
                            <br/>
                            <br/>
                            Untuk keperluan testing, sudah ada beberapa fitur yang sudah bisa digunakan
                        </DialogDescription>
                    </DialogHeader>
                    <ul className="pb-4 space-y-3">
                        <li className="grid grid-cols-12 gap-1 text-sm text-gray-800">
                            <img
                                src={ Spectro }
                                width={ 25 }
                                alt="spectro"
                                className="col-span-1"
                            />
                            <p className="col-span-11">
                                <strong> Halaman Admin</strong>, tinggal klik Masuk di pojok kanan atas navbar, di
                                halaman login langsung klik Masuk di formnya tanpa username atau password
                            </p>
                        </li>
                        <li className="grid grid-cols-12 gap-1 text-sm text-gray-800">
                            <img
                                src={ Havoc }
                                width={ 25 }
                                alt="spectro"
                                className="col-span-1"
                            />
                            <p className="col-span-11">
                                <strong>Operasi CRUD Admin</strong>, sudah terkoneksi ke Database sih.. bisa dicoba
                                untuk operasi CRUD nya
                            </p>
                        </li>
                        <li className="grid grid-cols-12 gap-1 text-sm text-gray-800">
                            <img
                                src={ Glacio }
                                width={ 25 }
                                alt="spectro"
                                className="col-span-1"
                            />
                            <p className="col-span-11">
                                <strong>Lorem ipsum dolor sit amet,</strong>, consectetur adipiscing elit
                            </p>
                        </li>
                    </ul>
                    <DialogFooter>
                        <Button onClick={ () => setIsOpen(false) } className="w-full">
                            Oke mint
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </>
    )
};
