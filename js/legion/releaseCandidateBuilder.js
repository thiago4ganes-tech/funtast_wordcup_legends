/**
 * LEGION Stage F — Release Candidate Builder
 * Creates a release-candidate decision object from gate and regression results.
 */

function buildReleaseDecision({ manifest, regressionResults, manualChecks = {} }) {
  const criticalFailures = regressionResults.flatMap(r => r.gate?.critical_failures || []);
  const failedFixtures = regressionResults.filter(r => r.status !== 'pass');
  const passRate = regressionResults.length
    ? (regressionResults.length - failedFixtures.length) / regressionResults.length
    : 0;

  const manualOk = Object.values(manualChecks).every(Boolean);

  const approved =
    criticalFailures.length === 0 &&
    passRate >= 0.8 &&
    manualOk;

  return {
    release_candidate: manifest.release_candidate,
    approved,
    pass_rate: Number(passRate.toFixed(3)),
    failed_fixtures: failedFixtures.map(f => f.fixture_id),
    critical_failures: criticalFailures,
    manual_checks: manualChecks,
    decision: approved ? 'GO' : 'NO_GO'
  };
}

module.exports = {
  buildReleaseDecision
};
