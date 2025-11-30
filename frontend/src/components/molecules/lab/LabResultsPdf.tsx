import { Card, CircularProgress } from "actify";
import { MdFullscreen, MdFullscreenExit } from "react-icons/md";

interface LabResultsPdfProps {
  pdf: string | null;
  pdfIsLoading: boolean;
  setIsFullscreen: (isFullscreen: boolean) => void;
  isFullscreen: boolean;
}

function LabResultsPdf({ pdf, pdfIsLoading, setIsFullscreen, isFullscreen }: LabResultsPdfProps) {
  return (
    <>
      <Card className="w-full mb-6 overflow-hidden relative p-0" elevation={3}>
        {pdfIsLoading ? (
          <div className="flex justify-center items-center" style={{ height: '400px' }}>
            <CircularProgress
              isIndeterminate={true}
              aria-label="Cargando resultados de laboratorio" 
            />
          </div>
        ) : pdf ? (
          <>
            <iframe 
              src={pdf} 
              className="border-0 cursor-pointer block" 
              style={{ 
                height: '400px', 
                minHeight: '400px', 
                width: '100%',
                display: 'block'
              }}
              title="Lab Results PDF"
              onClick={() => setIsFullscreen(true)}
            />
            <button
              onClick={() => setIsFullscreen(true)}
              className="absolute top-2 right-2 bg-white bg-opacity-90 hover:bg-opacity-100 rounded-lg p-2 shadow-lg transition-all z-10"
              title="Ver en pantalla completa"
            >
              <MdFullscreen className="text-xl text-gray-700" />
            </button>
          </>
        ) : (
          <div className="flex items-center justify-center bg-gray-100" style={{ height: '200px' }}>
            <p className="text-center text-gray-500">PDF no disponible o no generado</p>
          </div>
        )}
      </Card>

      {/* Fullscreen PDF Modal */}
      {isFullscreen && pdf && (
        <div
          className="fixed inset-0 bg-black bg-opacity-90 flex items-center justify-center z-50"
          onClick={() => setIsFullscreen(false)}
        >
          <div
            className="w-full h-full flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header with close button */}
            <div className="flex justify-between items-center p-4 bg-gray-900 bg-opacity-50">
              <h3 className="text-white text-lg font-semibold">Resultados de Laboratorio - Vista Completa</h3>
              <button
                onClick={() => setIsFullscreen(false)}
                className="text-white hover:text-gray-300 text-2xl font-bold p-2 rounded-lg hover:bg-gray-800 transition-colors"
                aria-label="Cerrar pantalla completa"
              >
                <MdFullscreenExit className="text-2xl" />
              </button>
            </div>
            
            {/* PDF Container */}
            <div className="flex-1 w-full overflow-hidden">
              <iframe 
                src={pdf} 
                className="w-full h-full border-0" 
                title="Lab Results PDF - Fullscreen"
              />
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default LabResultsPdf;