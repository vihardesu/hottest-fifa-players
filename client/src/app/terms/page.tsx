import type { Metadata } from "next";
import { LegalPage } from "@/components/legal-page";

export const metadata: Metadata = {
  title: "Terms of Service — FIFA Face-Off",
  description: "Terms of Service for FIFA Face-Off.",
};

export default function TermsPage() {
  return (
    <LegalPage title="Terms of Service" lastUpdated="June 29, 2026">
      <section>
        <h2>1. Acceptance of Terms</h2>
        <p>
          By accessing or using FIFA Face-Off (&quot;the Service&quot;), you agree to these Terms of
          Service. If you do not agree, please do not use the Service.
        </p>
      </section>

      <section>
        <h2>2. What FIFA Face-Off Is</h2>
        <p>
          FIFA Face-Off is a casual, fan-made voting game where users compare FIFA World Cup 2026
          player photos and vote on head-to-head matchups. Rankings are generated from community
          votes using a rating algorithm and are provided for entertainment only.
        </p>
        <p>
          This Service is not affiliated with, endorsed by, or sponsored by FIFA, any national
          football association, or any player featured on the site.
        </p>
      </section>

      <section>
        <h2>3. Eligibility</h2>
        <p>
          You must be at least 13 years old to use the Service. If you are under 18, you should use
          the Service only with permission from a parent or guardian.
        </p>
      </section>

      <section>
        <h2>4. Acceptable Use</h2>
        <p>You agree not to:</p>
        <ul>
          <li>Use bots, scripts, or automated tools to cast votes</li>
          <li>Attempt to manipulate rankings or circumvent rate limits</li>
          <li>Interfere with the operation or security of the Service</li>
          <li>Use the Service for unlawful, harassing, or abusive purposes</li>
        </ul>
        <p>
          We may throttle, block, or discard votes that appear fraudulent or abusive in order to
          keep rankings fair.
        </p>
      </section>

      <section>
        <h2>5. Voting and Rankings</h2>
        <p>
          Votes are subjective opinions. Rankings reflect aggregated community preferences, not
          objective measures of appearance, athletic ability, or player quality. We do not guarantee
          the accuracy, completeness, or availability of matchups, rankings, or leaderboard data.
        </p>
      </section>

      <section>
        <h2>6. Intellectual Property</h2>
        <p>
          Player names, images, and related materials may be owned by third parties, including FIFA,
          federations, clubs, and players. FIFA Face-Off displays publicly available player imagery
          for identification in the context of this fan voting experience.
        </p>
        <p>
          The FIFA Face-Off name, branding, site design, and original code are owned by the
          operator of this Service unless otherwise stated.
        </p>
      </section>

      <section>
        <h2>7. Disclaimers</h2>
        <p>
          The Service is provided &quot;as is&quot; and &quot;as available&quot; without warranties of any kind,
          whether express or implied, including fitness for a particular purpose and
          non-infringement.
        </p>
      </section>

      <section>
        <h2>8. Limitation of Liability</h2>
        <p>
          To the fullest extent permitted by law, the operator of FIFA Face-Off will not be liable
          for any indirect, incidental, special, consequential, or punitive damages arising from
          your use of the Service.
        </p>
      </section>

      <section>
        <h2>9. Changes</h2>
        <p>
          We may update these Terms from time to time. Continued use of the Service after changes
          are posted constitutes acceptance of the revised Terms.
        </p>
      </section>

      <section>
        <h2>10. Contact</h2>
        <p>
          Questions about these Terms can be sent to the site operator through the contact method
          listed on the project repository or deployment page.
        </p>
      </section>
    </LegalPage>
  );
}
