import React, { useEffect, useRef } from 'react';
import L from 'leaflet';
import { MapMarker, Language } from '../../types';
import { MapPin, TreePine, Bird, Home, Sparkles } from 'lucide-react';
import { getTranslation } from '../common/translations';

interface ImpactMapProps {
  markers: MapMarker[];
  language: Language;
}

export const ImpactMap: React.FC<ImpactMapProps> = ({ markers, language }) => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);

  useEffect(() => {
    if (!mapContainerRef.current) return;

    // Initialize Leaflet map centered around Kanpur/UP (26.5188, 80.2329)
    if (!mapInstanceRef.current) {
      const map = L.map(mapContainerRef.current, {
        center: [26.5188, 80.2329],
        zoom: 9,
        scrollWheelZoom: false
      });

      // CartoDB Dark Matter tile layer
      L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy; <a href="https://carto.com/">CARTO</a>',
        subdomains: 'abcd',
        maxZoom: 19
      }).addTo(map);

      mapInstanceRef.current = map;
    }

    const map = mapInstanceRef.current;

    // Clear existing markers
    map.eachLayer((layer) => {
      if (layer instanceof L.Marker) {
        map.removeLayer(layer);
      }
    });

    // Custom Icon Creators
    const createCustomIcon = (type: MapMarker['type']) => {
      let color = '#4CAF50';
      let iconSymbol = '🌳';

      if (type === 'Bird Water Station') {
        color = '#38BDF8';
        iconSymbol = '💧';
      } else if (type === 'HQ') {
        color = '#F4C430';
        iconSymbol = '🏛️';
      } else if (type === 'Event') {
        color = '#86EFAC';
        iconSymbol = '🌱';
      }

      return L.divIcon({
        className: 'custom-map-pin',
        html: `
          <div style="
            background-color: ${color};
            width: 32px;
            height: 32px;
            border-radius: 50%;
            border: 3px solid #0D2818;
            box-shadow: 0 4px 12px rgba(0,0,0,0.5);
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 14px;
            cursor: pointer;
            transition: transform 0.2s;
          ">
            ${iconSymbol}
          </div>
        `,
        iconSize: [32, 32],
        iconAnchor: [16, 16],
        popupAnchor: [0, -16]
      });
    };

    // Add Markers to Map
    markers.forEach((m) => {
      const marker = L.marker([m.lat, m.lng], {
        icon: createCustomIcon(m.type)
      }).addTo(map);

      const popupHtml = `
        <div style="padding: 6px; font-family: sans-serif; max-width: 220px;">
          <div style="
            display: inline-block;
            background: #1B5E34;
            color: #86EFAC;
            font-size: 9px;
            font-weight: bold;
            padding: 2px 8px;
            border-radius: 10px;
            text-transform: uppercase;
            margin-bottom: 6px;
          ">
            ${m.type}
          </div>
          <h4 style="font-weight: bold; font-size: 14px; color: #F9FBF7; margin: 0 0 4px 0;">
            ${m.title}
          </h4>
          <p style="font-size: 11px; color: #86EFAC; margin: 0 0 6px 0;">
            📍 ${m.locationName}
          </p>
          ${
            m.treesCount > 0
              ? `<div style="font-size: 12px; font-weight: bold; color: #F4C430; margin-bottom: 6px;">
                  🌳 ${m.treesCount} Trees Planted
                 </div>`
              : ''
          }
          ${
            m.photos && m.photos[0]
              ? `<img src="${m.photos[0]}" style="width: 100%; height: 90px; object-fit: cover; border-radius: 8px; border: 1px solid #1B5E34;" />`
              : ''
          }
        </div>
      `;

      marker.bindPopup(popupHtml);
    });

  }, [markers]);

  return (
    <section id="map" className="py-24 bg-[#0D2818] text-[#F9FBF7] relative border-b border-[#1B5E34]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-12 space-y-3">
          <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-[#1B5E34] text-[#86EFAC] text-xs font-bold uppercase tracking-wider">
            <MapPin className="w-3.5 h-3.5 text-[#F4C430]" />
            <span>GIS Field Tracking</span>
          </div>
          <h2 className="font-display font-extrabold text-3xl sm:text-5xl text-[#F9FBF7] tracking-tight">
            {getTranslation(language, 'map_title')}
          </h2>
          <p className="text-sm sm:text-base text-[#86EFAC]">
            {getTranslation(language, 'map_subtitle')}
          </p>
        </div>

        {/* Map Container */}
        <div className="relative rounded-3xl overflow-hidden border-2 border-[#1B5E34] shadow-2xl bg-[#0D2818]">
          <div ref={mapContainerRef} className="w-full h-[520px] z-10" />

          {/* Map Legend Overlay */}
          <div className="absolute bottom-4 left-4 z-20 bg-[#0D2818]/90 backdrop-blur-md p-4 rounded-2xl border border-[#1B5E34] shadow-xl space-y-2 text-xs">
            <span className="font-display font-bold text-[10px] text-[#86EFAC] uppercase tracking-wider block mb-1">
              Map Legend
            </span>
            <div className="flex items-center space-x-2 text-[#F9FBF7]">
              <span className="w-3 h-3 rounded-full bg-[#F4C430] inline-block" />
              <span className="font-medium">Kanvana HQ (Nankari, IIT Kanpur)</span>
            </div>
            <div className="flex items-center space-x-2 text-[#F9FBF7]">
              <span className="w-3 h-3 rounded-full bg-[#4CAF50] inline-block" />
              <span className="font-medium">Tree Plantation Drive</span>
            </div>
            <div className="flex items-center space-x-2 text-[#F9FBF7]">
              <span className="w-3 h-3 rounded-full bg-[#38BDF8] inline-block" />
              <span className="font-medium">Summer Bird Water Network</span>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
};
