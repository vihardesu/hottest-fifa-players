import type { Metadata } from "next";
import { LegalPage } from "@/components/legal-page";

export const metadata: Metadata = {
  title: "Methodology — FIFA Face-Off",
  description: "Official summary of the rating methodology used to calculate FIFA Face-Off leaderboard scores.",
};

export default function MethodologyPage() {
  return (
    <LegalPage title="Methodology" lastUpdated="June 29, 2026">
      <section>
        <h2>Overview</h2>
        <p>
          FIFA Face-Off produces its leaderboard from pairwise community votes. Each vote records a
          preferred player in a head-to-head comparison; aggregate preferences are converted into
          ordinal rankings and numeric scores through a published statistical model.
        </p>
        <p>
          The system employs the <strong>Glicko-2</strong> rating algorithm rather than classical
          Elo. Glicko-2 extends a single rating with explicit measures of confidence and stability,
          which allows both fair score updates and informed selection of future matchups.
        </p>
      </section>

      <section>
        <h2>Rating model</h2>
        <p>
          Under Glicko-2, each player is described by three quantities: a <strong>rating</strong>{" "}
          (estimated standing within the pool), a <strong>rating deviation (RD)</strong>{" "}
          (uncertainty around that estimate), and <strong>volatility</strong> (sensitivity to recent
          results). The value shown on the public leaderboard is the rounded rating; RD and
          volatility are used internally and are not displayed.
        </p>
        <p>
          When votes are processed, winners gain rating and losers lose rating in proportion to the
          expected outcome. Players with high uncertainty (large RD) adjust more readily to new
          evidence; established players with low RD change gradually. Uncertainty decreases as
          comparisons accumulate and may increase again after extended inactivity.
        </p>
      </section>

      <section>
        <h2>Matchmaking</h2>
        <p>
          Matchups are selected to maximize informational value from each vote. Comparisons between
          players of similar standing — where either outcome is plausible — contribute more to the
          ranking than predictable mismatches.
        </p>
        <p>
          The matchmaking procedure prioritizes players with elevated RD, then pairs them with
          opponents within a defined rating band, with controlled randomization to limit repetition.
          This directs voting activity toward comparisons that remain unresolved while leaving
          well-established positions largely undisturbed.
        </p>
      </section>

      <section>
        <h2>Score updates</h2>
        <p>
          Votes are collected continuously and applied in periodic batches rather than after each
          individual selection. Batch processing is a requirement of the Glicko-2 volatility
          estimation procedure and yields more stable long-run rankings.
        </p>
        <p>
          FIFA Face-Off applies rating updates on a <strong>five-minute cycle</strong>. The
          leaderboard reflects the most recent completed batch and may refresh in near real time
          while the page is open.
        </p>
      </section>

      <section>
        <h2>System parameters</h2>
        <div className="mt-3 overflow-x-auto">
          <table className="w-full min-w-[320px] border-collapse text-left text-sm md:text-base">
            <thead>
              <tr className="border-b border-[#D4CDB8]">
                <th className="py-2 pr-4 font-semibold text-[#4F4D46]">Parameter</th>
                <th className="py-2 pr-4 font-semibold text-[#4F4D46]">Value</th>
                <th className="py-2 font-semibold text-[#4F4D46]">Description</th>
              </tr>
            </thead>
            <tbody className="text-[#4F4D46]/85 [&_td]:py-2 [&_td]:pr-4 [&_tr]:border-b [&_tr]:border-[#D4CDB8]/60">
              <tr>
                <td>Initial rating</td>
                <td>1500</td>
                <td>Baseline assigned to all players at seeding.</td>
              </tr>
              <tr>
                <td>Initial RD</td>
                <td>350</td>
                <td>Maximum prior uncertainty for unrated players.</td>
              </tr>
              <tr>
                <td>Initial volatility</td>
                <td>0.06</td>
                <td>Standard Glicko-2 volatility prior.</td>
              </tr>
              <tr>
                <td>System constant (τ)</td>
                <td>0.5</td>
                <td>Volatility update constraint.</td>
              </tr>
              <tr>
                <td>Rating period</td>
                <td>5 minutes</td>
                <td>Interval between batch score recalculations.</td>
              </tr>
              <tr>
                <td>Matchmaking band</td>
                <td>±175 pts</td>
                <td>Maximum rating separation for paired opponents.</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      <section>
        <h2>Data integrity and fair use</h2>
        <p>
          All votes are retained in full (winner, loser, timestamp, and session identifier) to
          support audit, recomputation, and abuse review. Automated rate limits restrict voting
          frequency, suppress duplicate submissions, and cap per-session influence on individual
          players within a calendar day.
        </p>
        <p>
          Rankings reflect aggregated subjective preferences for entertainment purposes. They do not
          constitute objective assessments of players and are not affiliated with FIFA or any
          governing body.
        </p>
      </section>

      <p className="border-t border-[#D4CDB8]/60 pt-6 text-center text-sm text-[#4F4D46]/60 md:text-base">
        made with love by vihar desu ❤️
      </p>
    </LegalPage>
  );
}
