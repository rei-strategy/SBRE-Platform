import { StoreSlice } from './types';
import { supabase } from '../supabaseClient';
import { User, UserRole, TeamInvitation } from '../types';

const defaultUser: User = {
    id: 'guest',
    companyId: '',
    name: 'Guest',
    email: '',
    role: UserRole.ADMIN,
    avatarUrl: 'https://i.pravatar.cc/150?u=guest',
    onboardingComplete: false,
    enableTimesheets: true,
    payrollType: 'HOURLY',
    payRate: 0
};

export const createAuthSlice: StoreSlice<any> = (set, get) => ({
    isAuthenticated: false,
    isLoading: true,
    currentUser: defaultUser,
    users: [],
    teamInvitations: [],

    checkSession: async () => {
        try {
            console.log("Checking session...");
            const { data: { session }, error: sessionError } = await supabase.auth.getSession();

            if (sessionError) {
                console.error("Session error:", sessionError);
                set({ isLoading: false });
                return;
            }

            console.log("Session found:", session?.user?.id);

            if (session?.user) {
                await get().loadUserData(session.user.id);
            } else {
                console.log("No session user found.");
                set({ isLoading: false });
            }
        } catch (e) {
            console.error("Session check failed", e);
            set({ isLoading: false });
        }
    },

    loadUserData: async (userId: string) => {
        try {
            console.log("Loading user profile for:", userId);
            const { data: profile, error } = await supabase
                .from('profiles')
                .select('*')
                .eq('id', userId)
                .single();

            if (error) {
                console.error('Profile loading error:', error.message);
                set({ isLoading: false });
                return;
            }

            if (!profile) {
                console.error('Profile not found for user:', userId);
                set({ isLoading: false });
                return;
            }

            console.log("Profile loaded:", profile);

            const user: User = {
                id: profile.id,
                companyId: profile.company_id,
                name: profile.full_name || profile.email || 'User',
                email: profile.email,
                role: (profile.role as UserRole) || UserRole.ADMIN,
                avatarUrl: profile.avatar_url || `https://ui-avatars.com/api/?name=${encodeURIComponent(profile.full_name || 'User')}`,
                onboardingComplete: profile.onboarding_complete,
                enableTimesheets: profile.enable_timesheets ?? true,
                payrollType: profile.payroll_type || 'HOURLY',
                payRate: profile.pay_rate || 0
            };

            set({ currentUser: user, isAuthenticated: true });
            console.log("User authenticated:", user);

            if (user.companyId) {
                // Call loadCompanyData which will be in another slice BUT accessible via get()
                await get().loadCompanyData(user.companyId);
            }
        } catch (err: any) {
            console.error('Error loading user:', err.message || err);
        } finally {
            set({ isLoading: false });
        }
    },

    login: async (email: string, pass: string) => {
        set({ isLoading: true });
        console.log("Attempting login for:", email);
        const { error } = await supabase.auth.signInWithPassword({ email, password: pass });

        if (error) {
            console.error("Login error:", error.message);
            set({ isLoading: false });
        } else {
            console.log("Login successful, checking session...");
            await get().checkSession();
        }
        return { error };
    },

    signup: async (email: string, pass: string, name: string, type: 'create' | 'join', joinCode?: string) => {
        set({ isLoading: true });
        try {
            const { data: authData, error: authError } = await supabase.auth.signUp({
                email, password: pass, options: { data: { full_name: name } }
            });

            if (authError) throw authError;
            if (!authData.user) throw new Error("User creation failed.");

            if (authData.session) await supabase.auth.setSession(authData.session);

            let companyId = '';
            let role = UserRole.ADMIN;
            let companyCode = '';

            if (type === 'create') {
                companyId = crypto.randomUUID();
                companyCode = Math.random().toString(36).substring(2, 9).toUpperCase();

                const { error: settingsError } = await supabase.from('settings').insert({
                    company_id: companyId,
                    company_name: `${name}'s Company`,
                    company_code: companyCode,
                    onboarding_step: 1
                });
                if (settingsError) throw new Error(`Settings creation failed: ${settingsError.message}`);

            } else {
                if (!joinCode) throw new Error("Join code required");
                const { data: foundId, error: rpcError } = await supabase.rpc('get_company_id_by_code', { code_input: joinCode });
                if (rpcError || !foundId) throw new Error("Invalid Company Code");
                companyId = foundId;
                role = UserRole.TECHNICIAN;
            }

            const { error: profileError } = await supabase.from('profiles').upsert({
                id: authData.user.id,
                company_id: companyId,
                email: email,
                full_name: name,
                role: role,
                onboarding_complete: type === 'join'
            });

            if (profileError) throw new Error(`Profile creation failed: ${profileError.message}`);

            await get().loadUserData(authData.user.id);
            return { error: null, companyCode: type === 'create' ? companyCode : undefined };
        } catch (err: any) {
            set({ isLoading: false });
            return { error: err };
        }
    },

    logout: async () => {
        set({ isLoading: true });
        await supabase.auth.signOut();
        set({
            isAuthenticated: false,
            currentUser: defaultUser,
            isLoading: false,
            // Clear other data? 
            jobs: [], clients: [], users: [] // Ideally reset everything, but this is a rough reset
        });
    },

    switchUser: (role: UserRole) => {
        set((state) => ({ currentUser: { ...state.currentUser, role } }));
    },

    addUser: async (u: User) => {
        const currentUser = get().currentUser;
        const payload = {
            id: u.id,
            company_id: currentUser.companyId,
            full_name: u.name,
            email: u.email,
            role: u.role,
            payroll_type: u.payrollType,
            pay_rate: u.payRate,
            enable_timesheets: u.enableTimesheets
        };
        const { error } = await supabase.from('profiles').insert(payload);

        if (error) {
            console.error("Failed to add user to DB:", error);
            if (error.message.includes('unique constraint') || error.code === '23505') {
                alert("This email address is already registered to another team member.");
            } else {
                alert(`Failed to save team member: ${error.message}`);
            }
            return;
        }

        set((state) => ({ users: [...state.users, u] }));
    },

    updateUser: async (u: User) => {
        if (u.id) {
            const payload = {
                full_name: u.name,
                role: u.role,
                payroll_type: u.payrollType,
                pay_rate: u.payRate,
                enable_timesheets: u.enableTimesheets
            };
            await supabase.from('profiles').update(payload).eq('id', u.id);
            set((state) => ({ users: state.users.map(usr => usr.id === u.id ? u : usr) }));
        }
    },

    deleteUser: async (id: string) => {
        console.log("Store: deleteUser called with id:", id);
        const { error } = await supabase.from('profiles').delete().eq('id', id);

        if (error) {
            console.error("Store: Delete User Failed", error);
            return { error };
        }

        console.log("Store: Delete User Success, updating state");
        set((state) => ({ users: state.users.filter(u => u.id !== id) }));
        return { error: null };
    },

    deleteAccount: async () => { return { error: null }; },

    completeOnboarding: async () => {
        const currentUser = get().currentUser;
        if (currentUser.id) {
            const { error } = await supabase.from('profiles').update({ onboarding_complete: true }).eq('id', currentUser.id);
            if (!error) {
                set((state) => ({ currentUser: { ...state.currentUser, onboardingComplete: true } }));
            }
        }
    },

    inviteTeamMember: async (email: string, name: string, role: UserRole) => {
        const { currentUser, settings } = get();
        if (!currentUser.companyId || !settings.companyCode) return { error: "Company not ready" };

        const newInvite = {
            company_id: currentUser.companyId,
            email,
            name,
            role,
            code: settings.companyCode,
            status: 'PENDING'
        };

        const { data, error } = await supabase.from('team_invitations').insert(newInvite).select().single();

        if (data) {
            set((state) => ({
                teamInvitations: [...state.teamInvitations, {
                    id: data.id,
                    companyId: data.company_id,
                    email: data.email,
                    name: data.name,
                    role: data.role as UserRole,
                    code: data.code,
                    status: data.status,
                    createdAt: data.created_at
                }]
            }));

            supabase.functions.invoke('invite-team-member', {
                body: {
                    email,
                    name,
                    companyName: settings.companyName,
                    inviteCode: settings.companyCode
                }
            }).then(({ error }) => {
                if (error) console.error("Failed to send invite email:", error);
            });
        }

        return { error };
    },

    resendInvitation: async (inviteId: string) => {
        const { teamInvitations, settings } = get();
        const invite = teamInvitations.find(i => i.id === inviteId);
        if (!invite) return { error: "Invite not found" };

        const { error } = await supabase.functions.invoke('invite-team-member', {
            body: {
                email: invite.email,
                name: invite.name,
                companyName: settings.companyName,
                inviteCode: settings.companyCode
            }
        });
        return { error };
    }
});
