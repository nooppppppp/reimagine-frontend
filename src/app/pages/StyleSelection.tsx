import { useState, useRef, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router';
import { generateDesign } from '../api';

interface StyleSelectionPrefill {
  generatedImageUrl?: string;
  beforeImageUrl: string;
  inspirationImageUrl?: string;
  projectName: string;
  style: string;
  colorTone: string;
  roomType: string;
  selectedFurniture: string[];
  removedFurniture: string[];
}

function dataURLtoFile(dataUrl: string, filename: string): File {
  const arr = dataUrl.split(',');
  const mime = arr[0].match(/:(.*?);/)![1];
  const bstr = atob(arr[1]);
  let n = bstr.length;
  const u8arr = new Uint8Array(n);
  while (n--) u8arr[n] = bstr.charCodeAt(n);
  return new File([u8arr], filename, { type: mime });
}
import {
  Armchair,
  Sofa,
  Table,
  Bed,
  Boxes,
  Lamp,
  Frame,
  Clock,
  Coffee,
  BookOpen,
  Plus,
  X,
  Sparkles,
  Home,
  Loader2,
  CloudUpload,
  AlertCircle,
  FolderOpen
} from 'lucide-react';
import { Combobox } from '../components/Combobox';

type StyleType = string;
type ColorTone = string;
type RoomType = string;
type FurnitureCategory = 'Seating' | 'Tables' | 'Beds & Sleep' | 'Storage' | 'Decor';
type LoadingStage = 'loading' | null;

interface FurnitureItem {
  id: string;
  name: string;
  icon: React.ReactNode;
  category: FurnitureCategory;
}

const furnitureData: FurnitureItem[] = [
  // Seating
  { id: 'sofa-1', name: 'Modern Sofa', icon: <Sofa className="w-6 h-6" />, category: 'Seating' },
  { id: 'chair-1', name: 'Armchair', icon: <Armchair className="w-6 h-6" />, category: 'Seating' },
  { id: 'chair-2', name: 'Lounge Chair', icon: <Armchair className="w-6 h-6" />, category: 'Seating' },
  
  // Tables
  { id: 'table-1', name: 'Coffee Table', icon: <Coffee className="w-6 h-6" />, category: 'Tables' },
  { id: 'table-2', name: 'Dining Table', icon: <Table className="w-6 h-6" />, category: 'Tables' },
  { id: 'table-3', name: 'Side Table', icon: <Table className="w-6 h-6" />, category: 'Tables' },
  
  // Beds & Sleep
  { id: 'bed-1', name: 'Platform Bed', icon: <Bed className="w-6 h-6" />, category: 'Beds & Sleep' },
  { id: 'bed-2', name: 'Ottoman', icon: <Bed className="w-6 h-6" />, category: 'Beds & Sleep' },
  
  // Storage
  { id: 'storage-1', name: 'Bookshelf', icon: <BookOpen className="w-6 h-6" />, category: 'Storage' },
  { id: 'storage-2', name: 'Cabinet', icon: <Boxes className="w-6 h-6" />, category: 'Storage' },
  { id: 'storage-3', name: 'Dresser', icon: <Boxes className="w-6 h-6" />, category: 'Storage' },
  
  // Decor
  { id: 'decor-1', name: 'Floor Lamp', icon: <Lamp className="w-6 h-6" />, category: 'Decor' },
  { id: 'decor-2', name: 'Wall Art', icon: <Frame className="w-6 h-6" />, category: 'Decor' },
  { id: 'decor-3', name: 'Wall Clock', icon: <Clock className="w-6 h-6" />, category: 'Decor' },
  { id: 'decor-4', name: 'Table Lamp', icon: <Lamp className="w-6 h-6" />, category: 'Decor' },
];

const categories: FurnitureCategory[] = ['Seating', 'Tables', 'Beds & Sleep', 'Storage', 'Decor'];
const styles = [
  'Minimalist',
  'Scandinavian',
  'Modern',
  'Japanese',
  'Industrial',
  'Bohemian',
  'Mid-Century Modern',
  'Contemporary',
  'Rustic',
  'Coastal',
  'Art Deco',
  'Mediterranean',
  'Traditional',
  'Transitional',
  'Farmhouse',
];
const colorTones = [
  'Light & Neutral',
  'Warm & Cozy',
  'Dark & Elegant',
  'Natural & Earthy',
  'Monochrome',
  'Pastel',
  'Bold & Vibrant',
  'Cool & Calm',
  'Black & White',
  'Jewel Tones',
  'Terracotta & Clay',
  'Forest & Green',
];
const roomTypes = [
  'Bedroom',
  'Living Room',
  'Kitchen',
  'Office',
  'Bathroom',
  'Dining Room',
  'Kids Room',
  'Home Gym',
  'Laundry Room',
  'Entryway',
  'Hallway',
  'Balcony',
  'Studio Apartment',
];

export function StyleSelection() {
  const navigate = useNavigate();
  const location = useLocation();
  const prefill = location.state as StyleSelectionPrefill | null;

  const [projectName, setProjectName] = useState(prefill?.projectName ?? '');
  const [roomImage, setRoomImage] = useState<File | null>(
    prefill?.beforeImageUrl?.startsWith('data:')
      ? dataURLtoFile(prefill.beforeImageUrl, 'room.png')
      : null
  );
  const [inspirationImage, setInspirationImage] = useState<File | null>(null);
  const [privacyConsent, setPrivacyConsent] = useState(false);
  const [roomPreview, setRoomPreview] = useState<string | null>(prefill?.beforeImageUrl ?? null);
  const [inspirationPreview, setInspirationPreview] = useState<string | null>(prefill?.inspirationImageUrl ?? null);
  const [roomImageError, setRoomImageError] = useState('');
  const [consentError, setConsentError] = useState('');
  const [selectedStyle, setSelectedStyle] = useState<StyleType>(prefill?.style ?? 'Modern');
  const [selectedColorTone, setSelectedColorTone] = useState<ColorTone>(prefill?.colorTone ?? 'Light & Neutral');
  const [selectedRoomType, setSelectedRoomType] = useState<RoomType>(prefill?.roomType ?? 'Living Room');
  const [activeCategory, setActiveCategory] = useState<FurnitureCategory>('Seating');
  const [selectedFurniture, setSelectedFurniture] = useState<string[]>(prefill?.selectedFurniture ?? []);
  const [customFurnitureInput, setCustomFurnitureInput] = useState('');
  const [removeFurnitureInput, setRemoveFurnitureInput] = useState('');
  const [removedFurniture, setRemovedFurniture] = useState<string[]>(prefill?.removedFurniture ?? []);
  const [loadingStage, setLoadingStage] = useState<LoadingStage>(null);
  const [progress, setProgress] = useState(0);
  const [hasError, setHasError] = useState(false);

  // Fetch room image from backend URL (when coming from MyProjects or Change Style)
  useEffect(() => {
    if (prefill?.beforeImageUrl && !prefill.beforeImageUrl.startsWith('data:')) {
      fetch(prefill.beforeImageUrl)
        .then(r => r.blob())
        .then(blob => setRoomImage(new File([blob], 'room.png', { type: blob.type })))
        .catch(() => {});
    }
    if (prefill?.inspirationImageUrl && !prefill.inspirationImageUrl.startsWith('data:')) {
      fetch(prefill.inspirationImageUrl)
        .then(r => r.blob())
        .then(blob => setInspirationImage(new File([blob], 'inspiration.png', { type: blob.type })))
        .catch(() => {});
    }
  }, []);

  const roomInputRef = useRef<HTMLInputElement>(null);
  const inspirationInputRef = useRef<HTMLInputElement>(null);
  const roomUploadRef = useRef<HTMLDivElement>(null);
  const consentRef = useRef<HTMLDivElement>(null);
  const abortControllerRef = useRef<AbortController | null>(null);
  const progressIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Upload handlers
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e: React.DragEvent, type: 'room' | 'inspiration') => {
    e.preventDefault();
    e.stopPropagation();

    const file = e.dataTransfer.files[0];
    if (file && file.type.startsWith('image/')) {
      handleImageUpload(file, type);
    }
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>, type: 'room' | 'inspiration') => {
    const file = e.target.files?.[0];
    if (file) {
      handleImageUpload(file, type);
    }
  };

  const handleImageUpload = (file: File, type: 'room' | 'inspiration') => {
    const reader = new FileReader();
    reader.onloadend = () => {
      const preview = reader.result as string;
      if (type === 'room') {
        setRoomImage(file);
        setRoomPreview(preview);
        setRoomImageError('');
      } else {
        setInspirationImage(file);
        setInspirationPreview(preview);
      }
    };
    reader.readAsDataURL(file);
  };

  const removeImage = (type: 'room' | 'inspiration') => {
    if (type === 'room') {
      setRoomImage(null);
      setRoomPreview(null);
      if (roomInputRef.current) roomInputRef.current.value = '';
    } else {
      setInspirationImage(null);
      setInspirationPreview(null);
      if (inspirationInputRef.current) inspirationInputRef.current.value = '';
    }
  };


  const handleAddFurniture = (id: string) => {
    if (!selectedFurniture.includes(id)) {
      setSelectedFurniture([...selectedFurniture, id]);
    }
  };

  const handleRemoveFurniture = (id: string) => {
    setSelectedFurniture(selectedFurniture.filter(item => item !== id));
  };

  const handleAddCustomFurniture = () => {
    const trimmed = customFurnitureInput.trim();
    if (trimmed && !selectedFurniture.includes(trimmed)) {
      setSelectedFurniture([...selectedFurniture, trimmed]);
      setCustomFurnitureInput('');
    }
  };

  const handleCustomFurnitureKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleAddCustomFurniture();
    }
  };

  const handleRemoveFurnitureByName = () => {
    const trimmed = removeFurnitureInput.trim();
    if (trimmed && !removedFurniture.includes(trimmed)) {
      setRemovedFurniture([...removedFurniture, trimmed]);
      setRemoveFurnitureInput('');
    }
  };

  const handleDeleteFromRemovedList = (item: string) => {
    setRemovedFurniture(removedFurniture.filter(f => f !== item));
  };

  const handleRemoveFurnitureKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleRemoveFurnitureByName();
    }
  };

  const handleGenerateDesign = async () => {
    let hasValidationError = false;

    if (!roomImage && !roomPreview) {
      setRoomImageError('Please upload a room image to continue');
      hasValidationError = true;
    } else {
      setRoomImageError('');
    }

    if (!privacyConsent) {
      setConsentError('You must agree before generating a design');
      hasValidationError = true;
    } else {
      setConsentError('');
    }

    if (hasValidationError) {
      if (!roomImage && !roomPreview) {
        roomUploadRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      } else if (!privacyConsent) {
        consentRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
      return;
    }

    const resolvedProjectName = projectName.trim() ||
      `Design - ${new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}`;
    setProjectName(resolvedProjectName);

    setHasError(false);
    setProgress(0);
    setLoadingStage('loading');

    // Animate progress up to 90% while waiting for the API
    progressIntervalRef.current = setInterval(() => {
      setProgress(prev => {
        if (prev >= 90) {
          clearInterval(progressIntervalRef.current!);
          return 90;
        }
        return prev + 1.2;
      });
    }, 1000);

    const controller = new AbortController();
    abortControllerRef.current = controller;

    // If roomImage File isn't ready yet (URL-based prefill still loading), fetch it now
    let resolvedRoomImage = roomImage;
    if (!resolvedRoomImage && roomPreview && !roomPreview.startsWith('data:')) {
      try {
        const res = await fetch(roomPreview);
        const blob = await res.blob();
        resolvedRoomImage = new File([blob], 'room.png', { type: blob.type });
      } catch {
        clearInterval(progressIntervalRef.current!);
        setRoomImageError('Failed to load room image. Please re-upload.');
        setLoadingStage(null);
        return;
      }
    }

    const toAdd = selectedFurniture.map(id => {
      const item = furnitureData.find(f => f.id === id);
      return item ? item.name : id;
    });

    try {
      const imageUrl = await generateDesign(
        resolvedRoomImage!,
        inspirationImage,
        {
          style: selectedStyle,
          color_tone: selectedColorTone,
          room_type: selectedRoomType,
          to_remove: removedFurniture,
          to_add: toAdd,
        },
        resolvedProjectName,
        controller.signal
      );

      clearInterval(progressIntervalRef.current!);
      setProgress(100);

      // Save metadata for MyProjects page
      const filename = imageUrl.split('/').pop()!;
      const existing = JSON.parse(localStorage.getItem('reimagine_metadata') || '{}');
      existing[filename] = { projectName: resolvedProjectName, style: selectedStyle, roomType: selectedRoomType };
      localStorage.setItem('reimagine_metadata', JSON.stringify(existing));

      setTimeout(() => {
        navigate('/design-result', {
          state: {
            generatedImageUrl: imageUrl,
            beforeImageUrl: roomPreview,
            inspirationImageUrl: inspirationPreview,
            projectName: resolvedProjectName,
            preferences: {
              style: selectedStyle,
              colorTone: selectedColorTone,
              roomType: selectedRoomType,
              selectedFurniture,
              removedFurniture,
            },
          },
        });
      }, 500);
    } catch (err) {
      clearInterval(progressIntervalRef.current!);
      if ((err as Error).name !== 'AbortError') {
        setHasError(true);
      } else {
        setLoadingStage(null);
        setProgress(0);
      }
    }
  };

  const handleCancelGeneration = () => {
    abortControllerRef.current?.abort();
    clearInterval(progressIntervalRef.current!);
    setLoadingStage(null);
    setProgress(0);
    setHasError(false);
  };

  const filteredFurniture = furnitureData.filter(item => item.category === activeCategory);

  return (
    <div className="min-h-screen bg-stone-50">
      {/* Top Section */}
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
            <h1 className="text-xl text-stone-900">Design Your Room</h1>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate('/my-projects')}
              className="flex items-center gap-2 px-4 py-2 text-stone-700 hover:text-stone-900 hover:bg-stone-100 rounded-lg transition-colors"
            >
              <FolderOpen className="w-5 h-5" />
              <span>My Projects</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="space-y-6">
          {/* Upload Section */}
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <h2 className="text-[22px] text-stone-900 mb-6">Upload Your Room</h2>


            <div className="grid md:grid-cols-2 gap-6">
              {/* Project Name */}
              <div className="md:col-span-2 space-y-2">
                <label htmlFor="projectName" className="block text-[15px] text-stone-700">
                  Project Name
                </label>
                <input
                  id="projectName"
                  type="text"
                  value={projectName}
                  onChange={(e) => setProjectName(e.target.value)}
                  placeholder="e.g., Living Room Makeover"
                  className="w-full px-4 py-2.5 border border-stone-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-stone-400 focus:border-transparent text-[13px] placeholder:text-[13px]"
                />
              </div>

              {/* Room Image Upload - Compact */}
              <div ref={roomUploadRef} className="space-y-2">
                <label className="block text-[15px] text-stone-700">
                  Room Image <span className="text-red-500">*</span>
                </label>
                {!roomPreview ? (
                  <div
                    onDragOver={handleDragOver}
                    onDrop={(e) => handleDrop(e, 'room')}
                    onClick={() => roomInputRef.current?.click()}
                    className={`border-2 border-dashed rounded-xl p-6 text-center cursor-pointer transition-colors ${
                      roomImageError
                        ? 'border-red-400 bg-red-50 hover:border-red-500'
                        : 'border-stone-300 hover:border-stone-400 hover:bg-stone-50'
                    }`}
                  >
                    <CloudUpload className="w-8 h-8 text-stone-400 mx-auto mb-2" />
                    <p className="text-[13px] text-stone-600">Drag & drop or click</p>
                    <input
                      ref={roomInputRef}
                      type="file"
                      accept="image/*"
                      onChange={(e) => handleFileInput(e, 'room')}
                      className="hidden"
                    />
                  </div>
                ) : (
                  <div className="relative rounded-xl overflow-hidden border border-stone-300">
                    <img src={roomPreview} alt="Room preview" className="w-full h-32 object-cover" />
                    <button
                      type="button"
                      onClick={() => removeImage('room')}
                      className="absolute top-2 right-2 bg-white rounded-full p-1.5 shadow-lg hover:bg-stone-100"
                    >
                      <X className="w-4 h-4 text-stone-700" />
                    </button>
                  </div>
                )}
                {roomImageError && (
                  <p className="flex items-center gap-1.5 text-sm text-red-600">
                    <AlertCircle className="w-4 h-4 shrink-0" />
                    {roomImageError}
                  </p>
                )}
              </div>

              {/* Inspiration Image Upload - Compact */}
              <div className="space-y-2">
                <label className="block text-[15px] text-stone-700">
                  Inspiration Image
                </label>
                {!inspirationPreview ? (
                  <div
                    onDragOver={handleDragOver}
                    onDrop={(e) => handleDrop(e, 'inspiration')}
                    onClick={() => inspirationInputRef.current?.click()}
                    className="border-2 border-dashed border-stone-300 rounded-xl p-6 text-center cursor-pointer hover:border-stone-400 hover:bg-stone-50 transition-colors"
                  >
                    <CloudUpload className="w-8 h-8 text-stone-400 mx-auto mb-2" />
                    <p className="text-[13px] text-stone-600">Drag & drop or click</p>
                    <input
                      ref={inspirationInputRef}
                      type="file"
                      accept="image/*"
                      onChange={(e) => handleFileInput(e, 'inspiration')}
                      className="hidden"
                    />
                  </div>
                ) : (
                  <div className="relative rounded-xl overflow-hidden border border-stone-300">
                    <img src={inspirationPreview} alt="Inspiration preview" className="w-full h-32 object-cover" />
                    <button
                      type="button"
                      onClick={() => removeImage('inspiration')}
                      className="absolute top-2 right-2 bg-white rounded-full p-1.5 shadow-lg hover:bg-stone-100"
                    >
                      <X className="w-4 h-4 text-stone-700" />
                    </button>
                  </div>
                )}
              </div>

              {/* Privacy Consent */}
              <div ref={consentRef} className="md:col-span-2 space-y-2">
                <label className="flex items-start gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={privacyConsent}
                    onChange={(e) => {
                      setPrivacyConsent(e.target.checked);
                      if (e.target.checked) setConsentError('');
                    }}
                    className={`w-5 h-5 mt-0.5 rounded focus:ring-stone-400 ${
                      consentError ? 'border-red-400' : 'border-stone-300'
                    }`}
                  />
                  <span className="text-sm text-stone-700">
                    I agree that my uploaded images will only be processed temporarily.
                    <span className="text-red-500 ml-1">*</span>
                  </span>
                </label>
                {consentError && (
                  <p className="flex items-center gap-1.5 text-sm text-red-600 ml-8">
                    <AlertCircle className="w-4 h-4 shrink-0" />
                    {consentError}
                  </p>
                )}
              </div>

              {/* Upload Requirements */}
              <div className="md:col-span-2">
                <div className="bg-stone-50 rounded-xl p-4 text-sm text-stone-600">
                  <p className="font-medium text-stone-800 mb-2">Upload Requirements:</p>
                  <ul className="space-y-1 list-disc list-inside">
                    <li>Your current room photo (clear, well-lit)</li>
<li>Both images should be in JPG, PNG, or WebP format</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>

          {/* Room Preview */}
          <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
            <div className="aspect-video bg-stone-200 relative">
              {roomPreview ? (
                <img
                  src={roomPreview}
                  alt="Room preview"
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex flex-col items-center justify-center gap-3 text-stone-400">
                  <CloudUpload className="w-12 h-12" />
                  <p className="text-[15px]">Your room preview will appear here</p>
                  <p className="text-[13px]">Upload a room image above to get started</p>
                </div>
              )}
            </div>
          </div>

          {/* Design Preferences */}
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <h2 className="text-[22px] text-stone-900 mb-6">Design Preferences</h2>
            <div className="grid md:grid-cols-3 gap-6">
              <Combobox
                label="Style"
                value={selectedStyle}
                onChange={(value) => setSelectedStyle(value)}
                options={styles}
                placeholder="Select a style"
              />
              <Combobox
                label="Color Tone"
                value={selectedColorTone}
                onChange={(value) => setSelectedColorTone(value)}
                options={colorTones}
                placeholder="Select a color tone"
              />
              <Combobox
                label="Room Type"
                value={selectedRoomType}
                onChange={(value) => setSelectedRoomType(value)}
                options={roomTypes}
                placeholder="Select a room type"
              />
            </div>
          </div>

          {/* Remove Existing Furniture Section */}
          <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
            {/* Header */}
            <div className="border-b border-stone-200 px-6 py-4 flex items-center justify-between">
              <h2 className="text-[22px] text-stone-900">Remove Existing Furniture</h2>
              <button
                onClick={() => setRemovedFurniture([])}
                className="text-[14px] text-stone-600 hover:text-stone-900 px-4 py-2 hover:bg-stone-50 rounded-lg transition-colors whitespace-nowrap"
              >
                Clear All
              </button>
            </div>

            {/* Removed Furniture Display */}
            {removedFurniture.length > 0 && (
              <div className="px-6 pt-4 pb-2">
                <div className="flex flex-wrap gap-2">
                  {removedFurniture.map((item, index) => (
                    <div
                      key={index}
                      className="flex items-center gap-2 bg-red-50 px-3 py-2 rounded-full text-[14px] text-red-700 border border-red-200"
                    >
                      <span>{item}</span>
                      <button
                        onClick={() => handleDeleteFromRemovedList(item)}
                        className="ml-1 hover:bg-red-100 rounded-full p-0.5"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Remove Input */}
            <div className="px-6 pt-4 pb-6">
              <label className="block text-[15px] text-stone-700 mb-2">
                Type furniture to remove
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={removeFurnitureInput}
                  onChange={(e) => setRemoveFurnitureInput(e.target.value)}
                  onKeyDown={handleRemoveFurnitureKeyDown}
                  placeholder="Type furniture to remove and press Enter"
                  className="flex-1 px-4 py-2.5 border-2 border-stone-300 rounded-xl focus:outline-none focus:border-stone-400 transition-colors text-[15px] placeholder:text-[13px] placeholder:text-stone-400"
                />
                <button
                  onClick={handleRemoveFurnitureByName}
                  className="bg-stone-800 text-white px-6 py-2.5 rounded-xl hover:bg-stone-700 transition-colors flex items-center justify-center gap-2 text-[14px] w-32"
                >
                  <X className="w-4 h-4" />
                  Remove
                </button>
              </div>
            </div>
          </div>

          {/* Add Custom Furniture Section */}
          <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
            {/* Header */}
            <div className="border-b border-stone-200 px-6 py-4 flex items-center justify-between">
              <h2 className="text-[22px] text-stone-900">Add Custom Furniture</h2>
              <button
                onClick={() => setSelectedFurniture([])}
                className="text-[14px] text-stone-600 hover:text-stone-900 px-4 py-2 hover:bg-stone-50 rounded-lg transition-colors whitespace-nowrap"
              >
                Clear All
              </button>
            </div>

            {/* Selected Furniture Display */}
            {selectedFurniture.length > 0 && (
              <div className="px-6 pt-4 pb-2">
                <div className="flex flex-wrap gap-2">
                  {selectedFurniture.map(id => {
                    const item = furnitureData.find(f => f.id === id);
                    if (item) {
                      return (
                        <div
                          key={id}
                          className="flex items-center gap-2 bg-stone-100 px-3 py-2 rounded-full text-[14px] text-stone-700"
                        >
                          {item.icon}
                          <span>{item.name}</span>
                          <button
                            onClick={() => handleRemoveFurniture(id)}
                            className="ml-1 hover:bg-stone-200 rounded-full p-0.5"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                      );
                    }
                    // Custom furniture (not in predefined list)
                    return (
                      <div
                        key={id}
                        className="flex items-center gap-2 bg-stone-100 px-3 py-2 rounded-full text-[14px] text-stone-700"
                      >
                        <span>{id}</span>
                        <button
                          onClick={() => handleRemoveFurniture(id)}
                          className="ml-1 hover:bg-stone-200 rounded-full p-0.5"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Add Custom Furniture Input */}
            <div className="px-6 pt-4 pb-2">
              <label className="block text-[15px] text-stone-700 mb-2">
                Type furniture to add
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={customFurnitureInput}
                  onChange={(e) => setCustomFurnitureInput(e.target.value)}
                  onKeyDown={handleCustomFurnitureKeyDown}
                  placeholder="Type furniture name and press Enter"
                  className="flex-1 px-4 py-2.5 border-2 border-stone-300 rounded-xl focus:outline-none focus:border-stone-400 transition-colors text-[15px] placeholder:text-[13px] placeholder:text-stone-400"
                />
                <button
                  onClick={handleAddCustomFurniture}
                  className="bg-stone-800 text-white px-6 py-2.5 rounded-xl hover:bg-stone-700 transition-colors flex items-center justify-center gap-2 text-[14px] w-32"
                >
                  <Plus className="w-4 h-4" />
                  Add
                </button>
              </div>
            </div>

            {/* Category Tabs */}
            <div className="border-t border-stone-200 px-6 flex items-center mt-2">
              <div className="flex gap-1 overflow-x-auto">
                {categories.map(category => (
                  <button
                    key={category}
                    onClick={() => setActiveCategory(category)}
                    className={`px-6 py-4 whitespace-nowrap transition-colors border-b-2 text-[15px] ${
                      activeCategory === category
                        ? 'border-stone-800 text-stone-900'
                        : 'border-transparent text-stone-500 hover:text-stone-700'
                    }`}
                  >
                    {category}
                  </button>
                ))}
              </div>
            </div>

            {/* Furniture Items Grid */}
            <div className="p-6">
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
                {filteredFurniture.map(item => {
                  const isSelected = selectedFurniture.includes(item.id);
                  return (
                    <button
                      key={item.id}
                      onClick={() => isSelected ? handleRemoveFurniture(item.id) : handleAddFurniture(item.id)}
                      className={`relative flex flex-col items-center gap-3 p-6 rounded-xl border-2 transition-all ${
                        isSelected
                          ? 'border-stone-800 bg-stone-50 shadow-md'
                          : 'border-stone-200 hover:border-stone-400 hover:bg-stone-50'
                      }`}
                    >
                      <div className="text-stone-700">
                        {item.icon}
                      </div>
                      <span className="text-[14px] text-stone-700 text-center">{item.name}</span>
                      {isSelected && (
                        <div className="absolute top-2 right-2 bg-stone-800 text-white rounded-full p-1">
                          <Plus className="w-3 h-3 rotate-45" />
                        </div>
                      )}
                      {!isSelected && (
                        <Plus className="absolute top-2 right-2 w-5 h-5 text-stone-400" />
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Generate New Design Button */}
          <div className="bg-white rounded-2xl shadow-lg p-8">
            <div className="text-center mb-6">
              <h2 className="text-[22px] text-stone-900 mb-2">Ready to Transform Your Room?</h2>
              <p className="text-[15px] text-stone-600">
                Click below to generate your personalized AI-powered interior design
              </p>
            </div>
            <div className={`grid gap-3 ${prefill?.generatedImageUrl ? 'grid-cols-2' : 'grid-cols-1'}`}>
              {prefill?.generatedImageUrl && (
                <button
                  onClick={() => navigate('/design-result', {
                    state: {
                      generatedImageUrl: prefill.generatedImageUrl,
                      beforeImageUrl: prefill.beforeImageUrl,
                      projectName: prefill.projectName,
                      preferences: {
                        style: prefill.style,
                        colorTone: prefill.colorTone,
                        roomType: prefill.roomType,
                        selectedFurniture: prefill.selectedFurniture,
                        removedFurniture: prefill.removedFurniture,
                      },
                    },
                  })}
                  className="w-full border-2 border-stone-300 text-stone-700 px-8 py-4 rounded-xl hover:border-stone-400 hover:bg-stone-50 transition-colors flex items-center justify-center gap-2 text-[16px]"
                >
                  Cancel
                </button>
              )}
              <button
                onClick={handleGenerateDesign}
                className="w-full bg-stone-800 text-white px-8 py-4 rounded-xl hover:bg-stone-700 transition-colors shadow-lg hover:shadow-xl flex items-center justify-center gap-2 text-[16px]"
              >
                <Sparkles className="w-5 h-5" />
                Generate New Design
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Loading Modal */}
      {loadingStage && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-6">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-8">
            {!hasError ? (
              <>
                {/* Title */}
                <h2 className="text-[24px] text-stone-900 text-center mb-2">
                  Analyzing Your Room
                </h2>

                {/* Subtext */}
                <p className="text-[15px] text-stone-600 text-center mb-8">
                  Our AI is generating your personalized interior design.
                </p>

                {/* Animated Loading Icon */}
                <div className="flex justify-center mb-6">
                  <Loader2 className="w-12 h-12 text-stone-700 animate-spin" />
                </div>

                {/* Progress Bar */}
                <div className="mb-6">
                  <div className="h-2 bg-stone-200 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-stone-800 rounded-full transition-all duration-700 ease-out"
                      style={{ width: `${progress}%` }}
                    />
                  </div>
                  <div className="flex justify-between items-center mt-2">
                    <p className="text-[14px] text-stone-600">Generating your design...</p>
                    <p className="text-[14px] text-stone-600">{Math.round(progress)}%</p>
                  </div>
                </div>


                {/* Estimated Time */}
                <p className="text-[13px] text-stone-500 text-center mb-6">
                  Estimated time: ~2-3 minutes
                </p>

                {/* Cancel Button */}
                <button
                  onClick={handleCancelGeneration}
                  className="w-full px-4 py-3 border-2 border-stone-300 text-stone-700 rounded-xl hover:border-stone-400 hover:bg-stone-50 transition-colors text-[15px]"
                >
                  Cancel
                </button>
              </>
            ) : (
              <>
                {/* Error State */}
                <div className="text-center">
                  <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <X className="w-8 h-8 text-red-600" />
                  </div>
                  <h2 className="text-[24px] text-stone-900 mb-2">
                    Processing Failed
                  </h2>
                  <p className="text-[15px] text-stone-600 mb-6">
                    We encountered an error while generating your design. Please try again.
                  </p>
                  <button
                    onClick={handleCancelGeneration}
                    className="w-full px-4 py-3 bg-stone-800 text-white rounded-xl hover:bg-stone-700 transition-colors text-[15px]"
                  >
                    Try Again
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}