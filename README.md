# Sonora

An original music discovery website for independent artists. It searches a catalog and streams only from the music provider, with direct artist and license links on every listing.

## Run locally

1. Install Node.js 20 or newer.
2. Register an app in the Jamendo developer portal at https://developer.jamendo.com/ and add its Client ID to .env.local:

   JAMENDO_CLIENT_ID=your_client_id

3. Start the Next.js website with npm install, then npm run dev.
4. Open http://localhost:3000.

The Client ID is read by the server route; it is not placed in the browser bundle. Deploy with the same environment variable configured in your hosting provider. Jamendo asks developers to include the published app URL when registering an application.

## Catalog and rights

The current adapter searches Jamendo's catalog (roughly half a million independent tracks). This is not every commercial recording. Jamendo content is published under varying Creative Commons licenses; the page links each result to its source and license. Confirm each track's terms before reuse.

Jamendo's published API terms state that free API use is for non-commercial applications. Advertising, revenue, subscriptions, or other commercial use requires contacting Jamendo Licensing for terms. Do not launch a monetized public version until the provider grants the required rights. The app does not copy or host audio files.

## Deploy

This is a Next.js App Router app. It needs a server runtime for /api/tracks; a static export will not run the catalog adapter. Configure JAMENDO_CLIENT_ID in the deployment environment, then deploy through Vercel or another compatible Next.js host.

Add an operator contact address to the privacy page before launch. Keep the site free of ads and other revenue unless Jamendo grants commercial terms.


