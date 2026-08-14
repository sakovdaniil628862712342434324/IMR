/*
Author: Deema Lashtabeha
Inputs are the signed-in session from useAuth and movie rows from public.movies via the Supabase client.
Processing loads the list after login, runs validateMovie before insert/update, and calls supabase.from('movies') for insert, update, and delete. Only isAdmin sees the form and row actions; RLS also blocks writes for users.
Outputs the movies page: navbar, optional add/edit form, the list (title, actors, year), and footer. Guests are asked to log in. Missing env shows a setup note instead of querying.
*/

import { useEffect, useState } from "react";
import Link from "next/link";
import { Navbar } from "../components/Navbar";
import { Footer } from "../components/Footer";
import { MovieForm } from "../components/MovieForm";
import { MovieList } from "../components/MovieList";
import { useAuth } from "../context/Auth";
import { supabase, supabaseReady } from "../lib/supabase";
import { validateMovie } from "../lib/validate";

const emptyForm = { title: "", actors: "", year: "" };

export default function MoviesPage() {
	const { ready, session, isAdmin } = useAuth();
	const [movies, setMovies] = useState([]);
	const [form, setForm] = useState(emptyForm);
	const [errors, setErrors] = useState({});
	const [editingId, setEditingId] = useState(null);
	const [busy, setBusy] = useState(false);
	const [banner, setBanner] = useState("");

	async function load() {
		const { data, error } = await supabase.from("movies").select("id, title, actors, release_year").order("title");
		if (error) {
			setBanner(error.message);
			setMovies([]);
			return;
		}
		setBanner("");
		setMovies(data || []);
	}

	useEffect(() => {
		if (!ready || !session || !supabase) return;
		load();
	}, [ready, session]);

	function onChange(e) {
		setForm({ ...form, [e.target.name]: e.target.value });
	}

	function onCancel() {
		setEditingId(null);
		setForm(emptyForm);
		setErrors({});
	}

	function onEdit(m) {
		setEditingId(m.id);
		setForm({ title: m.title, actors: (m.actors || []).join(", "), year: String(m.release_year) });
		setErrors({});
		window.scrollTo({ top: 0, behavior: "smooth" });
	}

	async function onDelete(id) {
		const { error } = await supabase.from("movies").delete().eq("id", id);
		if (error) {
			setBanner(error.message);
			return;
		}
		if (editingId === id) onCancel();
		await load();
	}

	async function onSubmit(e) {
		e.preventDefault();
		const v = validateMovie(form.title, form.actors, form.year);
		if (!v.ok) {
			setErrors(v.errors);
			return;
		}
		setErrors({});
		setBusy(true);
		const row = { title: v.title, actors: v.actors, release_year: v.release_year };
		const q = editingId ? supabase.from("movies").update(row).eq("id", editingId) : supabase.from("movies").insert(row);
		const { error } = await q;
		setBusy(false);
		if (error) {
			setBanner(error.message);
			return;
		}
		onCancel();
		await load();
	}

	return (
		<div className="page">
			<Navbar />
			<main className="main">
				<h1>Movie catalogue</h1>
				{!supabaseReady ? <p className="banner">Set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY in .env.local, then restart npm run dev.</p> : null}
				{banner ? <p className="banner">{banner}</p> : null}
				{!ready ? (
					<p className="muted">Loading…</p>
				) : !session ? (
					<p className="card note">
						Log in to view the catalogue. <Link href="/login">Log in</Link> or <Link href="/signup">sign up</Link>. The first account becomes admin and can add, edit, and delete movies. Later accounts are view-only.
					</p>
				) : (
					<>
						{isAdmin ? <MovieForm title={form.title} actors={form.actors} year={form.year} errors={errors} editing={!!editingId} busy={busy} onChange={onChange} onSubmit={onSubmit} onCancel={onCancel} /> : <p className="muted">Signed in as a regular user — you can view movies. Only an admin can change the catalogue.</p>}
						<MovieList movies={movies} isAdmin={isAdmin} onEdit={onEdit} onDelete={onDelete} />
					</>
				)}
			</main>
			<Footer />
		</div>
	);
}
