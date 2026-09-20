import React, { useState } from 'react';
import {
  Wrench,
  Zap,
  Hammer,
  Paintbrush,
  Layers,
  Sparkles,
  Car,
  Bike,
  BatteryCharging,
  Smartphone,
  Laptop,
  Wifi,
  Refrigerator,
  Shield,
  Search,
  ArrowRight,
  ChevronRight
} from 'lucide-react';
import { ServiceCategory } from '../types';

interface ServicesPageProps {
  services: ServiceCategory[];
  onNavigate: (view: string, data?: any) => void;
  onSelectService: (serviceName: string) => void;
}

export const ServicesPage: React.FC<ServicesPageProps> = ({
  services,
  onNavigate,
  onSelectService
}) => {
  const [selectedGroup, setSelectedGroup] = useState<string>('All');
  const [search, setSearch] = useState('');

  const groups = ['All', 'Home Services', 'Vehicle Services', 'Technology', 'Other'];

  const getIcon = (iconName: string) => {
    switch (iconName) {
      case 'Wrench':
        return Wrench;
      case 'Zap':
        return Zap;
      case 'Hammer':
        return Hammer;
      case 'Paintbrush':
        return Paintbrush;
      case 'Layers':
        return Layers;
      case 'Sparkles':
        return Sparkles;
      case 'Car':
        return Car;
      case 'Bike':
        return Bike;
      case 'BatteryCharging':
        return BatteryCharging;
      case 'Smartphone':
        return Smartphone;
      case 'Laptop':
        return Laptop;
      case 'Wifi':
        return Wifi;
      case 'Refrigerator':
        return Refrigerator;
      case 'Shield':
        return Shield;
      default:
        return Wrench;
    }
  };

  const filteredServices = services.filter((s) => {
    const matchGroup = selectedGroup === 'All' || s.group === selectedGroup;
    const matchSearch =
      s.name.toLowerCase().includes(search.toLowerCase()) ||
      s.description.toLowerCase().includes(search.toLowerCase()) ||
      s.subServices.some((sub) => sub.toLowerCase().includes(search.toLowerCase()));
    return matchGroup && matchSearch && s.active;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10 space-y-8 text-[#F5F5F7]">
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto space-y-3">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#141414] border border-white/10 text-white/70 text-xs font-semibold">
          <span>Official Catalog</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
          FixIt Shashemene Service Catalog
        </h1>
        <p className="text-sm sm:text-base text-white/60 leading-relaxed">
          Comprehensive directory of verified local technicians and skilled tradespeople serving Arada, Awasho, Bole, Dida, Melka Oda, and all neighborhoods in Shashemene.
        </p>
      </div>

      {/* Controls Bar: Group tabs & Search */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-[#141414] p-3 rounded-[24px] border border-white/10 shadow-lg">
        {/* Category Tabs */}
        <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto pb-1 sm:pb-0">
          {groups.map((grp) => (
            <button
              key={grp}
              onClick={() => setSelectedGroup(grp)}
              className={`px-4 py-2 rounded-xl text-xs font-bold shrink-0 transition cursor-pointer ${
                selectedGroup === grp
                  ? 'bg-white text-black shadow-md'
                  : 'text-white/60 hover:bg-white/5 hover:text-white'
              }`}
            >
              {grp}
            </button>
          ))}
        </div>

        {/* Search */}
        <div className="relative w-full sm:w-72">
          <Search className="w-4 h-4 text-white/40 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search service or sub-task..."
            className="w-full text-xs bg-[#1C1C1E] text-white border border-white/10 rounded-xl pl-9 pr-3 py-2 outline-hidden placeholder:text-white/40 focus:border-[#FF5C00]/50 transition"
          />
        </div>
      </div>

      {/* Services Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredServices.map((service) => {
          const Icon = getIcon(service.icon);
          return (
            <div
              key={service.id}
              className="bg-[#141414] rounded-[28px] border border-white/10 p-6 flex flex-col justify-between hover:border-white/20 hover:bg-[#18181A] transition-all shadow-xl group"
            >
              <div>
                <div className="flex items-start justify-between gap-3 mb-4">
                  <div className="w-12 h-12 rounded-2xl bg-[#1C1C1E] text-[#FF5C00] flex items-center justify-center group-hover:scale-105 group-hover:bg-[#FF5C00] group-hover:text-black transition border border-white/5 shadow-xs">
                    <Icon className="w-6 h-6" />
                  </div>
                  {service.popular && (
                    <span className="text-[10px] font-extrabold uppercase tracking-wider bg-[#FF5C00]/15 text-[#FF5C00] px-2.5 py-1 rounded-full border border-[#FF5C00]/30">
                      Popular
                    </span>
                  )}
                </div>

                <div className="text-[11px] font-bold text-[#FF5C00] uppercase tracking-wider">
                  {service.group}
                </div>
                <h3 className="font-bold text-lg text-white mt-1 group-hover:text-white transition">
                  {service.name}
                </h3>
                <p className="text-xs text-white/60 mt-2 leading-relaxed">
                  {service.description}
                </p>

                {/* Sub Services */}
                <div className="mt-4 pt-3 border-t border-white/5">
                  <span className="text-[11px] font-bold text-white/40 block mb-2">
                    Common tasks solved:
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {service.subServices.map((sub, idx) => (
                      <span
                        key={idx}
                        className="text-[10px] bg-[#1C1C1E] text-white/70 font-medium px-2 py-0.5 rounded-lg border border-white/5"
                      >
                        {sub}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Action Button */}
              <div className="mt-6 pt-4 border-t border-white/5 flex items-center justify-between">
                <button
                  onClick={() => onNavigate('new-request', { category: service.name })}
                  className="text-xs font-bold text-white/60 hover:text-white transition cursor-pointer"
                >
                  Request this
                </button>

                <button
                  onClick={() => onSelectService(service.name)}
                  className="flex items-center gap-1 text-xs font-bold text-black bg-white hover:bg-white/90 px-3 py-1.5 rounded-xl transition cursor-pointer"
                >
                  <span>Find {service.name}</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
