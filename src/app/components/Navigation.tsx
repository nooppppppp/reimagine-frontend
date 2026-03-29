import logoImage from '../../assets/9a3aeb014e2d2d3eaafa4a8a334e6c2d6d3ff092.png';
import { Link } from 'react-router';

export function Navigation() {
  return (
    <nav className="w-full bg-white border-b border-stone-200">
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-3">
          <img 
            src={logoImage} 
            alt="ReImagine Logo" 
            className="h-10 w-10 object-cover object-top"
          />
          <div className="text-2xl text-stone-800 tracking-tight">
            ReImagine
          </div>
        </Link>
        <div className="flex gap-8 items-center">
          <Link to="/style-selection" className="text-stone-600 hover:text-stone-900 transition-colors">
            New Design
          </Link>
          <Link to="/my-projects" className="text-stone-600 hover:text-stone-900 transition-colors">
            My Projects
          </Link>
        </div>
      </div>
    </nav>
  );
}