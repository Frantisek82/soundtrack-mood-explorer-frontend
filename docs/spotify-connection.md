# Spotify connection controls

Frontend issue #44. Backend planning issue:
Frantisek82/soundtrack-mood-explorer-backend#33.

## Scope

Profile controls use the backend-owned OAuth flow. Spotify does not replace
application registration or login. Playback, recommendations, and Spotify
playlist synchronization are outside this milestone.

Backend prerequisites #35–#39 and account-deletion fix #45 are merged into
backend dev. Production verification remains in backend #40.

## Local configuration

Frontend .env.local:

NEXT_PUBLIC_API_URL=http://127.0.0.1:3000/api
NEXT_PUBLIC_SPOTIFY_ENABLED=true

The Spotify flag is optional and defaults to disabled. Enable it only for
intentional local verification with the maintainer's allowlisted account.

Open the frontend at http://127.0.0.1:3001 and the backend at
http://127.0.0.1:3000. Use 127.0.0.1 consistently and sign in again if changing
from localhost. Local frontend configuration must target the separate
development backend/database.

Restart the frontend after changing public environment variables. Public
variables are included in browser builds; never put secrets in them.

next.config.ts forces controls off when VERCEL_ENV=preview, even if the
Spotify flag is true. General-user and production enablement remain pending.

## Backend contract

All Spotify service requests include credentials, disable caching, reject
HTTP redirects, and have a bounded timeout. Responses are validated and
errors are mapped to bounded frontend messages.

- POST /spotify/connect sends JSON {} and returns a validated authorization URL.
- GET /spotify/status reads database-only connection status without refreshing.
- DELETE /spotify/disconnect expects an empty 204 after committed cleanup.

Status states are disconnected, connected, and reauthorization_required.
The only account field exposed to the frontend is an optional display name.

The service accepts only the configured local or production backend URL.
Authorization navigation is restricted to Spotify's HTTPS authorization
endpoint and the expected PKCE parameters and callback URI.

No Spotify tokens, verifiers, encryption keys, or client secrets are placed
in frontend storage, application return URLs, or logs.

## Callback and application sessions

The fixed destination is /profile?spotify=<result>.

Allowed results:
connected, denied, invalid_transaction, session_expired,
account_conflict, provider_error.

The notification parameter is removed after capture. Unknown or duplicate
values are invalid; they never produce a success notice. A connected result
is confirmed only after authenticated backend status reports connected.

When application authentication fails after a callback, navigation uses the
fixed /login?spotify=session_expired destination. Login displays the notice
and removes its query parameter. There is no caller-controlled return URL.

## Controls and disclosures

Connect and Reconnect require agreement to the Terms of use and
acknowledgement of the Privacy notice. Disconnect and status checks do not.

Registration displays these documents before signup and requires agreement.
These frontend acknowledgements do not create a server-side acceptance audit.

Profile explains Development Mode allowlisting, separate application login,
account switching, and the difference between local disconnect and revoking
Spotify consent. The latter links to Spotify's Apps page and Remove Access.

Privacy and terms identify František Babinský and link to the Contact page.
They describe active database cleanup without promising immediate backup
or infrastructure-log erasure.

Before wider enablement, backend #40 must verify actual provider processing,
contact delivery and retention, logs, backups, restore safeguards, policy
accuracy, and any required agreement-recording arrangements.

## Branding

The unchanged white full logo is from Spotify's official branding download:
https://developer.spotify.com/images/guidelines/design/2024-spotify-full-logo.zip

Source file: Full_Logo_White_RGB.svg
Local file: public/spotify/spotify-logo-white.svg

It is displayed on a dark background, above the 70px minimum width, with
clear space. Do not recolor, distort, or combine it with the application logo.

Guidance reviewed on 19 October 2026:
https://developer.spotify.com/documentation/design
https://developer.spotify.com/terms
https://developer.spotify.com/policy

## Validation status

Automated tests use mocked backend responses and fake values.
Existing account, Favorites, and playlist tests remain part of the full suite.

Manual verification plan (results recorded below):
- Local connect, return notification, confirmed status, reconnect, and disconnect.
- Keyboard operation and readable loading/error feedback.
- Existing login, profile, Favorites, and playlist workflows.
- Deployed callback, configuration, and Preview disablement.
- Chrome and Safari/iOS with normal browser privacy protections.

Do not mark unperformed browser or deployment checks complete.


## Local manual verification — 19 October 2026

Verified by the maintainer using the separate development backend/database
and allowlisted Spotify account:

- Existing connection status displayed correctly.
- Disconnect returned to the disconnected state.
- Connect completed authorization and confirmed the connection.
- Same-account reconnect completed successfully.
- Connection status persisted after refreshing Profile.
- Agreement checkbox and Spotify controls worked with Tab, Space, and Enter.
- Privacy and Terms pages displayed František Babinský correctly.

Deployed verification, Safari/iOS, explicit Chrome verification, and manual
Favorites/playlist regression checks remain unverified. Browser identity
was not recorded for this local check.

Production privacy, retention, backup, restore, contact-delivery, and logging
verification remain tracked in backend #40.
