/*
Author: Deema Lashtabeha
Inputs are hardcoded company constants at the top of this file (name, address, phone, email).
Processing lays those values out in three footer columns plus a copyright line for 2026.
Outputs the site footer on every page. Nothing is fetched; the assignment asked for a static footer with company and contact info.
Edit the constants below to change what visitors see.
*/

const COMPANY = "Internet Movies Rental Company";
const ADDRESS = "100 Cinema Row, Toronto, ON M5V 2T6";
const PHONE = "+1 (416) 555-0148";
const EMAIL = "contact@imr.movies";

export function Footer() {
	return (
		<footer className="foot">
			<div className="foot-grid">
				<div>
					<strong>{COMPANY}</strong>
					<p>A portal for staff to keep the IMR movie catalogue current: titles, cast, and release years.</p>
				</div>
				<div>
					<strong>Contact</strong>
					<p>{PHONE}</p>
					<p>
						<a href={"mailto:" + EMAIL}>{EMAIL}</a>
					</p>
				</div>
				<div>
					<strong>Visit</strong>
					<p>{ADDRESS}</p>
					<p>Mon–Sat 10:00–21:00</p>
				</div>
			</div>
			<p className="foot-copy">© 2026 {COMPANY}. All rights reserved.</p>
		</footer>
	);
}
