'use client';

import { useCallback, useRef, ChangeEvent, useState, useEffect, DragEvent, useMemo } from 'react';
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FileScan, Upload, ImageIcon, Trash2 } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";
import { Skeleton } from "@/components/ui/skeleton";

interface FileInputWithPreviewProps {
    id: string;
    value: File | null;
    onChange: (value: File | null) => void;
    allowedTypes: string[];
    placeholder?: string;
    errorMessage?: string;
}

export function FileInputWithPreview({ id, value, onChange, allowedTypes, placeholder, errorMessage }: FileInputWithPreviewProps) {
    const { toast } = useToast();
    const [preview, setPreview] = useState<string | null>(null);
    const [isDragging, setIsDragging] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const acceptString = useMemo(() => allowedTypes.join(','), [allowedTypes]);

    console.log('render')
    useEffect(() => {
        if (value && !preview) {
            const reader = new FileReader();
            reader.onload = (e) => {
                setPreview(e.target?.result as string);
            };
            reader.readAsDataURL(value);
        } else {
            setPreview(null);
        }
    }, [value]);

    const handleFileChange = useCallback((file: File | null) => {
        if (file && allowedTypes.includes(file.type)) {
            onChange(file);
        } else {
            toast({
                variant: "destructive",
                title: "Periksa kembali Input anda!",
                description: errorMessage ?? `Hanya file dengan tipe ${allowedTypes.join(', ')} yang diperbolehkan.`,
            });
            onChange(null);
            if (fileInputRef.current) {
                fileInputRef.current.value = '';
            }
        }
    }, [onChange, toast, allowedTypes]);

    const handleInputChange = useCallback((e: ChangeEvent<HTMLInputElement>) => {
        const selectedFile = e.target.files?.[0] || null;
        handleFileChange(selectedFile);
    }, [handleFileChange]);

    const handleDragOver = useCallback((e: DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        setIsDragging(true);
    }, []);

    const handleDragLeave = useCallback((e: DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        setIsDragging(false);
    }, []);

    const handleDrop = useCallback((e: DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        setIsDragging(false);
        const droppedFile = e.dataTransfer.files[0];
        handleFileChange(droppedFile);
    }, [handleFileChange]);

    const handleCancel = useCallback(() => {
        onChange(null);
        setPreview(null);
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    }, [onChange]);

    const renderPreview = useCallback(() => {
        if (!value || !preview) return null;

        if (value.type.startsWith('image/')) {
            return (
                <img
                    src={preview || "/placeholder.svg"}
                    alt="File preview"
                    className="object-contain"
                />
            );
        } else {
            return <iframe src={preview} className="w-full h-full" title="File Preview" />;
        }
    }, [value, preview]);

    return (
        <div className="w-full max-w-md mx-auto">
            {value ? (
                <Card className="mt-4 px-5 py-4 max-w-sm rounded-sm !shadow-none">
                    <div className="flex items-center justify-between gap-1 mb-2">
                        {(value.type).startsWith('image/') ? <ImageIcon /> : <FileScan />}
                        <span className="font-medium truncate">{value.name}</span>
                    </div>
                    <div className="bg-gray-100 rounded-sm p-0 flex items-center justify-center" style={{ aspectRatio: '3/4' }}>
                        {renderPreview()}
                    </div>
                    <div className="mt-4 flex justify-end space-x-2">
                        <Button size="icon" className="bg-red-600/80 hover:bg-red-600" onClick={handleCancel}><Trash2 /></Button>
                    </div>
                </Card>
            ) : (
                <>
                    <div className={`relative w-full aspect-[3/4] rounded my-2.5 flex items-center justify-center cursor-pointer ${
                            isDragging ? 'border-2 border-dashed border-blue-500' : ''
                        }`}
                        onDragOver={handleDragOver}
                        onDragLeave={handleDragLeave}
                        onDrop={handleDrop}
                        onClick={() => fileInputRef.current?.click()}
                    >
                        <Skeleton className="absolute inset-0 w-full h-full !animate-none">
                            <div className="absolute inset-0 flex flex-col items-center justify-center">
                                <Upload className="mb-2 text-gray-400" />
                                <p className="mt-2 text-sm text-center text-gray-500">{ placeholder ?? 'Drag & drop file here or click to select' }</p>
                            </div>
                        </Skeleton>
                    </div>
                    <input
                        type="file"
                        accept={acceptString}
                        onChange={handleInputChange}
                        className="hidden"
                        ref={fileInputRef}
                        id={`file-input-${id}`}
                    />
                    <label
                        htmlFor={`file-input-${id}`}
                        className="hidden w-full max-w-md px-4 py-2 text-sm font-medium text-center text-white bg-blue-600 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 cursor-pointer"
                    >
                        Pilih file
                    </label>
                </>
            )}
        </div>
    );
}

