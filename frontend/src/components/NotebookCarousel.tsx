import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, BookOpen } from 'lucide-react';
import type { Term } from '../lib/api';

interface NotebookCarouselProps {
  terms: Term[];
}

export default function NotebookCarousel({ terms }: NotebookCarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState(0);

  const currentTerm = terms[currentIndex];

  const goToPrevious = () => {
    setDirection(-1);
    setCurrentIndex((prev) => (prev === 0 ? terms.length - 1 : prev - 1));
  };

  const goToNext = () => {
    setDirection(1);
    setCurrentIndex((prev) => (prev === terms.length - 1 ? 0 : prev + 1));
  };

  const goToPage = (index: number) => {
    setDirection(index > currentIndex ? 1 : -1);
    setCurrentIndex(index);
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') goToPrevious();
      if (e.key === 'ArrowRight') goToNext();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentIndex, terms.length]);

  const pageVariants = {
    enter: (direction: number) => ({
      x: direction > 0 ? 300 : -300,
      rotateY: direction > 0 ? 15 : -15,
      opacity: 0,
    }),
    center: {
      x: 0,
      rotateY: 0,
      opacity: 1,
    },
    exit: (direction: number) => ({
      x: direction > 0 ? -300 : 300,
      rotateY: direction > 0 ? -15 : 15,
      opacity: 0,
    }),
  };

  if (terms.length === 0) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <BookOpen className="w-16 h-16 mx-auto mb-4 text-amber-700/50" />
          <p className="text-xl text-amber-900/60">No hay términos en el glosario</p>
        </div>
      </div>
    );
  }

  return (
    <div className="relative max-w-4xl mx-auto px-4 py-8">
      <div className="relative h-[70vh] perspective-1000">
        <AnimatePresence mode="wait" custom={direction}>
          <motion.div
            key={currentTerm.id}
            custom={direction}
            variants={pageVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{
              x: { type: 'spring', stiffness: 300, damping: 30 },
              rotateY: { type: 'spring', stiffness: 300, damping: 30 },
              opacity: { duration: 0.2 },
            }}
            className="absolute inset-0"
            style={{ transformStyle: 'preserve-3d' }}
          >
            <div className="h-full bg-[#fefcf6] rounded-lg shadow-2xl overflow-hidden border border-[#d4cfc3]">
              <div className="absolute left-8 top-0 bottom-0 w-px bg-red-400/30" />
              <div className="absolute left-10 top-0 bottom-0 w-px bg-red-400/20" />
              
              <div className="h-full p-8 pl-16 flex flex-col">
                <div className="flex items-center justify-between mb-6 border-b-2 border-[#e8e4d9] pb-4">
                  <span className="font-mono text-sm text-amber-700/60">
                    Página {currentIndex + 1} de {terms.length}
                  </span>
                  <span className="font-mono text-xs text-amber-700/40 uppercase tracking-wider">
                    {currentTerm.name.charAt(0).toUpperCase()}
                  </span>
                </div>

                <h2 
                  className="text-4xl md:text-5xl font-bold mb-6 text-[#2c241b]"
                  style={{ fontFamily: "'Caveat', cursive" }}
                >
                  {currentTerm.name}
                </h2>

                {currentTerm.imageUrl && (
                  <div className="mb-6 flex-shrink-0">
                    <div className="relative overflow-hidden rounded-lg border-4 border-white shadow-lg transform rotate-1">
                      <img
                        src={currentTerm.imageUrl}
                        alt={currentTerm.name}
                        className="w-full max-h-48 object-cover"
                      />
                    </div>
                  </div>
                )}

                <div 
                  className="flex-1 overflow-y-auto prose prose-amber max-w-none"
                  style={{ 
                    fontFamily: "'Special Elite', cursive",
                    lineHeight: '1.8',
                    backgroundImage: 'repeating-linear-gradient(transparent, transparent 31px, #e8e4d9 31px, #e8e4d9 32px)',
                    backgroundAttachment: 'local',
                    paddingTop: '8px',
                  }}
                >
                  <p className="text-lg leading-8 text-[#3d3226] whitespace-pre-wrap">
                    {currentTerm.definition}
                  </p>
                </div>

                <div className="mt-6 pt-4 border-t border-[#e8e4d9] flex items-center justify-between text-xs text-amber-700/40">
                  <span>Glosario de Informática</span>
                  <span>{new Date(currentTerm.createdAt).toLocaleDateString('es-ES')}</span>
                </div>
              </div>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      <div className="flex items-center justify-center gap-4 mt-8">
        <button
          onClick={goToPrevious}
          className="p-3 rounded-full bg-[#fefcf6] shadow-lg border border-[#d4cfc3] hover:shadow-xl hover:scale-105 transition-all duration-200 text-amber-800"
          aria-label="Página anterior"
        >
          <ChevronLeft className="w-6 h-6" />
        </button>

        <div className="flex gap-2 px-4 py-2 bg-[#fefcf6] rounded-full shadow-md border border-[#d4cfc3]">
          {terms.map((_, index) => (
            <button
              key={index}
              onClick={() => goToPage(index)}
              className={`w-2 h-2 rounded-full transition-all duration-200 ${
                index === currentIndex
                  ? 'bg-amber-700 w-6'
                  : 'bg-amber-700/30 hover:bg-amber-700/50'
              }`}
              aria-label={`Ir a página ${index + 1}`}
            />
          ))}
        </div>

        <button
          onClick={goToNext}
          className="p-3 rounded-full bg-[#fefcf6] shadow-lg border border-[#d4cfc3] hover:shadow-xl hover:scale-105 transition-all duration-200 text-amber-800"
          aria-label="Página siguiente"
        >
          <ChevronRight className="w-6 h-6" />
        </button>
      </div>

      <div className="text-center mt-4">
        <p className="text-sm text-amber-700/50">
          Usa ← → para navegar entre páginas
        </p>
      </div>
    </div>
  );
}