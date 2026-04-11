import { Upload, Palette, Sparkles } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

export function Steps() {
  const { t } = useLanguage();

  const steps = [
    {
      icon: Upload,
      title: t('steps_step1_title'),
      description: t('steps_step1_desc'),
    },
    {
      icon: Palette,
      title: t('steps_step2_title'),
      description: t('steps_step2_desc'),
    },
    {
      icon: Sparkles,
      title: t('steps_step3_title'),
      description: t('steps_step3_desc'),
    },
  ];

  return (
    <section className="w-full bg-stone-50 py-20">
      <div className="max-w-7xl mx-auto px-6">
        <h2 className="text-4xl text-center text-stone-900 mb-16">
          {t('steps_title')}
        </h2>
        <div className="grid md:grid-cols-3 gap-8">
          {steps.map((step, index) => (
            <div
              key={index}
              className="bg-white p-8 rounded-3xl shadow-md hover:shadow-xl transition-shadow"
            >
              <div className="w-16 h-16 bg-stone-100 rounded-full flex items-center justify-center mb-6">
                <step.icon className="w-8 h-8 text-stone-700" />
              </div>
              <h3 className="text-xl text-stone-900 mb-3">
                {step.title}
              </h3>
              <p className="text-stone-600 leading-relaxed">
                {step.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
