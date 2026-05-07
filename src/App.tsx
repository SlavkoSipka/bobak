import React, { useEffect, useState, useCallback, useRef } from 'react';
import { TableGrid } from './components/TableGrid';
import { Table as TableType } from './types/table';
import { Table } from './components/Table';
import { BarSection } from './components/BarSection';
import { SmallTableGrid } from './components/SmallTableGrid';
import { initializeGoogleSheets, getTableStatuses } from './utils/googleSheets';
import { ZoomIn, ZoomOut } from 'lucide-react';
import { Navbar } from './components/Navbar';

// Debounce funkcija za touch događaje
const ZOOM_SPEED = 0.005; // Controls zoom sensitivity
const MIN_SCALE = 0.5;
const MAX_SCALE = 2;
const INITIAL_SCALE = 0.8;

function App() {
  const [scale, setScale] = useState(INITIAL_SCALE);
  const [initialDistance, setInitialDistance] = useState<number | null>(null);
  const [initialScale, setInitialScale] = useState<number>(INITIAL_SCALE);
  const containerRef = useRef<HTMLDivElement>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [tableStatuses, setTableStatuses] = useState<boolean[]>([]);
  const [isVipTribuneLoaded, setIsVipTribuneLoaded] = useState(false); // Progresivno učitavanje VIP tribina
  
  const [upperTables, setUpperTables] = useState<TableType[]>(Array.from({ length: 35 }, (_, i) => ({
    id: i + 1, // Internal IDs 1-35
    isReserved: false
  })));
  
  const [lowerTables, setLowerTables] = useState<TableType[]>(Array.from({ length: 63 }, (_, i) => ({
    id: i + 36, // Internal IDs 36-98
    isReserved: false
  })));

  const [bottomTables, setBottomTables] = useState<TableType[]>(Array.from({ length: 12 }, (_, i) => ({
    id: i + 99, // Internal IDs 99-110
    isReserved: false
  })));

  const [barTables, setBarTables] = useState<TableType[]>(Array.from({ length: 27 }, (_, i) => ({
    id: i + 111, // Internal IDs 111-137
    isReserved: false
  })));

  const [extraTables, setExtraTables] = useState<TableType[]>(Array.from({ length: 9 }, (_, i) => ({
    id: i + 138, // Internal IDs 138-146
    isReserved: false
  })));

  const [rightElevatedTables, setRightElevatedTables] = useState<TableType[]>(Array.from({ length: 50 }, (_, i) => ({
    id: i + 147, // Internal IDs 147-196
    isReserved: false
  })));

  const [vipTables, setVipTables] = useState<TableType[]>(Array.from({ length: 9 }, (_, i) => ({
    id: i + 197, // Internal IDs 197-205
    displayId: i + 1, // Display IDs 1-9
    isReserved: false
  })));

  // Add table 10 separately
  const [table10, setTable10] = useState<TableType>({
    id: 266, // Internal ID 266
    displayId: 10, // Display ID 10
    isReserved: false
  });

  const [leftTables, setLeftTables] = useState<TableType[]>(Array.from({ length: 20 }, (_, i) => ({
    id: i + 206, // Internal IDs 206-225
    displayId: i + 1, // Display IDs 1-20
    isReserved: false
  })));

  const [isInitialized, setIsInitialized] = useState(false);

  const handleZoom = useCallback((delta: number) => {
    setScale(prev => Math.min(Math.max(MIN_SCALE, prev + delta), MAX_SCALE));
  }, []);

  const getDistance = (touches: TouchList): number => {
    const dx = touches[0].clientX - touches[1].clientX;
    const dy = touches[0].clientY - touches[1].clientY;
    return Math.sqrt(dx * dx + dy * dy);
  };

  const handleTouchStart = useCallback((e: TouchEvent | ReactTouchEvent) => {
    if (e.touches.length === 2) {
      e.preventDefault();
      setInitialDistance(getDistance(e.touches));
      setInitialScale(scale);
    }
  }, [scale]);

  const handleTouchMove = useCallback((e: TouchEvent | ReactTouchEvent) => {
    if (e.touches.length === 2 && initialDistance !== null) {
      e.preventDefault();
      const currentDistance = getDistance(e.touches);
      const scaleDelta = (currentDistance - initialDistance) * ZOOM_SPEED;
      const newScale = Math.min(Math.max(MIN_SCALE, initialScale + scaleDelta), MAX_SCALE);
      setScale(newScale);
    }
  }, [initialDistance, initialScale]);

  const handleTouchEnd = useCallback(() => {
    setInitialDistance(null);
  }, []);

  useEffect(() => {
    const element = containerRef.current;
    if (element) {
      element.addEventListener('touchstart', handleTouchStart, { passive: false });
      element.addEventListener('touchmove', handleTouchMove, { passive: false });
      element.addEventListener('touchend', handleTouchEnd);
      element.addEventListener('touchcancel', handleTouchEnd);

      return () => {
        element.removeEventListener('touchstart', handleTouchStart);
        element.removeEventListener('touchmove', handleTouchMove);
        element.removeEventListener('touchend', handleTouchEnd);
        element.removeEventListener('touchcancel', handleTouchEnd);
      };
    }
  }, [handleTouchStart, handleTouchMove, handleTouchEnd]);

  useEffect(() => {
    const GOOGLE_API_KEY = 'AIzaSyApyPqZeKJwH2308-uUtFprJ709fS-wrws';
    let intervalId: NodeJS.Timeout;

    async function initialize() {
      try {
        await initializeGoogleSheets(GOOGLE_API_KEY);
        const allStatuses = await getTableStatuses();
        setTableStatuses(allStatuses);
        
        // Ažuriranje svih grupa stolova
        setUpperTables(prevTables =>
          prevTables.map((table, index) => ({
            ...table,
            isReserved: allStatuses[index] || false
          }))
        );
        
        setLowerTables(prevTables =>
          prevTables.map((table, index) => ({
            ...table,
            isReserved: allStatuses[index + 35] || false
          }))
        );
        
        setBottomTables(prevTables =>
          prevTables.map((table, index) => ({
            ...table,
            isReserved: allStatuses[index + 98] || false
          }))
        );
        
        setBarTables(prevTables =>
          prevTables.map((table, index) => ({
            ...table,
            isReserved: allStatuses[index + 110] || false
          }))
        );
        
        setExtraTables(prevTables =>
          prevTables.map((table, index) => ({
            ...table,
            isReserved: allStatuses[index + 137] || false
          }))
        );
        
        setVipTables(prevTables =>
          prevTables.map((table, index) => ({
            ...table,
            isReserved: allStatuses[index + 147] || false
          }))
        );
        
        // Update table 10 status from F10
        setTable10(prevTable => ({
          ...prevTable,
          isReserved: allStatuses[265] || false // Index 265 for internal ID 266
        }));
        
        setLeftTables(prevTables =>
          prevTables.map((table, index) => ({
            ...table,
            isReserved: allStatuses[index + 175] || false
          }))
        );
        
        setRightElevatedTables(prevTables =>
          prevTables.map((table, index) => ({
            ...table,
            isReserved: allStatuses[index + 195] || false
          }))
        );
        
        setIsInitialized(true);
        setIsLoading(false);

        // Odloženo učitavanje VIP tribina za 500ms
        setTimeout(() => setIsVipTribuneLoaded(true), 500);
      } catch (error) {
        console.error('Failed to initialize Google Sheets:', error);
        setTimeout(initialize, 5000); // Pokušaj ponovo nakon 5 sekundi
      }
    }

    initialize();
    intervalId = setInterval(initialize, 10000); // Bilo je 30000

    return () => {
      if (intervalId) clearInterval(intervalId);
    };
  }, []);

  if (!isInitialized) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="animate-pulse text-gray-600">Loading tables...</div>
      </div>
    );
  }

  return (
    <>
      <Navbar backUrl="https://whiteclub.rs/" />
      <div 
        ref={containerRef}
        className="min-h-screen bg-gray-100 overflow-x-auto overflow-y-auto touch-pan-x touch-pan-y relative will-change-transform flex items-center justify-center pt-24"
        style={{
          opacity: isLoading ? 0 : 1,
          transition: 'opacity 0.3s ease-out',
          minHeight: '100dvh'
        }}
      >
        <div className="fixed bottom-4 right-4 flex flex-col gap-2 z-50">
          <div className="fixed left-4 top-32 hidden md:flex flex-col gap-8">
            <img src="https://aislike.rs/white/baner/logo%20transparent.png" alt="White Logo" className="w-40 h-auto opacity-30" />
            <img src="https://aislike.rs/white/baner/logo%20transparent.png" alt="White Logo" className="w-40 h-auto opacity-30" />
            <img src="https://aislike.rs/white/baner/logo%20transparent.png" alt="White Logo" className="w-40 h-auto opacity-30" />
          </div>
          <div className="fixed right-4 top-32 hidden md:flex flex-col gap-8">
            <img src="https://aislike.rs/white/baner/logo%20transparent.png" alt="White Logo" className="w-40 h-auto opacity-30" />
            <img src="https://aislike.rs/white/baner/logo%20transparent.png" alt="White Logo" className="w-40 h-auto opacity-30" />
            <img src="https://aislike.rs/white/baner/logo%20transparent.png" alt="White Logo" className="w-40 h-auto opacity-30" />
          </div>
          <button
            onClick={() => handleZoom(0.1)}
            className="p-2 bg-white rounded-full shadow-lg hover:bg-gray-50 transition-colors"
          >
            <ZoomIn className="w-6 h-6 text-gray-700" />
          </button>
          <button
            onClick={() => handleZoom(-0.1)}
            className="p-2 bg-white rounded-full shadow-lg hover:bg-gray-50 transition-colors"
          >
            <ZoomOut className="w-6 h-6 text-gray-700" />
          </button>
        </div>
        <div 
          className="min-w-[100%] px-4 py-4 flex justify-center"
          style={{
            transform: `scale(${scale})`,
            transformOrigin: '50% 0%',
            willChange: 'transform'
          }}
        >
          <div className="w-full max-w-[1400px] flex gap-2 relative mb-10 mx-auto scale-90 sm:scale-100">
            <div className="flex flex-col gap-4">
              <div className="bg-gradient-to-br from-gray-800 to-gray-900 p-4 rounded-lg shadow-xl mt-2 relative">
                <div className="space-y-2">
                  <h2 className="text-white text-sm font-semibold mb-4 text-center">VIP</h2>
                  {leftTables.map((table) => (
                    <div 
                      key={table.id}
                      className="w-8 h-6 bg-white/90 backdrop-blur-sm rounded-lg shadow-md flex items-center justify-center transition-transform duration-200"
                    >
                      <Table id={table.id} displayId={table.displayId} isReserved={table.isReserved} />
                    </div>
                  ))}
                </div>
              </div>
            </div>
            <div className="flex flex-col gap-4">
              <div className="space-y-6 pt-16">
                <h2 className="text-black text-sm font-semibold mb-2 text-center">Visoki separe</h2>
                {vipTables.map((table) => (
                  <div 
                    key={table.id}
                    className={`${
                      table.isReserved 
                        ? 'bg-gradient-to-r from-red-600 to-red-500' 
                        : 'bg-gradient-to-r from-amber-600 to-yellow-500'
                    } w-8 h-8 rounded-lg rounded-r-none shadow-lg border border-amber-400/30 flex flex-col items-center justify-center text-white font-bold text-[10px] leading-none transition-colors duration-300`}
                  >
                    <span className="mt-1">{table.displayId}</span>
                  </div>
                ))}
                {/* Table 10 */}
                <div 
                  className={`${
                    table10.isReserved 
                      ? 'bg-gradient-to-r from-red-600 to-red-500' 
                      : 'bg-gradient-to-r from-amber-600 to-yellow-500'
                  } w-8 h-8 rounded-lg rounded-r-none shadow-lg border border-amber-400/30 flex flex-col items-center justify-center text-white font-bold text-[10px] leading-none transition-colors duration-300`}
                >
                  <span className="mt-1">{table10.displayId}</span>
                </div>
              </div>
            </div>
            <div className="flex-1 space-y-4">
              <div className="bg-[#4a4a4a] p-3 rounded-t-lg">
                <h1 className="text-2xl text-white text-center font-bold">Bina</h1>
              </div>
              <div className="bg-gradient-to-r from-[#2c2c54] via-[#34344A] to-[#2c2c54] p-6 rounded-lg shadow-lg border border-[#4a4a4a]/20">
                <TableGrid tables={upperTables} />
              </div>
              <div className="bg-white p-6 rounded-lg shadow-lg">
                <TableGrid tables={lowerTables} />
              </div>
              <div className="bg-white p-4 rounded-lg shadow-lg w-56">
                <SmallTableGrid tables={bottomTables} />
              </div>
              <div className="w-32 h-48 border-4 border-gray-800 rounded-lg flex items-center justify-center mt-4 ml-auto">
                <span className="text-gray-800 font-bold text-2xl tracking-wider">ULAZ</span>
              </div>
            </div>
            <div className="flex flex-col gap-4">
              <BarSection tables={barTables} />
              <div className="bg-white p-2 rounded-lg shadow-lg w-32">
                <div className="grid grid-cols-2 gap-2">
                  {extraTables.map(table => (
                    <Table key={table.id} id={table.id} isReserved={table.isReserved} />
                  ))}
                </div>
                <div className="bg-[#4a4a4a] p-3 rounded-lg mt-4">
                  <h2 className="text-2xl text-white text-center font-bold tracking-wider">ŠANK</h2>
                </div>
              </div>
            </div>
            {isVipTribuneLoaded && (
              <div className="flex flex-col gap-4 ml-1">
                <div 
                  className="bg-gradient-to-br from-gray-800 to-gray-900 p-8 rounded-lg shadow-xl relative overflow-hidden"
                  style={{
                    borderRadius: '40px',
                  }}
                >
                  <h2 className="text-white text-sm font-semibold mb-4 text-center">VIP Tribine</h2>
                  <div className="flex gap-8 justify-center">
                    {/* Prvi stubac - stolovi 147-155 (display IDs 1-9) */}
                    <div className="flex flex-col">
                      <h2 className="text-white text-sm font-semibold mb-4 text-center">Visoki separe</h2>
                      <div className="flex flex-col gap-3">
                        {rightElevatedTables.slice(0, 9).map((table) => (
                          <div 
                            key={table.id}
                            className={`w-8 h-8 ${
                              table.isReserved
                                ? 'bg-gradient-to-r from-red-600 to-red-500'
                                : 'bg-gradient-to-r from-orange-500 to-orange-400'
                            } rounded-lg shadow-md flex items-center justify-center transition-transform duration-200 mb-2 text-white font-bold`}
                          >
                            <span>{19 - (table.id - 147)}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                    {/* Drugi stubac - stolovi 226-238 (display IDs 1-13) */}
                    <div className="flex flex-col gap-3">
                      {[...Array(13)].reverse().map((_, index) => {
                        const id = 13 - index; // Display IDs 1-13
                        const internalId = id + 225; // Internal IDs 226-238
                        return (
                          <div 
                            key={id}
                            className="w-8 h-6 bg-white/90 backdrop-blur-sm rounded-lg shadow-md flex items-center justify-center transition-transform duration-200 mb-2"
                          >
                            <Table id={internalId} displayId={id} isReserved={tableStatuses[internalId - 1] || false} />
                          </div>
                        );
                      })}
                    </div>
                    {/* Treći stubac - stolovi 239-255 (display IDs 14-30) */}
                    <div className="flex flex-col gap-3">
                      {[...Array(17)].reverse().map((_, index) => {
                        const id = 30 - index; // Display IDs 14-30
                        const internalId = id + 225; // Internal IDs 239-255
                        return (
                          <div 
                            key={id}
                            className="w-8 h-6 bg-white/90 backdrop-blur-sm rounded-lg shadow-md flex items-center justify-center transition-transform duration-200 mb-2"
                          >
                            <Table id={internalId} displayId={id} isReserved={tableStatuses[internalId - 1] || false} />
                          </div>
                        );
                      })}
                    </div>
                    {/* Četvrti stubac - stolovi 256-265 (display IDs 31-40) */}
                    <div className="flex flex-col gap-3">
                      {[...Array(10)].reverse().map((_, index) => {
                        const id = 40 - index; // Display IDs 31-40
                        const internalId = 296 - id; // Internal IDs 256-265
                        const gap =
                          id === 38
                            ? "mb-16"
                            : id >= 35 && id <= 37
                            ? "mb-4"
                            : id >= 31 && id <= 34
                            ? ""
                            : id === 35
                            ? "mb-24"
                            : id === 37
                            ? "mb-64"
                            : "mb-8";

                        return (
                          <div
                            key={id}
                            className={`${
                              id === 37 || id === 36 || id === 35
                                ? "w-12 h-12 bg-gradient-to-r from-purple-600 to-pink-500 rounded-lg shadow-xl flex flex-col items-center justify-center transition-all duration-300"
                                : "w-8 h-6 bg-white/90 backdrop-blur-sm rounded-lg shadow-md flex items-center justify-center transition-transform duration-200"
                            } ${gap} ${id >= 31 && id <= 34 ? "mt-12 -mb-1" : ""}`}
                          >
                            {id === 37 || id === 36 || id === 35 ? (
                              <div className="flex flex-col items-center">
                                <span className="text-white font-bold text-sm">{id}</span>
                                <span className="text-white text-[8px] font-medium mt-0.5">SUPER VIP</span>
                              </div>
                            ) : (
                              <div
                                className={`
                                  ${
                                    id === 40
                                      ? "w-8 h-8 rounded-lg bg-green-500 hover:bg-green-600"
                                      : id === 39
                                      ? "w-8 h-8 rounded-lg bg-green-500 hover:bg-green-600"
                                      : "w-6 h-6 sm:w-7 sm:h-7 rounded-full bg-green-500 hover:bg-green-600"
                                  }
                                  flex items-center justify-center text-white text-xs font-medium transition-colors ${
                                    tableStatuses[internalId - 1] ? "bg-red-500 hover:bg-red-600" : ""
                                  }
                                `}
                              >
                                {id}
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}

export default App;