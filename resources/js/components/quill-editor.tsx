import React, { useEffect, useRef, useState } from "react";
import Quill, { Delta } from "quill";
import "quill/dist/quill.snow.css";

export const QuillEditor = ({ value, onValueChange, }: {
    value?: Delta;
    onValueChange: (value: Delta) => void;
}) => {
    const quillRef = useRef<HTMLDivElement>(null);
    const [quillInstance, setQuillInstance] = useState<Quill | null>(null);

    useEffect(() => {
        if (quillRef.current && !quillInstance) {
            const quill = new Quill(quillRef.current, {
                theme: "snow",
                modules: {
                    toolbar: [
                        ["bold", "italic", "underline"],
                        [{ list: "ordered" }, { list: "bullet" }],
                        ["link"],
                    ],
                },
            });

            quill.on("text-change", () => {
                const delta = quill.getContents();
                if (onValueChange) {
                    onValueChange(delta);
                }
            });

            setQuillInstance(quill);
        }
    }, [quillRef, quillInstance, onValueChange]);

    useEffect(() => {
        if (quillInstance && value) {
            const currentContent = quillInstance.getContents();
            if (JSON.stringify(currentContent) !== JSON.stringify(value)) {
                quillInstance.setContents(value);
            }
        }
    }, [quillInstance, value]);

    return (
        <div>
            <div id="toolbar"></div>
            <div ref={ quillRef } style={ { height: "100px" } }></div>
        </div>
    );
};
