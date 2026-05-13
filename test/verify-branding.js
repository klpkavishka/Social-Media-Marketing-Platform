#!/usr/bin/env node
/**
 * Branding Components Verification Script
 * Validates that all branding components are properly exported and have correct structure
 */

const fs = require("fs");
const path = require("path");

const checks = {
  logoComponent: {
    file: "frontend/components/brand/logo.tsx",
    required: [
      "export function Logo",
      "export function LogoMark",
      "SVG",
      "ArcFlow",
      "Social Hub",
    ],
    description: "Logo component with ArcFlow branding",
  },
  visualElements: {
    file: "frontend/components/brand/visual-elements.tsx",
    required: [
      "export function GradientOrb",
      "export function BackgroundPattern",
      "export function FeatureGradientBg",
      "export function PremiumCard",
    ],
    description: "Visual element components",
  },
  globalStyles: {
    file: "frontend/styles/globals.css",
    required: [
      "--primary: 270",
      "--secondary: 200",
      "--accent: 180",
      "Space+Grotesk",
      "Sora",
      ".bg-gradient-primary",
      ".text-gradient-primary",
    ],
    description: "Global CSS with color palette and typography",
  },
  tailwindConfig: {
    file: "frontend/tailwind.config.ts",
    required: [
      "fontFamily",
      "Inter",
      "Sora",
      "Space Grotesk",
      "fade-in",
      "slide-up",
    ],
    description: "Tailwind configuration with fonts and animations",
  },
  layoutFile: {
    file: "frontend/app/layout.tsx",
    required: [
      "Space_Grotesk",
      "Sora",
      "--font-inter",
      "--font-space-grotesk",
      "--font-sora",
    ],
    description: "Root layout with font imports",
  },
  landingPage: {
    file: "frontend/app/page.tsx",
    required: [
      "import { Logo }",
      "import { BackgroundPattern",
      "import { PremiumCard",
      "text-gradient-primary",
      "bg-gradient-primary",
      "ArcFlow",
    ],
    description: "Landing page with branding components",
  },
  dashboardLayout: {
    file: "frontend/app/dashboard/layout.tsx",
    required: ["import { Logo }", "showName={false}", "ArcFlow", "Social Hub"],
    description: "Dashboard layout with ArcFlow branding",
  },
};

console.log("🎨 Branding Components Verification\n");

let allPassed = true;
const results = [];

Object.entries(checks).forEach(([key, check]) => {
  const filePath = path.join(process.cwd(), check.file);

  if (!fs.existsSync(filePath)) {
    results.push({
      status: "❌",
      check: check.description,
      detail: `File not found: ${check.file}`,
    });
    allPassed = false;
    return;
  }

  const content = fs.readFileSync(filePath, "utf8");
  const missing = check.required.filter((req) => !content.includes(req));

  if (missing.length === 0) {
    results.push({
      status: "✅",
      check: check.description,
      detail: `All ${check.required.length} requirements met`,
    });
  } else {
    results.push({
      status: "⚠️",
      check: check.description,
      detail: `Missing: ${missing.join(", ")}`,
    });
    allPassed = false;
  }
});

results.forEach((r) => {
  console.log(`${r.status} ${r.check}`);
  console.log(`   ${r.detail}\n`);
});

// Color palette verification
console.log("🎨 Color Palette Verification\n");
const globalCssPath = path.join(process.cwd(), "frontend/styles/globals.css");
const globalCss = fs.readFileSync(globalCssPath, "utf8");

const colorChecks = [
  { name: "Primary (Violet)", regex: /--primary:\s*270\s+100%\s+55%/ },
  { name: "Secondary (Blue)", regex: /--secondary:\s*200\s+100%\s+50%/ },
  { name: "Accent (Cyan)", regex: /--accent:\s*180\s+100%\s+50%/ },
  {
    name: "Gradient Primary",
    regex: /\.bg-gradient-primary.*from-violet-500.*to-blue-500/,
  },
  {
    name: "Text Gradient Primary",
    regex: /\.text-gradient-primary.*bg-clip-text/,
  },
];

colorChecks.forEach((check) => {
  const passed = check.regex.test(globalCss);
  console.log(`${passed ? "✅" : "❌"} ${check.name}`);
});

// Typography verification
console.log("\n📝 Typography Verification\n");
const tailwindPath = path.join(process.cwd(), "frontend/tailwind.config.ts");
const tailwind = fs.readFileSync(tailwindPath, "utf8");

const typographyChecks = [
  { name: "Inter Font", regex: /Inter/ },
  { name: "Space Grotesk Font", regex: /Space Grotesk/ },
  { name: "Sora Font", regex: /Sora/ },
];

typographyChecks.forEach((check) => {
  const passed = check.regex.test(tailwind);
  console.log(`${passed ? "✅" : "❌"} ${check.name}`);
});

// Component exports verification
console.log("\n📦 Component Exports Verification\n");
const logoPath = path.join(process.cwd(), "frontend/components/brand/logo.tsx");
const elementPath = path.join(
  process.cwd(),
  "frontend/components/brand/visual-elements.tsx",
);

const logo = fs.readFileSync(logoPath, "utf8");
const elements = fs.readFileSync(elementPath, "utf8");

const exportChecks = [
  { name: "Logo export", file: logo, regex: /export function Logo/ },
  { name: "LogoMark export", file: logo, regex: /export function LogoMark/ },
  {
    name: "GradientOrb export",
    file: elements,
    regex: /export function GradientOrb/,
  },
  {
    name: "BackgroundPattern export",
    file: elements,
    regex: /export function BackgroundPattern/,
  },
  {
    name: "FeatureGradientBg export",
    file: elements,
    regex: /export function FeatureGradientBg/,
  },
  {
    name: "PremiumCard export",
    file: elements,
    regex: /export function PremiumCard/,
  },
];

exportChecks.forEach((check) => {
  const passed = check.regex.test(check.file);
  console.log(`${passed ? "✅" : "❌"} ${check.name}`);
});

console.log(
  "\n" +
    (allPassed
      ? "✅ All verifications passed!"
      : "⚠️ Some verifications failed."),
);
