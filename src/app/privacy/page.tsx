import Link from "next/link";

export default function PrivacyPage() {
  return (
    <main className="max-w-3xl mx-auto px-6 py-10 space-y-6">
      <h1 className="text-3xl font-bold">Privacy notice</h1>
      <p>Last updated: 20 October 2026</p>

      <section className="space-y-3">
        <h2 className="text-xl font-semibold">Who maintains this project</h2>
        <p>
          Soundtrack Mood Explorer is a portfolio project developed and maintained
          by František Babinský. The maintainer is responsible for the
          application’s processing of your information.
        </p>
        <p>
          For privacy questions or requests concerning your information, use the{" "}
          <Link href="/contact" className="underline">Contact page</Link>.
          Do not include passwords or Spotify credentials in your message.
        </p>
      </section>

      <section className="space-y-3">
        <h2 className="text-xl font-semibold">Application information</h2>
        <p>
          Account information includes your name, email address, a password hash,
          and account timestamps. The application stores your saved Favorites
          and custom playlists. Contact messages contain the name, email address,
          subject, and message you submit.
        </p>
        <p>
          This information is processed to provide your account and saved
          collections, authenticate requests, protect the application, and respond
          to messages.
        </p>
      </section>

      <section className="space-y-3">
        <h2 className="text-xl font-semibold">Contact messages and retention</h2>
        <p>
          Contact messages are sent through Resend to the maintainer’s personal
          Gmail mailbox. Resend processes the name, email address, subject, and
          message you submit. The mailbox also contains any replies.
        </p>
        <p>
          Resend documents United States storage, 30-day email and log retention
          on its Free plan, and backups persisting for seven days. Earlier removal
          of a specific message requires contacting Resend support. See{" "}
          <a
            href="https://resend.com/security/gdpr"
            className="underline"
            target="_blank"
            rel="noopener noreferrer"
          >
            Resend’s data-handling information
          </a>.
        </p>
        <p>
          For ordinary project enquiries, the maintainer manually deletes the
          conversation, including replies, within 30 days after resolution and
          permanently removes those messages from Gmail Trash. This is a manual
          policy, not an automated deletion feature.
        </p>
        <p>
          The maintainer does not forward or download these messages into another
          mailbox or mail application. Gmail processing is also subject to{" "}
          <a
            href="https://policies.google.com/privacy"
            className="underline"
            target="_blank"
            rel="noopener noreferrer"
          >
            Google’s Privacy Policy
          </a>.
          Deletion from the mailbox does not establish immediate erasure from
          Google’s internal systems.
        </p>
        <p>
          Application-account deletion does not automatically remove separate
          contact correspondence. For requests concerning that correspondence,
          contact the maintainer through the Contact page. Earlier deletion of
          provider-held copies may require provider assistance.
        </p>
      </section>

      <section className="space-y-3">
        <h2 className="text-xl font-semibold">Optional Spotify connection</h2>
        <p>
          Connecting Spotify is separate from application registration and login.
          This feature is currently limited to private portfolio testing with
          allowlisted Spotify accounts.
        </p>
        <p>
          When you authorize the connection, the backend processes your Spotify
          account identifier, available display name, authorization information,
          and access and refresh credentials. Credentials are encrypted in the
          database and are not sent to the frontend.
        </p>
        <p>
          This information supports account linking, connection status, and
          renewal of authorized access. This milestone does not request optional
          Spotify scopes or provide playback, listening-history collection, or
          Spotify playlist synchronization.
        </p>
        <p>
          Spotify processes information under its own{" "}
          <a
            href="https://www.spotify.com/legal/privacy-policy/"
            className="underline"
            target="_blank"
            rel="noopener noreferrer"
          >
            privacy policy
          </a>.
        </p>
      </section>

      <section className="space-y-3">
        <h2 className="text-xl font-semibold">Cookies and service providers</h2>
        <p>
          The backend uses an HttpOnly authentication cookie to recognize your
          signed-in application session. Starting Spotify authorization also sets
          a short-lived HttpOnly cookie to bind the authorization attempt to your
          browser. The authorization attempt expires after ten minutes.
        </p>
        <p>
          You can remove or block cookies through your browser settings. Doing so
          can prevent login or Spotify authorization from working.
        </p>
        <p>
          The deployed application uses Vercel for hosting and MongoDB Atlas for
          database storage. Spotify receives requests needed for authorization
          and authorized account access. Infrastructure providers may process
          request information as part of operating their services.
        </p>
      </section>

      <section className="space-y-3">
        <h2 className="text-xl font-semibold">Disconnecting and deleting data</h2>
        <p>
          Use Disconnect Spotify on your profile to remove the active Spotify
          connection, stored credentials, profile information, and pending
          authorization attempts from the application database.
        </p>
        <p>
          Local disconnect does not revoke consent at Spotify. To revoke access,
          open{" "}
          <a
            href="https://www.spotify.com/account/apps/"
            className="underline"
            target="_blank"
            rel="noopener noreferrer"
          >
            Spotify’s Apps page
          </a>{" "}
          and choose Remove Access.
        </p>
        <p>
          Deleting your application account removes its active account record,
          Favorites, owned custom playlists, Spotify connection, and pending
          Spotify authorization attempts. Shared catalogue entries remain.
        </p>
        <p>
          Database backup/restore arrangements and infrastructure-log retention
          are still under review before wider Spotify availability. Active
          database deletion does not establish immediate removal from backups
          or infrastructure logs. Contact the maintainer for information or
          requests concerning retained copies.
        </p>
      </section>

      <p>
        Read the{" "}
        <Link href="/terms" className="underline">Terms of use</Link>.
        Spotify is a third-party beneficiary of the Spotify-related provisions
        of this notice.
      </p>
    </main>
  );
}
