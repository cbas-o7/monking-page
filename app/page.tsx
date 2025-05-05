"use client"

import Header from '@/components/Header';
import { getData } from "@/src/firebase"
import { useState, useEffect, useCallback, useMemo, memo } from "react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Instagram } from "lucide-react"
import Image from "next/image"
import DesignDialog from '@/components/DesignDialog';

// Memoized Design Card
const DesignCard = memo(function DesignCard({
  design,
  onClick,
}: {
  design: { id: string; code: string; name: string; tags: string[]; image: string; },
  onClick: (design: { id: string; code: string; name: string; tags: string[]; image: string; }) => void
}) {
  return (
    <div
      className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300 cursor-pointer border border-gray-200"
      onClick={() => onClick(design)}
    >
      <div className="relative h-64 w-full">
        <Image src={design.image || "/placeholder.svg"} alt={design.name} fill className="object-contain" />
      </div>
      <div className="p-4">
        <h3 className="text-lg font-semibold mb-2 text-black">{design.name}</h3>
        <div className="flex flex-wrap gap-2">
          {Array.isArray(design.tags) ? design.tags.map((tag, index) => (
            <Badge
              key={index}
              variant="outline"
              className="bg-gray-100 text-black hover:bg-gray-200 border-gray-300"
            >
              {tag}
            </Badge>
          )) : null}
        </div>
      </div>
    </div>
  );
});

export default function Home() {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedDesign, setSelectedDesign] = useState<{ id: string; code: string; name: string; tags: string[]; image: string; } | null>(null)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [zoomLevel, setZoomLevel] = useState(1)
  const [designs, setDesigns] = useState<{ id: string; code: string; name: string; tags: string[]; image: string; }[]>([])

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getData();
        if (data) {
          setDesigns(data);
        }
      } catch (error) {
        console.error("Error cargando diseños:", error);
      }
    };
    fetchData();
  }, []);

  // Memoriza el filtrado para evitar cálculos innecesarios
  const filteredDesigns = useMemo(() => {
    const searchLower = searchTerm.toLowerCase();
    return Array.isArray(designs)
      ? designs.filter((design) =>
          design.name.toLowerCase().includes(searchLower) ||
          (Array.isArray(design.tags) && design.tags.some(tag =>
            tag.toLowerCase().includes(searchLower)
          ))
        )
      : [];
  }, [designs, searchTerm]);

  // Memoriza funciones para evitar recreación
  const handleZoomIn = useCallback(() => {
    setZoomLevel((prev) => Math.min(prev + 0.5, 3))
  }, []);

  const handleZoomOut = useCallback(() => {
    setZoomLevel((prev) => Math.max(prev - 0.5, 1))
  }, []);

  const handleFranchiseClick = useCallback((franchise: string) => {
    setSearchTerm(franchise)
  }, []);

  const memoSetSearchTerm = useCallback((value: string) => setSearchTerm(value), []);
  const memoSetIsDialogOpen = useCallback((open: boolean) => setIsDialogOpen(open), []);

  const openDesignDetail = useCallback((design: { id: string; code: string; name: string; tags: string[]; image: string; }) => {
    setSelectedDesign(design)
    setIsDialogOpen(true)
    setZoomLevel(1)
  }, []);

  // Memoriza las props del Header
  const headerProps = useMemo(() => ({
    searchTerm,
    setSearchTerm: memoSetSearchTerm,
    handleFranchiseClick,
  }), [searchTerm, memoSetSearchTerm, handleFranchiseClick]);


  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header - Sticky Navbar */}
      <Header {...headerProps} />

      {/* Hero Section con video de fondo */}
      <div className="relative h-[500px] overflow-hidden">
        {/* Video de fondo */}
        <div className="absolute inset-0 w-full h-full">
          <video autoPlay loop muted playsInline className="w-full h-full object-cover">
            <source
              src="/video.mp4"
              type="video/mp4"
            />
            Tu navegador no soporta videos HTML5.
          </video>
          {/* Overlay para mejorar legibilidad del texto */}
          <div className="absolute inset-0 bg-black/55"></div>
        </div>

        {/* Contenido del hero */}
        <div className="relative z-10 container mx-auto px-4 h-full flex flex-col justify-center items-center text-center">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">Diseños Únicos para Ti</h2>
          <p className="text-xl md:text-2xl text-white mb-6">Entrega en todo Monterrey con precios desde $450 MXN</p>
          <a href={process.env.NEXT_PUBLIC_INSTAGRAM} target="_blank" rel="noopener noreferrer">
            <Button size="lg" className="bg-black hover:bg-gray-800 text-white border-white border">
              <Instagram className="mr-2 h-5 w-5" />
              Más información en Instagram
            </Button>
          </a>
        </div>
      </div>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">

        <h2 className="text-2xl font-semibold mb-6 text-black">Nuestros Diseños de Bordado</h2>

        {/* Grid de diseños */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {filteredDesigns.map((design) => (
            <DesignCard
              key={design.id}
              design={design}
              onClick={openDesignDetail}
            />
          ))}
        </div>

        {/* Mensaje si no hay resultados */}
        {filteredDesigns.length === 0 && (
          <div className="text-center py-10">
            <p className="text-gray-500 text-lg">No se encontraron diseños que coincidan con tu búsqueda.</p>
          </div>
        )}
      </main>

      {/* Diálogo para ver detalles con zoom */}
    {selectedDesign && (
      <DesignDialog
        isOpen={isDialogOpen}
        onOpenChange={memoSetIsDialogOpen}
        design={selectedDesign}
        zoomLevel={zoomLevel}
        onZoomIn={handleZoomIn}
        onZoomOut={handleZoomOut}
      />
    )}

      {/* Footer */}
      <footer className="bg-black text-white py-8">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="mb-4 md:mb-0">
              <h2 className="text-2xl font-bold">Monking</h2>
              <p className="text-gray-300">Diseños de bordado de alta calidad</p>
            </div>
            <div className="text-gray-300 text-sm">
              <p>© {new Date().getFullYear()} Monking. Todos los derechos reservados.</p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}