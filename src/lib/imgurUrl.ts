const hasImageExtension = (path: string) => /\.(png|jpe?g|gif|webp)$/i.test(path);

/**
 * Normalizes Imgur page URLs for Next/Image: `https://imgur.com/<id>` → `https://i.imgur.com/<id>.png`.
 * Passes through non-Imgur URLs and already-direct `i.imgur.com` links unchanged when they already have an extension.
 */
export function processImgurImageUrl(url: string): string {
	const trimmed = url.trim();
	if (!trimmed) return trimmed;

	try {
		const u = new URL(trimmed);
		const host = u.hostname.replace(/^www\./, '').toLowerCase();

		if (host === 'i.imgur.com') {
			const path = u.pathname.replace(/^\//, '');
			if (!path) return trimmed;
			if (hasImageExtension(path)) return trimmed;
			return `https://i.imgur.com/${path}.png`;
		}

		if (host === 'imgur.com' || host === 'm.imgur.com') {
			const segments = u.pathname.split('/').filter(Boolean);
			let id = segments[0];
			if (segments[0] === 'gallery' || segments[0] === 'a') {
				id = segments[1];
			}
			if (!id || !/^[a-zA-Z0-9]+$/.test(id)) return trimmed;
			return `https://i.imgur.com/${id}.png`;
		}
	} catch {
		return trimmed;
	}

	return trimmed;
}
