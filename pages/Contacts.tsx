import React, { useContext, useMemo, useRef, useState, useEffect } from 'react';
import { StoreContext } from '../store';
import { Button } from '../components/Button';
import { Modal } from '../components/Modal';
import { Upload } from 'lucide-react';

type ImportedContact = {
  id: string;
  name: string;
  email: string;
  phone: string;
  type: 'Client' | 'Vendor' | 'Other';
  tags: string[];
};

const IMPORTED_CONTACTS_KEY = 'importedContacts';
const VENDOR_TAGS_KEY = 'vendorContactTags';
const CLIENT_PHOTOS_KEY = 'clientContactPhotos';

const loadImportedContacts = (key: string): ImportedContact[] => {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
};

const loadVendorTags = (key: string): Record<string, string[]> => {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
};

export const Contacts: React.FC = () => {
  const store = useContext(StoreContext);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [importedContacts, setImportedContacts] = useState<ImportedContact[]>([]);
  const [tagInput, setTagInput] = useState('');
  const [pendingTags, setPendingTags] = useState<string[]>([]);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editDraft, setEditDraft] = useState({
    name: '',
    email: '',
    phone: '',
    type: 'Other' as ImportedContact['type'],
    tags: ''
  });
  const [editTags, setEditTags] = useState<string[]>([]);
  const [editTagInput, setEditTagInput] = useState('');
  const [vendorTags, setVendorTags] = useState<Record<string, string[]>>({});
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [isPhotoOpen, setIsPhotoOpen] = useState(false);
  const [photoTargetId, setPhotoTargetId] = useState<string | null>(null);
  const [photoUrlDraft, setPhotoUrlDraft] = useState('');
  const [clientPhotos, setClientPhotos] = useState<Record<string, string>>({});
  const [newContact, setNewContact] = useState({
    name: '',
    email: '',
    phone: '',
    type: 'Other' as ImportedContact['type'],
    tags: ''
  });

  if (!store) return null;

  const { clients, vendors, updateClient, updateVendor, currentUser } = store;
  const storageSuffix = currentUser.companyId || currentUser.id;
  const importedContactsKey = `${IMPORTED_CONTACTS_KEY}:${storageSuffix}`;
  const vendorTagsKey = `${VENDOR_TAGS_KEY}:${storageSuffix}`;
  const clientPhotosKey = `${CLIENT_PHOTOS_KEY}:${storageSuffix}`;

  useEffect(() => {
    setImportedContacts(loadImportedContacts(importedContactsKey));
    setVendorTags(loadVendorTags(vendorTagsKey));
    try {
      const raw = localStorage.getItem(clientPhotosKey);
      setClientPhotos(raw ? JSON.parse(raw) : {});
    } catch {
      setClientPhotos({});
    }
  }, [importedContactsKey, vendorTagsKey, clientPhotosKey]);

  const combinedContacts = useMemo(() => {
    const clientContacts = clients.map((client) => ({
      id: client.id,
      name: `${client.firstName} ${client.lastName}`,
      email: client.email,
      phone: client.phone,
      type: 'Client' as const,
      tags: client.tags || [],
      address: client.properties?.[0]
        ? `${client.properties[0].address.street}, ${client.properties[0].address.city} ${client.properties[0].address.state} ${client.properties[0].address.zip}`
        : '',
      source: 'client' as const
    }));
    const vendorContacts = vendors.map((vendor) => ({
      id: vendor.id,
      name: vendor.name,
      email: vendor.email,
      phone: vendor.phone,
      type: 'Vendor' as const,
      tags: vendorTags[vendor.id] || [],
      address: vendor.location || '',
      source: 'vendor' as const
    }));
    const imported = importedContacts.map((contact) => ({
      ...contact,
      address: '',
      source: 'imported' as const
    }));
    return [...imported, ...clientContacts, ...vendorContacts];
  }, [clients, vendors, importedContacts, vendorTags]);

  const startEdit = (contact: typeof combinedContacts[number]) => {
    setEditingId(`${contact.source}-${contact.id}`);
    setEditDraft({
      name: contact.name,
      email: contact.email,
      phone: contact.phone,
      type: contact.type,
      tags: contact.tags.join(', ')
    });
    setEditTags(contact.tags || []);
    setEditTagInput('');
  };

  const cancelEdit = () => {
    setEditingId(null);
  };

  const saveEdit = async (contact: typeof combinedContacts[number]) => {
    const nextTags = editTags.length > 0
      ? editTags
      : editDraft.tags
          .split(',')
          .map((tag) => tag.trim())
          .filter(Boolean);

    if (contact.source === 'imported') {
      const next = importedContacts.map((c) =>
        c.id === contact.id
          ? {
              ...c,
              name: editDraft.name,
              email: editDraft.email,
              phone: editDraft.phone,
              type: editDraft.type,
              tags: nextTags
            }
          : c
      );
      setImportedContacts(next);
      localStorage.setItem(importedContactsKey, JSON.stringify(next));
    } else if (contact.source === 'client') {
      const [firstName, ...rest] = editDraft.name.trim().split(' ');
      const lastName = rest.join(' ');
      const existing = clients.find((c) => c.id === contact.id);
      if (existing) {
        await updateClient({
          ...existing,
          firstName: firstName || existing.firstName,
          lastName: lastName || existing.lastName,
          email: editDraft.email,
          phone: editDraft.phone,
          tags: nextTags
        });
      }
    } else if (contact.source === 'vendor') {
      const existing = vendors.find((v) => v.id === contact.id);
      if (existing) {
        await updateVendor({
          ...existing,
          name: editDraft.name,
          email: editDraft.email,
          phone: editDraft.phone
        });
      }
      const next = { ...vendorTags, [contact.id]: nextTags };
      setVendorTags(next);
      localStorage.setItem(vendorTagsKey, JSON.stringify(next));
    }

    setEditingId(null);
  };

  const addPendingTag = (value: string) => {
    const trimmed = value.trim();
    if (!trimmed) return;
    if (pendingTags.includes(trimmed)) return;
    setPendingTags((prev) => [...prev, trimmed]);
  };

  const addEditTag = (value: string) => {
    const trimmed = value.trim();
    if (!trimmed) return;
    if (editTags.includes(trimmed)) return;
    setEditTags((prev) => [...prev, trimmed]);
  };

  const handleCsvImport = async (file: File) => {
    const text = await file.text();
    const [headerLine, ...rows] = text.split(/\r?\n/).filter(Boolean);
    const headers = headerLine.split(',').map((h) => h.trim().toLowerCase());
    const nameIdx = headers.indexOf('name');
    const emailIdx = headers.indexOf('email');
    const phoneIdx = headers.indexOf('phone');
    const typeIdx = headers.indexOf('type');
    const tagsIdx = headers.indexOf('tags');

    const parsed = rows.map((row) => {
      const cols = row.split(',').map((c) => c.trim());
      const tags = tagsIdx >= 0 ? cols[tagsIdx]?.split(/;|\|/).map((t) => t.trim()).filter(Boolean) : [];
      return {
        id: crypto.randomUUID(),
        name: nameIdx >= 0 ? cols[nameIdx] : cols[0],
        email: emailIdx >= 0 ? cols[emailIdx] : '',
        phone: phoneIdx >= 0 ? cols[phoneIdx] : '',
        type: (typeIdx >= 0 ? cols[typeIdx] : 'Other') as ImportedContact['type'],
        tags
      };
    });

    const next = [...parsed, ...importedContacts];
    setImportedContacts(next);
    localStorage.setItem(importedContactsKey, JSON.stringify(next));
  };

  return (
    <div className="max-w-7xl mx-auto pb-12">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white tracking-tight">Contacts</h1>
          <p className="text-slate-500 dark:text-slate-400 mt-1">All clients, vendors, and imported contacts in one place.</p>
        </div>
        <div className="flex items-center gap-3">
          <Button onClick={() => setIsAddOpen(true)}>Add Contact</Button>
          <Button variant="outline" onClick={() => fileInputRef.current?.click()}>
            <Upload className="w-4 h-4 mr-2" /> Import CSV
          </Button>
          <input
            type="file"
            accept=".csv"
            ref={fileInputRef}
            className="hidden"
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) handleCsvImport(file);
              e.currentTarget.value = '';
            }}
          />
        </div>
      </div>

      <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-100 dark:border-slate-700 shadow-sm overflow-hidden">
        <div className="p-4 border-b border-slate-200 dark:border-slate-700 flex flex-col md:flex-row md:items-center md:justify-between gap-3">
          <p className="text-sm text-slate-500 dark:text-slate-400">Total contacts: {combinedContacts.length}</p>
          <div className="flex items-center gap-2">
            <input
              value={tagInput}
              onChange={(e) => setTagInput(e.target.value)}
              placeholder="Add tag to imported contacts"
              className="border border-slate-200 rounded-lg px-3 py-2 text-sm"
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ',') {
                  e.preventDefault();
                  addPendingTag(tagInput.replace(',', ''));
                  setTagInput('');
                }
              }}
            />
            <Button
              size="sm"
              onClick={() => {
                const allTags = [...pendingTags];
                const trimmedInput = tagInput.trim();
                if (trimmedInput) allTags.push(trimmedInput);
                if (allTags.length === 0) return;
                const unique = Array.from(new Set(allTags));
                const next = importedContacts.map((contact) => ({
                  ...contact,
                  tags: Array.from(new Set([...(contact.tags || []), ...unique]))
                }));
                setImportedContacts(next);
                localStorage.setItem(importedContactsKey, JSON.stringify(next));
                setTagInput('');
                setPendingTags([]);
              }}
            >
              Add Tag
            </Button>
          </div>
          {pendingTags.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {pendingTags.map((tag) => (
                <button
                  key={tag}
                  type="button"
                  onClick={() => setPendingTags((prev) => prev.filter((t) => t !== tag))}
                  className="text-[10px] font-bold uppercase tracking-wide px-2 py-1 rounded-full border border-slate-200 text-slate-500 hover:bg-red-50 hover:text-red-600"
                  title="Remove tag"
                >
                  {tag} ×
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="text-xs text-slate-500 uppercase bg-slate-50 dark:bg-slate-900/50 border-b border-slate-200 dark:border-slate-700">
              <tr>
                <th className="px-6 py-3 font-bold">Name</th>
                <th className="px-6 py-3 font-bold">Home Photo</th>
                <th className="px-6 py-3 font-bold">Address</th>
                <th className="px-6 py-3 font-bold">Type</th>
                <th className="px-6 py-3 font-bold">Email</th>
                <th className="px-6 py-3 font-bold">Phone</th>
                <th className="px-6 py-3 font-bold">Tags</th>
                <th className="px-6 py-3 font-bold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-700">
              {combinedContacts.map((contact) => (
                (() => {
                  const rowId = `${contact.source}-${contact.id}`;
                  const isEditing = editingId === rowId;
                  return (
                <tr key={`${contact.type}-${contact.id}`} className="hover:bg-slate-50 dark:hover:bg-slate-700/50">
                  <td className="px-6 py-4 font-medium text-slate-900 dark:text-white">
                    {isEditing ? (
                      <input
                        className="w-full border border-slate-200 dark:border-slate-600 rounded-lg px-3 py-2 text-sm bg-white dark:bg-slate-800"
                        value={editDraft.name}
                        onChange={(e) => setEditDraft((prev) => ({ ...prev, name: e.target.value }))}
                      />
                    ) : (
                      contact.name
                    )}
                  </td>
                  <td className="px-6 py-4">
                    {contact.source === 'client' ? (
                      clientPhotos[contact.id] ? (
                        <img
                          src={clientPhotos[contact.id]}
                          alt={`${contact.name} home`}
                          className="h-12 w-16 rounded-md object-cover border border-slate-200"
                        />
                      ) : (
                        <button
                          type="button"
                          onClick={() => {
                            setPhotoTargetId(contact.id);
                            setPhotoUrlDraft('');
                            setIsPhotoOpen(true);
                          }}
                          className="text-xs font-semibold text-slate-600 hover:text-slate-900 underline"
                        >
                          Add photo
                        </button>
                      )
                    ) : (
                      <span className="text-xs text-slate-400">—</span>
                    )}
                  </td>
                  <td className="px-6 py-4 text-sm text-slate-600 dark:text-slate-300">
                    {contact.address || '—'}
                  </td>
                  <td className="px-6 py-4 text-xs font-bold uppercase text-slate-500">
                    {isEditing ? (
                      <select
                        className="border border-slate-200 dark:border-slate-600 rounded-lg px-2 py-1 text-xs bg-white dark:bg-slate-800"
                        value={editDraft.type}
                        onChange={(e) => setEditDraft((prev) => ({ ...prev, type: e.target.value as ImportedContact['type'] }))}
                        disabled={contact.source !== 'imported'}
                      >
                        <option value="Client">Client</option>
                        <option value="Vendor">Vendor</option>
                        <option value="Other">Other</option>
                      </select>
                    ) : (
                      contact.type
                    )}
                  </td>
                  <td className="px-6 py-4">
                    {isEditing ? (
                      <input
                        className="w-full border border-slate-200 dark:border-slate-600 rounded-lg px-3 py-2 text-sm bg-white dark:bg-slate-800"
                        value={editDraft.email}
                        onChange={(e) => setEditDraft((prev) => ({ ...prev, email: e.target.value }))}
                      />
                    ) : (
                      contact.email || '—'
                    )}
                  </td>
                  <td className="px-6 py-4">
                    {isEditing ? (
                      <input
                        className="w-full border border-slate-200 dark:border-slate-600 rounded-lg px-3 py-2 text-sm bg-white dark:bg-slate-800"
                        value={editDraft.phone}
                        onChange={(e) => setEditDraft((prev) => ({ ...prev, phone: e.target.value }))}
                      />
                    ) : (
                      contact.phone || '—'
                    )}
                  </td>
                  <td className="px-6 py-4">
                    {isEditing ? (
                      <div className="space-y-2">
                        <div className="flex flex-wrap gap-2">
                          {editTags.map((tag) => (
                            <button
                              key={tag}
                              type="button"
                              onClick={() => setEditTags((prev) => prev.filter((t) => t !== tag))}
                              className="text-[10px] font-bold uppercase tracking-wide px-2 py-1 rounded-full border border-slate-200 text-slate-500 hover:bg-red-50 hover:text-red-600"
                              title="Remove tag"
                            >
                              {tag} ×
                            </button>
                          ))}
                          {editTags.length === 0 && (
                            <span className="text-xs text-slate-400">No tags yet</span>
                          )}
                        </div>
                        <input
                          className="w-full border border-slate-200 dark:border-slate-600 rounded-lg px-3 py-2 text-sm bg-white dark:bg-slate-800"
                          value={editTagInput}
                          onChange={(e) => setEditTagInput(e.target.value)}
                          placeholder="Type a tag and press Enter"
                          onKeyDown={(e) => {
                            if (e.key === 'Enter' || e.key === ',') {
                              e.preventDefault();
                              addEditTag(editTagInput.replace(',', ''));
                              setEditTagInput('');
                            }
                          }}
                        />
                      </div>
                    ) : contact.tags.length > 0 ? (
                      <div className="flex flex-wrap gap-2">
                        {contact.tags.map((tag) => (
                          <span key={tag} className="text-[10px] font-bold uppercase tracking-wide px-2 py-1 rounded-full border border-slate-200 text-slate-500">
                            {tag}
                          </span>
                        ))}
                      </div>
                    ) : (
                      <span className="text-xs text-slate-400">—</span>
                    )}
                  </td>
                  <td className="px-6 py-4 text-right">
                    {isEditing ? (
                      <div className="flex justify-end gap-2">
                        <Button size="sm" variant="outline" onClick={cancelEdit}>Cancel</Button>
                        <Button size="sm" onClick={() => saveEdit(contact)}>Save</Button>
                      </div>
                    ) : (
                      <Button size="sm" variant="outline" onClick={() => startEdit(contact)}>Edit</Button>
                    )}
                  </td>
                </tr>
                  );
                })()
              ))}
              {combinedContacts.length === 0 && (
                <tr>
                  <td colSpan={8} className="px-6 py-10 text-center text-slate-400">No contacts yet.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
      {isAddOpen && (
        <Modal isOpen={isAddOpen} onClose={() => setIsAddOpen(false)} title="Add Contact">
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-semibold text-slate-600 mb-1">Name</label>
              <input
                value={newContact.name}
                onChange={(e) => setNewContact((prev) => ({ ...prev, name: e.target.value }))}
                className="w-full border border-slate-200 rounded-lg px-3 py-2.5"
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-sm font-semibold text-slate-600 mb-1">Email</label>
                <input
                  value={newContact.email}
                  onChange={(e) => setNewContact((prev) => ({ ...prev, email: e.target.value }))}
                  className="w-full border border-slate-200 rounded-lg px-3 py-2.5"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-600 mb-1">Phone</label>
                <input
                  value={newContact.phone}
                  onChange={(e) => setNewContact((prev) => ({ ...prev, phone: e.target.value }))}
                  className="w-full border border-slate-200 rounded-lg px-3 py-2.5"
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-sm font-semibold text-slate-600 mb-1">Type</label>
                <select
                  value={newContact.type}
                  onChange={(e) => setNewContact((prev) => ({ ...prev, type: e.target.value as ImportedContact['type'] }))}
                  className="w-full border border-slate-200 rounded-lg px-3 py-2.5"
                >
                  <option value="Client">Client</option>
                  <option value="Vendor">Vendor</option>
                  <option value="Other">Other</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-600 mb-1">Tags (comma separated)</label>
                <input
                  value={newContact.tags}
                  onChange={(e) => setNewContact((prev) => ({ ...prev, tags: e.target.value }))}
                  className="w-full border border-slate-200 rounded-lg px-3 py-2.5"
                  placeholder="vip, recurring"
                />
              </div>
            </div>
            <div className="flex items-center justify-end gap-2 pt-2">
              <Button variant="outline" onClick={() => setIsAddOpen(false)}>Cancel</Button>
              <Button
                onClick={() => {
                  if (!newContact.name.trim()) return;
                  const tags = newContact.tags
                    .split(',')
                    .map((tag) => tag.trim())
                    .filter(Boolean);
                  const entry: ImportedContact = {
                    id: crypto.randomUUID(),
                    name: newContact.name.trim(),
                    email: newContact.email.trim(),
                    phone: newContact.phone.trim(),
                    type: newContact.type,
                    tags
                  };
                  const next = [entry, ...importedContacts];
                  setImportedContacts(next);
                  localStorage.setItem(importedContactsKey, JSON.stringify(next));
                  setNewContact({ name: '', email: '', phone: '', type: 'Other', tags: '' });
                  setIsAddOpen(false);
                }}
              >
                Save Contact
              </Button>
            </div>
          </div>
        </Modal>
      )}
      {isPhotoOpen && (
        <Modal isOpen={isPhotoOpen} onClose={() => setIsPhotoOpen(false)} title="Add Home Photo">
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-semibold text-slate-600 mb-1">Photo URL</label>
              <input
                value={photoUrlDraft}
                onChange={(e) => setPhotoUrlDraft(e.target.value)}
                className="w-full border border-slate-200 rounded-lg px-3 py-2.5"
                placeholder="https://..."
              />
            </div>
            <div className="flex items-center justify-end gap-2 pt-2">
              <Button variant="outline" onClick={() => setIsPhotoOpen(false)}>Cancel</Button>
              <Button
                onClick={() => {
                  if (!photoTargetId || !photoUrlDraft.trim()) return;
                  const next = { ...clientPhotos, [photoTargetId]: photoUrlDraft.trim() };
                  setClientPhotos(next);
                  localStorage.setItem(clientPhotosKey, JSON.stringify(next));
                  setIsPhotoOpen(false);
                }}
              >
                Save Photo
              </Button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};
