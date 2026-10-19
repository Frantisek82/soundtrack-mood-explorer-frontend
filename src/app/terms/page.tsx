import Link from "next/link";

export default function TermsPage() {
  return (
    <main className="max-w-3xl mx-auto px-6 py-10 space-y-6">
      <h1 className="text-3xl font-bold">Terms of use</h1>
      <p>Last updated: 19 October 2026</p>

      <section className="space-y-3">
        <h2 className="text-xl font-semibold">The project</h2>
        <p>
          Soundtrack Mood Explorer is a portfolio project developed and maintained
          by František Babinský, who is responsible for this application.
          Questions can be sent through the{" "}
          <Link href="/contact" className="underline">Contact page</Link>.
        </p>
        <p>
          By accepting these terms, you agree to use the application lawfully,
          protect your account credentials, and access only accounts and
          information you are authorized to use.
        </p>
      </section>

      <section className="space-y-3">
        <h2 className="text-xl font-semibold">Optional Spotify integration</h2>
        <p>
          Spotify connection is optional and does not replace application login.
          Development Mode limits access to allowlisted Spotify accounts.
          Playback and Spotify playlist synchronization are outside this
          integration.
        </p>
        <p>
          You may disconnect through your profile. Switching Spotify accounts
          requires disconnecting first. To revoke Spotify consent separately,
          use{" "}
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
          Your information is processed as described in the{" "}
          <Link href="/privacy" className="underline">Privacy notice</Link>.
        </p>
      </section>

      <section className="space-y-3">
        <h2 className="text-xl font-semibold">Spotify protections</h2>
        <p>
          This application is independent of Spotify and does not represent
          Spotify or make warranties or representations on Spotify’s behalf.
          Spotify is not responsible for this application.
        </p>
        <p>
          To the extent permitted by applicable law, all implied warranties
          concerning the Spotify Platform, Spotify Service, and Spotify Content
          are disclaimed, including merchantability, fitness for a particular
          purpose, and non-infringement.
        </p>
        <p>
          You must not modify or create derivative works based on the Spotify
          Platform, Spotify Service, or Spotify Content. To the fullest extent
          allowed by law, you must not decompile, reverse-engineer, disassemble,
          or otherwise reduce them to source code or another human-perceivable
          form.
        </p>
        <p>
          To the extent permitted by law, Spotify and other third-party service
          providers have no liability for this application. Spotify is a
          third-party beneficiary of these terms and the Privacy notice and
          may directly enforce these terms.
        </p>
      </section>

      <section className="space-y-3">
        <h2 className="text-xl font-semibold">Availability and your rights</h2>
        <p>
          This portfolio project may change or become unavailable. No guarantee
          of uninterrupted availability is made. These terms do not exclude
          rights or protections that applicable law does not allow to be excluded.
        </p>
      </section>
    </main>
  );
}
