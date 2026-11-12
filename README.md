# QUAKE fallback

When the QUAKE earthquake page cannot be shown, this page points to official sources.
It contains no earthquake data and is not an earthquake early warning.

- `index.html`: static page with links to the Japan Meteorological Agency and NIED.
- `scripts/check-feed.mjs`: checks every 10 minutes that the main site's data is fresh.
- `.github/ISSUE_TEMPLATE/`: feedback form for the site. Posts are public; the form asks people not to include personal details.
