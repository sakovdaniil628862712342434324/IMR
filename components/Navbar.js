/*
Author: Deema Lashtabeha
Inputs are the Auth context: ready, session, profile, isAdmin, and signOut.
Processing renders a fixed set of links (Movies, Log in, Sign up) or the signed-in email plus Log out. Admin sees an Admin badge.
Outputs a custom static header used on every page. Links are hardcoded IMR routes, not a UI kit navbar.
Unauthenticated visitors still see the bar so they can reach login and signup.
*/

import Link from "next/link";
import { useAuth } from "../context/Auth";

export function Navbar() {
	const { ready, session, profile, isAdmin, signOut } = useAuth();
	return (
		<header className="nav">
			<Link href="/" className="nav-brand">
				<span className="nav-mark">IMR</span>
				Internet Movies Rental
			</Link>
			<nav className="nav-links">
				<Link href="/">Movies</Link>
				{!ready ? null : session ? (
					<>
						<span className="nav-user">
							{profile && profile.full_name ? profile.full_name : session.user.email}
							{isAdmin ? <em>Admin</em> : <em>User</em>}
						</span>
						<button type="button" className="linkish" onClick={signOut}>
							Log out
						</button>
					</>
				) : (
					<>
						<Link href="/login">Log in</Link>
						<Link href="/signup" className="nav-cta">
							Sign up
						</Link>
					</>
				)}
			</nav>
		</header>
	);
}
