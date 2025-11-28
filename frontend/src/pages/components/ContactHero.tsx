import { ImageWithFallback } from './figma/ImageWithFallback';
import { Hammer, Ruler, PaintBucket } from 'lucide-react';

export function ContactHero() {
  return (
    <div className="relative bg-slate-900 text-white overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0 opacity-20">
        <ImageWithFallback 
          src="https://images.unsplash.com/photo-1581092918056-0c4c3acd3789?w=1200&q=80"
          alt="Renovation background"
          className="w-full h-full object-cover"
        />
      </div>
      
      {/* Grid Overlay */}
      <div className="absolute inset-0 opacity-5" style={{
        backgroundImage: `
          linear-gradient(rgba(255,255,255,.1) 1px, transparent 1px),
          linear-gradient(90deg, rgba(255,255,255,.1) 1px, transparent 1px)
        `,
        backgroundSize: '50px 50px'
      }}></div>

      {/* Content */}
      <div className="relative container mx-auto px-4 py-20 md:py-28">
        <div className="max-w-4xl mx-auto text-center">
          {/* Decorative Icons */}
          <div className="flex justify-center gap-8 mb-8">
            <div className="w-16 h-16 bg-orange-500/20 rounded-lg flex items-center justify-center border border-orange-500/30 transform rotate-3">
              <Hammer className="w-8 h-8 text-orange-400" />
            </div>
            <div className="w-16 h-16 bg-blue-500/20 rounded-lg flex items-center justify-center border border-blue-500/30 transform -rotate-2">
              <Ruler className="w-8 h-8 text-blue-400" />
            </div>
            <div className="w-16 h-16 bg-green-500/20 rounded-lg flex items-center justify-center border border-green-500/30 transform rotate-2">
              <PaintBucket className="w-8 h-8 text-green-400" />
            </div>
          </div>

          <h1 className="mb-6 text-white">Контакты</h1>
          <p className="text-slate-300 max-w-2xl mx-auto text-lg">
            Свяжитесь с Team X1 для онлайн-помощи в оформлении перепланировки без проблем с законом
          </p>

          {/* Decorative Lines */}
          <div className="mt-12 flex items-center justify-center gap-4">
            <div className="h-px w-20 bg-gradient-to-r from-transparent to-orange-500"></div>
            <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
            <div className="h-px w-20 bg-gradient-to-l from-transparent to-orange-500"></div>
          </div>
        </div>
      </div>

      {/* Bottom Wave */}
      <div className="absolute bottom-0 left-0 right-0">
        <svg viewBox="0 0 1440 48" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-12">
          <path d="M0 48H1440V24C1440 24 1200 0 720 0C240 0 0 24 0 24V48Z" fill="rgb(248 250 252)" />
        </svg>
      </div>
    </div>
  );
}
