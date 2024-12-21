import { AdminLayout } from "@/layouts/AdminLayout";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowRight, BookOpenText, FolderSync } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { MahiruCirle } from "@/lib/StaticImagesLib";
import {
    ChartConfig,
    ChartContainer,
    ChartLegend,
    ChartLegendContent,
    ChartTooltip,
    ChartTooltipContent
} from "@/components/ui/chart";
import { Bar, BarChart, CartesianGrid, XAxis } from "recharts";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Head } from "@inertiajs/react";
import * as React from "react";

export default function AdminDashboardPage() {
    const KuisAktif = [
        {
            nama: 'Kuis Pertemuan 1 - SO XXXVIII',
            praktikum: 'Sistem Operasi XXXVIII'
        },
        {
            nama: 'Kuis Pertemuan 2 - SO XXXVIII',
            praktikum: 'Sistem Operasi XXXVIII'
        },
        {
            nama: 'Kuis Pertemuan 3 - SO XXXVIII',
            praktikum: 'Sistem Operasi XXXVIII'
        },
        {
            nama: 'Kuis Pertemuan 4 - SO XXXVIII',
            praktikum: 'Sistem Operasi XXXVIII'
        },
        {
            nama: 'Kuis Pertemuan 1 - Jarkom XXXVIII',
            praktikum: 'Jaringan Komputer XXXVIII'
        },
    ];
    const AslabAktif = [
        { npm: '06.2021.1.07397', nama: 'Mochamad Luthfan Rianda Putra' },
        { npm: '06.2021.1.07434', nama: 'Indy Adira Khalfani' },
        { npm: '06.2021.1.07461', nama: 'Latiful Sirri' },
        { npm: '06.2021.1.07482', nama: 'Chatarina natassya putri' },
        { npm: '06.2022.1.07587', nama: 'Afzal Musyaffa Lathif Ashrafil Adam' },
        { npm: '06.2022.1.07590', nama: 'Windi Nitasya Lubis' },
        { npm: '06.2022.1.07610', nama: 'Marikh kasiful izzat' },
        { npm: '06.2022.1.07626', nama: 'Gregoria Stefania Kue Siga' }
    ];

    const chartDataPraktikum = [
        { praktikum: "Sistem Operasi XXXVI", lulus: 90, gugur: 7 },
        { praktikum: "Jaringan Komputer XXXVI", lulus: 83, gugur: 2 },
        { praktikum: "Sistem Operasi XXXVII", lulus: 85, gugur: 21 },
        { praktikum: "Jaringan Komputer XXXVII", lulus: 93, gugur: 3 },
        { praktikum: "Sistem Operasi XXXVIII", lulus: 80, gugur: 8 },
        { praktikum: "Jaringan Komputer XXXVIII", lulus: 0, gugur: 0 },
    ];

    const chartConfig = {
        lulus: {
            label: "Lulus",
            color: "#2563eb",
        },
        gugur: {
            label: "Gugur",
            color: "#f87171",
        },
    } satisfies ChartConfig;

    return (
        <>
            <AdminLayout>
                <Head title="Admin - Dashboard" />
                <div className="flex flex-col lg:flex-row gap-3">
                    <Card className="flex flex-col w-full lg:w-2/3 lg:min-w-[26rem] h-[27rem] lg:h-[32rem] overflow-y-auto rounded">
                        <ScrollArea>
                            <CardHeader>
                                <CardTitle>Sesi Kuis Aktif</CardTitle>
                                <CardDescription>
                                    { KuisAktif.length } Sesi aktif mendatang
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="grid gap-4">
                                {
                                    KuisAktif.map((kuis, index) => ((
                                        <div key={index} className="flex items-center space-x-4 rounded-md border p-4 truncate [&_p]:truncate">
                                            <BookOpenText/>
                                            <div className="space-y-1 flex-1 truncate overflow-hidden">
                                                <p className="text-sm font-medium leading-none">
                                                    { kuis.nama }
                                                </p>
                                                <p className="text-sm text-muted-foreground">
                                                    { kuis.praktikum }
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
                                    )))
                                }
                            </CardContent>
                            <CardFooter className="mt-auto">
                                <Button className="w-full">
                                    Manajemen Kuis <ArrowRight/>
                                </Button>
                            </CardFooter>
                        </ScrollArea>
                    </Card>
                    <Card className="flex flex-col w-full lg:w-1/3 lg:min-w-[23rem] h-[27rem] lg:h-[32rem] overflow-y-auto rounded">
                        <ScrollArea>
                            <CardHeader>
                                <CardTitle>Aslab Aktif</CardTitle>
                                <CardDescription>
                                    { AslabAktif.length } Aslab aktif saat ini
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="grid gap-4">
                                {
                                    AslabAktif.map((aslab, index) => ((
                                        <div key={index} className="flex items-center space-x-4 rounded-md border p-4 truncate [&_p]:truncate">
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
                                            </div>
                                        </div>
                                    )))
                                }
                            </CardContent>
                            <CardFooter className="mt-auto">
                                <Button className="w-full">
                                    Manajemen Aslab <ArrowRight/>
                                </Button>
                            </CardFooter>
                        </ScrollArea>
                    </Card>
                </div>
                <div className="w-full flex flex-col lg:flex-row gap-3">
                    <Card className="p-3 content-center w-full lg:w-2/3 lg:min-w-[26rem] min-h-80 lg:min-h-[30rem] rounded">
                        <ScrollArea>
                            <CardHeader>
                                <CardTitle>Statistik Praktikum terbaru</CardTitle>
                                <CardDescription>
                                    Data kelulusan { chartDataPraktikum.length } praktikum terbaru
                                </CardDescription>
                            </CardHeader>
                            <ChartContainer config={ chartConfig } className="min-h-[200px] w-80 md:w-[38rem] md:min-w-96 lg:w-[38rem] mx-auto">
                                <BarChart accessibilityLayer data={ chartDataPraktikum }>
                                    <CartesianGrid vertical={ false }/>
                                    <XAxis
                                        dataKey="praktikum"
                                        tickLine={ false }
                                        tickMargin={ 10 }
                                        axisLine={ false }
                                        tickFormatter={(value) => {
                                            const words = value.split(" ");
                                            const initials = words[0][0] + words[1][0];
                                            return `${initials}-${words.slice(-1)[0]}`;
                                        }}
                                    />
                                    <ChartTooltip content={ <ChartTooltipContent/> }/>
                                    <ChartLegend content={ <ChartLegendContent/> }/>
                                    <Bar dataKey="lulus" fill="var(--color-lulus)" radius={ 4 }/>
                                    <Bar dataKey="gugur" fill="var(--color-gugur)" radius={ 4 }/>
                                </BarChart>
                            </ChartContainer>
                        </ScrollArea>
                    </Card>
                    <Card className="flex flex-col w-full lg:w-1/3 lg:min-w-[23rem] h-[30rem] overflow-y-auto rounded">
                       <ScrollArea>
                           <CardHeader>
                               <CardTitle>Aslab Aktif (SARAN KONTEN?)</CardTitle>
                               <CardDescription>
                                   { AslabAktif.length } Aslab aktif saat ini
                               </CardDescription>
                           </CardHeader>
                           <CardContent className="grid gap-4">
                               {
                                   AslabAktif.map((aslab, index) => ((
                                       <div key={index} className="flex items-center space-x-4 rounded-md border p-4 truncate [&_p]:truncate">
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
                                           </div>
                                       </div>
                                   )))
                               }
                           </CardContent>
                           <CardFooter className="mt-auto">
                               <Button className="w-full">
                                   Manajemen Aslab <ArrowRight/>
                               </Button>
                           </CardFooter>
                       </ScrollArea>
                    </Card>
                </div>
            </AdminLayout>
        </>
    )
}
