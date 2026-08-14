/*
Author: Deema Lashtabeha
Inputs are the current form values (title, actors text, year), field errors, whether we are editing, and busy/submit flags from the movies page.
Processing renders three labeled fields and a submit button (Add movie or Save changes) plus Cancel when editing. noValidate so our validateMovie messages show instead of the browser tooltip.
Outputs user keystrokes via onChange and the submit event via onSubmit. Actors are typed as a comma-separated list. Admin-only page decides whether this form is mounted.
*/

export function MovieForm({ title, actors, year, errors, editing, busy, onChange, onSubmit, onCancel }) {
	return (
		<form className="card form" onSubmit={onSubmit} noValidate>
			<h2>{editing ? "Edit movie" : "Add a movie"}</h2>
			<label>
				Title
				<input name="title" value={title} onChange={onChange} maxLength={120} autoComplete="off" />
				{errors.title ? <span className="err">{errors.title}</span> : null}
			</label>
			<label>
				Actors (comma-separated)
				<input name="actors" value={actors} onChange={onChange} placeholder="Name one, Name two" autoComplete="off" />
				{errors.actors ? <span className="err">{errors.actors}</span> : null}
			</label>
			<label>
				Release year
				<input name="year" value={year} onChange={onChange} inputMode="numeric" placeholder="1999" autoComplete="off" />
				{errors.year ? <span className="err">{errors.year}</span> : null}
			</label>
			<div className="form-row">
				<button type="submit" className="btn" disabled={busy}>
					{editing ? "Save changes" : "Add movie"}
				</button>
				{editing ? (
					<button type="button" className="btn ghost" onClick={onCancel} disabled={busy}>
						Cancel
					</button>
				) : null}
			</div>
		</form>
	);
}
