/*
Author: Deema Lashtabeha
Inputs are an array of movie rows from Supabase (id, title, actors[], release_year) and isAdmin plus onEdit/onDelete callbacks.
Processing maps each row to a table line: title, actors joined with commas, year. Admin rows also get Edit and Delete buttons.
Outputs the catalogue table, or an empty-state paragraph when the array is empty. Delete asks window.confirm before calling onDelete.
Regular users see the same columns without action buttons.
*/

export function MovieList({ movies, isAdmin, onEdit, onDelete }) {
	if (!movies.length) return <p className="empty">No movies in the catalogue yet.</p>;
	return (
		<div className="table-wrap">
			<table className="movies">
				<thead>
					<tr>
						<th>Title</th>
						<th>Actors</th>
						<th>Release year</th>
						{isAdmin ? <th>Actions</th> : null}
					</tr>
				</thead>
				<tbody>
					{movies.map(m => (
						<tr key={m.id}>
							<td>{m.title}</td>
							<td>{(m.actors || []).join(", ")}</td>
							<td>{m.release_year}</td>
							{isAdmin ? (
								<td className="actions">
									<button type="button" className="linkish" onClick={() => onEdit(m)}>
										Edit
									</button>
									<button
										type="button"
										className="linkish danger"
										onClick={() => {
											if (window.confirm("Delete “" + m.title + "”?")) onDelete(m.id);
										}}>
										Delete
									</button>
								</td>
							) : null}
						</tr>
					))}
				</tbody>
			</table>
		</div>
	);
}
