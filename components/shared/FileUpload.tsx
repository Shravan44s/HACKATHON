'use client';

import { useState, useRef, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { Upload, X, FileText, Image as ImageIcon, FileSpreadsheet } from 'lucide-react';
import type { FileAttachment } from '@/lib/types';

interface FileUploadProps {
    files: FileAttachment[];
    onChange: (files: FileAttachment[]) => void;
    accept?: Record<string, string[]>;
    maxFiles?: number;
    label?: string;
}

export default function FileUpload({
    files,
    onChange,
    accept = {
        'image/*': ['.jpg', '.jpeg', '.png', '.gif', '.webp'],
        'application/pdf': ['.pdf'],
        'application/vnd.ms-powerpoint': ['.ppt'],
        'application/vnd.openxmlformats-officedocument.presentationml.presentation': ['.pptx'],
    },
    maxFiles = 10,
    label = 'Upload Files',
}: FileUploadProps) {
    const [dragActive, setDragActive] = useState(false);
    const idCounter = useRef(0);

    const onDrop = useCallback(
        (acceptedFiles: File[]) => {
            setDragActive(false);
            const newFiles: FileAttachment[] = acceptedFiles.map((file) => ({
                id: `file-${Date.now()}-${idCounter.current++}`,
                name: file.name,
                type: file.type,
                size: file.size,
                url: URL.createObjectURL(file),
            }));
            onChange([...files, ...newFiles].slice(0, maxFiles));
        },
        [files, onChange, maxFiles]
    );

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop,
        accept,
        maxFiles: maxFiles - files.length,
        onDragEnter: () => setDragActive(true),
        onDragLeave: () => setDragActive(false),
    });

    const removeFile = (id: string) => {
        onChange(files.filter((f) => f.id !== id));
    };

    const getFileIcon = (type: string) => {
        if (type.startsWith('image/')) return <ImageIcon className="w-4 h-4 text-cyan" />;
        if (type.includes('pdf')) return <FileText className="w-4 h-4 text-red-400" />;
        if (type.includes('presentation') || type.includes('powerpoint'))
            return <FileSpreadsheet className="w-4 h-4 text-gold" />;
        return <FileText className="w-4 h-4 text-muted-foreground" />;
    };

    return (
        <div className="space-y-3">
            <label className="text-sm font-medium text-foreground">{label}</label>
            <div
                {...getRootProps()}
                className={`border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-all duration-200 ${isDragActive || dragActive
                        ? 'border-violet bg-violet/5'
                        : 'border-surface-border hover:border-violet/50 hover:bg-white/[0.02]'
                    }`}
            >
                <input {...getInputProps()} />
                <Upload className={`w-8 h-8 mx-auto mb-3 ${isDragActive ? 'text-violet' : 'text-muted-foreground'}`} />
                <p className="text-sm text-muted-foreground">
                    Drag & drop files here, or <span className="text-violet">click to browse</span>
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                    Images, PDFs, PPT/PPTX — Max {maxFiles} files
                </p>
            </div>

            {files.length > 0 && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {files.map((file) => (
                        <div
                            key={file.id}
                            className="flex items-center gap-3 p-3 rounded-lg bg-surface-raised border border-surface-border"
                        >
                            {file.type.startsWith('image/') ? (
                                <img
                                    src={file.url}
                                    alt={file.name}
                                    className="w-10 h-10 rounded object-cover"
                                />
                            ) : (
                                <div className="w-10 h-10 rounded bg-dark flex items-center justify-center">
                                    {getFileIcon(file.type)}
                                </div>
                            )}
                            <div className="flex-1 min-w-0">
                                <p className="text-sm text-foreground truncate">{file.name}</p>
                                <p className="text-xs text-muted-foreground">
                                    {(file.size / 1024).toFixed(1)} KB
                                </p>
                            </div>
                            <button
                                onClick={(e) => {
                                    e.stopPropagation();
                                    removeFile(file.id);
                                }}
                                className="text-muted-foreground hover:text-red-400 transition-colors"
                            >
                                <X className="w-4 h-4" />
                            </button>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
