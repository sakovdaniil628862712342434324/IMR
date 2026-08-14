/*
Author: Deema Lashtabeha
Inputs are email and password from the login form, plus signIn from useAuth.
Processing calls signIn on submit, then router.push('/') when Supabase returns no error. Failures stay on the card with the error text.
Outputs the login page with navbar and footer. A link to /signup is for visitors without an account. noValidate so we show our own empty-field messages.
*/

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import { Navbar } from "../components/Navbar";
import { Footer } from "../components/Footer";
import { useAuth } from "../context/Auth";
import { supabaseReady } from "../lib/supabase";

export default function Login() {
	const { signIn, session, ready } = useAuth();
	const router = useRouter();
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [error, setError] = useState("");
	const [busy, setBusy] = useState(false);

	useEffect(() => {
		if (ready && session) router.replace("/");
	}, [ready, session, router]);

	async function onSubmit(e) {
		e.preventDefault();
		if (!email.trim() || !password) {
			setError("Email and password are required.");
			return;
		}
		if (!supabaseReady) {
			setError("Supabase env vars are missing.");
			return;
		}
		setBusy(true);
		const r = await signIn(email, password);
		setBusy(false);
		if (r.error) {
			setError(r.error);
			return;
		}
		router.push("/");
	}

	return (
		<div className="page">
			<Navbar />
			<main className="main narrow">
				<form className="card form" onSubmit={onSubmit} noValidate>
					<h1>Log in</h1>
					<label>
						Email
						<input type="text" inputMode="email" value={email} onChange={e => setEmail(e.target.value)} autoComplete="email" />
					</label>
					<label>
						Password
						<input type="password" value={password} onChange={e => setPassword(e.target.value)} autoComplete="current-password" />
					</label>
					{error ? <p className="err">{error}</p> : null}
					<button type="submit" className="btn" disabled={busy}>
						Log in
					</button>
					<p className="muted">
						No account? <Link href="/signup">Sign up</Link>
					</p>
				</form>
			</main>
			<Footer />
		</div>
	);
}
