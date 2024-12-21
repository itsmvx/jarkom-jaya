import React, { useEffect, useRef, useState } from "react";
import Quill, { Delta } from "quill";
import "quill/dist/quill.snow.css";

export const QuillEditor = ({ value, onValueChange }: {
    value?: Delta;
    onValueChange: (value: Delta) => void;
}) => {
    const quillRef = useRef<HTMLDivElement>(null);
    const [ editorContent, setEditorContent ] = useState<Delta>(value ?? { ops: [{ insert: "\n" }] } as Delta);

    useEffect(() => {
        if (quillRef.current) {
            const quill = new Quill(quillRef.current, {
                theme: "snow",
                modules: {
                    toolbar: [
                        ["bold", "italic", "underline"],
                        [{ list: "ordered" }, { list: "bullet" }],
                        ["link", "image"],
                    ],
                },
            });
            quill.on("text-change", () => {
                const delta = quill.getContents();
                setEditorContent(delta);
            });
        }
    }, []);
    useEffect(() => {
        if (onValueChange) {
            onValueChange(editorContent);
        }
    }, [ editorContent ]);

    return (
        <div>
            <div id="toolbar"></div>
            <div ref={quillRef} style={{ height: "100px" }}></div>
        </div>
    );
};
