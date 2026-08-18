#!/usr/bin/env node
/**
 * generate-sitemap.js
 *
 * Generates sitemap.xml for CourseCoupon from the existing data files
 * (data/courses.json, data/trainers.json, data/categories.json, data/languages.json).
 *
 * Usage:
 *   node tools/generate-sitemap.js
 *
 * Run this from the repo root (same level as index.html / data/).
 * No npm install needed — uses only Node's built-in fs/path modules.
 */

const fs = require("fs");
const path = require("path");

// ---- CONFIG -----------------------------------------------------------
// Change this to your real domain before running.
const SITE_URL = "https://himabindubandari.github.io/CourseCoupon"; // no trailing slash

const ROOT = process.cwd();
const DATA_DIR = path.join(ROOT, "data");
const OUTPUT_FILE = path.join(ROOT, "sitemap.xml");

// Static pages that always exist, with a hint for priority/changefreq.
// (Only real, live pages — the "- Copy" drafts should not ship / be indexed.)
const STATIC_PAGES = [
  { url: "/index.html", changefreq: "daily", priority: "1.0" },
  { url: "/search.html", changefreq: "daily", priority: "0.6" },
  { url: "/trending-topics.html", changefreq: "weekly", priority: "0.7" },
  { url: "/instructors.html", changefreq: "weekly", priority: "0.7" },
  { url: "/language.html", changefreq: "weekly", priority: "0.5" },
];
// -------------------------------------------------------------------------

function readJSON(filename) {
  const filePath = path.join(DATA_DIR, filename);
  if (!fs.existsSync(filePath)) {
    console.warn(`⚠️  ${filename} not found in ${DATA_DIR}, skipping.`);
    return [];
  }
  const raw = fs.readFileSync(filePath, "utf-8");
  try {
    return JSON.parse(raw);
  } catch (err) {
    console.error(`❌ Failed to parse ${filename}:`, err.message);
    return [];
  }
}

// XML requires these characters to be escaped in text nodes/attributes.
function escapeXML(str) {
  return String(str)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

function urlEntry(loc, { lastmod, changefreq, priority } = {}) {
  let xml = `  <url>\n    <loc>${escapeXML(loc)}</loc>\n`;
  if (lastmod) xml += `    <lastmod>${lastmod}</lastmod>\n`;
  if (changefreq) xml += `    <changefreq>${changefreq}</changefreq>\n`;
  if (priority) xml += `    <priority>${priority}</priority>\n`;
  xml += `  </url>\n`;
  return xml;
}

function todayISODate() {
  return new Date().toISOString().split("T")[0];
}

function build() {
  const courses = readJSON("courses.json");
  const trainers = readJSON("trainers.json");
  const categories = readJSON("categories.json");
  const languages = readJSON("languages.json");

  const today = todayISODate();
  let entries = [];

  // --- Static pages ---
  for (const page of STATIC_PAGES) {
    entries.push(
      urlEntry(`${SITE_URL}${page.url}`, {
        lastmod: today,
        changefreq: page.changefreq,
        priority: page.priority,
      })
    );
  }

  // --- Course pages intentionally excluded from the sitemap ---
  // (individual course.html?id=N pages are not included by request)

  // --- Trainer pages: trainer.html?trainer=slug ---
  let skippedTrainers = 0;
  for (const trainer of trainers) {
    if (!trainer.slug) {
      skippedTrainers++;
      continue;
    }
    entries.push(
      urlEntry(`${SITE_URL}/trainer.html?trainer=${encodeURIComponent(trainer.slug)}`, {
        lastmod: today,
        changefreq: "weekly",
        priority: "0.6",
      })
    );
  }

  // --- Category pages: category.html?category=slug ---
  let skippedCategories = 0;
  for (const category of categories) {
    if (!category.slug) {
      skippedCategories++;
      continue;
    }
    entries.push(
      urlEntry(`${SITE_URL}/category.html?category=${encodeURIComponent(category.slug)}`, {
        lastmod: today,
        changefreq: "weekly",
        priority: "0.6",
      })
    );
  }

  // --- Language pages: language.html?language=slug ---
  let skippedLanguages = 0;
  for (const language of languages) {
    if (!language.slug) {
      skippedLanguages++;
      continue;
    }
    entries.push(
      urlEntry(`${SITE_URL}/language.html?language=${encodeURIComponent(language.slug)}`, {
        lastmod: today,
        changefreq: "weekly",
        priority: "0.5",
      })
    );
  }

  const xml =
    `<?xml version="1.0" encoding="UTF-8"?>\n` +
    `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n` +
    entries.join("") +
    `</urlset>\n`;

  fs.writeFileSync(OUTPUT_FILE, xml, "utf-8");

  console.log(`✅ sitemap.xml written to ${OUTPUT_FILE}`);
  console.log(`   Total URLs: ${entries.length}`);
  console.log(`   Courses: excluded from sitemap (${courses.length} in data, not included)`);
  console.log(`   Trainers: ${trainers.length - skippedTrainers} included, ${skippedTrainers} skipped`);
  console.log(`   Categories: ${categories.length - skippedCategories} included, ${skippedCategories} skipped`);
  console.log(`   Languages: ${languages.length - skippedLanguages} included, ${skippedLanguages} skipped`);

  // Sitemap protocol caps a single file at 50,000 URLs / 50MB uncompressed.
  // You're nowhere near that yet, but flag it early so it's not a surprise later.
  if (entries.length > 45000) {
    console.warn("⚠️  Approaching the 50,000 URL sitemap limit — consider splitting into a sitemap index.");
  }
}

build();
