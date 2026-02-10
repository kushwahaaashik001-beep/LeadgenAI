"use client";

import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Globe, 
  MapPin, 
  Users, 
  TrendingUp, 
  Filter,
  ZoomIn,
  ZoomOut,
  Target,
  Compass
} from 'lucide-react';
import { Lead } from '@/app/hooks/useLeads';

interface GlobalMapProps {
  leads: Lead[];
}

interface MapLocation {
  city: string;
  country: string;
  lat: number;
  lng: number;
  count: number;
  avgSalary: number;
  companies: string[];
  color: string;
}

const POPULAR_CITIES = [
  { city: 'San Francisco', country: 'USA', lat: 37.7749, lng: -122.4194, color: 'bg-purple-500' },
  { city: 'New York', country: 'USA', lat: 40.7128, lng: -74.0060, color: 'bg-blue-500' },
  { city: 'London', country: 'UK', lat: 51.5074, lng: -0.1278, color: 'bg-green-500' },
  { city: 'Berlin', country: 'Germany', lat: 52.5200, lng: 13.4050, color: 'bg-yellow-500' },
  { city: 'Bangalore', country: 'India', lat: 12.9716, lng: 77.5946, color: 'bg-pink-500' },
  { city: 'Singapore', country: 'Singapore', lat: 1.3521, lng: 103.8198, color: 'bg-red-500' },
  { city: 'Sydney', country: 'Australia', lat: -33.8688, lng: 151.2093, color: 'bg-indigo-500' },
  { city: 'Toronto', country: 'Canada', lat: 43.6532, lng: -79.3832, color: 'bg-cyan-500' },
];

const REGION_COLORS = {
  'North America': 'from-blue-500 to-cyan-500',
  'Europe': 'from-green-500 to-emerald-500',
  'Asia': 'from-purple-500 to-pink-500',
  'Australia': 'from-orange-500 to-red-500',
  'South America': 'from-yellow-500 to-amber-500',
  'Africa': 'from-teal-500 to-green-500',
  'Remote': 'from-gray-500 to-slate-500',
};

export default function GlobalMap({ leads }: GlobalMapProps) {
  const [activeFilter, setActiveFilter] = useState<string>('all');
  const [zoom, setZoom] = useState(1);
  const [hoveredLocation, setHoveredLocation] = useState<MapLocation | null>(null);
  const [mapData, setMapData] = useState<MapLocation[]>([]);

  // Process leads into map data
  useEffect(() => {
    const processedData: Record<string, MapLocation> = {};
    
    leads.forEach(lead => {
      if (!lead.location) return;
      
      // Extract city and country from location string
      const location = lead.location.toLowerCase();
      let city = 'Unknown';
      let country = 'Remote';
      
      // Simple location parsing (in production, use a proper geocoding service)
      if (location.includes('remote') || location.includes('work from')) {
        city = 'Remote';
        country = 'Remote';
      } else if (location.includes('san francisco')) {
        city = 'San Francisco';
        country = 'USA';
      } else if (location.includes('new york')) {
        city = 'New York';
        country = 'USA';
      } else if (location.includes('london')) {
        city = 'London';
        country = 'UK';
      } else if (location.includes('bangalore')) {
        city = 'Bangalore';
        country = 'India';
      }
      
      const key = `${city}-${country}`;
      
      if (!processedData[key]) {
        const cityData = POPULAR_CITIES.find(c => c.city === city) || {
          city,
          country,
          lat: Math.random() * 180 - 90,
          lng: Math.random() * 360 - 180,
          color: 'bg-gray-500'
        };
        
        processedData[key] = {
          ...cityData,
          count: 0,
          avgSalary: 0,
          companies: []
        };
      }
      
      processedData[key].count += 1;
      if (lead.salary_max) {
        processedData[key].avgSalary = 
          ((processedData[key].avgSalary * (processedData[key].count - 1)) + lead.salary_max) / processedData[key].count;
      }
      if (lead.company && !processedData[key].companies.includes(lead.company)) {
        processedData[key].companies.push(lead.company);
      }
    });
    
    setMapData(Object.values(processedData).slice(0, 8));
  }, [leads]);

  // Calculate statistics
  const totalLocations = mapData.length;
  const totalOpportunities = mapData.reduce((sum, loc) => sum + loc.count, 0);
  const avgSalary = mapData.reduce((sum, loc) => sum + loc.avgSalary, 0) / (mapData.length || 1);
  const remotePercentage = Math.round(((mapData.find(loc => loc.city === 'Remote')?.count || 0) / totalOpportunities) * 100);

  const getRegion = (country: string) => {
    if (country === 'Remote') return 'Remote';
    if (['USA', 'Canada', 'Mexico'].includes(country)) return 'North America';
    if (['UK', 'Germany', 'France', 'Netherlands', 'Spain', 'Italy'].includes(country)) return 'Europe';
    if (['India', 'Singapore', 'Japan', 'China'].includes(country)) return 'Asia';
    if (['Australia', 'New Zealand'].includes(country)) return 'Australia';
    return 'Other';
  };

  const filteredData = activeFilter === 'all' 
    ? mapData 
    : mapData.filter(loc => getRegion(loc.country) === activeFilter);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-gradient-to-br from-blue-600/20 to-cyan-600/20 rounded-lg">
            <Globe className="w-5 h-5 text-blue-400" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-white">Global Opportunities</h3>
            <p className="text-sm text-gray-400">{totalOpportunities} opportunities across {totalLocations} locations</p>
          </div>
        </div>
        
        <div className="flex items-center space-x-2">
          <button
            onClick={() => setZoom(Math.min(2, zoom + 0.2))}
            className="p-2 hover:bg-gray-800 rounded-lg transition-colors"
          >
            <ZoomIn className="w-4 h-4 text-gray-400" />
          </button>
          <button
            onClick={() => setZoom(Math.max(0.5, zoom - 0.2))}
            className="p-2 hover:bg-gray-800 rounded-lg transition-colors"
          >
            <ZoomOut className="w-4 h-4 text-gray-400" />
          </button>
          <button
            onClick={() => setZoom(1)}
            className="p-2 hover:bg-gray-800 rounded-lg transition-colors"
          >
            <Target className="w-4 h-4 text-gray-400" />
          </button>
        </div>
      </div>

      {/* Map Container */}
      <div className="relative h-64 bg-gradient-to-br from-gray-900 to-gray-950 border border-gray-800 rounded-2xl overflow-hidden">
        {/* Grid Background */}
        <div 
          className="absolute inset-0 opacity-20"
          style={{
            backgroundImage: `
              linear-gradient(to right, rgba(255,255,255,0.1) 1px, transparent 1px),
              linear-gradient(to bottom, rgba(255,255,255,0.1) 1px, transparent 1px)
            `,
            backgroundSize: `${40 * zoom}px ${40 * zoom}px`,
          }}
        />
        
        {/* World Map Outline */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="relative w-48 h-48">
            {/* Continents - Simplified representation */}
            <div className="absolute top-1/4 left-1/4 w-16 h-16 bg-gradient-to-br from-blue-500/20 to-cyan-500/20 rounded-full border border-blue-500/30" />
            <div className="absolute top-1/3 right-1/4 w-20 h-20 bg-gradient-to-br from-green-500/20 to-emerald-500/20 rounded-full border border-green-500/30" />
            <div className="absolute bottom-1/4 left-1/3 w-24 h-24 bg-gradient-to-br from-purple-500/20 to-pink-500/20 rounded-full border border-purple-500/30" />
            <div className="absolute bottom-1/3 right-1/3 w-12 h-12 bg-gradient-to-br from-orange-500/20 to-red-500/20 rounded-full border border-orange-500/30" />
          </div>
        </div>

        {/* Location Markers */}
        {filteredData.map((location, index) => {
          // Calculate position based on lat/lng
          const left = 50 + (location.lng / 180) * 40;
          const top = 50 - (location.lat / 90) * 40;
          
          return (
            <motion.div
              key={`${location.city}-${index}`}
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: index * 0.1 }}
              className="absolute cursor-pointer"
              style={{
                left: `${left}%`,
                top: `${top}%`,
                transform: `translate(-50%, -50%) scale(${zoom})`,
              }}
              onMouseEnter={() => setHoveredLocation(location)}
              onMouseLeave={() => setHoveredLocation(null)}
            >
              <div className="relative group">
                {/* Pulsing effect */}
                <div className="absolute inset-0 animate-ping">
                  <div className={`w-3 h-3 ${location.color} rounded-full opacity-50`} />
                </div>
                
                {/* Main marker */}
                <div className={`w-4 h-4 ${location.color} rounded-full border-2 border-white shadow-lg group-hover:scale-125 transition-transform`}>
                  <div className="absolute -top-6 left-1/2 transform -translate-x-1/2 whitespace-nowrap text-xs font-semibold text-white bg-gray-900 px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity">
                    {location.city}
                  </div>
                </div>
              </div>
            </motion.div>
          );
        })}

        {/* Legend */}
        <div className="absolute bottom-4 left-4 bg-gray-900/80 backdrop-blur-sm border border-gray-800 rounded-lg p-3">
          <div className="flex items-center space-x-2 mb-2">
            <Compass className="w-4 h-4 text-gray-400" />
            <span className="text-sm font-medium text-white">Legend</span>
          </div>
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-1">
              <div className="w-3 h-3 bg-purple-500 rounded-full" />
              <span className="text-xs text-gray-400">High Demand</span>
            </div>
            <div className="flex items-center space-x-1">
              <div className="w-3 h-3 bg-blue-500 rounded-full" />
              <span className="text-xs text-gray-400">Tech Hubs</span>
            </div>
          </div>
        </div>

        {/* Hover Info Card */}
        {hoveredLocation && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="absolute top-4 right-4 w-64 bg-gray-900/90 backdrop-blur-sm border border-gray-800 rounded-xl p-4 shadow-2xl"
          >
            <div className="flex items-start justify-between mb-3">
              <div>
                <h4 className="font-bold text-white">{hoveredLocation.city}</h4>
                <p className="text-sm text-gray-400">{hoveredLocation.country}</p>
              </div>
              <MapPin className="w-5 h-5 text-purple-400" />
            </div>
            
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-400">Opportunities</span>
                <span className="text-lg font-bold text-white">{hoveredLocation.count}</span>
              </div>
              
              {hoveredLocation.avgSalary > 0 && (
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-400">Avg Salary</span>
                  <span className="text-lg font-bold text-green-400">
                    ${Math.round(hoveredLocation.avgSalary / 1000)}k
                  </span>
                </div>
              )}
              
              {hoveredLocation.companies.length > 0 && (
                <div>
                  <div className="text-sm text-gray-400 mb-1">Top Companies</div>
                  <div className="flex flex-wrap gap-1">
                    {hoveredLocation.companies.slice(0, 3).map((company, i) => (
                      <span
                        key={i}
                        className="text-xs bg-gray-800 text-gray-300 px-2 py-1 rounded"
                      >
                        {company}
                      </span>
                    ))}
                    {hoveredLocation.companies.length > 3 && (
                      <span className="text-xs text-gray-500">
                        +{hoveredLocation.companies.length - 3} more
                      </span>
                    )}
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </div>

      {/* Filters */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center space-x-2">
            <Filter className="w-4 h-4 text-gray-400" />
            <span className="text-sm font-medium text-gray-300">Filter by Region</span>
          </div>
          <span className="text-xs text-gray-500">
            {filteredData.length} locations
          </span>
        </div>
        
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => setActiveFilter('all')}
            className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
              activeFilter === 'all'
                ? 'bg-gradient-to-r from-purple-600 to-blue-600 text-white'
                : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
            }`}
          >
            All Regions
          </button>
          
          {Object.entries(REGION_COLORS).map(([region, colorClass]) => (
            <button
              key={region}
              onClick={() => setActiveFilter(region)}
              className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
                activeFilter === region
                  ? 'bg-gradient-to-r ' + colorClass + ' text-white'
                  : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
              }`}
            >
              {region}
            </button>
          ))}
        </div>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="p-3 bg-gray-800/30 rounded-xl">
          <div className="flex items-center space-x-2 mb-2">
            <MapPin className="w-4 h-4 text-blue-400" />
            <span className="text-sm text-gray-400">Locations</span>
          </div>
          <div className="text-2xl font-bold text-white">{totalLocations}</div>
        </div>
        
        <div className="p-3 bg-gray-800/30 rounded-xl">
          <div className="flex items-center space-x-2 mb-2">
            <Users className="w-4 h-4 text-green-400" />
            <span className="text-sm text-gray-400">Opportunities</span>
          </div>
          <div className="text-2xl font-bold text-white">{totalOpportunities}</div>
        </div>
        
        <div className="p-3 bg-gray-800/30 rounded-xl">
          <div className="flex items-center space-x-2 mb-2">
            <TrendingUp className="w-4 h-4 text-purple-400" />
            <span className="text-sm text-gray-400">Remote Jobs</span>
          </div>
          <div className="text-2xl font-bold text-green-400">{remotePercentage}%</div>
        </div>
        
        <div className="p-3 bg-gray-800/30 rounded-xl">
          <div className="flex items-center space-x-2 mb-2">
            <Target className="w-4 h-4 text-amber-400" />
            <span className="text-sm text-gray-400">Hotspot</span>
          </div>
          <div className="text-xl font-bold text-white">
            {mapData[0]?.city || 'None'}
          </div>
        </div>
      </div>

      {/* Location List */}
      {filteredData.length > 0 && (
        <div className="space-y-2">
          {filteredData.slice(0, 5).map((location) => (
            <div
              key={location.city}
              className="flex items-center justify-between p-3 bg-gray-800/30 hover:bg-gray-800/50 rounded-xl transition-colors"
            >
              <div className="flex items-center space-x-3">
                <div className={`w-3 h-3 ${location.color} rounded-full`} />
                <div>
                  <div className="font-medium text-white">{location.city}</div>
                  <div className="text-sm text-gray-400">{location.country}</div>
                </div>
              </div>
              
              <div className="flex items-center space-x-4">
                <div className="text-right">
                  <div className="font-bold text-white">{location.count}</div>
                  <div className="text-xs text-gray-400">jobs</div>
                </div>
                {location.avgSalary > 0 && (
                  <div className="text-right">
                    <div className="font-bold text-green-400">
                      ${Math.round(location.avgSalary / 1000)}k
                    </div>
                    <div className="text-xs text-gray-400">avg salary</div>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
