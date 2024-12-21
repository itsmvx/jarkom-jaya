import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import type { Delta } from "quill";
import { QuillDeltaToHtmlConverter } from 'quill-delta-to-html';
import parse from 'html-react-parser';

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs))
}
export const romanToNumber = (roman: string): number => {
    const map: Record<string, number> = {
        I: 1, V: 5, X: 10, L: 50, C: 100, D: 500, M: 1000,
    };
    let num = 0;
    let prevValue = 0;

    for (let i = roman.length - 1; i >= 0; i--) {
        const value = map[roman[i]];
        num += value < prevValue ? -value : value;
        prevValue = value;
    }
    return num;
};
export const deltaParse = (data: string): Delta => {
    try {
        const parsed = JSON.parse(data);
        if (parsed && typeof parsed === "object" && Array.isArray(parsed.ops)) {
            return parsed as Delta;
        }
    } catch (error) {
        console.warn("Invalid Delta format");
    }
    return { ops: [{ insert: "\n" }] } as Delta;
};

export const RenderQuillDelta = ({ delta, imgWidth = 32, className }: {
    delta: Delta;
    imgWidth?: number;
    className?: string;
}) => {
    const ops = Array.isArray(delta.ops) ? delta.ops : [];
    const converter = new QuillDeltaToHtmlConverter(ops, {
        paragraphTag: 'p',
        encodeHtml: false,
        multiLineParagraph: true,
    });
    const htmlContent: string = converter.convert();
    return (
        <>
            <div className={ `flex flex-col items-center justify-center *:*:w-${imgWidth} *:flex *:flex-col *:items-center *:justify-center *:*:rounded ${className as string}` }>
                {parse(htmlContent)}
            </div>
        </>
    );
};

