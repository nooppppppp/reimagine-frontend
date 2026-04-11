import { useState } from 'react';
import { Link } from 'react-router';
import { Eye, EyeOff } from 'lucide-react';
import { ImageWithFallback } from '../components/figma/ImageWithFallback';
import { useLanguage } from '../context/LanguageContext';

export function Login() {
  const { t } = useLanguage();
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Login attempt', { email, password, rememberMe });
  };

  return (
    <div className="min-h-screen flex">
      {/* Left side - Image with overlay */}
      <div className="hidden lg:flex lg:w-2/5 relative bg-stone-900">
        <ImageWithFallback
          src="https://images.unsplash.com/photo-1592401526914-7e5d94a8d6fa?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb2Rlcm4lMjBsaXZpbmclMjByb29tJTIwYWVzdGhldGljJTIwaW50ZXJpb3J8ZW58MXx8fHwxNzczMDQ0MzAzfDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
          alt="Modern living room interior"
          className="w-full h-full object-cover opacity-80"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-stone-900/90 via-stone-900/50 to-transparent flex items-end">
          <div className="p-16 text-white space-y-4">
            <h1 className="text-5xl leading-tight">
              {t('login_welcomeBack')}
            </h1>
            <p className="text-xl text-stone-200">
              {t('login_tagline')}
            </p>
          </div>
        </div>
      </div>

      {/* Right side - Login form */}
      <div className="w-full lg:w-3/5 flex items-center justify-center p-8 bg-stone-50">
        <div className="w-full max-w-sm">
          <div className="bg-white rounded-3xl shadow-xl p-6 space-y-5">
            <div className="space-y-1.5">
              <h2 className="text-2xl text-stone-900">
                {t('login_title')}
              </h2>
              <p className="text-sm text-stone-600">
                {t('login_subtitle')}
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Email field */}
              <div className="space-y-1.5">
                <label htmlFor="email" className="block text-xs text-stone-700">
                  {t('login_email')}
                </label>
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  className="w-full px-3.5 py-2.5 border border-stone-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-stone-400 focus:border-transparent"
                  required
                />
              </div>

              {/* Password field */}
              <div className="space-y-1.5">
                <label htmlFor="password" className="block text-xs text-stone-700">
                  {t('login_password')}
                </label>
                <div className="relative">
                  <input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder={t('login_passwordPlaceholder')}
                    className="w-full px-3.5 py-2.5 border border-stone-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-stone-400 focus:border-transparent pr-10"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-500 hover:text-stone-700"
                  >
                    {showPassword ? (
                      <EyeOff className="w-4 h-4" />
                    ) : (
                      <Eye className="w-4 h-4" />
                    )}
                  </button>
                </div>
              </div>

              {/* Remember me and Forgot password */}
              <div className="flex items-center justify-between">
                <label className="flex items-center gap-1.5 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="w-3.5 h-3.5 rounded border-stone-300 text-stone-800 focus:ring-stone-400"
                  />
                  <span className="text-xs text-stone-700">{t('login_rememberMe')}</span>
                </label>
                <a href="#forgot" className="text-xs text-stone-600 hover:text-stone-900">
                  {t('login_forgotPassword')}
                </a>
              </div>

              {/* Login button */}
              <button
                type="submit"
                className="w-full bg-stone-800 text-white py-2.5 rounded-full text-sm hover:bg-stone-700 transition-colors shadow-lg hover:shadow-xl"
              >
                {t('login_button')}
              </button>
            </form>

            {/* Sign up link */}
            <div className="text-center text-xs">
              <span className="text-stone-600">{t('login_noAccount')}</span>
              <a href="#signup" className="text-stone-800 hover:text-stone-900 font-medium">
                {t('login_signUp')}
              </a>
            </div>

            {/* Divider */}
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-stone-300"></div>
              </div>
              <div className="relative flex justify-center text-xs">
                <span className="bg-white px-3 text-stone-500">{t('login_orContinueWith')}</span>
              </div>
            </div>

            {/* Social login buttons */}
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                className="flex items-center justify-center gap-1.5 px-3 py-2.5 border border-stone-300 rounded-xl hover:bg-stone-50 transition-colors"
              >
                <svg className="w-4 h-4" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                </svg>
                <span className="text-stone-700 text-sm">Google</span>
              </button>
              <button
                type="button"
                className="flex items-center justify-center gap-1.5 px-3 py-2.5 border border-stone-300 rounded-xl hover:bg-stone-50 transition-colors"
              >
                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M17.05 20.28c-.98.95-2.05.8-3.08.35-1.09-.46-2.09-.48-3.24 0-1.44.62-2.2.44-3.06-.35C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.8 1.18-.24 2.31-.93 3.57-.84 1.51.12 2.65.72 3.4 1.8-3.12 1.87-2.38 5.98.48 7.13-.57 1.5-1.31 2.99-2.54 4.09l.01-.01zM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.34 4.5-3.74 4.25z" />
                </svg>
                <span className="text-stone-700 text-sm">Apple</span>
              </button>
            </div>
          </div>

          {/* Back to home link */}
          <div className="text-center mt-6">
            <Link to="/" className="text-stone-600 hover:text-stone-900 text-sm">
              {t('login_backToHome')}
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
