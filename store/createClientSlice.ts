import { StoreSlice } from './types';
import { supabase } from '../supabaseClient';
import { Client, Property } from '../types';
import { geocodeAddress } from '../utils/geocoding';

export const createClientSlice: StoreSlice<any> = (set, get) => ({
    clients: [],

    addClient: async (client: Client) => {
        const { currentUser } = get();
        if (!currentUser.companyId) return;

        const clientPayload = {
            id: client.id,
            company_id: currentUser.companyId,
            first_name: client.firstName,
            last_name: client.lastName,
            company_name: client.companyName,
            email: client.email,
            phone: client.phone,
            billing_address: client.billingAddress,
            tags: client.tags,
            date_of_birth: client.dateOfBirth
        };
        const { error } = await supabase.from('clients').insert(clientPayload);
        if (error) { console.error("Add Client Failed", error); return; }

        if (client.properties && client.properties.length > 0) {
            const propPayload = await Promise.all(client.properties.map(async p => {
                let address = { ...p.address };
                if (!address.lat || !address.lng) {
                    const coords = await geocodeAddress(address);
                    if (coords) {
                        address.lat = coords.lat;
                        address.lng = coords.lng;
                    }
                }

                return {
                    id: p.id,
                    company_id: currentUser.companyId,
                    client_id: client.id,
                    address: address,
                    access_instructions: p.accessInstructions
                };
            }));
            await supabase.from('properties').insert(propPayload);

            client.properties = propPayload.map(p => ({
                id: p.id,
                clientId: p.client_id,
                address: p.address,
                accessInstructions: p.access_instructions
            }));
        }

        set((state) => ({ clients: [...state.clients, client] }));

        get().triggerAutomation('NEW_CLIENT', client.id, { client });
    },

    updateClient: async (client: Client) => {
        await supabase.from('clients').update({
            first_name: client.firstName,
            last_name: client.lastName,
            email: client.email,
            phone: client.phone
        }).eq('id', client.id);
        set((state) => ({
            clients: state.clients.map(c => c.id === client.id ? client : c)
        }));
    },

    updateProperty: async (property: Property) => {
        let address = { ...property.address };

        if (!address.lat || !address.lng) {
            const coords = await geocodeAddress(address);
            if (coords) {
                address.lat = coords.lat;
                address.lng = coords.lng;
            }
        }

        const payload = {
            address: address,
            access_instructions: property.accessInstructions
        };

        const { error } = await supabase.from('properties').update(payload).eq('id', property.id);

        if (!error) {
            set((state) => ({
                clients: state.clients.map(c => {
                    if (c.id === property.clientId) {
                        return {
                            ...c,
                            properties: c.properties.map(p => p.id === property.id ? { ...p, address } : p)
                        };
                    }
                    return c;
                })
            }));
        }
    },

    deleteClient: async (id: string) => {
        console.log("Store: deleteClient called with id:", id);
        const { error } = await supabase.from('clients').delete().eq('id', id);
        if (error) {
            console.error("Store: Delete Client Failed", error);
            return { error };
        }
        console.log("Store: Delete Client Success, updating state");
        set((state) => ({ clients: state.clients.filter(c => c.id !== id) }));
        return { error: null };
    }
});
