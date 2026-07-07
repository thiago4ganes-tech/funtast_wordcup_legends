/**
 * LEGION Stage F — Statistical Quality Gate
 * CommonJS module for batch QA.
 */

function inRange(value, min, max) {
  if (value === null || value === undefined || Number.isNaN(value)) return false;
  return value >= min && value <= max;
}

function evaluateMetric(name, value, target) {
  const criticalPass = inRange(value, target.critical_min, target.critical_max);
  const targetPass = inRange(value, target.min, target.max);
  return {
    name,
    value,
    target_min: target.min,
    target_max: target.max,
    critical_min: target.critical_min,
    critical_max: target.critical_max,
    pass: targetPass,
    critical_pass: criticalPass,
    status: !criticalPass ? 'critical_fail' : targetPass ? 'pass' : 'warning'
  };
}

function evaluateBatchSummary(summary, targetsConfig) {
  const targets = targetsConfig.targets || {};
  const results = [];

  for (const [metric, target] of Object.entries(targets)) {
    if (Object.prototype.hasOwnProperty.call(summary, metric)) {
      results.push(evaluateMetric(metric, summary[metric], target));
    }
  }

  const criticalFailures = results.filter(r => !r.critical_pass);
  const warnings = results.filter(r => r.critical_pass && !r.pass);

  return {
    passed: criticalFailures.length === 0,
    critical_failures: criticalFailures,
    warnings,
    results
  };
}

module.exports = {
  evaluateMetric,
  evaluateBatchSummary
};
