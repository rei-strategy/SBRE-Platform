import React, { useEffect, useMemo, useRef, useState } from 'react';
import L from 'leaflet';
import { MapContainer, TileLayer, Marker, Popup, Circle } from 'react-leaflet';
import { Search, SlidersHorizontal, MapPin, Star, ShieldCheck, Clock, Filter, Heart, ChevronDown, X, ArrowLeft, ClipboardList, TrendingUp, Briefcase, Calendar, Map, MessageSquare } from 'lucide-react';
import { PublicNavbar } from '../components/PublicNavbar';
import { AuthModal } from '../components/AuthModal';

const categories = [
  'Realtors', 'Contractors', 'Lenders', 'Inspectors', 'Photographers',
  'Property Managers', 'Cleaning Crews', 'Stagers', 'Appraisers', 'Solar Installers',
  'Landscapers', 'Logistics & FF&E'
];

const CATEGORY_GROUPS = [
  { label: 'Acquisition', items: ['Realtors', 'Lenders', 'Appraisers', 'Inspectors'] },
  { label: 'Execution', items: ['Contractors', 'Property Managers', 'Cleaning Crews', 'Stagers', 'Photographers'] },
  { label: 'Exterior', items: ['Solar Installers', 'Landscapers'] },
  { label: 'Logistics', items: ['Logistics & FF&E'] },
];

type Listing = {
  name: string;
  category: string;
  location: string;
  rating: number;
  reviews: number;
  badges: string[];
  response: string;
  tags: string[];
  lat: number;
  lng: number;
  priceLabel: string;
  description: string;
  imageUrl: string;
  imageUrls: string[];
};

const IMAGE_POOL = [
  'https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&w=1200&q=80',
  'https://images.unsplash.com/photo-1503387762-592deb58ef4e?auto=format&fit=crop&w=1200&q=80',
  'https://images.unsplash.com/photo-1502005097973-6a7082348e28?auto=format&fit=crop&w=1200&q=80',
  'https://images.unsplash.com/photo-1505691938895-1758d7feb511?auto=format&fit=crop&w=1200&q=80',
  'https://images.unsplash.com/photo-1501183638710-841dd1904471?auto=format&fit=crop&w=1200&q=80',
  'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=1200&q=80',
  'https://images.unsplash.com/photo-1507089947368-19c1da9775ae?auto=format&fit=crop&w=1200&q=80',
  'https://images.unsplash.com/photo-1501183638710-841dd1904471?auto=format&fit=crop&w=1200&q=80',
];

const BASE_LISTINGS: Listing[] = [
  {
    name: 'Blue Ridge Contractors',
    category: 'Contractors',
    location: 'Austin, TX',
    rating: 4.8,
    reviews: 132,
    badges: ['Verified', 'Elite'],
    response: 'Under 15 min',
    tags: ['Rehab crews', 'Turnkey', 'Roofing'],
    lat: 30.279, lng: -97.744,
    priceLabel: '$18K',
    description: 'Full interior refresh (1,200 sq ft) • framing • roofing punch',
    imageUrl: 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&w=1200&q=80',
    imageUrls: [
      'https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1503387762-592deb58ef4e?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1502005097973-6a7082348e28?auto=format&fit=crop&w=1200&q=80'
    ]
  },
  {
    name: 'Summit Capital Lending',
    category: 'Lenders',
    location: 'Austin, TX',
    rating: 4.7,
    reviews: 88,
    badges: ['Verified'],
    response: 'Under 30 min',
    tags: ['Hard money', 'Bridge', 'Fast close'],
    lat: 30.266, lng: -97.75,
    priceLabel: '$1.2K',
    description: 'Avg closing costs on a 12-month bridge (2 pts, doc prep, wire)',
    imageUrl: 'https://images.unsplash.com/photo-1503387762-592deb58ef4e?auto=format&fit=crop&w=1200&q=80',
    imageUrls: [
      'https://images.unsplash.com/photo-1503387762-592deb58ef4e?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1501183638710-841dd1904471?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=1200&q=80'
    ]
  },
  {
    name: 'Precision Inspectors',
    category: 'Inspectors',
    location: 'Austin, TX',
    rating: 4.9,
    reviews: 210,
    badges: ['Verified', 'Elite'],
    response: 'Same day',
    tags: ['Roof', 'HVAC', 'Foundation'],
    lat: 30.273, lng: -97.734,
    priceLabel: '$425',
    description: 'Full home inspection with same-day report, roof/HVAC/foundation',
    imageUrl: 'https://images.unsplash.com/photo-1502005097973-6a7082348e28?auto=format&fit=crop&w=1200&q=80',
    imageUrls: [
      'https://images.unsplash.com/photo-1502005097973-6a7082348e28?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1507089947368-19c1da9775ae?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1505691938895-1758d7feb511?auto=format&fit=crop&w=1200&q=80'
    ]
  },
  {
    name: 'Atlas Property Mgmt',
    category: 'Property Managers',
    location: 'Austin, TX',
    rating: 4.6,
    reviews: 164,
    badges: ['Verified'],
    response: 'Under 1 hr',
    tags: ['SFR', 'Small multi', 'Leasing'],
    lat: 30.287, lng: -97.742,
    priceLabel: '8% /mo',
    description: '8% management fee • leasing fee 50% first month • SFR + small multi',
    imageUrl: 'https://images.unsplash.com/photo-1505691938895-1758d7feb511?auto=format&fit=crop&w=1200&q=80',
    imageUrls: [
      'https://images.unsplash.com/photo-1505691938895-1758d7feb511?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1501183638710-841dd1904471?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=1200&q=80'
    ]
  },
  {
    name: 'Prime Appraisals Co.',
    category: 'Appraisers',
    location: 'Austin, TX',
    rating: 4.5,
    reviews: 97,
    badges: ['Verified'],
    response: 'Under 1 hr',
    tags: ['SFR', 'Multi', 'Rush orders'],
    lat: 30.268, lng: -97.728,
    priceLabel: '$675',
    description: 'SFR appraisal • 48-hr turnaround • rush upgrade available',
    imageUrl: 'https://images.unsplash.com/photo-1501183638710-841dd1904471?auto=format&fit=crop&w=1200&q=80',
    imageUrls: [
      'https://images.unsplash.com/photo-1501183638710-841dd1904471?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1507089947368-19c1da9775ae?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1503387762-592deb58ef4e?auto=format&fit=crop&w=1200&q=80'
    ]
  },
];

const listings: Listing[] = Array.from({ length: 75 }, (_, index) => {
  const base = BASE_LISTINGS[index % BASE_LISTINGS.length];
  const seed = index + 7;
  const jitter = (value: number) => ((Math.sin(seed * value) + 1) / 2 - 0.5);
  const latJitter = jitter(12.9898) * 0.03;
  const lngJitter = jitter(78.233) * 0.03;
  const name = index < BASE_LISTINGS.length ? base.name : `${base.name} ${index + 1}`;
  const imageOffset = (index % IMAGE_POOL.length);
  const imageUrls = [
    IMAGE_POOL[imageOffset % IMAGE_POOL.length],
    IMAGE_POOL[(imageOffset + 1) % IMAGE_POOL.length],
    IMAGE_POOL[(imageOffset + 2) % IMAGE_POOL.length],
  ];
  return {
    ...base,
    name,
    lat: base.lat + latJitter,
    lng: base.lng + lngJitter,
    imageUrl: imageUrls[0],
    imageUrls,
  };
});

const createPriceIcon = (label: string) =>
  L.divIcon({
    className: '',
    html: `<div style="display:inline-flex;align-items:center;justify-content:center;white-space:nowrap;min-width:48px;height:30px;background:#0f172a;color:white;padding:0 12px;border-radius:999px;border:2px solid #ffffff;font-weight:700;font-size:12px;line-height:1;box-shadow:0 8px 20px rgba(0,0,0,0.2);">${label}</div>`,
  });

export const CategoriesPage: React.FC = () => {
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [authMode, setAuthMode] = useState<'login' | 'signup'>('signup');
  const [query, setQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [selectedFilter, setSelectedFilter] = useState<string>('All');
  const [favorites, setFavorites] = useState<Set<string>>(new Set());
  const [currentPage, setCurrentPage] = useState(1);
  const [sortOption, setSortOption] = useState<'Rating' | 'Response time' | 'Price'>('Rating');
  const [selectedListingIndex, setSelectedListingIndex] = useState<number | null>(null);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const detailScrollRef = useRef<HTMLDivElement | null>(null);
  const resultsScrollTopRef = useRef(0);
  const [isCategoryOpen, setIsCategoryOpen] = useState(false);
  const categoryRef = useRef<HTMLDivElement | null>(null);

  const openAuth = (mode: 'login' | 'signup' = 'signup') => {
    setAuthMode(mode);
    setIsAuthOpen(true);
  };

  const toggleFavorite = (name: string) => {
    setFavorites((prev) => {
      const next = new Set(prev);
      if (next.has(name)) {
        next.delete(name);
      } else {
        next.add(name);
      }
      return next;
    });
  };

  const filtered = useMemo(() => {
    return listings.filter((item) => {
      const matchesQuery =
        item.name.toLowerCase().includes(query.toLowerCase()) ||
        item.tags.some((t) => t.toLowerCase().includes(query.toLowerCase())) ||
        item.location.toLowerCase().includes(query.toLowerCase());
      const matchesCategory = selectedCategory === 'All' || item.category === selectedCategory;
      const matchesFilter = selectedFilter === 'All' ? true : item.badges.includes(selectedFilter);
      return matchesQuery && matchesCategory && matchesFilter;
    });
  }, [query, selectedCategory, selectedFilter]);

  useEffect(() => {
    setCurrentPage(1);
    setSelectedListingIndex(null);
    setSelectedImageIndex(0);
  }, [query, selectedCategory, selectedFilter, sortOption]);

  const parsePrice = (label: string) => {
    const cleaned = label.replace(/[^0-9.]/g, '');
    const value = parseFloat(cleaned || '0');
    return label.toLowerCase().includes('k') ? value * 1000 : value;
  };

  const parseResponse = (response: string) => {
    const lowered = response.toLowerCase();
    if (lowered.includes('same day')) return 24 * 60;
    if (lowered.includes('under')) {
      const match = lowered.match(/under\s+(\d+)\s*(min|hr)/);
      if (match) {
        const amount = Number(match[1]);
        return match[2] === 'hr' ? amount * 60 : amount;
      }
    }
    return Number.MAX_SAFE_INTEGER;
  };

  const sorted = useMemo(() => {
    const data = [...filtered];
    data.sort((a, b) => {
      if (sortOption === 'Rating') return b.rating - a.rating;
      if (sortOption === 'Price') return parsePrice(a.priceLabel) - parsePrice(b.priceLabel);
      return parseResponse(a.response) - parseResponse(b.response);
    });
    return data;
  }, [filtered, sortOption]);

  useEffect(() => {
    const handleOutside = (event: MouseEvent) => {
      if (!categoryRef.current) return;
      if (event.target instanceof Node && !categoryRef.current.contains(event.target)) {
        setIsCategoryOpen(false);
      }
    };

    document.addEventListener('mousedown', handleOutside);
    return () => document.removeEventListener('mousedown', handleOutside);
  }, []);

  const pageSize = 20;
  const totalPages = Math.max(1, Math.ceil(sorted.length / pageSize));
  const safePage = Math.min(currentPage, totalPages);
  const paged = useMemo(() => {
    const start = (safePage - 1) * pageSize;
    return sorted.slice(start, start + pageSize);
  }, [sorted, safePage]);

  const selectedListing = selectedListingIndex !== null ? sorted[selectedListingIndex] : null;
  const selectedImages = selectedListing?.imageUrls ?? (selectedListing ? [selectedListing.imageUrl] : []);
  const similarVendors = useMemo(() => {
    if (!selectedListing) return [];
    return sorted.filter((item) => item.name !== selectedListing.name).slice(0, 4);
  }, [sorted, selectedListing]);

  const mapFocus = selectedListing ?? (paged[0] ?? null);
  const mapCenter = useMemo(() => {
    if (!mapFocus) return { lat: 30.274, lng: -97.74 };
    return { lat: mapFocus.lat, lng: mapFocus.lng };
  }, [mapFocus]);
  const mapZoom = selectedListing ? 16 : 14;
  const mapMarkers = selectedListing ? [selectedListing] : paged;
  const handleSelectListing = (name: string) => {
    const index = sorted.findIndex((item) => item.name === name);
    if (index !== -1) {
      if (detailScrollRef.current) {
        resultsScrollTopRef.current = detailScrollRef.current.scrollTop;
      }
      setSelectedListingIndex(index);
      setSelectedImageIndex(0);
      if (detailScrollRef.current) {
        detailScrollRef.current.scrollTo({ top: 0, behavior: 'smooth' });
      }
    }
  };

  const handleAnchorClick = (event: React.MouseEvent<HTMLAnchorElement>, id: string) => {
    event.preventDefault();
    const container = detailScrollRef.current;
    if (!container) return;
    const target = container.querySelector<HTMLElement>(`#${id}`);
    if (!target) return;
    target.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  return (
    <div className="h-screen overflow-hidden bg-white text-slate-900">
      <PublicNavbar onOpenAuth={openAuth} />

      <section className="w-full mx-auto px-2 pt-20 pb-2 md:px-4">
        <div className="relative z-30 rounded-b-lg rounded-t-none border border-slate-200 bg-white p-2 shadow-sm md:sticky md:top-16">
          <div className="grid gap-3 md:grid-cols-[3fr,1.7fr,0.5fr]">
          <div className="flex items-center gap-3 rounded-lg border border-slate-300 bg-white px-4 py-2.5">
            <Search className="h-5 w-5 text-slate-400" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search vendors, specialties, or tags"
              className="flex-1 bg-transparent text-base text-slate-900 placeholder:text-slate-400 focus:outline-none"
            />
          </div>
          <div ref={categoryRef} className="relative flex items-center gap-2 rounded-lg border border-slate-300 bg-white px-3 py-2.5">
            <MapPin className="h-5 w-5 text-slate-400" />
            <button
              type="button"
              onClick={() => setIsCategoryOpen((open) => !open)}
              className="flex-1 text-left text-base text-slate-900"
              aria-haspopup="listbox"
              aria-expanded={isCategoryOpen}
            >
              {selectedCategory === 'All' ? (
                <span className="text-slate-400">Category (e.g., Contractors, Lenders)</span>
              ) : (
                selectedCategory
              )}
            </button>
            {selectedCategory !== 'All' && (
              <button
                type="button"
                onClick={() => setSelectedCategory('All')}
                className="rounded-full p-1 text-slate-400 hover:text-slate-600"
                aria-label="Clear category"
              >
                <X className="h-4 w-4" />
              </button>
            )}
            <ChevronDown className={`h-4 w-4 text-slate-400 transition-transform ${isCategoryOpen ? 'rotate-180' : ''}`} />
            {isCategoryOpen && (
              <div className="absolute left-0 right-0 top-full z-20 mt-2 rounded-lg border border-slate-200 bg-white py-2 shadow-lg">
                <label className="flex cursor-pointer items-center gap-2 px-4 py-2 text-sm text-slate-700 hover:bg-slate-50">
                  <input
                    type="checkbox"
                    className="h-4 w-4 rounded border-slate-300 text-blue-600"
                    checked={selectedCategory === 'All'}
                    onChange={() => setSelectedCategory('All')}
                  />
                  All
                </label>
                {CATEGORY_GROUPS.map((group) => (
                  <div key={group.label}>
                    <div className="px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.2em] text-slate-400">
                      {group.label}
                    </div>
                    {group.items.map((category) => (
                      <label
                        key={category}
                        className="flex cursor-pointer items-center gap-2 px-4 py-2 text-sm text-slate-700 hover:bg-slate-50"
                      >
                        <input
                          type="checkbox"
                          className="h-4 w-4 rounded border-slate-300 text-blue-600"
                          checked={selectedCategory === category}
                          onChange={() =>
                            setSelectedCategory(selectedCategory === category ? 'All' : category)
                          }
                        />
                        {category}
                      </label>
                    ))}
                  </div>
                ))}
              </div>
            )}
          </div>
          <div className="flex items-center gap-3 rounded-lg border border-slate-300 bg-white px-3 py-2.5 justify-between">
            <div className="flex items-center gap-2 text-slate-700 text-sm font-semibold">
              <Filter className="h-4 w-4 text-slate-500" />
              Verified
            </div>
            <button
              type="button"
              role="switch"
              aria-checked={selectedFilter === 'Verified'}
              onClick={() => setSelectedFilter(selectedFilter === 'Verified' ? 'All' : 'Verified')}
              className={`relative inline-flex h-6 w-11 items-center rounded-full border transition-colors ${
                selectedFilter === 'Verified'
                  ? 'border-blue-600 bg-blue-600'
                  : 'border-slate-300 bg-slate-200'
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white shadow-sm transition-transform ${
                  selectedFilter === 'Verified' ? 'translate-x-5' : 'translate-x-1'
                }`}
              />
            </button>
          </div>
          </div>
        </div>
      </section>

      <section className="grid gap-4 md:grid-cols-[1.45fr,1fr] w-full mx-auto px-2 pb-0 md:px-4 h-[calc(100vh-150px)]">
        <div className="relative z-0 rounded-2xl overflow-hidden border border-slate-200 shadow-sm -ml-2 md:-ml-4 rounded-l-none">
          <MapContainer
            center={[mapCenter.lat, mapCenter.lng]}
            zoom={mapZoom}
            style={{ height: '100%', width: '100%', zIndex: 0 }}
            scrollWheelZoom
          >
            <TileLayer
              url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OSM</a> &copy; <a href="https://carto.com/attributions">CARTO</a>'
            />
            {mapMarkers.map((vendor) => (
              <Marker
                key={vendor.name}
                position={[vendor.lat, vendor.lng]}
                icon={createPriceIcon(vendor.priceLabel)}
              >
                <Popup>
                  <div className="w-56 text-sm">
                    <span className="inline-flex rounded-md bg-slate-100 px-2 py-0.5 text-base font-bold text-slate-900">
                      {vendor.name}
                    </span>
                    <p className="text-xs text-slate-500 mt-0.5">{vendor.category} • {vendor.location}</p>
                    <div className="mt-3 flex items-center gap-2 text-xs text-slate-600">
                      <span className="inline-flex items-center gap-1"><Star className="w-3.5 h-3.5 text-amber-500" /> {vendor.rating} ({vendor.reviews})</span>
                      <span className="inline-flex items-center gap-1"><Clock className="w-3.5 h-3.5 text-blue-600" /> {vendor.response}</span>
                    </div>
                    <div className="mt-3 flex items-center justify-between">
                      <span className="text-sm font-semibold text-slate-900">{vendor.priceLabel}</span>
                      <button
                        type="button"
                        onClick={() => handleSelectListing(vendor.name)}
                        className="text-xs font-semibold text-blue-700"
                      >
                        View details
                      </button>
                    </div>
                  </div>
                </Popup>
              </Marker>
            ))}
            {selectedListing && (
              <Circle
                center={[selectedListing.lat, selectedListing.lng]}
                radius={1800}
                pathOptions={{
                  color: '#2563eb',
                  weight: 2,
                  fillColor: '#60a5fa',
                  fillOpacity: 0.2,
                }}
              />
            )}
          </MapContainer>
        </div>

        <div ref={detailScrollRef} className="space-y-3 h-full overflow-y-auto pr-1 pb-4 scroll-smooth">
          {!selectedListing && (
            <>
              <div className="sticky top-0 z-20 flex items-center justify-between rounded-xl border border-slate-200 bg-slate-50 px-4 py-3">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.25em] text-slate-600">Top matches</p>
                  <p className="text-sm text-slate-500">Showing {paged.length} of {sorted.length}</p>
                </div>
                <div className="flex items-center gap-2 text-sm text-slate-600">
                  <SlidersHorizontal className="h-4 w-4" />
                  Sort by:
                  <select
                    value={sortOption}
                    onChange={(e) => setSortOption(e.target.value as 'Rating' | 'Response time' | 'Price')}
                    className="rounded-md border border-slate-200 bg-white px-2 py-1 text-sm font-semibold text-slate-800"
                  >
                    <option value="Rating">Rating</option>
                    <option value="Response time">Response time</option>
                    <option value="Price">Price</option>
                  </select>
                </div>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                {paged.map((vendor) => (
                  <button
                    type="button"
                    key={vendor.name}
                    onClick={() => handleSelectListing(vendor.name)}
                    className="text-left rounded-xl border border-slate-200 bg-slate-50 shadow-sm hover:shadow-md transition-shadow overflow-hidden"
                  >
                    <div className="relative h-44 bg-gradient-to-br from-slate-100 via-slate-50 to-slate-200">
                      <img
                        src={vendor.imageUrl}
                        alt={vendor.name}
                        loading="lazy"
                        className="h-full w-full object-cover"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent" />
                      <div className="absolute left-3 right-3 top-3 flex items-center justify-between gap-2">
                        <div className="flex items-center gap-2">
                        {vendor.badges.includes('Verified') && (
                          <span className="inline-flex items-center gap-1 rounded-full bg-slate-900/70 px-3 py-1 text-[11px] font-semibold text-white">
                            <ShieldCheck className="h-3 w-3" /> Verified
                          </span>
                        )}
                        </div>
                        <button
                          type="button"
                          onClick={(event) => {
                            event.stopPropagation();
                            toggleFavorite(vendor.name);
                          }}
                          className={`inline-flex h-8 w-8 items-center justify-center rounded-full border transition-colors ${
                            favorites.has(vendor.name)
                              ? 'border-blue-600 bg-blue-600 text-white'
                              : 'border-white/70 bg-white/80 text-slate-700 hover:bg-white'
                          }`}
                          aria-label={favorites.has(vendor.name) ? 'Remove favorite' : 'Add favorite'}
                        >
                          <Heart className={`h-4 w-4 ${favorites.has(vendor.name) ? 'fill-current' : ''}`} />
                        </button>
                      </div>
                    </div>
                    <div className="px-4 py-3">
                      <div>
                        <p className="text-lg font-bold text-slate-900">{vendor.name}</p>
                        <div className="flex flex-wrap items-center gap-x-3 gap-y-1 mt-1 text-sm text-slate-600">
                          <span>{vendor.priceLabel}</span>
                          <span className="inline-flex items-center gap-1"><Star className="w-4 h-4 text-amber-500" /> {vendor.rating} ({vendor.reviews})</span>
                          <span className="inline-flex items-center gap-1"><Clock className="w-4 h-4 text-blue-600" /> {vendor.response} response</span>
                        </div>
                      </div>
                      <p className="text-sm text-slate-600 mt-2">{vendor.description}</p>
                      <div className="flex flex-wrap gap-2 mt-3 text-[11px] font-semibold uppercase tracking-[0.14em] text-slate-500">
                        {vendor.tags.map((tag) => (
                          <span key={tag} className="rounded-full border border-slate-200 px-3 py-1">{tag}</span>
                        ))}
                      </div>
                    </div>
                  </button>
                ))}
              </div>

              <div className="flex items-center justify-between rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-600 shadow-sm">
                <button
                  type="button"
                  onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                  disabled={safePage === 1}
                  className="rounded-md border border-slate-300 px-3 py-1.5 text-xs font-semibold disabled:opacity-50"
                >
                  Previous
                </button>
                <span>Page {safePage} of {totalPages}</span>
                <button
                  type="button"
                  onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                  disabled={safePage === totalPages}
                  className="rounded-md border border-slate-300 px-3 py-1.5 text-xs font-semibold disabled:opacity-50"
                >
                  Next
                </button>
              </div>
            </>
          )}

          {selectedListing && (
            <div className="space-y-2">
              <div className="sticky top-0 z-30 -mx-2 bg-white/95 px-2 pb-3 pt-2 backdrop-blur">
                <div className="flex items-center justify-between rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 shadow-sm">
                <button
                  type="button"
                  onClick={() => {
                    setSelectedListingIndex(null);
                    setSelectedImageIndex(0);
                    if (detailScrollRef.current) {
                      requestAnimationFrame(() => {
                        detailScrollRef.current?.scrollTo({ top: resultsScrollTopRef.current });
                      });
                    }
                  }}
                  className="inline-flex items-center gap-2 text-sm font-semibold text-blue-700"
                >
                  <ArrowLeft className="h-4 w-4" />
                  Back to results
                </button>
                <div className="flex items-center gap-2 text-sm text-slate-600">
                  <button
                    type="button"
                    onClick={() => setSelectedListingIndex((prev) => (prev === null ? prev : Math.max(0, prev - 1)))}
                    disabled={selectedListingIndex === 0}
                    className="rounded-md border border-slate-300 px-2.5 py-1 text-xs font-semibold disabled:opacity-50"
                  >
                    Previous
                  </button>
                  <button
                    type="button"
                    onClick={() =>
                      setSelectedListingIndex((prev) =>
                        prev === null ? prev : Math.min(sorted.length - 1, prev + 1)
                      )
                    }
                    disabled={selectedListingIndex === sorted.length - 1}
                    className="rounded-md border border-slate-300 px-2.5 py-1 text-xs font-semibold disabled:opacity-50"
                  >
                    Next
                  </button>
                </div>
                </div>
              </div>

              <div className="rounded-xl border border-slate-200 bg-white shadow-sm overflow-hidden">
                <div className="grid items-stretch gap-3 bg-slate-50 p-3 lg:grid-cols-[2.2fr,1fr]">
                  <div className="flex h-full flex-col gap-2">
                    <div className="relative h-60 rounded-lg overflow-hidden">
                      <img
                        src={selectedImages[selectedImageIndex] || selectedListing.imageUrl}
                        alt={selectedListing.name}
                        loading="lazy"
                        className="h-full w-full object-cover"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent" />
                      <div className="absolute inset-x-0 bottom-3 flex items-center justify-center gap-2">
                        {selectedImages.map((_, index) => (
                          <button
                            key={`${selectedListing.name}-dot-${index}`}
                            type="button"
                            onClick={() => setSelectedImageIndex(index)}
                            className={`h-2 w-2 rounded-full ${selectedImageIndex === index ? 'bg-white' : 'bg-white/50'}`}
                            aria-label={`Show image ${index + 1}`}
                          />
                        ))}
                      </div>
                      <div className="absolute inset-y-0 left-3 flex items-center">
                        <button
                          type="button"
                          onClick={() => setSelectedImageIndex((prev) => (prev > 0 ? prev - 1 : selectedImages.length - 1))}
                          className="rounded-full border border-white/70 bg-white/80 p-2 text-slate-700 hover:bg-white"
                          aria-label="Previous image"
                        >
                          <ArrowLeft className="h-4 w-4" />
                        </button>
                      </div>
                      <div className="absolute inset-y-0 right-3 flex items-center">
                        <button
                          type="button"
                          onClick={() => setSelectedImageIndex((prev) => (prev + 1) % selectedImages.length)}
                          className="rounded-full border border-white/70 bg-white/80 p-2 text-slate-700 hover:bg-white"
                          aria-label="Next image"
                        >
                          <ArrowLeft className="h-4 w-4 rotate-180" />
                        </button>
                      </div>
                    </div>
                    <div className="grid grid-cols-3 gap-2">
                      {selectedImages.slice(0, 3).map((image, index) => (
                        <button
                          key={`${selectedListing.name}-thumb-${index}`}
                          type="button"
                          onClick={() => setSelectedImageIndex(index)}
                          className={`relative h-20 rounded-lg overflow-hidden ${selectedImageIndex === index ? 'ring-2 ring-blue-600' : ''}`}
                        >
                          <img
                            src={image}
                            alt={selectedListing.name}
                            loading="lazy"
                            className="h-full w-full object-cover"
                          />
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="flex h-full flex-col gap-3">
                    <div className="flex-1 rounded-lg border border-slate-200 bg-white px-4 py-4">
                      <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">Vendor Status</p>
                      <div className="mt-3 flex flex-wrap items-center gap-2">
                        {selectedListing.badges.includes('Verified') && (
                          <span className="inline-flex items-center gap-1 rounded-full bg-slate-900/80 px-3 py-1 text-[11px] font-semibold text-white">
                            <ShieldCheck className="h-3 w-3" /> Verified
                          </span>
                        )}
                        <button
                          type="button"
                          onClick={() => toggleFavorite(selectedListing.name)}
                          className={`inline-flex h-8 w-8 items-center justify-center rounded-full border ${
                            favorites.has(selectedListing.name)
                              ? 'border-blue-600 bg-blue-600 text-white'
                              : 'border-slate-200 text-slate-700'
                          }`}
                          aria-label={favorites.has(selectedListing.name) ? 'Remove favorite' : 'Add favorite'}
                        >
                          <Heart className={`h-4 w-4 ${favorites.has(selectedListing.name) ? 'fill-current' : ''}`} />
                        </button>
                      </div>
                    </div>

                    <div className="flex-1 rounded-lg border border-slate-200 bg-white px-4 py-4">
                      <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">Response</p>
                      <p className="text-sm text-slate-700 mt-2">{selectedListing.response}</p>
                    </div>

                    <div className="flex-1 rounded-lg border border-slate-200 bg-white px-4 py-4">
                      <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">Pricing</p>
                      <p className="text-sm text-slate-700 mt-2">{selectedListing.priceLabel}</p>
                    </div>

                  </div>
                </div>

                <div className="px-5 pb-6">
                  <div className="border-b border-slate-200 pb-4">
                    <h2 className="text-2xl font-bold text-slate-900 mt-2">{selectedListing.name}</h2>
                    <p className="text-xs text-slate-500 mt-1">Open Mon–Sat • 8:00 AM–6:00 PM</p>
                    <div className="flex flex-wrap items-center gap-x-3 gap-y-1 mt-3 text-sm text-slate-600">
                      <span>{selectedListing.priceLabel}</span>
                      <span className="inline-flex items-center gap-1"><Star className="w-4 h-4 text-amber-500" /> {selectedListing.rating} ({selectedListing.reviews})</span>
                      <span className="inline-flex items-center gap-1"><Clock className="w-4 h-4 text-blue-600" /> {selectedListing.response} response</span>
                    </div>
                  </div>

                  <div className="mt-5 space-y-6">
                    <nav className="flex flex-wrap gap-6 border-b border-slate-200 pb-3 text-sm text-slate-600">
                      <a href="#schedule-service" onClick={(e) => handleAnchorClick(e, 'schedule-service')} className="hover:text-slate-900">Schedule service</a>
                      <a href="#about-us" onClick={(e) => handleAnchorClick(e, 'about-us')} className="hover:text-slate-900">About us</a>
                      <a href="#contact-vendor" onClick={(e) => handleAnchorClick(e, 'contact-vendor')} className="hover:text-slate-900">Contact vendor</a>
                      <a href="#similar-vendors" onClick={(e) => handleAnchorClick(e, 'similar-vendors')} className="hover:text-slate-900">Similar vendors</a>
                    </nav>
                    <section id="what-we-do" className="space-y-3 scroll-mt-24">
                      <h3 className="text-sm font-semibold text-slate-900">What we do</h3>
                      <div className="flex flex-wrap gap-2 text-[11px] font-semibold uppercase tracking-[0.14em] text-slate-500">
                        {selectedListing.tags.map((tag) => (
                          <span key={tag} className="rounded-full border border-slate-200 px-3 py-1 bg-white">{tag}</span>
                        ))}
                      </div>
                    </section>

                    <section className="space-y-3">
                      <p className="text-sm text-slate-700">{selectedListing.description}</p>
                    </section>

                    <section id="schedule-service" className="rounded-lg border border-slate-200 px-4 py-3 scroll-mt-24">
                      <h3 className="text-sm font-semibold text-slate-900">Schedule service</h3>
                      <p className="text-xs text-slate-500 mt-1">Response window: {selectedListing.response}</p>
                      <div className="mt-3 space-y-2">
                        <select className="w-full rounded-md border border-slate-200 px-2 py-2 text-sm text-slate-700">
                          <option value="">Select service</option>
                          {selectedListing.tags.map((tag) => (
                            <option key={tag} value={tag}>{tag}</option>
                          ))}
                        </select>
                        <input
                          type="date"
                          className="w-full rounded-md border border-slate-200 px-2 py-2 text-sm text-slate-700"
                        />
                        <select className="w-full rounded-md border border-slate-200 px-2 py-2 text-sm text-slate-700">
                          <option value="">Preferred time</option>
                          <option>Morning</option>
                          <option>Midday</option>
                          <option>Afternoon</option>
                        </select>
                        <button className="w-full rounded-md bg-blue-600 px-3 py-2 text-sm font-semibold text-white">
                          Request appointment
                        </button>
                      </div>
                    </section>

                    <section id="vendor-facts" className="grid gap-4 md:grid-cols-2 scroll-mt-24">
                      <div className="rounded-lg border border-slate-200 px-4 py-3">
                        <p className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
                          <ClipboardList className="h-4 w-4" /> Vendor facts
                        </p>
                        <div className="mt-3 space-y-2 text-sm text-slate-700">
                          <p>Category: {selectedListing.category}</p>
                          <p>Location: {selectedListing.location}</p>
                          <p>Verified: {selectedListing.badges.includes('Verified') ? 'Yes' : 'No'}</p>
                        </div>
                      </div>
                      <div className="rounded-lg border border-slate-200 px-4 py-3">
                        <p className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
                          <TrendingUp className="h-4 w-4" /> Performance
                        </p>
                        <div className="mt-3 space-y-2 text-sm text-slate-700">
                          <p>Rating: {selectedListing.rating} ({selectedListing.reviews} reviews)</p>
                          <p>Response time: {selectedListing.response}</p>
                          <p>Pricing: {selectedListing.priceLabel}</p>
                        </div>
                      </div>
                    </section>

                    <section id="services-specialties" className="grid gap-4 md:grid-cols-2 scroll-mt-24">
                      <div className="rounded-lg border border-slate-200 px-4 py-3">
                        <p className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
                          <Briefcase className="h-4 w-4" /> Services &amp; specialties
                        </p>
                        <div className="mt-3 flex flex-wrap gap-2 text-[11px] font-semibold uppercase tracking-[0.14em] text-slate-500">
                          {selectedListing.tags.map((tag) => (
                            <span key={tag} className="rounded-full border border-slate-200 px-3 py-1 bg-white">{tag}</span>
                          ))}
                        </div>
                      </div>
                      <div className="rounded-lg border border-slate-200 px-4 py-3">
                        <p className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
                          <Calendar className="h-4 w-4" /> Availability
                        </p>
                        <p className="text-sm text-slate-700 mt-2">Response window: {selectedListing.response}</p>
                      </div>
                    </section>

                    <section id="service-area" className="grid gap-4 md:grid-cols-2 scroll-mt-24">
                      <div className="rounded-lg border border-slate-200 px-4 py-3">
                        <p className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
                          <Map className="h-4 w-4" /> Service area
                        </p>
                        <p className="text-sm text-slate-700 mt-2">{selectedListing.location}</p>
                        <p className="text-xs text-slate-500 mt-2">See full coverage on the map.</p>
                      </div>
                      <div className="rounded-lg border border-slate-200 px-4 py-3">
                        <p className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
                          <MessageSquare className="h-4 w-4" /> Reviews
                        </p>
                        <p className="text-sm text-slate-700 mt-2">{selectedListing.rating} ({selectedListing.reviews} reviews)</p>
                      </div>
                    </section>

                    <section id="about-us" className="grid gap-6 rounded-lg border border-slate-200 p-5 lg:grid-cols-[1.4fr,1fr] scroll-mt-24">
                      <div className="space-y-4">
                        <h3 className="text-2xl font-bold text-slate-900">About us</h3>
                        <p className="text-base text-slate-700">{selectedListing.description}</p>
                        <button className="w-full rounded-md border border-blue-600 px-4 py-2 text-sm font-semibold text-blue-600 hover:bg-blue-50 sm:w-auto">
                          View company details
                        </button>
                        <p className="text-xs text-slate-500">Source: {selectedListing.name}</p>
                      </div>
                      <div className="space-y-3">
                        <div className="overflow-hidden rounded-xl border border-slate-200">
                          <img
                            src={selectedListing.imageUrl}
                            alt={selectedListing.name}
                            loading="lazy"
                            className="h-40 w-full object-cover"
                          />
                        </div>
                        <p className="text-sm text-slate-700">{selectedListing.location}</p>
                      </div>
                    </section>

                    <section id="contact-vendor" className="space-y-3 scroll-mt-24">
                      <h3 className="text-sm font-semibold text-slate-900">Contact vendor</h3>
                      <div className="grid gap-2 md:grid-cols-2">
                        <input
                          type="text"
                          placeholder="Your name"
                          className="w-full rounded-md border border-slate-200 px-3 py-2 text-sm text-slate-700"
                        />
                        <input
                          type="email"
                          placeholder="Email"
                          className="w-full rounded-md border border-slate-200 px-3 py-2 text-sm text-slate-700"
                        />
                      </div>
                      <textarea
                        placeholder="Tell us about your project"
                        className="w-full rounded-md border border-slate-200 px-3 py-2 text-sm text-slate-700"
                        rows={3}
                      />
                      <button className="rounded-md bg-slate-900 px-4 py-2 text-sm font-semibold text-white">
                        Send message
                      </button>
                    </section>

                    <section id="similar-vendors" className="space-y-3 scroll-mt-24">
                      <h3 className="text-sm font-semibold text-slate-900">Similar vendors</h3>
                      <div className="grid gap-4 md:grid-cols-2">
                        {similarVendors.map((vendor) => (
                          <button
                            key={vendor.name}
                            type="button"
                            onClick={() => handleSelectListing(vendor.name)}
                            className="text-left rounded-xl border border-slate-200 bg-slate-50 shadow-sm hover:shadow-md transition-shadow overflow-hidden"
                          >
                            <div className="relative h-44 bg-gradient-to-br from-slate-100 via-slate-50 to-slate-200">
                              <img
                                src={vendor.imageUrl}
                                alt={vendor.name}
                                loading="lazy"
                                className="h-full w-full object-cover"
                              />
                              <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent" />
                              <div className="absolute left-3 right-3 top-3 flex items-center justify-between gap-2">
                                <div className="flex items-center gap-2">
                                  {vendor.badges.includes('Verified') && (
                                    <span className="inline-flex items-center gap-1 rounded-full bg-slate-900/70 px-3 py-1 text-[11px] font-semibold text-white">
                                      <ShieldCheck className="h-3 w-3" /> Verified
                                    </span>
                                  )}
                                </div>
                                <button
                                  type="button"
                                  onClick={(event) => {
                                    event.stopPropagation();
                                    toggleFavorite(vendor.name);
                                  }}
                                  className={`inline-flex h-8 w-8 items-center justify-center rounded-full border transition-colors ${
                                    favorites.has(vendor.name)
                                      ? 'border-blue-600 bg-blue-600 text-white'
                                      : 'border-white/70 bg-white/80 text-slate-700 hover:bg-white'
                                  }`}
                                  aria-label={favorites.has(vendor.name) ? 'Remove favorite' : 'Add favorite'}
                                >
                                  <Heart className={`h-4 w-4 ${favorites.has(vendor.name) ? 'fill-current' : ''}`} />
                                </button>
                              </div>
                            </div>
                            <div className="px-4 py-3">
                              <div>
                                <p className="text-lg font-bold text-slate-900">{vendor.name}</p>
                                <div className="flex flex-wrap items-center gap-x-3 gap-y-1 mt-1 text-sm text-slate-600">
                                  <span>{vendor.priceLabel}</span>
                                  <span className="inline-flex items-center gap-1"><Star className="w-4 h-4 text-amber-500" /> {vendor.rating} ({vendor.reviews})</span>
                                  <span className="inline-flex items-center gap-1"><Clock className="w-4 h-4 text-blue-600" /> {vendor.response} response</span>
                                </div>
                              </div>
                              <p className="text-sm text-slate-600 mt-2">{vendor.description}</p>
                              <div className="flex flex-wrap gap-2 mt-3 text-[11px] font-semibold uppercase tracking-[0.14em] text-slate-500">
                                {vendor.tags.map((tag) => (
                                  <span key={tag} className="rounded-full border border-slate-200 px-3 py-1">{tag}</span>
                                ))}
                              </div>
                            </div>
                          </button>
                        ))}
                      </div>
                    </section>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </section>

      <AuthModal isOpen={isAuthOpen} onClose={() => setIsAuthOpen(false)} defaultMode={authMode} />
    </div>
  );
};
