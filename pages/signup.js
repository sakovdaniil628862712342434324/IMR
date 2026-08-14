/*
Author: Deema Lashtabeha
Inputs are full name, email, and password from the signup form, plus signUp from useAuth.
Processing checks empty fields and password length (min 6, Supabase default) then calls signUp. The first successful signup is admin via the SQL trigger; later signups are users.
Outputs the signup page. If email confirmation is on in Supabase, needsConfirm shows a stay-and-confirm note instead of routing home. Otherwise router.push('/').
*/

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import { Navbar } from "../components/Navbar";
import { Footer } from "../components/Footer";
import { useAuth } from "../context/Auth";
import { supabaseReady } from "../lib/supabase";

export default function Signup() {
	const { signUp, session, ready } = useAuth();
	const router = useRouter();
	const [name, setName] = useState("");
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [error, setError] = useState("");
	const [note, setNote] = useState("");
	const [busy, setBusy] = useState(false);

	useEffect(() => {
		if (ready && session) router.replace("/");
	}, [ready, session, router]);

	async function onSubmit(e) {
		e.preventDefault();
		if (!name.trim() || !email.trim() || !password) {
			setError("Name, email, and password are required.");
			return;
		}
		if (!email.includes("@")) {
			setError("Enter a valid email.");
			return;
		}
		if (password.length < 6) {
			setError("Password must be at least 6 characters.");
			return;
		}
		if (!supabaseReady) {
			setError("Supabase env vars are missing.");
			return;
		}
		setBusy(true);
		setError("");
		const r = await signUp(email, password, name);
		setBusy(false);
		if (r.error) {
			setError(r.error);
			return;
		}
		if (r.needsConfirm) {
			setNote("Check your email to confirm the account, then log in. (Or turn off Confirm email in Supabase Auth settings.)");
			return;
		}
		router.push("/");
	}

	return (
		<div className="page">
			<Navbar />
			<main className="main narrow">
				<form className="card form" onSubmit={onSubmit} noValidate>
					<h1>Sign up</h1>
					<label>
						Full name
						<input value={name} onChange={e => setName(e.target.value)} autoComplete="name" />
					</label>
					<label>
						Email
						<input type="text" inputMode="email" value={email} onChange={e => setEmail(e.target.value)} autoComplete="email" />
					</label>
					<label>
						Password
						<input type="password" value={password} onChange={e => setPassword(e.target.value)} autoComplete="new-password" />
					</label>
					{error ? <p className="err">{error}</p> : null}
					{note ? <p className="muted">{note}</p> : null}
					<button type="submit" className="btn" disabled={busy}>
						Create account
					</button>
					<p className="muted">
						Already registered? <Link href="/login">Log in</Link>
					</p>
				</form>
			</main>
			<Footer />
		</div>
	);
}
