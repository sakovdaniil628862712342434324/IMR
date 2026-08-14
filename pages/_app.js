/*
Author: Deema Lashtabeha
Inputs are the page Component and pageProps from Next.js.
Processing loads globals.css, wraps every route in AuthProvider, and sets the document title to IMR.
Outputs a shell where Navbar/Footer pages can call useAuth for session and role.
AuthProvider sits at the root so login state is shared without prop drilling.
*/

import "../styles/globals.css";
import Head from "next/head";
import { AuthProvider } from "../context/Auth";

const base = process.env.NEXT_PUBLIC_BASE_PATH || "";

export default function App({ Component, pageProps }) {
	return (
		<AuthProvider>
			<Head>
				<title>IMR — Internet Movies Rental Company</title>
				<meta name="description" content="IMR movie database portal" />
				<link rel="icon" href={base + "/favicon.svg"} />
			</Head>
			<Component {...pageProps} />
		</AuthProvider>
	);
}
