/*
Author: Daniil Sakov
Inputs are optional NEXT_PUBLIC_BASE_PATH from GitHub Actions (empty on localhost).
Processing enables a static HTML export so GitHub Pages can host the app with no Node server. trailingSlash writes login/index.html so /login/ does not 404. images.unoptimized is required because Pages cannot run the Next image optimizer.
Outputs next.config consumed by next build. Local npm run dev ignores export and still uses /.
*/

const base = process.env.NEXT_PUBLIC_BASE_PATH || "";

const nextConfig = {
	reactStrictMode: true,
	output: "export",
	trailingSlash: true,
	images: { unoptimized: true },
	basePath: base,
	assetPrefix: base || undefined
};

module.exports = nextConfig;
