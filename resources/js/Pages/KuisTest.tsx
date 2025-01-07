import { Card } from "@/components/ui/card";
import { AnswersRender } from "@/components/answers-render";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Separator } from "@/components/ui/separator";
import { ArrowBigLeft, ArrowBigRight, CircleCheck, LayoutGrid } from "lucide-react";
import { deltaParse, RenderQuillDelta } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";

type AnswerOption = {
    value: string;
    label: string;
};

type QuizState = {
    currentIndex: number;
    answers: { [id: string]: string };
};

export default function KuisTest({ soals }: {
    soals: {
        id: string;
        pertanyaan: string;
        pilihan_jawaban: string;
    }[];
}) {
    const DataSoal = useMemo(() => {
        return soals.map((soal) => ({
            id: soal.id,
            pertanyaan: deltaParse(soal.pertanyaan),
            pilihan_jawaban: JSON.parse(soal.pilihan_jawaban) as AnswerOption[],
        }));
    }, [soals]);

    const [quizState, setQuizState] = useState<QuizState>({
        currentIndex: 0,
        answers: {},
    });
    console.log(quizState)

    const handleNavigation = useCallback((direction: "forward" | "backward" | "custom", index?: number) => {
        setQuizState((prevState) => {
            const newIndex = (() => {
                if (direction === "forward") return (prevState.currentIndex + 1) % DataSoal.length;
                if (direction === "backward") return (prevState.currentIndex - 1 + DataSoal.length) % DataSoal.length;
                if (direction === "custom" && index !== undefined) return Math.max(0, Math.min(index, DataSoal.length - 1));
                return prevState.currentIndex;
            })();

            return { ...prevState, currentIndex: newIndex };
        });
    }, [DataSoal.length]);

    const handleAnswer = useCallback((id: string, value: string) => {
        setQuizState((prevState) => ({
            ...prevState,
            answers: { ...prevState.answers, [id]: value },
        }));
    }, []);

    const AnswerOptions = useMemo(() => {
        const currentSoal = DataSoal[quizState.currentIndex];
        const selectedAnswer = quizState.answers[currentSoal.id] || "";

        return (
            <AnswersRender
                options={currentSoal.pilihan_jawaban}
                selectedAnswer={selectedAnswer}
                onSelect={(value) => handleAnswer(currentSoal.id, value)}
            />
        );
    }, [DataSoal, quizState]);

    const [ sideSoalShow, setSideSoalShow ] = useState<boolean>(false);
    const [ sideJawabanShow, setSideJawabanShow ] = useState<boolean>(false);
    const sideSoalRef = useRef<HTMLElement | null>(null);
    const sideJawabanRef = useRef<HTMLElement | null>(null);

    const handleShowSideEl = (type: 'soal' | 'jawaban') => {
        switch (type) {
            case "soal": {
                setSideSoalShow((prevState) => !prevState);
                setSideJawabanShow(false);
            } break;
            case "jawaban": {
                setSideJawabanShow((prevState) => !prevState);
                setSideSoalShow(false);
            } break;
        }
    };

    useEffect(() => {
        const handleClick = (event: MouseEvent | TouchEvent) => {
            if (sideSoalRef.current && sideJawabanRef.current && event.target) {
                if (sideSoalShow && !sideSoalRef.current.contains(event.target as Node)) {
                    setSideSoalShow(false);
                } else if (sideJawabanShow && !sideJawabanRef.current.contains(event.target as Node)) {
                    setSideJawabanShow(false);
                }
            }
        };

        window.addEventListener('mouseup', handleClick);

        return () => window.removeEventListener('mouseup', handleClick);
    }, []);

    return (
        <>
            <div className="flex flex-col lg:flex-row gap-4 h-auto lg:h-screen bg-zinc-100 py-6 px-3">
                <aside data-show={ sideSoalShow } ref={ sideSoalRef } className="z-10 fixed -translate-x-full p-3 data-[show=true]:translate-x-0 lg:translate-x-0 left-0 lg:static w-2/3 sm:w-80 lg:w-72 top-0 bottom-0 flex flex-col gap-4 overflow-visible lg:overflow-hidden transition-all ease-in-out duration-200 my-card bg-white">
                    <Card className="my-card !border-[1.5px] w-full h-20 p-3 space-y-1 text-center">
                        <h3 className="font-medium text-xl">Waktu Tersisa</h3>
                        <div
                            className="flex flex-row items-center justify-center gap-2 font-bold text-blue-600 text-xl">
                            <p>17</p>
                            <span className="text-black">:</span>
                            <p>59</p>
                        </div>
                    </Card>
                    <button
                        className={ `fixed lg:hidden top-1/2 -translate-y-1/2 p-2 flex -right-11 items-end bg-zinc-600/40 rounded *:font-semibold *:font-sans` }
                        onClick={ () => handleShowSideEl('soal') }>
                        <LayoutGrid width={ 35 }/>
                    </button>
                    <ScrollArea>
                        <Card className="h-full overflow-y-auto p-4 shadow-[5px_5px_14px_0_rgba(31,45,61,0.10)] rounded border-[1px] border-zinc-200">
                            <div className="grid grid-cols-4 sm:grid-cols-5 lg:grid-cols-4 items-start content-start justify-start gap-2 overflow-y-auto">
                                { Array.from({ length: DataSoal.length }).map((_, index) => ((
                                    <Button key={index} onClick={ () => handleNavigation('custom', index) } className="w-8 sm:w-10 md:w-10 lg:w-12 h-8 sm:h-10 md:h-10 lg:h-12">
                                        { index + 1 }
                                    </Button>
                                ))) }
                            </div>
                        </Card>
                    </ScrollArea>
                    <div className="w-full px-3">
                        <Button disabled={ true } className="w-full h-12 md:h-14 rounded text-white text-lg font-semibold tracking-wider bg-green-600 hover:bg-green-600/80">
                            SELESAI
                        </Button>
                    </div>
                </aside>
                <main className="flex-1 h-full flex flex-col my-card bg-white min-h-[26rem] lg:min-h-0">
                    <header className="my-4 mx-3 flex flex-row justify-between font-medium text-muted-foreground/70 ">
                        <h6 className="text-base indent-2">
                            Soal { quizState.currentIndex + 1 } dari { DataSoal.length }
                        </h6>
                        <div className="flex flex-row gap-0.5 items-center text-xs">
                            <CircleCheck width={ 18 } color="green"/>
                            <p>Berhasil menyimpan</p>
                        </div>
                    </header>
                    <Separator className="my-3 bg-muted-foreground/70 h-0.5"/>
                    <div className="flex-1 py-1.5 px-3.5 overflow-y-auto">
                        <Card className="my-card !border-[1.5px] w-full h-80 min-h-72 py-2 overflow-y-auto">
                            <RenderQuillDelta
                                delta={ DataSoal[quizState.currentIndex].pertanyaan }
                                className="!items-start justify-center px-5 pt-1 pb-3"
                            />
                        </Card>
                    </div>
                    <div className="p-4 flex flex-row gap-0.5 items-center justify-between">
                        <Button className="w-36 h-11 transition-width" onClick={ () => handleNavigation("backward") }>
                            <ArrowBigLeft className="text-lg"/> <span>Sebelumnya</span>
                        </Button>
                        <Button className="w-36 h-11 transition-width" onClick={ () => handleNavigation("forward") }>
                            <ArrowBigRight className="text-lg"/> <span>Berikutnya</span>
                        </Button>
                    </div>
                </main>
                <aside className="w-full lg:w-80 h-full transition-width">
                    <Card className="my-card w-full h-full p-4 overflow-y-auto">
                        <ScrollArea>
                            { AnswerOptions }
                        </ScrollArea>
                    </Card>
                </aside>
            </div>
        </>
    );
}
