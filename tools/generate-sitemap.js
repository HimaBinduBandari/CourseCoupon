#!/usr/bin/env node
/**
 * generate-sitemap.js
 *
 * Generates:
 *   1. sitemap.xml
 *   2. sitemap.html
 *
 * from:
 *   data/courses.json
 *   data/trainers.json
 *   data/categories.json
 *   data/languages.json
 *
 * Usage:
 *   node tools/generate-sitemap.js
 */

const fs = require("fs");
const path = require("path");

// -------------------------------------------------------------------------
// CONFIG
// -------------------------------------------------------------------------

const SITE_URL = "https://himabindubandari.github.io/CourseCoupon";

const ROOT = process.cwd();
const DATA_DIR = path.join(ROOT, "data");

const XML_OUTPUT_FILE = path.join(ROOT, "sitemap.xml");
const HTML_OUTPUT_FILE = path.join(ROOT, "sitemap.html");

// -------------------------------------------------------------------------
// STATIC PAGES
// -------------------------------------------------------------------------

const STATIC_PAGES = [
  {
    url: "/index.html",
    name: "Home",
    description: "Find the latest Udemy courses and free/discounted course coupons.",
    changefreq: "daily",
    priority: "1.0",
  },
  {
    url: "/search.html",
    name: "Search Courses",
    description: "Search and discover courses available on CourseCoupon.",
    changefreq: "daily",
    priority: "0.6",
  },
  {
    url: "/trending-topics.html",
    name: "Trending Topics",
    description: "Explore popular and trending learning topics.",
    changefreq: "weekly",
    priority: "0.7",
  },
  {
    url: "/instructors.html",
    name: "Instructors",
    description: "Browse courses by instructor.",
    changefreq: "weekly",
    priority: "0.7",
  },
  {
    url: "/language.html",
    name: "Languages",
    description: "Browse courses by language.",
    changefreq: "weekly",
    priority: "0.5",
  },
];

// -------------------------------------------------------------------------
// READ JSON
// -------------------------------------------------------------------------

function readJSON(filename) {
  const filePath = path.join(DATA_DIR, filename);

  if (!fs.existsSync(filePath)) {
    console.warn(`⚠️ ${filename} not found in ${DATA_DIR}, skipping.`);
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

// -------------------------------------------------------------------------
// HELPERS
// -------------------------------------------------------------------------

function escapeXML(str) {
  return String(str)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

function escapeHTML(str) {
  return String(str)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

function todayISODate() {
  return new Date().toISOString().split("T")[0];
}

function absoluteURL(url) {
  return `${SITE_URL}${url}`;
}

function urlEntry(loc, { lastmod, changefreq, priority } = {}) {
  let xml = `  <url>\n`;
  xml += `    <loc>${escapeXML(loc)}</loc>\n`;

  if (lastmod) {
    xml += `    <lastmod>${lastmod}</lastmod>\n`;
  }

  if (changefreq) {
    xml += `    <changefreq>${changefreq}</changefreq>\n`;
  }

  if (priority) {
    xml += `    <priority>${priority}</priority>\n`;
  }

  xml += `  </url>\n`;

  return xml;
}

// -------------------------------------------------------------------------
// HTML SITEMAP HELPERS
// -------------------------------------------------------------------------

function htmlLink(url, name, description = "") {
  return `
        <li class="sitemap-item">
          <a href="${escapeHTML(url)}">${escapeHTML(name)}</a>
          ${
            description
              ? `<p>${escapeHTML(description)}</p>`
              : ""
          }
        </li>`;
}

function slugToName(slug) {
  return String(slug)
    .replace(/[-_]+/g, " ")
    .replace(/\b\w/g, (char) => char.toUpperCase());
}

// -------------------------------------------------------------------------
// BUILD HTML SITEMAP
// -------------------------------------------------------------------------

function buildHTMLSitemap({
  today,
  trainers,
  categories,
  languages,
}) {
  let mainPagesHTML = "";

  for (const page of STATIC_PAGES) {
    mainPagesHTML += htmlLink(
      page.url,
      page.name,
      page.description
    );
  }

  // -----------------------------------------------------------------------
  // CATEGORIES
  // -----------------------------------------------------------------------

  const validCategories = categories
    .filter((category) => category.slug)
    .sort((a, b) =>
      String(a.slug).localeCompare(String(b.slug))
    );

  let categoriesHTML = "";

  for (const category of validCategories) {
    const name =
      category.category_name ||
      category.name ||
      slugToName(category.slug);

    const url =
      `/category.html?category=${encodeURIComponent(category.slug)}`;

    categoriesHTML += htmlLink(
      url,
      name,
      `Browse ${name} courses`
    );
  }

  // -----------------------------------------------------------------------
  // LANGUAGES
  // -----------------------------------------------------------------------

  const validLanguages = languages
    .filter((language) => language.slug)
    .sort((a, b) =>
      String(a.slug).localeCompare(String(b.slug))
    );

  let languagesHTML = "";

  for (const language of validLanguages) {
    const name =
      language.language_name ||
      language.name ||
      slugToName(language.slug);

    const url =
      `/language.html?language=${encodeURIComponent(language.slug)}`;

    languagesHTML += htmlLink(
      url,
      name,
      `Browse courses in ${name}`
    );
  }

  // -----------------------------------------------------------------------
  // TRAINERS
  // -----------------------------------------------------------------------

  const validTrainers = trainers
    .filter((trainer) => trainer.slug)
    .sort((a, b) =>
      String(a.slug).localeCompare(String(b.slug))
    );

  let trainersHTML = "";

  for (const trainer of validTrainers) {
    const name =
      trainer.name ||
      trainer.trainer_name ||
      trainer.title ||
      slugToName(trainer.slug);

    const url =
      `/trainer.html?trainer=${encodeURIComponent(trainer.slug)}`;

    trainersHTML += htmlLink(
      url,
      name,
      `Browse courses by ${name}`
    );
  }

  // -----------------------------------------------------------------------
  // HTML
  // -----------------------------------------------------------------------

  return `<!DOCTYPE html>
<html lang="en">

<head>

  <meta charset="UTF-8">

  <meta
    name="viewport"
    content="width=device-width, initial-scale=1.0"
  >

  <title>HTML Sitemap | CourseCoupon</title>

  <meta
    name="description"
    content="Browse all CourseCoupon pages, courses, categories, languages, and instructors."
  >

  <meta
    name="robots"
    content="index, follow"
  >

  <link
    rel="canonical"
    href="${SITE_URL}/sitemap.html"
  >

  <style>

    * {
      box-sizing: border-box;
    }

    html {
      scroll-behavior: smooth;
    }

    body {
      margin: 0;
      font-family:
        Inter,
        -apple-system,
        BlinkMacSystemFont,
        "Segoe UI",
        Roboto,
        Arial,
        sans-serif;

      background: #f7f8fc;
      color: #1f2937;
      line-height: 1.6;
    }

    .container {
      width: min(1100px, calc(100% - 32px));
      margin: 0 auto;
    }

    header {
      background: #ffffff;
      border-bottom: 1px solid #e5e7eb;
    }

    .header-inner {
      min-height: 72px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 20px;
    }

    .logo {
      color: #111827;
      text-decoration: none;
      font-size: 22px;
      font-weight: 800;
    }

    .back-link {
      color: #4f46e5;
      text-decoration: none;
      font-weight: 600;
    }

    .back-link:hover {
      text-decoration: underline;
    }

    .hero {
      padding: 60px 0 40px;
      text-align: center;
    }

    .hero h1 {
      margin: 0 0 12px;
      font-size: clamp(32px, 5vw, 48px);
      line-height: 1.1;
      color: #111827;
    }

    .hero p {
      max-width: 700px;
      margin: 0 auto;
      color: #6b7280;
      font-size: 17px;
    }

    .updated {
      margin-top: 12px !important;
      font-size: 14px !important;
    }

    main {
      padding-bottom: 60px;
    }

    .sitemap-section {
      background: #ffffff;
      border: 1px solid #e5e7eb;
      border-radius: 16px;
      padding: 28px;
      margin-bottom: 24px;
      box-shadow: 0 4px 15px rgba(0, 0, 0, 0.04);
    }

    .sitemap-section h2 {
      margin: 0 0 20px;
      color: #111827;
      font-size: 24px;
    }

    .sitemap-list {
      list-style: none;
      padding: 0;
      margin: 0;

      display: grid;
      grid-template-columns:
        repeat(auto-fit, minmax(260px, 1fr));

      gap: 10px 20px;
    }

    .sitemap-item {
      padding: 12px 0;
      border-bottom: 1px solid #f0f1f5;
    }

    .sitemap-item a {
      color: #4f46e5;
      text-decoration: none;
      font-weight: 650;
    }

    .sitemap-item a:hover {
      text-decoration: underline;
    }

    .sitemap-item p {
      margin: 3px 0 0;
      font-size: 13px;
      color: #6b7280;
    }

    .count {
      display: inline-flex;
      align-items: center;
      justify-content: center;

      min-width: 32px;
      height: 24px;

      padding: 0 8px;
      margin-left: 8px;

      border-radius: 20px;

      background: #f3f4f6;
      color: #6b7280;

      font-size: 12px;
      font-weight: 700;
    }

    footer {
      padding: 30px 0;
      text-align: center;
      color: #6b7280;
      font-size: 14px;
    }

    footer a {
      color: #4f46e5;
      text-decoration: none;
    }

    @media (max-width: 600px) {

      .hero {
        padding: 40px 0 30px;
      }

      .sitemap-section {
        padding: 20px;
      }

      .sitemap-list {
        grid-template-columns: 1fr;
      }

      .header-inner {
        min-height: 60px;
      }

    }

  </style>

</head>

<body>

<header>

  <div class="container header-inner">

    <a
      class="logo"
      href="/CourseCoupon/index.html"
    >
      CourseCoupon
    </a>

    <a
      class="back-link"
      href="/CourseCoupon/index.html"
    >
      ← Back to Home
    </a>

  </div>

</header>

<section class="hero">

  <div class="container">

    <h1>HTML Sitemap</h1>

    <p>
      Explore CourseCoupon and quickly find courses,
      categories, languages, and instructors.
    </p>

    <p class="updated">
      Last updated: ${today}
    </p>

  </div>

</section>

<main>

  <div class="container">

    <!-- MAIN PAGES -->

    <section class="sitemap-section">

      <h2>
        Main Pages
        <span class="count">${STATIC_PAGES.length}</span>
      </h2>

      <ul class="sitemap-list">

        ${mainPagesHTML}

      </ul>

    </section>


    <!-- CATEGORIES -->

    <section class="sitemap-section">

      <h2>
        Categories
        <span class="count">${validCategories.length}</span>
      </h2>

      <ul class="sitemap-list">

        ${categoriesHTML || `
          <li class="sitemap-item">
            No categories available.
          </li>
        `}

      </ul>

    </section>


    <!-- LANGUAGES -->

    <section class="sitemap-section">

      <h2>
        Languages
        <span class="count">${validLanguages.length}</span>
      </h2>

      <ul class="sitemap-list">

        ${languagesHTML || `
          <li class="sitemap-item">
            No languages available.
          </li>
        `}

      </ul>

    </section>


    <!-- TRAINERS -->

    <section class="sitemap-section">

      <h2>
        Instructors
        <span class="count">${validTrainers.length}</span>
      </h2>

      <ul class="sitemap-list">

        ${trainersHTML || `
          <li class="sitemap-item">
            No instructors available.
          </li>
        `}

      </ul>

    </section>

  </div>

</main>

<footer>

  <div class="container">

    <p>
      © ${new Date().getFullYear()}
      <a href="/CourseCoupon/index.html">CourseCoupon</a>
    </p>

  </div>

</footer>

</body>

</html>
`;
}

// -------------------------------------------------------------------------
// BUILD EVERYTHING
// -------------------------------------------------------------------------

function build() {

  const courses = readJSON("courses.json");
  const trainers = readJSON("trainers.json");
  const categories = readJSON("categories.json");
  const languages = readJSON("languages.json");

  const today = todayISODate();

  let entries = [];

  // -----------------------------------------------------------------------
  // STATIC PAGES → XML
  // -----------------------------------------------------------------------

  for (const page of STATIC_PAGES) {

    entries.push(
      urlEntry(
        absoluteURL(page.url),
        {
          lastmod: today,
          changefreq: page.changefreq,
          priority: page.priority,
        }
      )
    );

  }

  // -----------------------------------------------------------------------
  // TRAINERS → XML
  // -----------------------------------------------------------------------

  let skippedTrainers = 0;

  for (const trainer of trainers) {

    if (!trainer.slug) {
      skippedTrainers++;
      continue;
    }

    entries.push(
      urlEntry(
        `${SITE_URL}/trainer.html?trainer=${encodeURIComponent(
          trainer.slug
        )}`,
        {
          lastmod: today,
          changefreq: "weekly",
          priority: "0.6",
        }
      )
    );

  }

  // -----------------------------------------------------------------------
  // CATEGORIES → XML
  // -----------------------------------------------------------------------

  let skippedCategories = 0;

  for (const category of categories) {

    if (!category.slug) {
      skippedCategories++;
      continue;
    }

    entries.push(
      urlEntry(
        `${SITE_URL}/category.html?category=${encodeURIComponent(
          category.slug
        )}`,
        {
          lastmod: today,
          changefreq: "weekly",
          priority: "0.6",
        }
      )
    );

  }

  // -----------------------------------------------------------------------
  // LANGUAGES → XML
  // -----------------------------------------------------------------------

  let skippedLanguages = 0;

  for (const language of languages) {

    if (!language.slug) {
      skippedLanguages++;
      continue;
    }

    entries.push(
      urlEntry(
        `${SITE_URL}/language.html?language=${encodeURIComponent(
          language.slug
        )}`,
        {
          lastmod: today,
          changefreq: "weekly",
          priority: "0.5",
        }
      )
    );

  }

  // -----------------------------------------------------------------------
  // WRITE XML SITEMAP
  // -----------------------------------------------------------------------

  const xml =
    `<?xml version="1.0" encoding="UTF-8"?>\n` +
    `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n` +
    entries.join("") +
    `</urlset>\n`;

  fs.writeFileSync(
    XML_OUTPUT_FILE,
    xml,
    "utf-8"
  );

  // -----------------------------------------------------------------------
  // WRITE HTML SITEMAP
  // -----------------------------------------------------------------------

  const html = buildHTMLSitemap({
    today,
    trainers,
    categories,
    languages,
  });

  fs.writeFileSync(
    HTML_OUTPUT_FILE,
    html,
    "utf-8"
  );

  // -----------------------------------------------------------------------
  // LOG
  // -----------------------------------------------------------------------

  console.log("");
  console.log("==============================================");
  console.log("       CourseCoupon Sitemap Generator");
  console.log("==============================================");
  console.log("");

  console.log(`✅ sitemap.xml written`);
  console.log(`   Total XML URLs: ${entries.length}`);
  console.log("");

  console.log(`✅ sitemap.html written`);
  console.log(`   URL: ${SITE_URL}/sitemap.html`);
  console.log("");

  console.log(
    `   Courses: excluded from XML sitemap (${courses.length})`
  );

  console.log(
    `   Trainers: ${trainers.length - skippedTrainers} included, ${skippedTrainers} skipped`
  );

  console.log(
    `   Categories: ${categories.length - skippedCategories} included, ${skippedCategories} skipped`
  );

  console.log(
    `   Languages: ${languages.length - skippedLanguages} included, ${skippedLanguages} skipped`
  );

  console.log("");

  if (entries.length > 45000) {
    console.warn(
      "⚠️ Approaching the 50,000 URL sitemap limit."
    );
  }

}

// -------------------------------------------------------------------------
// RUN
// -------------------------------------------------------------------------

build();