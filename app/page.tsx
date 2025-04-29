"use client"

import dotenv from 'dotenv';
import { getData } from "@/src/firebase"
import { useState, useRef, useEffect } from "react"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Search, Instagram, ZoomIn, ZoomOut, Tag } from "lucide-react"
import Image from "next/image"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { get } from 'http';

dotenv.config()
/* 
// Datos de ejemplo para los diseños
const designs = [
  {
    id: 1,
    code: "167",
    name: "Luffy",
    fullName: "167-Luffy",
    tags: ["one piece", "anime", "personaje"],
    image: "/placeholder.svg?height=300&width=300",
    description: "Diseño bordado del capitán de los Sombreros de Paja, Monkey D. Luffy de One Piece.",
  },
  {
    id: 2,
    code: "168",
    name: "Goku",
    fullName: "168-Goku",
    tags: ["dragon ball", "anime", "personaje"],
    image: "/placeholder.svg?height=300&width=300",
    description: "Diseño bordado de Goku, el protagonista de Dragon Ball.",
  },
  {
    id: 3,
    code: "169",
    name: "Vegeta",
    fullName: "169-Vegeta",
    tags: ["dragon ball", "anime", "personaje"],
    image: "/placeholder.svg?height=300&width=300",
    description: "Diseño bordado del príncipe saiyajin Vegeta de Dragon Ball.",
  },
  {
    id: 4,
    code: "170",
    name: "Naruto",
    fullName: "170-Naruto",
    tags: ["naruto", "anime", "personaje"],
    image: "/placeholder.svg?height=300&width=300",
    description: "Diseño bordado de Naruto Uzumaki, protagonista de Naruto.",
  },
  {
    id: 5,
    code: "171",
    name: "Sasuke",
    fullName: "171-Sasuke",
    tags: ["naruto", "anime", "personaje"],
    image: "/placeholder.svg?height=300&width=300",
    description: "Diseño bordado de Sasuke Uchiha de la serie Naruto.",
  },
  {
    id: 6,
    code: "172",
    name: "Zoro",
    fullName: "172-Zoro",
    tags: ["one piece", "anime", "personaje"],
    image: "/placeholder.svg?height=300&width=300",
    description: "Diseño bordado de Roronoa Zoro, el espadachín de los Sombreros de Paja.",
  },
  {
    id: 7,
    code: "173",
    name: "Tanjiro",
    fullName: "173-Tanjiro",
    tags: ["demon slayer", "anime", "personaje"],
    image: "/placeholder.svg?height=300&width=300",
    description: "Diseño bordado de Tanjiro Kamado, protagonista de Demon Slayer.",
  },
  {
    id: 8,
    code: "174",
    name: "Nezuko",
    fullName: "174-Nezuko",
    tags: ["demon slayer", "anime", "personaje"],
    image: "/placeholder.svg?height=300&width=300",
    description: "Diseño bordado de Nezuko Kamado de Demon Slayer.",
  },
  {
    id: 9,
    code: "175",
    name: "Eren",
    fullName: "175-Eren",
    tags: ["attack on titan", "anime", "personaje"],
    image: "/placeholder.svg?height=300&width=300",
    description: "Diseño bordado de Eren Yeager, protagonista de Attack on Titan.",
  },
  {
    id: 10,
    code: "176",
    name: "Mikasa",
    fullName: "176-Mikasa",
    tags: ["attack on titan", "anime", "personaje"],
    image: "/placeholder.svg?height=300&width=300",
    description: "Diseño bordado de Mikasa Ackerman de Attack on Titan.",
  },
  {
    id: 11,
    code: "177",
    name: "Pikachu",
    fullName: "177-Pikachu",
    tags: ["pokemon", "anime", "mascota"],
    image: "/placeholder.svg?height=300&width=300",
    description: "Diseño bordado de Pikachu, el Pokémon más popular.",
  },
  {
    id: 12,
    code: "178",
    name: "Charizard",
    fullName: "178-Charizard",
    tags: ["pokemon", "anime", "mascota"],
    image: "/placeholder.svg?height=300&width=300",
    description: "Diseño bordado de Charizard, uno de los Pokémon más poderosos.",
  },
]
 */
// Lista de franquicias para el dropdown
const franchises = [
  "naruto",
  "nike",
  "pokemon",
  "dragon ball",
  "one piece",
  "demon slayer",
  "attack on titan",
  "pokemon",
  "my hero academia",
  "jujutsu kaisen",
  "chainsaw man",
  "hunter x hunter",
  "bleach",
  "death note",
]

export default function Home() {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedDesign, setSelectedDesign] = useState(null)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [zoomLevel, setZoomLevel] = useState(1)
  const [isScrolled, setIsScrolled] = useState(false)
  const [designs, setDesigns] = useState([]) // Reemplaza el estado firebaseData por designs
  const [isLoading, setIsLoading] = useState(true)

  const scrollRef = useRef(null)

  // Detectar scroll para aplicar efectos al navbar
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 10) {
        setIsScrolled(true)
      } else {
        setIsScrolled(false)
      }
    }

    window.addEventListener("scroll", handleScroll)
    return () => {
      window.removeEventListener("scroll", handleScroll)
    }
  }, [])

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const data = await getData();
        if (data) {
          setDesigns(data); // Guarda los datos en el estado designs
          console.log("Diseños cargados:", data);
        }
      } catch (error) {
        console.error("Error cargando diseños:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  // Filtrar diseños basados en el término de búsqueda
  const filteredDesigns = Array.isArray(designs) ? designs.filter((design) => {
    const searchLower = searchTerm.toLowerCase();
    return (
      design.name.toLowerCase().includes(searchLower) ||
      (Array.isArray(design.tags) && design.tags.some(tag =>
        tag.toLowerCase().includes(searchLower)
      ))
    );
  }) : [];

  // Abrir el diálogo con el diseño seleccionado
  const openDesignDetail = (design) => {
    setSelectedDesign(design)
    setIsDialogOpen(true)
    setZoomLevel(1) // Resetear zoom al abrir
  }

  // Manejar el zoom
  const handleZoomIn = () => {
    setZoomLevel((prev) => Math.min(prev + 0.5, 3))
  }

  const handleZoomOut = () => {
    setZoomLevel((prev) => Math.max(prev - 0.5, 1))
  }

  // Manejar clic en etiqueta de franquicia
  const handleFranchiseClick = (franchise) => {
    setSearchTerm(franchise)
    // Desplazar al inicio de los resultados
    window.scrollTo({
      top: scrollRef.current.offsetTop,
      behavior: "smooth",
    })
  }

  // Resetear zoom al cerrar el diálogo
  useEffect(() => {
    if (!isDialogOpen) {
      setZoomLevel(1)
    }
  }, [isDialogOpen])

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header - Sticky Navbar */}
      <header className={`sticky top-0 z-50 bg-white transition-shadow duration-300 ${isScrolled ? "shadow-md" : ""}`}>
        <div className="container mx-auto px-4 py-4">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center mb-4 md:mb-0">
              {/* Espacio para el logo */}
              <div className="w-18 h-12 rounded-full mr-3 flex items-center justify-center">
                <Image
                  src="/monking.svg"
                  alt="Logo"
                  width={60}
                  height={60}
                  className="object-cover"
                />
              </div>
              <h1 className="text-3xl font-bold text-black">Monking</h1>
            </div>
            <div className="relative w-full md:w-1/2 flex items-center">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <Input
                type="text"
                placeholder="Buscar por nombre o etiqueta..."
                className="pl-10 w-full"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />

              {/* Dropdown de franquicias */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" className="ml-2 whitespace-nowrap">
                    <Tag className="h-4 w-4 mr-2" />
                    Franquicias
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56 max-h-80 overflow-y-auto">
                  {franchises.map((franchise, index) => (
                    <DropdownMenuItem
                      key={index}
                      onClick={() => handleFranchiseClick(franchise)}
                      className="cursor-pointer capitalize"
                    >
                      {franchise}
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </div>
      </header>

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
          <a href="https://www.instagram.com/stitchking_mty/" target="_blank" rel="noopener noreferrer">
            <Button size="lg" className="bg-black hover:bg-gray-800 text-white border-white border">
              <Instagram className="mr-2 h-5 w-5" />
              Más información en Instagram
            </Button>
          </a>
        </div>
      </div>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8" ref={scrollRef}>

        <h2 className="text-2xl font-semibold mb-6 text-black">Nuestros Diseños de Bordado</h2>

        {/* Grid de diseños */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {
            isLoading ? (
              // Muestra un mensaje de carga
              <div className="col-span-full text-center py-10">
                <p className="text-gray-500">Cargando diseños...</p>
              </div>
            ) : (
              filteredDesigns.map((design) => (


                <div
                  key={design.id}
                  className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300 cursor-pointer border border-gray-200"
                  onClick={() => openDesignDetail(design)}
                >
                  <div className="relative h-64 w-full">
                    <Image src={design.image || "/placeholder.svg"} alt={design.name} fill className="object-contain" />
                  </div>
                  <div className="p-4">
                    <h3 className="text-lg font-semibold mb-2 text-black">{design.name}</h3>
                    <div className="flex flex-wrap gap-2">
                      {/* {console.log("tags:", design.tags)} */}
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
              )))}
        </div>

        {/* Mensaje si no hay resultados */}
        {filteredDesigns.length === 0 && (
          <div className="text-center py-10">
            <p className="text-gray-500 text-lg">No se encontraron diseños que coincidan con tu búsqueda.</p>
          </div>
        )}
      </main>

      {/* Diálogo para ver detalles con zoom */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        {selectedDesign && (
          <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto bg-white">
            <DialogHeader>
              <DialogTitle className="text-2xl text-black">{selectedDesign.name}</DialogTitle>
              <DialogDescription>
                <div className="flex flex-wrap gap-2 mt-2">

                  {Array.isArray(selectedDesign.tags) ? selectedDesign.tags.map((tag, index) => (
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
                  onClick={handleZoomOut}
                  disabled={zoomLevel <= 1}
                  className="border-black text-black"
                >
                  <ZoomOut className="h-4 w-4 mr-1" /> Reducir
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleZoomIn}
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
                    src={selectedDesign.image || "/placeholder.svg"}
                    alt={selectedDesign.name}
                    fill
                    className="object-contain p-6"
                  />
                </div>
              </div>
            </div>

            {/* <p className="text-gray-700">{selectedDesign.description}</p> */}
            <p className="text-sm text-gray-500 mt-4">Código: {selectedDesign.code}</p>
          </DialogContent>
        )}
      </Dialog>

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