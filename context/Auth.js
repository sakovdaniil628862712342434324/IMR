/*
Author: Daniil Sakov
Inputs are the Supabase auth session (or none) and the matching row in public.profiles.
Processing subscribes to onAuthStateChange, loads the profile for session.user.id, and exposes signUp, signIn, signOut.
Outputs { ready, session, profile, isAdmin, signUp, signIn, signOut } via useAuth. isAdmin is true when profile.role === 'admin'.
Pages wait on ready so the navbar does not flash the wrong links. Missing env leaves session null and ready true.
*/

import { createContext, useContext, useEffect, useState } from "react";
import { supabase, supabaseReady } from "../lib/supabase";

const AuthContext = createContext(null);

async function loadProfile(userId) {
	if (!supabase || !userId) return null;
	const { data } = await supabase.from("profiles").select("id, email, full_name, role").eq("id", userId).single();
	return data || null;
}

export function AuthProvider({ children }) {
	const [ready, setReady] = useState(false);
	const [session, setSession] = useState(null);
	const [profile, setProfile] = useState(null);

	useEffect(() => {
		if (!supabaseReady || !supabase) {
			setReady(true);
			return;
		}
		supabase.auth.getSession().then(async ({ data }) => {
			setSession(data.session);
			setProfile(data.session ? await loadProfile(data.session.user.id) : null);
			setReady(true);
		});
		const { data: sub } = supabase.auth.onAuthStateChange((_event, next) => {
			setSession(next);
			if (!next) {
				setProfile(null);
				return;
			}
			loadProfile(next.user.id).then(setProfile);
		});
		return () => sub.subscription.unsubscribe();
	}, []);

	async function signUp(email, password, fullName) {
		const { data, error } = await supabase.auth.signUp({ email: email.trim(), password, options: { data: { full_name: fullName.trim() } } });
		if (error) return { error: error.message };
		if (data.session) setProfile(await loadProfile(data.session.user.id));
		return { error: null, needsConfirm: !data.session };
	}

	async function signIn(email, password) {
		const { error } = await supabase.auth.signInWithPassword({ email: email.trim(), password });
		if (error) return { error: error.message };
		return { error: null };
	}

	async function signOut() {
		await supabase.auth.signOut();
	}

	const value = { ready, session, profile, isAdmin: !!(profile && profile.role === "admin"), signUp, signIn, signOut };
	return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
	const ctx = useContext(AuthContext);
	if (!ctx) throw new Error("useAuth must be inside AuthProvider");
	return ctx;
}
