import React, { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import { MapMarker, Language } from '../../types';
import { MapPin, TreePine, Bird, Home, Sparkles, Filter } from 'lucide-react';
import { getTranslation } from '../common/translations';

interface ImpactMapProps {
  markers: MapMarker[];
  language: Language;
}

export const ImpactMap: React.FC<ImpactMapProps> = ({ markers, language }) => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const [filterType, setFilterType] = useState<string>('All');

  const filteredMarkers = markers.filter(m => {
    if (filterType === 'All') return true;
    if (filterType === 'Plantation') return m.type === 'Plantation';
    if (filterType === 'Bird Water Station') return m.type === 'Bird Water Station';
    if (filterType === 'HQ') return m.type === 'HQ';
    return true;
  });

  useEffect(() => {
    if (!mapContainerRef.current) return;

    // Initialize Leaflet map centered around Kanpur/UP (26.5188, 80.2329)
    if (!mapInstanceRef.current) {
      const map = L.map(mapContainerRef.current, {
        center: [26.5188, 80.2329],
        zoom: 9,
        scrollWheelZoom: false
      });

      // CartoDB Voyager light tile layer
      L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png', {
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
            border: 3px solid #ffffff;
            box-shadow: 0 4px 12px rgba(0,0,0,0.2);
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
    filteredMarkers.forEach((m) => {
      const marker = L.marker([m.lat, m.lng], {
        icon: createCustomIcon(m.type)
      }).addTo(map);

      const popupHtml = `
        <div style="padding: 6px; font-family: sans-serif; max-width: 220px;">
          <div style="
            display: inline-block;
            background: #DCFCE7;
            color: #0A3319;
            font-size: 9px;
            font-weight: 800;
            padding: 2px 8px;
            border-radius: 10px;
            text-transform: uppercase;
            margin-bottom: 6px;
          ">
            ${m.type}
          </div>
          <h4 style="font-weight: 800; font-size: 14px; color: #0A3319; margin: 0 0 4px 0;">
            ${m.title}
          </h4>
          <p style="font-size: 11px; color: #15803D; font-weight: 600; margin: 0 0 6px 0;">
            📍 ${m.locationName}
          </p>
          ${
            m.treesCount > 0
              ? `<div style="font-size: 12px; font-weight: 800; color: #D97706; margin-bottom: 6px;">
                  🌳 ${m.treesCount} Trees Planted
                 </div>`
              : ''
          }
          ${
            m.photos && m.photos[0]
              ? `<img src="${m.photos[0]}" style="width: 100%; height: 90px; object-fit: cover; border-radius: 8px; border: 1px solid #A7F3D0;" />`
              : ''
          }
        </div>
      `;

      marker.bindPopup(popupHtml);
    });

  }, [filteredMarkers]);

  return (
    <section id="map" className="py-24 bg-[#EDF5EE] text-slate-800 relative border-b border-emerald-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-8 space-y-3">
          <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-emerald-100 text-[#0A3319] text-xs font-extrabold uppercase tracking-wider">
            <MapPin className="w-3.5 h-3.5 text-[#D97706]" />
            <span>GIS Field Tracking</span>
          </div>
          <h2 className="font-display font-extrabold text-3xl sm:text-5xl text-[#0A3319] tracking-tight">
            {getTranslation(language, 'map_title')}
          </h2>
          <p className="text-sm sm:text-base text-slate-600">
            {getTranslation(language, 'map_subtitle')}
          </p>
        </div>

        {/* Interactive Filter Pills */}
        <div className="flex flex-wrap items-center justify-center gap-2 mb-6">
          {[
            { id: 'All', label: '📍 All Markers', count: markers.length },
            { id: 'Plantation', label: '🌳 Plantations', count: markers.filter(m => m.type === 'Plantation').length },
            { id: 'Bird Water Station', label: '💧 Bird Water Network', count: markers.filter(m => m.type === 'Bird Water Station').length },
            { id: 'HQ', label: '🏛️ Headquarters', count: markers.filter(m => m.type === 'HQ').length }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setFilterType(tab.id)}
              className={`px-4 py-2 rounded-xl text-xs font-extrabold transition-all border cursor-pointer ${
                filterType === tab.id
                  ? 'bg-[#0A3319] text-[#F4C430] border-[#0A3319] shadow-md scale-105'
                  : 'bg-white text-slate-700 border-emerald-200 hover:bg-emerald-50'
              }`}
            >
              {tab.label} <span className="opacity-70 font-mono">({tab.count})</span>
            </button>
          ))}
        </div>

        {/* Map Container */}
        <div className="relative rounded-3xl overflow-hidden border-2 border-emerald-200 shadow-2xl bg-white">
          <div ref={mapContainerRef} className="w-full h-[520px] z-10" />

          {/* Map Legend Overlay */}
          <div className="absolute bottom-4 left-4 z-20 bg-white/95 backdrop-blur-md p-4 rounded-2xl border border-emerald-200 shadow-xl space-y-2 text-xs">
            <span className="font-display font-extrabold text-[10px] text-[#0A3319] uppercase tracking-wider block mb-1">
              Map Legend
            </span>
            <div className="flex items-center space-x-2 text-slate-800">
              <span className="w-3 h-3 rounded-full bg-[#D97706] inline-block" />
              <span className="font-semibold">Kanvana HQ (Nankari, IIT Kanpur)</span>
            </div>
            <div className="flex items-center space-x-2 text-slate-800">
              <span className="w-3 h-3 rounded-full bg-[#16A34A] inline-block" />
              <span className="font-semibold">Tree Plantation Drive</span>
            </div>
            <div className="flex items-center space-x-2 text-slate-800">
              <span className="w-3 h-3 rounded-full bg-[#0284C7] inline-block" />
              <span className="font-semibold">Summer Bird Water Network</span>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
};
