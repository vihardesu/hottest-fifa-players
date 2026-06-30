import type { Metadata } from "next";
import { LegalPage } from "@/components/legal-page";

export const metadata: Metadata = {
  title: "Privacy Policy — FIFA Face-Off",
  description: "Privacy Policy for FIFA Face-Off.",
};

export default function PrivacyPage() {
  return (
    <LegalPage title="Privacy Policy" lastUpdated="June 29, 2026">
      <section>
        <h2>1. Overview</h2>
        <p>
          This Privacy Policy explains what information FIFA Face-Off collects, how we use it, and
          the choices you have. We aim to collect only what is needed to run the voting game and
          leaderboard.
        </p>
      </section>

      <section>
        <h2>2. Information We Collect</h2>
        <p>When you use the Service, we may collect:</p>
        <ul>
          <li>
            <strong>Vote data:</strong> which player you selected in a matchup, the matchup
            participants, and a timestamp
          </li>
          <li>
            <strong>Session identifier:</strong> a random ID stored in your browser to help enforce
            fair-use limits and reduce duplicate voting
          </li>
          <li>
            <strong>Technical data:</strong> basic request metadata such as IP address or user agent
            that may be processed by our hosting provider for security and operations
          </li>
        </ul>
        <p>
          We do not require you to create an account, provide your name, or submit an email address
          to vote.
        </p>
      </section>

      <section>
        <h2>3. How We Use Information</h2>
        <p>We use collected information to:</p>
        <ul>
          <li>Record votes and calculate leaderboard rankings</li>
          <li>Prevent spam, abuse, and automated voting</li>
          <li>Maintain, secure, and improve the Service</li>
        </ul>
        <p>We do not sell your personal information.</p>
      </section>

      <section>
        <h2>4. Storage and Retention</h2>
        <p>
          Vote and ranking data is stored in Supabase, our database provider. Data is retained for as
          long as needed to operate the leaderboard and maintain the integrity of the game, unless
          a longer retention period is required by law.
        </p>
      </section>

      <section>
        <h2>5. Cookies and Local Storage</h2>
        <p>
          The Service may use browser local storage or similar technologies to keep a session
          identifier and support rate limiting. These are functional tools, not advertising
          trackers.
        </p>
      </section>

      <section>
        <h2>6. Third-Party Services</h2>
        <p>We rely on third-party infrastructure to run the Service, including:</p>
        <ul>
          <li>
            <strong>Vercel</strong> for hosting and content delivery
          </li>
          <li>
            <strong>Supabase</strong> for database storage
          </li>
        </ul>
        <p>
          These providers process data on our behalf according to their own privacy policies and
          security practices.
        </p>
      </section>

      <section>
        <h2>7. Your Choices and Rights</h2>
        <p>
          Because voting does not require an account, we may have limited ability to identify votes
          tied to a specific individual beyond a browser session. Depending on where you live, you
          may have rights to access, correct, or delete personal data. Requests can be sent to the
          site operator.
        </p>
      </section>

      <section>
        <h2>8. Children&apos;s Privacy</h2>
        <p>
          The Service is not directed to children under 13, and we do not knowingly collect personal
          information from children under 13. If you believe a child has provided us information,
          please contact us so we can take appropriate steps.
        </p>
      </section>

      <section>
        <h2>9. Security</h2>
        <p>
          We use reasonable technical and organizational measures to protect data, but no online
          service can guarantee absolute security.
        </p>
      </section>

      <section>
        <h2>10. Changes to This Policy</h2>
        <p>
          We may update this Privacy Policy from time to time. The &quot;Last updated&quot; date at the top of
          this page will reflect the most recent revision.
        </p>
      </section>

      <section>
        <h2>11. Contact</h2>
        <p>
          Privacy questions can be sent to the site operator through the contact method listed on the
          project repository or deployment page.
        </p>
      </section>
    </LegalPage>
  );
}
