import React, { useEffect, useState, useContext } from 'react';
import { Link } from 'react-router-dom';
import { PublicNavbar } from '../components/PublicNavbar';
import { MapContainer, TileLayer, Marker } from 'react-leaflet';
import { StoreContext } from '../store';
import { Button } from '../components/Button';
import { Modal } from '../components/Modal';

const CONTACTED_VENDORS_KEY = 'clientContactedVendors';
const APPOINTMENTS_KEY = 'clientAppointments';
const PROFILE_KEY_PREFIX = 'clientProfile';
const PROPERTIES_KEY_PREFIX = 'clientProperties';

type ContactedVendor = {
  id: string;
  vendorName: string;
  category: string;
  location: string;
  contactName: string;
  contactEmail: string;
  message: string;
  requestedAt: string;
};

type AppointmentRequest = {
  id: string;
  vendorName: string;
  category: string;
  location: string;
  service: string;
  preferredDate: string;
  preferredTime: string;
  projectDetails: string;
  attachments: string[];
  requestedAt: string;
};

type ClientProfile = {
  name: string;
  email: string;
  location: string;
};

type ClientProperty = {
  id: string;
  name: string;
  addressLine: string;
  city: string;
  state: string;
  zip: string;
  photoUrl?: string;
};

const loadContactedVendors = (): ContactedVendor[] => {
  try {
    const raw = localStorage.getItem(CONTACTED_VENDORS_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed;
  } catch {
    return [];
  }
};

const loadAppointments = (): AppointmentRequest[] => {
  try {
    const raw = localStorage.getItem(APPOINTMENTS_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed;
  } catch {
    return [];
  }
};

const loadClientProfile = (userId: string, fallback: ClientProfile): ClientProfile => {
  try {
    const raw = localStorage.getItem(`${PROFILE_KEY_PREFIX}:${userId}`);
    if (!raw) return fallback;
    const parsed = JSON.parse(raw);
    if (!parsed || typeof parsed !== 'object') return fallback;
    return {
      name: parsed.name || fallback.name,
      email: parsed.email || fallback.email,
      location: parsed.location || fallback.location
    };
  } catch {
    return fallback;
  }
};

const loadClientProperties = (userId: string): ClientProperty[] => {
  try {
    const raw = localStorage.getItem(`${PROPERTIES_KEY_PREFIX}:${userId}`);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
};

export const ClientDashboard: React.FC = () => {
  const store = useContext(StoreContext);
  const [contacts, setContacts] = useState<ContactedVendor[]>([]);
  const [appointments, setAppointments] = useState<AppointmentRequest[]>([]);
  const [mapCenter, setMapCenter] = useState<[number, number]>([30.2672, -97.7431]);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isPropertyOpen, setIsPropertyOpen] = useState(false);
  const [profile, setProfile] = useState<ClientProfile>({
    name: store?.currentUser?.name || '',
    email: store?.currentUser?.email || '',
    location: ''
  });
  const [properties, setProperties] = useState<ClientProperty[]>([]);
  const [propertyDraft, setPropertyDraft] = useState<ClientProperty>({
    id: '',
    name: '',
    addressLine: '',
    city: '',
    state: '',
    zip: '',
    photoUrl: ''
  });

  useEffect(() => {
    setContacts(loadContactedVendors());
    setAppointments(loadAppointments());
  }, []);

  useEffect(() => {
    const userId = store?.currentUser?.id || 'anonymous';
    const fallbackProfile: ClientProfile = {
      name: store?.currentUser?.name || '',
      email: store?.currentUser?.email || '',
      location: ''
    };
    setProfile(loadClientProfile(userId, fallbackProfile));
    setProperties(loadClientProperties(userId));
  }, [store?.currentUser?.id, store?.currentUser?.name, store?.currentUser?.email]);

  useEffect(() => {
    if (!navigator.geolocation) return;
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setMapCenter([position.coords.latitude, position.coords.longitude]);
      },
      () => undefined,
      { enableHighAccuracy: false, timeout: 5000 }
    );
  }, []);

  return (
    <div className="min-h-screen bg-white text-slate-900">
      <PublicNavbar onOpenAuth={() => undefined} />

      <section className="pt-28 pb-16 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
            <div>
              <h1 className="text-3xl md:text-4xl font-bold text-slate-900">Homeowner Dashboard</h1>
              <p className="text-slate-500 mt-2">Track vendors you contacted and follow up on your requests.</p>
            </div>
            <Link
              to="/platform"
              className="inline-flex items-center justify-center rounded-lg border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50"
            >
              Start a new search
            </Link>
          </div>

          <div className="grid gap-6 lg:grid-cols-[1.4fr,1fr] mb-10">
            <div className="rounded-2xl border border-slate-200 bg-white shadow-sm p-6">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">Profile</p>
                  <h2 className="text-2xl font-bold text-slate-900 mt-2">{profile.name || 'Unnamed homeowner'}</h2>
                  <p className="text-sm text-slate-500 mt-1">{profile.email || 'Email not provided'}</p>
                  <p className="text-sm text-slate-500 mt-1">{profile.location || 'Location not set'}</p>
                </div>
                <Button variant="outline" onClick={() => setIsProfileOpen(true)}>Edit Profile</Button>
              </div>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-white shadow-sm p-6">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">Properties</p>
                  <h2 className="text-lg font-semibold text-slate-900 mt-2">Your Homes</h2>
                  <p className="text-sm text-slate-500 mt-1">Add each property you manage or own.</p>
                </div>
                <Button variant="outline" onClick={() => {
                  setPropertyDraft({
                    id: crypto.randomUUID(),
                    name: '',
                    addressLine: '',
                    city: '',
                    state: '',
                    zip: '',
                    photoUrl: ''
                  });
                  setIsPropertyOpen(true);
                }}>Add Property</Button>
              </div>
              {properties.length === 0 ? (
                <div className="text-sm text-slate-500 py-6 text-center border border-dashed border-slate-200 rounded-xl">
                  No properties yet.
                </div>
              ) : (
                <div className="space-y-4">
                  {properties.map((property) => (
                    <div key={property.id} className="flex items-start gap-4 border border-slate-200 rounded-xl p-4">
                      <div className="w-20 h-20 rounded-lg border border-slate-200 overflow-hidden bg-slate-50 flex items-center justify-center text-xs text-slate-400">
                        {property.photoUrl ? (
                          <img src={property.photoUrl} alt={property.name} className="w-full h-full object-cover" />
                        ) : (
                          <span>No photo</span>
                        )}
                      </div>
                      <div>
                        <p className="font-semibold text-slate-900">{property.name || 'Untitled property'}</p>
                        <p className="text-sm text-slate-500 mt-1">
                          {property.addressLine}{property.addressLine ? ',' : ''} {property.city} {property.state} {property.zip}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white shadow-sm">
            <div className="border-b border-slate-200 px-6 py-4">
              <h2 className="text-lg font-semibold text-slate-900">Contacted Vendors</h2>
              <p className="text-sm text-slate-500 mt-1">
                Showing {contacts.length} request{contacts.length === 1 ? '' : 's'}
              </p>
            </div>

            {contacts.length === 0 ? (
              <div className="px-6 py-10 text-center text-slate-500">
                You have not contacted any vendors yet.
              </div>
            ) : (
              <div className="divide-y divide-slate-200">
                {contacts.map((contact) => (
                  <div key={contact.id} className="px-6 py-5 flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                    <div>
                      <p className="text-lg font-semibold text-slate-900">{contact.vendorName}</p>
                      <p className="text-sm text-slate-500 mt-1">{contact.category} • {contact.location}</p>
                      {contact.message ? (
                        <p className="text-sm text-slate-600 mt-3 max-w-2xl">{contact.message}</p>
                      ) : null}
                    </div>
                    <div className="text-sm text-slate-500">
                      <div>{contact.contactName || 'Name not provided'}</div>
                      <div>{contact.contactEmail || 'Email not provided'}</div>
                      <div className="mt-2 text-xs text-slate-400">Requested {new Date(contact.requestedAt).toLocaleString()}</div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white shadow-sm mt-10">
            <div className="border-b border-slate-200 px-6 py-4">
              <h2 className="text-lg font-semibold text-slate-900">Requested Appointments</h2>
              <p className="text-sm text-slate-500 mt-1">
                Showing {appointments.length} appointment{appointments.length === 1 ? '' : 's'}
              </p>
            </div>

            {appointments.length === 0 ? (
              <div className="px-6 py-10 text-center text-slate-500">
                You have not requested any appointments yet.
              </div>
            ) : (
              <div className="divide-y divide-slate-200">
                {appointments.map((appointment) => (
                  <div key={appointment.id} className="px-6 py-5 flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                    <div>
                      <p className="text-lg font-semibold text-slate-900">{appointment.vendorName}</p>
                      <p className="text-sm text-slate-500 mt-1">{appointment.category} • {appointment.location}</p>
                      <p className="text-sm text-slate-600 mt-3">
                        {appointment.service}
                        {appointment.preferredDate ? ` • ${appointment.preferredDate}` : ''}
                        {appointment.preferredTime ? ` • ${appointment.preferredTime}` : ''}
                      </p>
                      {appointment.projectDetails ? (
                        <p className="text-sm text-slate-600 mt-2 max-w-2xl">{appointment.projectDetails}</p>
                      ) : null}
                      {appointment.attachments?.length ? (
                        <p className="text-xs text-slate-500 mt-2">Attachments: {appointment.attachments.join(', ')}</p>
                      ) : null}
                    </div>
                    <div className="text-xs text-slate-400">Requested {new Date(appointment.requestedAt).toLocaleString()}</div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white shadow-sm mt-10 overflow-hidden">
            <div className="border-b border-slate-200 px-6 py-4">
              <h2 className="text-lg font-semibold text-slate-900">Homeowner Location</h2>
              <p className="text-sm text-slate-500 mt-1">Centered on your current location.</p>
            </div>
            <div className="h-72">
              <MapContainer center={mapCenter} zoom={12} style={{ height: '100%', width: '100%' }}>
                <TileLayer
                  attribution='&copy; OpenStreetMap contributors'
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                <Marker position={mapCenter} />
              </MapContainer>
            </div>
          </div>
        </div>
      </section>

      {isProfileOpen && (
        <Modal
          isOpen={isProfileOpen}
          onClose={() => setIsProfileOpen(false)}
          title="Edit Profile"
        >
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-semibold text-slate-600 mb-1">Name</label>
              <input
                value={profile.name}
                onChange={(e) => setProfile((prev) => ({ ...prev, name: e.target.value }))}
                className="w-full border border-slate-200 rounded-lg px-3 py-2.5"
                placeholder="Full name"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-slate-600 mb-1">Email</label>
              <input
                value={profile.email}
                onChange={(e) => setProfile((prev) => ({ ...prev, email: e.target.value }))}
                className="w-full border border-slate-200 rounded-lg px-3 py-2.5"
                placeholder="email@example.com"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-slate-600 mb-1">Location</label>
              <input
                value={profile.location}
                onChange={(e) => setProfile((prev) => ({ ...prev, location: e.target.value }))}
                className="w-full border border-slate-200 rounded-lg px-3 py-2.5"
                placeholder="City, State"
              />
            </div>
            <div className="flex items-center justify-end gap-2 pt-2">
              <Button
                variant="outline"
                onClick={() => setIsProfileOpen(false)}
              >
                Cancel
              </Button>
              <Button
                onClick={() => {
                  const userId = store?.currentUser?.id || 'anonymous';
                  localStorage.setItem(`${PROFILE_KEY_PREFIX}:${userId}`, JSON.stringify(profile));
                  setIsProfileOpen(false);
                }}
              >
                Save
              </Button>
            </div>
          </div>
        </Modal>
      )}

      {isPropertyOpen && (
        <Modal
          isOpen={isPropertyOpen}
          onClose={() => setIsPropertyOpen(false)}
          title="Add Property"
        >
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-semibold text-slate-600 mb-1">Property Name</label>
              <input
                value={propertyDraft.name}
                onChange={(e) => setPropertyDraft((prev) => ({ ...prev, name: e.target.value }))}
                className="w-full border border-slate-200 rounded-lg px-3 py-2.5"
                placeholder="Main residence"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-slate-600 mb-1">Address</label>
              <input
                value={propertyDraft.addressLine}
                onChange={(e) => setPropertyDraft((prev) => ({ ...prev, addressLine: e.target.value }))}
                className="w-full border border-slate-200 rounded-lg px-3 py-2.5"
                placeholder="Street address"
              />
            </div>
            <div className="grid grid-cols-3 gap-3">
              <input
                value={propertyDraft.city}
                onChange={(e) => setPropertyDraft((prev) => ({ ...prev, city: e.target.value }))}
                className="w-full border border-slate-200 rounded-lg px-3 py-2.5"
                placeholder="City"
              />
              <input
                value={propertyDraft.state}
                onChange={(e) => setPropertyDraft((prev) => ({ ...prev, state: e.target.value }))}
                className="w-full border border-slate-200 rounded-lg px-3 py-2.5"
                placeholder="State"
              />
              <input
                value={propertyDraft.zip}
                onChange={(e) => setPropertyDraft((prev) => ({ ...prev, zip: e.target.value }))}
                className="w-full border border-slate-200 rounded-lg px-3 py-2.5"
                placeholder="Zip"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-slate-600 mb-1">Photo URL (optional)</label>
              <input
                value={propertyDraft.photoUrl || ''}
                onChange={(e) => setPropertyDraft((prev) => ({ ...prev, photoUrl: e.target.value }))}
                className="w-full border border-slate-200 rounded-lg px-3 py-2.5"
                placeholder="https://..."
              />
            </div>
            <div className="flex items-center justify-end gap-2 pt-2">
              <Button variant="outline" onClick={() => setIsPropertyOpen(false)}>Cancel</Button>
              <Button
                onClick={() => {
                  if (!propertyDraft.addressLine.trim()) return;
                  const userId = store?.currentUser?.id || 'anonymous';
                  const next = [...properties, propertyDraft];
                  setProperties(next);
                  localStorage.setItem(`${PROPERTIES_KEY_PREFIX}:${userId}`, JSON.stringify(next));
                  setIsPropertyOpen(false);
                }}
              >
                Save Property
              </Button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};
