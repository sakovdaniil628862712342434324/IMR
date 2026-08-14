/*
Author: Deema Lashtabeha
Inputs are none beyond the Next.js Html/Head/Main/NextScript slots.
Processing sets lang=en on the root html element for the IMR portal.
Outputs the static document shell every page hydrates into.
No movie data is rendered here. Favicon and title live in _app.js.
*/

import { Html, Head, Main, NextScript } from "next/document";

export default function Document() {
	return (
		<Html lang="en">
			<Head />
			<body>
				<Main />
				<NextScript />
			</body>
		</Html>
	);
}
