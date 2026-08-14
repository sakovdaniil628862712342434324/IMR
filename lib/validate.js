/*
Author: Daniil Sakov
Inputs are a raw movie form: title string, actors string (comma-separated names), and year string or number.
Processing trims title, splits actors on commas, drops empty names, and requires a 4-digit year in 1888..(current year + 1).
Outputs { ok: true, title, actors, release_year } when every field is valid, or { ok: false, errors } with per-field messages for the form.
Used on both add and edit so invalid rows never reach Supabase. At least one actor name is required.
*/

const YEAR_MIN = 1888;

export function validateMovie(title, actorsText, year) {
	const errors = {};
	const t = String(title || "").trim();
	if (!t) errors.title = "Title is required.";
	else if (t.length > 120) errors.title = "Title must be 120 characters or less.";
	const actors = String(actorsText || "")
		.split(",")
		.map(s => s.trim())
		.filter(s => s);
	if (!actors.length) errors.actors = "Enter at least one actor (comma-separated).";
	else if (actors.length > 20) errors.actors = "At most 20 actors.";
	const raw = String(year || "").trim();
	const yearMax = new Date().getFullYear() + 1;
	if (!raw) errors.year = "Release year is required.";
	else if (!/^\d{4}$/.test(raw)) errors.year = "Release year must be a 4-digit number.";
	else {
		const y = parseInt(raw, 10);
		if (y < YEAR_MIN || y > yearMax) errors.year = "Release year must be between " + YEAR_MIN + " and " + yearMax + ".";
	}
	if (errors.title || errors.actors || errors.year) return { ok: false, errors };
	return { ok: true, title: t, actors, release_year: parseInt(raw, 10) };
}
