"use client"

import React, { memo, useMemo } from 'react'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ZoomIn, ZoomOut } from "lucide-react"
import Image from "next/image"

interface DesignDialogProps {
    isOpen: boolean;
    onOpenChange: (open: boolean) => void;
    design: {
        name: string;
        tags: string[];
        image?: string;
        code: string;
    };
    zoomLevel: number;
    onZoomIn: () => void;
    onZoomOut: () => void;
}

const DesignDialog = memo(({
    isOpen,
    onOpenChange,
    design,
    zoomLevel,
    onZoomIn,
    onZoomOut
}: DesignDialogProps) => {
    // Memoriza los tags para evitar recreación
    const tags = useMemo(() => Array.isArray(design?.tags) ? design.tags : [], [design]);

    // Memoriza la imagen y nombre
    const imageSrc = useMemo(() => design?.image || "/placeholder.svg", [design]);
    const imageAlt = useMemo(() => design?.name || "Design", [design]);

    return (
        <Dialog open={isOpen} onOpenChange={onOpenChange}>
            {design && (
                <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto bg-white">
                    <DialogHeader>
                        <DialogTitle className="text-2xl text-black">{design.name}</DialogTitle>
                        <DialogDescription>
                            <div className="flex flex-wrap gap-2 mt-2">
                                {tags.length > 0 ? tags.map((tag: string, index: number) => (
                                    <Badge key={index} variant="outline" className="bg-gray-100 text-black border-gray-300">
                                        {tag}
                                    </Badge>
                                )) : <hr />}
                            </div>
                        </DialogDescription>
                    </DialogHeader>

                    {/* Contenedor de imagen con zoom */}
                    <div className="relative overflow-hidden my-4">
                        <div className="flex justify-end mb-2 space-x-2">
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={onZoomOut}
                                disabled={zoomLevel <= 1}
                                className="border-black text-black"
                            >
                                <ZoomOut className="h-4 w-4 mr-1" /> Reducir
                            </Button>
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={onZoomIn}
                                disabled={zoomLevel >= 3}
                                className="border-black text-black"
                            >
                                <ZoomIn className="h-4 w-4 mr-1" /> Ampliar
                            </Button>
                        </div>

                        <div
                            className="relative h-80 w-full overflow-auto"
                            style={{
                                cursor: zoomLevel > 1 ? "move" : "default",
                            }}
                        >
                            <div
                                style={{
                                    transform: `scale(${zoomLevel})`,
                                    transformOrigin: "center",
                                    transition: "transform 0.2s ease-out",
                                    height: "100%",
                                    width: "100%",
                                    position: "relative",
                                }}
                            >
                                <Image
                                    src={imageSrc}
                                    alt={imageAlt}
                                    fill
                                    className="object-contain p-6"
                                />
                            </div>
                        </div>
                    </div>

                    <p className="text-sm text-gray-500 mt-4">Código: {design.code}</p>
                </DialogContent>
            )}
        </Dialog>
    )
})

DesignDialog.displayName = 'DesignDialog'

export default DesignDialog