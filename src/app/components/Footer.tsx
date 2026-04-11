import { Facebook, Twitter, Instagram, Linkedin } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

export function Footer() {
  const { t } = useLanguage();

  return (
    <footer className="w-full bg-stone-900 text-white py-16">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid md:grid-cols-4 gap-12 mb-12">
          <div className="md:col-span-2">
            <h3 className="text-xl mb-4">ReImagine</h3>
            <p className="text-stone-400 text-sm">
              {t('footer_tagline')}
            </p>
          </div>
          <div>
            <h4 className="mb-4">{t('footer_contact')}</h4>
            <ul className="space-y-2 text-stone-400">
              <li>hello@reimagine.com</li>
              <li>+1 (555) 123-4567</li>
              <li>San Francisco, CA</li>
            </ul>
          </div>
          <div>
            <h4 className="mb-4">{t('footer_followUs')}</h4>
            <div className="flex gap-4">
              <a
                href="#facebook"
                className="w-10 h-10 bg-stone-800 rounded-full flex items-center justify-center hover:bg-stone-700 transition-colors"
              >
                <Facebook className="w-5 h-5" />
              </a>
              <a
                href="#twitter"
                className="w-10 h-10 bg-stone-800 rounded-full flex items-center justify-center hover:bg-stone-700 transition-colors"
              >
                <Twitter className="w-5 h-5" />
              </a>
              <a
                href="#instagram"
                className="w-10 h-10 bg-stone-800 rounded-full flex items-center justify-center hover:bg-stone-700 transition-colors"
              >
                <Instagram className="w-5 h-5" />
              </a>
              <a
                href="#linkedin"
                className="w-10 h-10 bg-stone-800 rounded-full flex items-center justify-center hover:bg-stone-700 transition-colors"
              >
                <Linkedin className="w-5 h-5" />
              </a>
            </div>
          </div>
        </div>
        <div className="border-t border-stone-800 pt-8 text-center text-stone-400 text-sm">
          {t('footer_rights')}
        </div>
      </div>
    </footer>
  );
}
