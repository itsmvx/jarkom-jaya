import { PraktikanLayout } from "@/layouts/PraktikanLayout";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowRight, BookOpenText, FolderSync } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { MahiruCirle } from "@/lib/StaticImagesLib";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Head, router } from "@inertiajs/react";
import * as React from "react";
import { PageProps } from "@/types";
import ErrorPage from "@/Pages/ErrorPage";

export default function PraktikanDashboardPage({ auth, aslabs, kuis, praktikums }: PageProps<{
    aslabs: {
        nama: string;
        npm: string;
        jabatan: string;
    }[];
    kuis: {
        id: string;
        nama: string;
        praktikum: {
            id: string;
            nama: string;
        };
    }[];
    praktikums: {
        id: string;
        nama: string;
        status: 0 | 1;
    }[];
}>) {
    if (!auth.user) {
        return (
            <ErrorPage status={401} />
        );
    }

    return (
        <>
            <PraktikanLayout auth={auth}>
                <Head title="Dashboard" />
                <div className="flex flex-col lg:flex-row gap-3">
                    <Card className="flex flex-col w-full lg:w-2/3 lg:min-w-[26rem] h-[27rem] lg:h-[32rem] overflow-y-auto rounded">
                        <CardHeader>
                            <CardTitle>Jadwal Kuis</CardTitle>
                            <CardDescription>
                                { kuis.length } Kuis mendatang
                            </CardDescription>
                        </CardHeader>
                        <ScrollArea>
                            <CardContent className="grid gap-4">
                                {
                                    kuis.length > 0 ? kuis.map((kuis, index) => ((
                                        <div key={index} className="flex items-center space-x-4 rounded-md border p-4 truncate [&_p]:truncate">
                                            <BookOpenText/>
                                            <div className="space-y-1 flex-1 truncate overflow-hidden">
                                                <p className="text-sm font-medium leading-none">
                                                    { kuis.nama }
                                                </p>
                                                <p className="text-sm text-muted-foreground">
                                                    { kuis.praktikum.nama }
                                                </p>
                                            </div>
                                            <TooltipProvider>
                                                <Tooltip>
                                                    <TooltipTrigger>
                                                        <FolderSync/>
                                                    </TooltipTrigger>
                                                    <TooltipContent>
                                                        Detail Kuis
                                                    </TooltipContent>
                                                </Tooltip>
                                            </TooltipProvider>
                                        </div>
                                    ))) : (
                                        <div
                                            className="flex items-center space-x-4 rounded-md border p-3 truncate [&_p]:truncate">
                                            <p className="text-sm font-medium text-muted-foreground/80">
                                                Tidak ada kuis mendatang
                                            </p>
                                        </div>
                                    )
                                }
                            </CardContent>
                        </ScrollArea>
                        <CardFooter className="mt-auto">
                            <Button className="w-full">
                                Manajemen Kuis <ArrowRight/>
                            </Button>
                        </CardFooter>
                    </Card>
                    <Card className="flex flex-col w-full lg:w-1/3 lg:min-w-[23rem] h-[27rem] lg:h-[32rem] overflow-y-auto rounded">
                        <CardHeader>
                            <CardTitle>Aslab Aktif</CardTitle>
                            <CardDescription>
                                { aslabs.length } Aslab aktif saat ini
                            </CardDescription>
                        </CardHeader>
                        <ScrollArea>
                            <CardContent className="grid gap-4">
                                {
                                    aslabs.map((aslab, index) => ((
                                        <div key={ index }
                                             className="flex items-center space-x-4 rounded-md border p-4 truncate [&_p]:truncate">
                                            <div className="h-7">
                                                <img src={ MahiruCirle } alt="profile" width={ 30 }/>
                                            </div>
                                            <div className="space-y-1 flex-1 truncate overflow-hidden">
                                                <p className="text-sm font-medium leading-none">
                                                    { aslab.nama }
                                                </p>
                                                <p className="text-sm text-muted-foreground">
                                                    { aslab.npm }
                                                </p>
                                                <p className="!-mt-0.5 text-sm text-muted-foreground">
                                                    { aslab.jabatan }
                                                </p>
                                            </div>
                                        </div>
                                    )))
                                }
                            </CardContent>
                        </ScrollArea>
                        <CardFooter className="mt-auto">
                            <Button className="w-full" onClick={() => router.visit(route('admin.aslab.index'))}>
                                Manajemen Aslab <ArrowRight/>
                            </Button>
                        </CardFooter>
                    </Card>
                </div>
            </PraktikanLayout>
        </>
    );
}
