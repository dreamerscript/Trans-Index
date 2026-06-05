// ─────────────────────────────────────────────
// rights.js
// Define the rights categories shown in the panel.
// To add a new right, add an object to RIGHTS below.
// Keys must match what you use in data.json.
// ─────────────────────────────────────────────

const RIGHTS = [
  { key: "sentenced",    question: "Can a person be sentenced for being trans?",           invert: true },
  { key: "mental",       question: "Is being trans officially classified as a mental illness?", invert: true },
  { key: "legal_name",   question: "Can trans people change their legal name?" },
  { key: "legal_gender", question: "Can trans people change their legal gender marker?" },
  { key: "nonbinary",    question: "Is a non-binary or third gender option available on official documents?" },
  { key: "hrt",          question: "Can trans people access HRT?" },
  { key: "surgery",      question: "Can trans people get gender-affirming surgery?" },
  { key: "minors",       question: "Can trans minors access gender-affirming care?" },
  { key: "prison",       question: "Can trans people be placed in prisons matching their gender?" },
  { key: "military",     question: "Can trans people serve in the military?" },
  { key: "marriage",     question: "Can trans people marry in their affirmed gender?" },
  { key: "adopt",        question: "Can trans people adopt children?" },
];

// ─────────────────────────────────────────────
// Status config
// Values used in data.json: "yes" | "partial" | "no" | "illegal" | "unknown"
// ─────────────────────────────────────────────

const STATUS_LABEL = {
  yes:     "Yes",
  partial: "Partial / varies",
  no:      "No",
  illegal: "Criminalized",
  unknown: "No data",
};

const STATUS_CLASS = {
  yes:     "status-yes",
  partial: "status-partial",
  no:      "status-no",
  illegal: "status-illegal",
  unknown: "status-unknown",
};

// Colours used on the map fill
const MAP_COLOR = {
  yes:     "var(--map-yes)",
  partial: "var(--map-partial)",
  no:      "var(--map-no)",
  illegal: "var(--map-illegal)",
  unknown: "var(--map-unknown)",
};
