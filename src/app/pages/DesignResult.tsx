import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router';
import {
  Home,
  Download,
  Palette,
  Maximize2,
  X,
  FolderOpen,
  Save
} from 'lucide-react';

type ViewMode = 'after' | 'comparison';

interface ResultState {
  generatedImageUrl: string;
  beforeImageUrl: string | null;
  inspirationImageUrl?: string | null;
  projectName: string;
  preferences?: {
    style: string;
    colorTone: string;
    roomType: string;
    selectedFurniture: string[];
    removedFurniture: string[];
  };
}

export function DesignResult() {
  const navigate = useNavigate();
  const location = useLocation();
  const state = location.state as ResultState | null;
  const [viewMode, setViewMode] = useState<ViewMode>('after');
  const [isFullscreen, setIsFullscreen] = useState(false);

  const afterImage = state?.generatedImageUrl ?? '';
  const beforeImage = state?.beforeImageUrl ?? afterImage;
  const projectName = state?.projectName ?? 'Design';
  const hasBeforeImage = !!state?.beforeImageUrl;

  const handleChangeStyle = () => {
    navigate('/style-selection', {
      state: {
        generatedImageUrl: afterImage,
        beforeImageUrl: beforeImage,
        inspirationImageUrl: state?.inspirationImageUrl,
        projectName,
        style: state?.preferences?.style,
        colorTone: state?.preferences?.colorTone,
        roomType: state?.preferences?.roomType,
        selectedFurniture: state?.preferences?.selectedFurniture ?? [],
        removedFurniture: state?.preferences?.removedFurniture ?? [],
      },
    });
  };

  const handleDownloadImage = async () => {
    try {
      const response = await fetch(afterImage);
      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${projectName}.png`;
      a.click();
      setTimeout(() => URL.revokeObjectURL(url), 1000);
    } catch {
      alert('Failed to download image. Make sure the backend is running.');
    }
  };

  const handleSaveProject = () => {
    navigate('/my-projects');
  };

  const toggleFullscreen = () => {
    setIsFullscreen(!isFullscreen);
  };

  return (
    <div className="min-h-screen bg-stone-50">
      {/* Top Navigation */}
      <div className="bg-white border-b border-stone-200 px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate('/')}
              className="flex items-center gap-2 text-stone-600 hover:text-stone-900 transition-colors"
            >
              <Home className="w-5 h-5" />
            </button>
            <div className="h-6 w-px bg-stone-300"></div>
            <h1 className="text-xl text-stone-900">Design Result</h1>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate('/my-projects')}
              className="flex items-center gap-2 px-4 py-2 text-stone-700 hover:text-stone-900 hover:bg-stone-100 rounded-lg transition-colors"
            >
              <FolderOpen className="w-5 h-5" />
              <span>My Projects</span>
            </button>
            <button
              onClick={() => navigate('/style-selection')}
              className="px-4 py-2 bg-stone-800 text-white rounded-lg hover:bg-stone-700 transition-colors"
            >
              New Design
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="space-y-6">
          {/* User Guidance Text */}
          <div className="bg-stone-100 border border-stone-200 rounded-xl px-6 py-4">
            <p className="text-stone-700 text-center">
              You can regenerate the design with a different style or download the result.
            </p>
          </div>

          {/* Image Preview Section */}
          <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
            {viewMode === 'after' ? (
              // Single Image View
              <div className="relative">
                <div className="aspect-video bg-stone-200">
                  <img 
                    src={afterImage}
                    alt="Generated design"
                    className="w-full h-full object-cover"
                  />
                </div>
                {/* Overlay Controls */}
                <div className="absolute top-4 right-4 flex gap-2">
                  {hasBeforeImage && (
                    <button
                      onClick={() => setViewMode('comparison')}
                      className="bg-white/95 backdrop-blur-sm px-3 py-2 rounded-lg shadow-lg hover:bg-white transition-colors text-sm text-stone-700 border border-stone-300"
                    >
                      Show Comparison
                    </button>
                  )}
                  <button
                    onClick={toggleFullscreen}
                    className="bg-white/95 backdrop-blur-sm p-2 rounded-lg shadow-lg hover:bg-white transition-colors"
                    title="Fullscreen"
                  >
                    <Maximize2 className="w-5 h-5 text-stone-700" />
                  </button>
                </div>
                {/* Resolution Note */}
                <div className="absolute bottom-4 left-4">
                  <div className="bg-black/60 backdrop-blur-sm px-3 py-2 rounded-lg">
                    <p className="text-white text-sm">Generated image resolution: 1024×1024</p>
                  </div>
                </div>
              </div>
            ) : (
              // Before/After Comparison View
              <div className="grid md:grid-cols-2 gap-0">
                <div className="relative">
                  <div className="aspect-video bg-stone-200">
                    <img 
                      src={beforeImage}
                      alt="Before"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="absolute top-4 left-4">
                    <div className="bg-stone-800 text-white px-3 py-1 rounded-lg text-sm">
                      Before
                    </div>
                  </div>
                </div>
                <div className="relative border-l-2 border-stone-300">
                  <div className="aspect-video bg-stone-200">
                    <img
                      src={afterImage}
                      alt="After"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="absolute top-4 left-4">
                    <div className="bg-stone-800 text-white px-3 py-1 rounded-lg text-sm">
                      After
                    </div>
                  </div>
                  <div className="absolute top-4 right-4">
                    <button
                      onClick={() => setViewMode('after')}
                      className="bg-white/95 backdrop-blur-sm px-3 py-2 rounded-lg shadow-lg hover:bg-white transition-colors text-sm text-stone-700 border border-stone-300"
                    >
                      Hide Comparison
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Action Buttons */}
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <button
                onClick={handleSaveProject}
                className="flex items-center justify-center gap-2 px-4 py-3 bg-stone-800 text-white rounded-xl hover:bg-stone-700 transition-colors"
              >
                <Save className="w-5 h-5" />
                <span>Save Project</span>
              </button>

              <button
                onClick={handleChangeStyle}
                className="flex items-center justify-center gap-2 px-4 py-3 border-2 border-stone-300 text-stone-700 rounded-xl hover:border-stone-400 hover:bg-stone-50 transition-colors"
              >
                <Palette className="w-5 h-5" />
                <span>Change Style</span>
              </button>

              <button
                onClick={handleDownloadImage}
                className="flex items-center justify-center gap-2 px-4 py-3 border-2 border-stone-300 text-stone-700 rounded-xl hover:border-stone-400 hover:bg-stone-50 transition-colors"
              >
                <Download className="w-5 h-5" />
                <span>Download</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Fullscreen Modal */}
      {isFullscreen && (
        <div className="fixed inset-0 bg-black z-50 flex items-center justify-center">
          <button
            onClick={toggleFullscreen}
            className="absolute top-4 right-4 bg-white/20 hover:bg-white/30 p-2 rounded-lg transition-colors"
          >
            <X className="w-6 h-6 text-white" />
          </button>
          <img 
            src={afterImage}
            alt="Fullscreen preview"
            className="max-w-full max-h-full object-contain"
          />
        </div>
      )}
    </div>
  );
}