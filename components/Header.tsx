"use client"

import React, { useMemo, memo, useCallback } from 'react'
import Image from 'next/image'
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem } from "@/components/ui/dropdown-menu"
import { Search, Tag } from "lucide-react"

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

// Memoriza el DropdownMenuItem para evitar re-render innecesario
const FranchiseItem = memo(function FranchiseItem({ franchise, onClick }: { franchise: string, onClick: (franchise: string) => void }) {
  return (
    <DropdownMenuItem
      onClick={() => onClick(franchise)}
      className="cursor-pointer capitalize"
    >
      {franchise}
    </DropdownMenuItem>
  )
})

interface HeaderProps {
  searchTerm: string;
  setSearchTerm: (value: string) => void;
  handleFranchiseClick: (franchise: string) => void;
}

const Header: React.FC<HeaderProps> = memo(({ searchTerm, setSearchTerm, handleFranchiseClick }) => {
  // Memoriza la lista de franquicias
  const franchiseList = useMemo(() => franchises, []);

  // Memoriza el handler de input
  const handleInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value)
  }, [setSearchTerm]);

  return (
    <header className={`sticky top-0 z-50 bg-white transition-shadow duration-300 `}>
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
                onChange={handleInputChange}
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
                  {franchiseList.map((franchise, index) => (
                    <FranchiseItem
                      key={index}
                      franchise={franchise}
                      onClick={handleFranchiseClick}
                    />
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </div>
      </header>
  )
})

Header.displayName = 'Header'

export default Header