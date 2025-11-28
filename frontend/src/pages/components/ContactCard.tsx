import { Phone, Mail, ExternalLink } from 'lucide-react';

interface ContactCardProps {
  icon: 'phone' | 'mail';
  title: string;
  value: string;
  href: string;
  description: string;
}

export function ContactCard({ icon, title, value, href, description }: ContactCardProps) {
  const Icon = icon === 'phone' ? Phone : Mail;
  const bgColor = icon === 'phone' ? 'bg-green-50' : 'bg-blue-50';
  const borderColor = icon === 'phone' ? 'border-green-500' : 'border-blue-500';
  const iconColor = icon === 'phone' ? 'text-green-600' : 'text-blue-600';
  const hoverColor = icon === 'phone' ? 'hover:border-green-600' : 'hover:border-blue-600';

  return (
    <a 
      href={href}
      className={`block bg-white rounded-lg p-8 border-2 ${borderColor} ${hoverColor} transition-all hover:shadow-lg group relative overflow-hidden`}
    >
      {/* Blueprint Lines Background */}
      <div className="absolute top-0 right-0 w-32 h-32 opacity-5">
        <svg viewBox="0 0 100 100" className="w-full h-full">
          <line x1="0" y1="20" x2="100" y2="20" stroke="currentColor" strokeWidth="0.5"/>
          <line x1="0" y1="40" x2="100" y2="40" stroke="currentColor" strokeWidth="0.5"/>
          <line x1="0" y1="60" x2="100" y2="60" stroke="currentColor" strokeWidth="0.5"/>
          <line x1="0" y1="80" x2="100" y2="80" stroke="currentColor" strokeWidth="0.5"/>
          <line x1="20" y1="0" x2="20" y2="100" stroke="currentColor" strokeWidth="0.5"/>
          <line x1="40" y1="0" x2="40" y2="100" stroke="currentColor" strokeWidth="0.5"/>
          <line x1="60" y1="0" x2="60" y2="100" stroke="currentColor" strokeWidth="0.5"/>
          <line x1="80" y1="0" x2="80" y2="100" stroke="currentColor" strokeWidth="0.5"/>
        </svg>
      </div>

      <div className="relative z-10">
        <div className={`w-16 h-16 ${bgColor} rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
          <Icon className={`w-8 h-8 ${iconColor}`} />
        </div>
        
        <h3 className="mb-2 text-slate-900">{title}</h3>
        <p className="text-slate-900 mb-2 flex items-center gap-2">
          {value}
          <ExternalLink className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity" />
        </p>
        <p className="text-slate-500 text-sm">{description}</p>

        {/* Corner Marks (like in blueprints) */}
        <div className="absolute top-2 left-2 w-4 h-4 border-t-2 border-l-2 border-slate-200"></div>
        <div className="absolute top-2 right-2 w-4 h-4 border-t-2 border-r-2 border-slate-200"></div>
        <div className="absolute bottom-2 left-2 w-4 h-4 border-b-2 border-l-2 border-slate-200"></div>
        <div className="absolute bottom-2 right-2 w-4 h-4 border-b-2 border-r-2 border-slate-200"></div>
      </div>
    </a>
  );
}
