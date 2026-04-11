import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';
import { getProjects, clearHistory, Project } from '../api';
import {
  Home,
  Plus,
  Search,
  Eye,
  Download,
  Trash2,
  FolderOpen
} from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

type SortOption = 'recent' | 'oldest';

export function MyProjects() {
  const navigate = useNavigate();
  const { t, lang, toggleLang } = useLanguage();
  const [projects, setProjects] = useState<Project[]>([]);
  const [loadError, setLoadError] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<SortOption>('recent');
  const [projectToDelete, setProjectToDelete] = useState<string | null>(null);
  const [activeStyleFilter, setActiveStyleFilter] = useState<string | null>(null);
  const [activeRoomFilter, setActiveRoomFilter] = useState<string | null>(null);

  useEffect(() => {
    getProjects()
      .then(data => setProjects(data))
      .catch(() => setLoadError(t('myprojects_loadError')));
  }, []);

  const handleViewProject = (project: Project) => {
    navigate('/design-result', {
      state: {
        generatedImageUrl: project.outputImageUrl,
        beforeImageUrl: project.inputImageUrl,
        projectName: project.projectName,
        preferences: project.preferences,
      },
    });
  };

  const handleDownloadProject = async (project: Project) => {
    if (!project.outputImageUrl) {
      alert('This project has no image to download.');
      return;
    }
    try {
      const response = await fetch(project.outputImageUrl);
      if (!response.ok) throw new Error('Image not found');
      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${project.projectName}.png`;
      a.click();
      setTimeout(() => URL.revokeObjectURL(url), 1000);
    } catch {
      alert('Failed to download image.');
    }
  };

  const confirmDelete = async () => {
    try {
      await clearHistory();
      setProjects([]);
    } catch {
      alert('Failed to clear history.');
    }
    setProjectToDelete(null);
  };

  const availableStyles = [...new Set(projects.map(p => p.preferences?.style).filter(Boolean))] as string[];
  const availableRooms = [...new Set(projects.map(p => p.preferences?.roomType).filter(Boolean))] as string[];

  const filteredProjects = projects
    .filter(project =>
      project.projectName.toLowerCase().includes(searchQuery.toLowerCase()) &&
      (!activeStyleFilter || project.preferences?.style === activeStyleFilter) &&
      (!activeRoomFilter || project.preferences?.roomType === activeRoomFilter)
    )
    .sort((a, b) =>
      sortBy === 'recent' ? b.createdAt - a.createdAt : a.createdAt - b.createdAt
    );

  const formatDate = (timestamp: number) =>
    new Date(timestamp * 1000).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });

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
            <h1 className="text-xl text-stone-900">{t('myprojects_title')}</h1>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate('/style-selection')}
              className="flex items-center gap-2 bg-stone-800 text-white px-6 py-3 rounded-full hover:bg-stone-700 transition-colors shadow-lg hover:shadow-xl"
            >
              <Plus className="w-5 h-5" />
              {t('nav_newDesign')}
            </button>
            <button
              onClick={toggleLang}
              className="flex items-center gap-1.5 px-3 py-1.5 border border-stone-300 rounded-lg text-sm text-stone-600 hover:text-stone-900 hover:border-stone-400 hover:bg-stone-50 transition-colors"
            >
              {lang === 'en' ? 'TH' : 'EN'}
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="mb-8">
          <p className="text-[15px] text-stone-600">{t('myprojects_subtitle')}</p>
        </div>

        {loadError && (
          <div className="bg-red-50 border border-red-200 rounded-xl p-4 text-red-800 text-sm mb-6">
            {loadError}
          </div>
        )}

        {projects.length === 0 && !loadError ? (
          <div className="bg-white rounded-2xl shadow-lg p-16 text-center">
            <FolderOpen className="w-16 h-16 text-stone-400 mx-auto mb-4" />
            <h2 className="text-[24px] text-stone-900 mb-2">{t('myprojects_empty_title')}</h2>
            <p className="text-[15px] text-stone-600 mb-6">{t('myprojects_empty_subtitle')}</p>
            <button
              onClick={() => navigate('/style-selection')}
              className="inline-flex items-center gap-2 bg-stone-800 text-white px-8 py-4 rounded-full hover:bg-stone-700 transition-colors shadow-lg hover:shadow-xl"
            >
              <Plus className="w-5 h-5" />
              {t('myprojects_empty_cta')}
            </button>
          </div>
        ) : (
          <>
            {/* Search, Filter and Sort */}
            <div className="bg-white rounded-2xl shadow-lg p-6 mb-6 space-y-4">
              {/* Row 1: Search + Dropdowns */}
              <div className="flex flex-col md:flex-row gap-3">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-stone-400" />
                  <input
                    type="text"
                    placeholder={t('myprojects_search')}
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 border border-stone-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-stone-400 focus:border-transparent text-[15px] placeholder:text-[13px]"
                  />
                </div>
                <div className="relative">
                  <select
                    value={activeRoomFilter ?? ''}
                    onChange={(e) => setActiveRoomFilter(e.target.value || null)}
                    className="appearance-none pl-4 pr-10 py-2.5 border border-stone-300 rounded-xl text-[14px] text-stone-700 focus:outline-none focus:ring-2 focus:ring-stone-400 bg-white w-full"
                  >
                    <option value="">{t('myprojects_allRoomTypes')}</option>
                    {availableRooms.map(room => (
                      <option key={room} value={room}>{room}</option>
                    ))}
                  </select>
                  <svg className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400 pointer-events-none" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
                <div className="relative">
                  <select
                    value={activeStyleFilter ?? ''}
                    onChange={(e) => setActiveStyleFilter(e.target.value || null)}
                    className="appearance-none pl-4 pr-10 py-2.5 border border-stone-300 rounded-xl text-[14px] text-stone-700 focus:outline-none focus:ring-2 focus:ring-stone-400 bg-white w-full"
                  >
                    <option value="">{t('myprojects_allStyles')}</option>
                    {availableStyles.map(style => (
                      <option key={style} value={style}>{style}</option>
                    ))}
                  </select>
                  <svg className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400 pointer-events-none" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
              </div>
              {/* Row 2: Sort */}
              <div className="flex items-center gap-2">
                <span className="text-[14px] text-stone-600">{t('myprojects_sortBy')}</span>
                <button
                  onClick={() => setSortBy('recent')}
                  className={`px-3 py-1 rounded-lg text-[14px] transition-colors ${
                    sortBy === 'recent' ? 'bg-stone-800 text-white' : 'bg-stone-100 text-stone-700 hover:bg-stone-200'
                  }`}
                >
                  {t('myprojects_recent')}
                </button>
                <button
                  onClick={() => setSortBy('oldest')}
                  className={`px-3 py-1 rounded-lg text-[14px] transition-colors ${
                    sortBy === 'oldest' ? 'bg-stone-800 text-white' : 'bg-stone-100 text-stone-700 hover:bg-stone-200'
                  }`}
                >
                  {t('myprojects_oldest')}
                </button>
              </div>
            </div>

            {/* Projects Grid */}
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredProjects.map(project => (
                <div
                  key={project.id}
                  className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow group"
                >
                  <div className="relative aspect-video bg-stone-200 overflow-hidden">
                    <img
                      src={project.outputImageUrl}
                      alt={project.projectName}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                      <button
                        onClick={() => handleViewProject(project)}
                        className="bg-white text-stone-800 p-2 rounded-lg hover:bg-stone-100 transition-colors"
                        title="View Project"
                      >
                        <Eye className="w-5 h-5" />
                      </button>
                      <button
                        onClick={() => handleDownloadProject(project)}
                        className="bg-white text-stone-800 p-2 rounded-lg hover:bg-stone-100 transition-colors"
                        title="Download"
                      >
                        <Download className="w-5 h-5" />
                      </button>
                      <button
                        onClick={() => setProjectToDelete('all')}
                        className="bg-red-500 text-white p-2 rounded-lg hover:bg-red-600 transition-colors"
                        title="Clear All History"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </div>
                  </div>

                  <div className="p-4">
                    <h3 className="text-[18px] text-stone-900 mb-2">{project.projectName}</h3>
                    <div className="flex flex-wrap gap-1.5 mb-2">
                      {project.preferences?.style && (
                        <span className="px-2 py-0.5 bg-stone-100 text-stone-600 rounded-full text-[12px]">
                          {project.preferences.style}
                        </span>
                      )}
                      {project.preferences?.roomType && (
                        <span className="px-2 py-0.5 bg-stone-100 text-stone-600 rounded-full text-[12px]">
                          {project.preferences.roomType}
                        </span>
                      )}
                    </div>
                    <p className="text-[14px] text-stone-500">{formatDate(project.createdAt)}</p>
                  </div>
                </div>
              ))}
            </div>

            {filteredProjects.length === 0 && (
              <div className="bg-white rounded-2xl shadow-lg p-12 text-center">
                <Search className="w-12 h-12 text-stone-400 mx-auto mb-4" />
                <p className="text-[15px] text-stone-600">{t('myprojects_noResults')}</p>
              </div>
            )}
          </>
        )}
      </div>

      {/* Delete Confirmation Modal */}
      {projectToDelete && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-6">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-8">
            <h2 className="text-[24px] text-stone-900 mb-4">{t('myprojects_clearHistory')}</h2>
            <p className="text-[15px] text-stone-600 mb-6">
              {t('myprojects_clearHistoryDesc')}
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setProjectToDelete(null)}
                className="flex-1 px-4 py-3 border-2 border-stone-300 text-stone-700 rounded-xl hover:border-stone-400 hover:bg-stone-50 transition-colors text-[15px]"
              >
                {t('myprojects_cancel')}
              </button>
              <button
                onClick={confirmDelete}
                className="flex-1 px-4 py-3 bg-red-500 text-white rounded-xl hover:bg-red-600 transition-colors text-[15px]"
              >
                {t('myprojects_delete')}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
