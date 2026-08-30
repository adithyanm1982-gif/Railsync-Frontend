import { PriorityClass, RealTask } from '@/shared/types/railsyncReal';

/**
 * Exact replica of backend/app/services/intelligence/priority_engine.py
 * (PriorityEngine.calculate_score / classify). This REPLACES the
 * simpler (Defect Severity*0.5 + Overdue*0.3 + Criticality*0.2)
 * formula from the original team brief -- the real, deployed backend
 * uses a 0-100 scale across six weighted, normalized factors instead.
 * Keep this in sync if priority_engine.py changes.
 */

const WEIGHTS = {
  safety_risk: 0.25,
  criticality: 0.2,
  operational_impact: 0.2,
  severity: 0.15,
  urgency: 0.1,
  overdue: 0.1,
};

const URGENCY_SCORES: Record<string, number> = {
  IMMEDIATE: 100,
  HIGH: 80,
  MEDIUM: 60,
  NORMAL: 40,
  LOW: 20,
};

function normalize(value: number, min: number, max: number): number {
  if (max === min) return 0;
  const clamped = Math.max(min, Math.min(value, max));
  return ((clamped - min) / (max - min)) * 100;
}

export interface RealPriorityInputs {
  safety_risk: number; // 1-100
  criticality: number; // 1-100
  operational_impact: number; // 1-100
  severity: number; // 1-5
  urgency: string; // 'IMMEDIATE'|'HIGH'|'MEDIUM'|'NORMAL'|'LOW'
  overdue_days: number;
}

export function computeRealPriorityScore(input: RealPriorityInputs): number {
  const safety = normalize(input.safety_risk, 1, 100);
  const criticality = normalize(input.criticality, 1, 100);
  const operationalImpact = normalize(input.operational_impact, 1, 100);
  const severity = normalize(input.severity, 1, 5);
  const urgency = URGENCY_SCORES[input.urgency?.toUpperCase()] ?? 0;
  const overdue = normalize(input.overdue_days, 0, 30); // 30+ days = max urgency

  const score =
    safety * WEIGHTS.safety_risk +
    criticality * WEIGHTS.criticality +
    operationalImpact * WEIGHTS.operational_impact +
    severity * WEIGHTS.severity +
    urgency * WEIGHTS.urgency +
    overdue * WEIGHTS.overdue;

  return Math.round(Math.max(0, Math.min(score, 100)) * 100) / 100;
}

export function classifyRealPriority(score: number): PriorityClass {
  if (score >= 75) return 'Critical';
  if (score >= 55) return 'High';
  if (score >= 35) return 'Medium';
  return 'Low';
}

/** Per-factor weighted contribution, for the breakdown chart -- mirrors the six terms above. */
export function realPriorityBreakdown(input: RealPriorityInputs) {
  return {
    safety_risk: Math.round(normalize(input.safety_risk, 1, 100) * WEIGHTS.safety_risk * 100) / 100,
    criticality: Math.round(normalize(input.criticality, 1, 100) * WEIGHTS.criticality * 100) / 100,
    operational_impact:
      Math.round(normalize(input.operational_impact, 1, 100) * WEIGHTS.operational_impact * 100) / 100,
    severity: Math.round(normalize(input.severity, 1, 5) * WEIGHTS.severity * 100) / 100,
    urgency: Math.round((URGENCY_SCORES[input.urgency?.toUpperCase()] ?? 0) * WEIGHTS.urgency * 100) / 100,
    overdue: Math.round(normalize(input.overdue_days, 0, 30) * WEIGHTS.overdue * 100) / 100,
  };
}

export function priorityInputsFromTask(task: RealTask): RealPriorityInputs {
  return {
    safety_risk: task.safety_risk,
    criticality: task.criticality,
    operational_impact: task.operational_impact,
    severity: task.severity,
    urgency: task.urgency,
    overdue_days: task.overdue_days,
  };
}

export const PRIORITY_CLASS_COLORS: Record<PriorityClass, string> = {
  Critical: '#F43F5E',
  High: '#F59E0B',
  Medium: '#38BDF8',
  Low: '#22C55E',
};
