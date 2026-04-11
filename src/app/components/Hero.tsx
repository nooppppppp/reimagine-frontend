import { ImageWithFallback } from './figma/ImageWithFallback';
import { Link } from 'react-router';
import { useLanguage } from '../context/LanguageContext';

export function Hero() {
  const { t } = useLanguage();

  return (
    <section className="w-full bg-gradient-to-b from-white to-stone-50">
      <div className="max-w-7xl mx-auto px-6 py-20">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div className="space-y-6">
            <h1 className="text-5xl text-stone-900 leading-tight">
              {t('hero_title')}
            </h1>
            <p className="text-xl text-stone-600">
              {t('hero_subtitle')}
            </p>
            <Link to="/style-selection">
              <button className="bg-stone-800 text-white px-8 py-4 rounded-full hover:bg-stone-700 transition-colors shadow-lg hover:shadow-xl">
                {t('hero_cta')}
              </button>
            </Link>
          </div>
          <div className="rounded-3xl overflow-hidden shadow-2xl">
            <ImageWithFallback
              src="https://images.unsplash.com/photo-1667584523543-d1d9cc828a15?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb2Rlcm4lMjBsaXZpbmclMjByb29tJTIwaW50ZXJpb3J8ZW58MXx8fHwxNzczMDMzNzkxfDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
              alt="Modern living room interior"
              className="w-full h-full object-cover"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
