"use client"

import React, { memo, useMemo } from 'react'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
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
}

const DesignDialog = memo(({
    isOpen,
    onOpenChange,
    design,
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
                                )) : <div />}
                            </div>
                        </DialogDescription>
                    </DialogHeader>

                    {/* Contenedor de imagen con zoom */}
                    <div className="relative overflow-hidden my-4">

                        <div
                            className="relative h-80 w-full overflow-auto"
                        >
                                <Image
                                    src={imageSrc}
                                    alt={imageAlt}
                                    fill
                                    className="object-contain p-6"
                                />
                        </div>
                    </div>

                    <h6 className="text-sm text-gray-500 mt-4">Código: {design.code}</h6>
                </DialogContent>
            )}
        </Dialog>
    )
})

DesignDialog.displayName = 'DesignDialog'

export default DesignDialog