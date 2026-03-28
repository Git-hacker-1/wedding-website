import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card } from '@/components/ui/card';
import { MapPin, Plane, Hotel, Palmtree, ExternalLink } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface Location {
  id: string;
  name: string;
  type: string;
  url: string;
  embedUrl: string;
  icon: React.ReactNode;
  info: string;
  distance?: string;
}

const locations: Location[] = [
  {
    id: 'resort',
    name: 'Dreams Playa Mujeres Golf & Spa Resort',
    type: 'Wedding Venue',
    url: 'https://maps.google.com/?q=Dreams+Playa+Mujeres+Golf+%26+Spa+Resort,+Playa+Mujeres,+Cancun,+Mexico',
    embedUrl: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3717.8!2d-86.8175!3d21.2589!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x8f4c2c8b1c8b1c8b%3A0x8f4c2c8b1c8b1c8b!2sDreams+Playa+Mujeres+Golf+%26+Spa+Resort!5e0!3m2!1sen!2sus!4v1700000000000!5m2!1sen!2sus',
    icon: <Hotel className="w-5 h-5" />,
    info: 'Our beautiful wedding venue and your home for the weekend. All wedding events will take place here.',
  },
  {
    id: 'airport',
    name: 'Cancun International Airport (CUN)',
    type: 'Airport',
    url: 'https://maps.app.goo.gl/9RxyyR4uN8eG6yWQ8',
    embedUrl: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d119630.93297686377!2d-86.91157143171887!3d21.040180295254245!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x8f4e804f3f1e1641%3A0x880e6119df998a6!2sCancun%20International%20Airport!5e0!3m2!1sen!2sus!4v1700000000000!5m2!1sen!2sus',
    icon: <Plane className="w-5 h-5" />,
    info: 'The main travel hub. Look out for our wedding transportation here if you arranged it through our booking site.',
    distance: '35-45 min drive to resort',
  },
  {
    id: 'isla',
    name: 'Isla Mujeres',
    type: 'Attraction',
    url: 'https://maps.app.goo.gl/Jq4yR4uN8eG6yWQ8',
    embedUrl: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3718.5!2d-86.745!3d21.2333!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x8f4c281000000001%3A0x500000000000000!2sIsla%20Mujeres!5e0!3m2!1sen!2sus!4v1700000000000!5m2!1sen!2sus',
    icon: <Palmtree className="w-5 h-5" />,
    info: 'A beautiful island just off the coast, perfect for a day trip. Accessible via a short ferry ride from Punta Sam or Puerto Juarez.',
    distance: 'Ferry terminal is 10 mins away',
  }
];

export function InteractiveMap() {
  const [activeLocation, setActiveLocation] = useState<Location>(locations[0]);
  const [isMapLoaded, setIsMapLoaded] = useState(false);

  return (
    <Card className="overflow-hidden bg-sand-pearl shadow-passport border-0">
      <div className="flex flex-col md:flex-row h-[600px]">
        {/* Sidebar / Controls */}
        <div className="md:w-1/3 bg-sand-light border-b md:border-b-0 md:border-r border-sand-driftwood/30 p-4 md:p-6 flex flex-col overflow-y-auto">
          <h3 className="text-xl font-heading text-ocean-deep mb-6 flex items-center gap-2">
            <MapPin className="w-5 h-5 text-gold" />
            Key Locations
          </h3>
          
          <div className="space-y-3 flex-1">
            {locations.map((loc) => {
              const isActive = activeLocation.id === loc.id;
              return (
                <button
                  key={loc.id}
                  onClick={() => {
                    setActiveLocation(loc);
                    setIsMapLoaded(false);
                  }}
                  className={cn(
                    'w-full text-left p-4 rounded-xl transition-all duration-300 border-2 block',
                    isActive
                      ? 'bg-ocean-deep text-white border-ocean-deep shadow-lg transform scale-[1.02]'
                      : 'bg-white border-transparent hover:border-sand-driftwood/50 text-ocean-deep shadow-sm hover:shadow-md'
                  )}
                >
                  <div className="flex items-start gap-3">
                    <div className={cn('p-2 rounded-lg shrink-0', isActive ? 'bg-white/20' : 'bg-ocean-caribbean/10 text-ocean-caribbean')}>
                      {loc.icon}
                    </div>
                    <div>
                      <h4 className={cn('font-medium leading-tight mb-1', isActive ? 'text-white' : 'text-ocean-deep')}>
                        {loc.name}
                      </h4>
                      <p className={cn('text-xs uppercase tracking-wider', isActive ? 'text-white/70' : 'text-sand-dark')}>
                        {loc.type}
                      </p>
                    </div>
                  </div>
                </button>
              );
            })}
          </div>

          {/* Active Location Info Panel */}
          <AnimatePresence mode="wait">
            <motion.div
              key={activeLocation.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="mt-6 pt-6 border-t border-sand-driftwood/30"
            >
              <p className="text-sm text-sand-dark leading-relaxed mb-3">
                {activeLocation.info}
              </p>
              {activeLocation.distance && (
                <p className="text-xs font-medium text-ocean-caribbean mb-4">
                  {activeLocation.distance}
                </p>
              )}
              <Button variant="outline" size="sm" asChild className="w-full">
                <a href={activeLocation.url} target="_blank" rel="noopener noreferrer" className="flex items-center justify-center">
                  Open in Google Maps <ExternalLink className="w-3.5 h-3.5 ml-2" />
                </a>
              </Button>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Map Area */}
        <div className="md:w-2/3 relative h-[300px] md:h-full bg-sand-warm/30">
          <AnimatePresence mode="wait">
            {!isMapLoaded && (
              <motion.div
                initial={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="absolute inset-0 flex items-center justify-center bg-sand-warm/50 z-10"
              >
                <div className="w-10 h-10 border-4 border-ocean-caribbean/30 border-t-ocean-caribbean rounded-full animate-spin" />
              </motion.div>
            )}
          </AnimatePresence>
          <iframe
            src={activeLocation.embedUrl}
            className="w-full h-full border-0 absolute inset-0 z-0"
            allowFullScreen
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            title={`${activeLocation.name} - Map`}
            onLoad={() => setIsMapLoaded(true)}
          />
        </div>
      </div>
    </Card>
  );
}
