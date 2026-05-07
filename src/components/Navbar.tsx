import React from 'react';
import { Phone, ArrowLeft, Info } from 'lucide-react';

interface NavbarProps {
  backUrl: string;
}

export function Navbar({ backUrl }: NavbarProps) {
  return (
    <nav className="fixed top-0 left-0 right-0 bg-white shadow-md z-50">
      <div className="bg-indigo-600 text-white px-4 py-2 text-center text-sm">
        <div className="flex items-center justify-center gap-2">
          <Info className="w-4 h-4" />
          <span>Za rezervacije pozovite</span>
          <a href="tel:+381640543000" className="font-bold hover:underline">
            064 054-3000
          </a>
        </div>
      </div>
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <div className="flex items-center gap-4">
          <a
            href={backUrl}
            className="flex items-center gap-2 text-gray-700 hover:text-gray-900 transition-colors py-3 pl-4"
          >
            <ArrowLeft className="w-5 h-5" />
            <span className="font-medium">Nazad</span>
          </a>
        </div>
        
        <div className="flex items-center gap-4">
          <a
            href="https://www.instagram.com/whiteclubvb?igsh=MXJldGNhenA2czAxYg=="
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-lg hover:from-purple-600 hover:to-pink-600 transition-colors"
          >
            <span className="font-medium">Instagram</span>
          </a>
          <a
            href="tel:+381640543000"
            className="flex items-center gap-2 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
          >
            <Phone className="w-5 h-5" />
            <span className="font-medium hidden md:inline">Pozovite odmah</span>
            <span className="font-medium md:hidden">Pozovi</span>
          </a>
        </div>
      </div>
    </nav>
  );
}