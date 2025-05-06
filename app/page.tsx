"use client"

import Header from '@/components/Header';
import { getData } from "@/src/firebase"
import Image from "next/image"
import { useState, useEffect, useCallback, useMemo, memo, useRef } from "react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ChevronLeft, ChevronRight, Instagram } from "lucide-react"
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
      <div className="relative h-64 w-full ">
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
  const [designs, setDesigns] = useState<{ id: string; code: string; name: string; tags: string[]; image: string; }[]>([])
  const [currentPage, setCurrentPage] = useState(1)
  const designsPerPage = 52

  const scrollRef = useRef<HTMLDivElement>(null)

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

  const filteredDesigns = designs.filter((design) => {
    const searchLower = searchTerm.toLowerCase()
    return (
      design.name.toLowerCase().includes(searchLower) ||
      design.tags.some((tag) => tag.toLowerCase().includes(searchLower))
    )
  })

  // Asegurar que la página actual sea válida cuando cambian los resultados filtrados
  useEffect(() => {
    const maxPage = Math.max(1, Math.ceil(filteredDesigns.length / designsPerPage))
    if (currentPage > maxPage) {
      setCurrentPage(1)
    }
  }, [filteredDesigns.length, currentPage, designsPerPage])

  // Calcular el número total de páginas
  const totalPages = Math.ceil(filteredDesigns.length / designsPerPage)

  // Obtener los diseños para la página actual
  const currentDesigns = filteredDesigns.slice((currentPage - 1) * designsPerPage, currentPage * designsPerPage)

  interface PageChangeHandler {
    (page: number): void;
  }

  const handlePageChange: PageChangeHandler = (page) => {
    setCurrentPage(page);
    // Desplazar al inicio de los resultados
    window.scrollTo({
      top: scrollRef.current ? scrollRef.current.offsetTop : 0,
      behavior: "smooth",
    });
  };

  const handleFranchiseClick = useCallback((franchise: string) => {
    setSearchTerm(franchise)
    setCurrentPage(1)

    // Desplazar al inicio de los resultados
    window.scrollTo({
      top: scrollRef.current ? scrollRef.current.offsetTop : 0,
      behavior: "smooth",
    })
  }, []);

  const memoSetSearchTerm = useCallback((value: string) => setSearchTerm(value), []);
  const memoSetIsDialogOpen = useCallback((open: boolean) => setIsDialogOpen(open), []);

  const openDesignDetail = useCallback((design: { id: string; code: string; name: string; tags: string[]; image: string; }) => {
    setSelectedDesign(design)
    setIsDialogOpen(true)
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

        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-semibold text-black">Nuestros Diseños de Bordado</h2>

          {/* Información de paginación */}
          {filteredDesigns.length > 0 && (
            <p className="text-gray-600">
              Mostrando {(currentPage - 1) * designsPerPage + 1}-
              {Math.min(currentPage * designsPerPage, filteredDesigns.length)} de {filteredDesigns.length} diseños
            </p>
          )}
        </div>

        {/* Grid de diseños */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {currentDesigns.map((design) => (
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

        {/* Controles de paginación */}
        {totalPages > 1 && (
          <div className="flex justify-center items-center mt-8 space-x-2">
            <Button
              variant="outline"
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className="border-black text-black"
            >
              <ChevronLeft className="h-4 w-4 mr-1" /> Anterior
            </Button>

            <div className="flex items-center space-x-1">
              {/* Nueva lógica de paginación para evitar duplicados */}
              {(() => {
                const pages: (number | string)[] = [];
                if (totalPages <= 7) {
                  // Mostrar todas las páginas si son pocas
                  for (let i = 1; i <= totalPages; i++) pages.push(i);
                } else {
                  // Siempre mostrar la primera página
                  pages.push(1, 2, 3);

                  // Mostrar puntos suspensivos si estamos lejos del inicio
                  if (currentPage > 4) pages.push('start-ellipsis');

                  // Mostrar hasta 3 páginas alrededor de la actual
                  const start = Math.max(4, currentPage - 2);
                  const end = Math.min(totalPages - 3, currentPage + 1);
                  for (let i = start; i <= end; i++) pages.push(i);

                  // Mostrar puntos suspensivos si estamos lejos del final
                  if (currentPage < totalPages - 3) pages.push('end-ellipsis');

                  // Siempre mostrar la última página
                  pages.push(totalPages - 2, totalPages - 1, totalPages);
                }

                return pages.map((page, idx) =>
                  typeof page === "number" ? (
                    <Button
                      key={page}
                      variant={currentPage === page ? "default" : "outline"}
                      className={currentPage === page ? "bg-black text-white" : "border-black text-black"}
                      onClick={() => handlePageChange(page)}
                    >
                      {page}
                    </Button>
                  ) : (
                    <span key={page + idx} className="px-2">...</span>
                  )
                );
              })()}
            </div>

            <Button
              variant="outline"
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="border-black text-black"
            >
              Siguiente <ChevronRight className="h-4 w-4 ml-1" />
            </Button>
          </div>
        )}
      </main>

      {/* Diálogo para ver detalles con zoom */}
      {selectedDesign && (
        <DesignDialog
          isOpen={isDialogOpen}
          onOpenChange={memoSetIsDialogOpen}
          design={selectedDesign}
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
              <h6>© {new Date().getFullYear()} Monking. Todos los derechos reservados.</h6>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}