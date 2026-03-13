import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect, useRef } from 'react';
import { ChevronLeft, ChevronRight, BookOpen } from 'lucide-react';
import type { Term } from '../lib/api';

interface NotebookCarouselProps {
  terms: Term[];
}

export default function NotebookCarousel({ terms }: NotebookCarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const touchStartX = useRef(0);
  const touchEndX = useRef(0);

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

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') goToPrevious();
      if (e.key === 'ArrowRight') goToNext();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentIndex, terms.length]);

  // Touch/Swipe handlers
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.targetTouches[0].clientX;
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    touchEndX.current = e.targetTouches[0].clientX;
  };

  const handleTouchEnd = () => {
    const diff = touchStartX.current - touchEndX.current;
    const minSwipeDistance = 50;
    
    if (Math.abs(diff) > minSwipeDistance) {
      if (diff > 0) {
        goToNext();
      } else {
        goToPrevious();
      }
    }
  };

  const pageVariants = {
    enter: (direction: number) => ({
      x: direction > 0 ? 100 : -100,
      opacity: 0,
    }),
    center: {
      x: 0,
      opacity: 1,
    },
    exit: (direction: number) => ({
      x: direction > 0 ? -100 : 100,
      opacity: 0,
    }),
  };

  if (terms.length === 0) {
    return (
      <div className="flex items-center justify-center min-h-[50vh] md:min-h-[60vh]">
        <div className="text-center px-4">
          <BookOpen className="w-12 h-12 md:w-16 md:h-16 mx-auto mb-4 text-amber-700/50" />
          <p className="text-lg md:text-xl text-amber-900/60">No hay términos en el glosario</p>
        </div>
      </div>
    );
  }

  return (
    <div className="relative max-w-4xl mx-auto px-2 sm:px-4 py-4 md:py-8" ref={containerRef}>
      <div 
        className="relative h-[60vh] sm:h-[65vh] md:h-[70vh] perspective-1000"
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
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
              opacity: { duration: 0.2 },
            }}
            className="absolute inset-0"
          >
            <div className="h-full bg-[#fefcf6] rounded-lg shadow-2xl overflow-hidden border border-[#d4cfc3]">
              {/* Notebook lines - hidden on mobile */}
              <div className="hidden sm:block absolute left-6 md:left-8 top-0 bottom-0 w-px bg-red-400/30" />
              <div className="hidden sm:block absolute left-8 md:left-10 top-0 bottom-0 w-px bg-red-400/20" />
              
              <div className="h-full p-4 sm:p-6 md:p-8 sm:pl-12 md:pl-16 flex flex-col">
                {/* Header */}
                <div className="flex items-center justify-between mb-4 md:mb-6 border-b-2 border-[#e8e4d9] pb-3 md:pb-4">
                  <span className="font-mono text-xs md:text-sm text-amber-700/60">
                    Página {currentIndex + 1} de {terms.length}
                  </span>
                  <span className="font-mono text-xs text-amber-700/40 uppercase tracking-wider">
                    {currentTerm.name.charAt(0).toUpperCase()}
                  </span>
                </div>

                {/* Title */}
                <h2 
                  className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mb-4 md:mb-6 text-[#2c241b] leading-tight"
                  style={{ fontFamily: "'Caveat', cursive" }}
                >
                  {currentTerm.name}
                </h2>

                {/* Image */}
                {currentTerm.imageUrl && (
                  <div className="mb-4 md:mb-6 flex-shrink-0">
                    <div className="relative overflow-hidden rounded-lg border-2 md:border-4 border-white shadow-lg transform rotate-1">
                      <img
                        src={currentTerm.imageUrl}
                        alt={currentTerm.name}
                        className="w-full max-h-32 sm:max-h-40 md:max-h-48 object-cover"
                      />
                    </div>
                  </div>
                )}

                {/* Definition */}
                <div 
                  className="flex-1 overflow-y-auto prose prose-amber max-w-none px-0.5"
                  style={{ 
                    fontFamily: "'Special Elite', cursive",
                    lineHeight: '1.7',
                    backgroundImage: 'repeating-linear-gradient(transparent, transparent 27px, #e8e4d9 27px, #e8e4d9 28px)',
                    backgroundAttachment: 'local',
                    paddingTop: '4px',
                  }}
                >
                  <p className="text-sm sm:text-base md:text-lg leading-7 text-[#3d3226] whitespace-pre-wrap">
                    {currentTerm.definition}
                  </p>
                </div>

                {/* Footer */}
                <div className="mt-4 md:mt-6 pt-3 md:pt-4 border-t border-[#e8e4d9] flex items-center justify-between text-xs text-amber-700/40">
                  <span>Glosario de Informática</span>
                  <span>{new Date(currentTerm.createdAt).toLocaleDateString('es-ES')}</span>
                </div>
              </div>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Navigation */}
      <div className="flex items-center justify-center gap-2 sm:gap-4 mt-4 md:mt-8">
        <button
          onClick={goToPrevious}
          className="p-2 sm:p-3 rounded-full bg-[#fefcf6] shadow-lg border border-[#d4cfc3] hover:shadow-xl hover:scale-105 transition-all duration-200 text-amber-800 active:scale-95 min-w-[44px] min-h-[44px] flex items-center justify-center"
          aria-label="Página anterior"
        >
          <ChevronLeft className="w-5 h-5 sm:w-6 sm:h-6" />
        </button>

        <div className="flex gap-1.5 sm:gap-2 px-3 sm:px-4 py-2 bg-[#fefcf6] rounded-full shadow-md border border-[#d4cfc3] max-w-[200px] sm:max-w-none overflow-x-auto">
          {terms.map((_, index) => (
            <button
              key={index}
              onClick={() => goToPage(index)}
              className={`h-2 rounded-full transition-all duration-200 flex-shrink-0 ${
                index === currentIndex
                  ? 'bg-amber-700 w-4 sm:w-6'
                  : 'bg-amber-700/30 hover:bg-amber-700/50 w-2'
              }`}
              aria-label={`Ir a página ${index + 1}`}
            />
          ))}
        </div>

        <button
          onClick={goToNext}
          className="p-2 sm:p-3 rounded-full bg-[#fefcf6] shadow-lg border border-[#d4cfc3] hover:shadow-xl hover:scale-105 transition-all duration-200 text-amber-800 active:scale-95 min-w-[44px] min-h-[44px] flex items-center justify-center"
          aria-label="Página siguiente"
        >
          <ChevronRight className="w-5 h-5 sm:w-6 sm:h-6" />
        </button>
      </div>

      {/* Help text */}
      <div className="text-center mt-3 md:mt-4">
        <p className="text-xs sm:text-sm text-amber-700/50 hidden sm:block">
          Usa ← → para navegar entre páginas
        </p>
        <p className="text-xs text-amber-700/50 sm:hidden">
          Desliza para navegar
        </p>
      </div>
    </div>
  );
}