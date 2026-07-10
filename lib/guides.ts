/**
 * Long-tail SEO guides. Content lives here as typed blocks (no MDX tooling) so
 * it stays type-safe and renders through one component. Each guide is a static
 * article at /guides/[slug] with Article + Breadcrumb JSON-LD.
 */

export type Block =
  | { type: "p"; text: string }
  | { type: "h2"; text: string }
  | { type: "ul"; items: string[] };

export type Guide = {
  slug: string;
  title: string;
  description: string;
  keywords: string[];
  datePublished: string; // ISO date
  dateModified: string;
  readingMinutes: number;
  excerpt: string;
  /** Related service slug to deep-link the CTA (see lib/content.ts services). */
  ctaServiceSlug?: string;
  content: Block[];
};

export const guides: Guide[] = [
  {
    slug: "how-to-verify-payoneer-in-kenya",
    title: "How to Verify Your Payoneer Account in Kenya (2026 Guide)",
    description:
      "A step-by-step 2026 guide to verifying a Payoneer account in Kenya — the exact documents you need, how to format them, and the mistakes that get accounts rejected.",
    keywords: [
      "verify Payoneer Kenya",
      "Payoneer verification 2026",
      "Payoneer KYC Kenya",
      "Payoneer documents Kenya",
    ],
    datePublished: "2026-06-15",
    dateModified: "2026-07-01",
    readingMinutes: 6,
    excerpt:
      "The exact documents, formatting rules and pitfalls that decide whether your Payoneer account passes verification the first time.",
    ctaServiceSlug: "personal-payoneer",
    content: [
      {
        type: "p",
        text: "Payoneer is one of the most reliable ways for Kenyan freelancers and online sellers to get paid by clients and platforms abroad. But the verification step — where Payoneer confirms your identity and address — is where most people get stuck. The good news: almost every rejection comes down to document quality, not eligibility.",
      },
      { type: "h2", text: "What you actually need" },
      {
        type: "p",
        text: "For a personal Payoneer account in Kenya, you'll typically need three things prepared correctly:",
      },
      {
        type: "ul",
        items: [
          "A government ID — a Kenyan national ID or passport, photographed flat with all four corners visible and no glare.",
          "Proof of address — a bank statement, utility bill or official letter from the last 3 months showing your name and physical address.",
          "A clear selfie or ID photo that matches the name on your account exactly.",
        ],
      },
      { type: "h2", text: "Why most Kenyan accounts get rejected" },
      {
        type: "p",
        text: "Payoneer's review is partly automated, and the automation is strict about formatting. The most common reasons for rejection have nothing to do with whether your documents are genuine:",
      },
      {
        type: "ul",
        items: [
          "The name on your ID doesn't match the name on your Payoneer profile (even a missing middle name can fail).",
          "The document photo is cropped, blurry, or has glare over the important details.",
          "The proof of address is older than 3 months or doesn't show a physical address.",
          "The file is the wrong size or resolution, so the automated reader can't extract the text.",
        ],
      },
      { type: "h2", text: "How to format documents so they pass" },
      {
        type: "p",
        text: "Scan or photograph in good, even lighting on a dark, flat surface. Keep the full document in frame with a small margin around it. Use a resolution high enough to read every line but keep the file under Payoneer's size limit. Save as a clean JPG or PDF — not a screenshot of a screenshot. If your name differs across documents, fix your Payoneer profile to match your ID before you submit.",
      },
      { type: "h2", text: "If you've already been rejected" },
      {
        type: "p",
        text: "A previous rejection doesn't blacklist you — you can resubmit corrected documents. Read Payoneer's rejection reason carefully, fix the specific issue, and resubmit only what's needed. If you're not sure why it failed, this is exactly what our team helps with: we review your documents, tell you precisely what's wrong, and reformat them to pass.",
      },
    ],
  },
  {
    slug: "why-payoneer-account-keeps-getting-rejected",
    title: "Why Your Payoneer Account Keeps Getting Rejected (and How to Fix It)",
    description:
      "Payoneer verification failing again and again? Here are the real reasons accounts get rejected and a checklist to fix each one before you resubmit.",
    keywords: [
      "Payoneer rejected",
      "Payoneer verification failed",
      "Payoneer account not approved",
      "fix Payoneer rejection",
    ],
    datePublished: "2026-06-22",
    dateModified: "2026-07-02",
    readingMinutes: 5,
    excerpt:
      "Repeated rejections are almost always a document-format problem. Here's how to diagnose and fix each cause.",
    ctaServiceSlug: "personal-docs-formatting",
    content: [
      {
        type: "p",
        text: "If your Payoneer account keeps getting rejected, it's tempting to think you're not eligible. In our experience helping hundreds of East African sellers, that's rarely the case. Repeated rejections almost always trace back to a small, fixable formatting problem that the automated review keeps flagging.",
      },
      { type: "h2", text: "The usual suspects" },
      {
        type: "ul",
        items: [
          "Name mismatch — the biggest one. Your ID, your bank statement and your Payoneer profile must all show the same name in the same order.",
          "Expired or old proof of address — anything older than three months is usually rejected automatically.",
          "Low-quality images — glare, shadows, cropped edges or low resolution stop the reader from extracting text.",
          "Wrong document type — a delivery receipt or screenshot is not accepted as proof of address; use a bank statement or utility bill.",
          "Editing artifacts — any sign the document was altered will fail review, even if your intent was innocent (like cropping too aggressively).",
        ],
      },
      { type: "h2", text: "A pre-submission checklist" },
      {
        type: "p",
        text: "Before you resubmit, run through this list:",
      },
      {
        type: "ul",
        items: [
          "Does the name match exactly across ID, address proof and Payoneer profile?",
          "Is the address document dated within the last 3 months?",
          "Can you read every line of each document clearly, with no glare?",
          "Is the full document in frame with all corners visible?",
          "Is the file a clean JPG or PDF at a sensible resolution and size?",
        ],
      },
      { type: "h2", text: "When to get help" },
      {
        type: "p",
        text: "If you've been rejected two or more times and you've checked the list above, the problem is usually something specific that's hard to spot on your own. That's where a second pair of experienced eyes saves you weeks — we identify the exact reason your documents fail and reformat them to the spec Payoneer's review accepts.",
      },
    ],
  },
  {
    slug: "us-receiving-account-for-african-freelancers",
    title: "How to Get a US Receiving Account as an African Freelancer",
    description:
      "Get paid by Upwork, Etsy, eBay and direct clients through a US, UK or Canada receiving account — how it works for African freelancers and how to set one up.",
    keywords: [
      "US receiving account Africa",
      "get paid Upwork Kenya",
      "USD account freelancer Africa",
      "receiving account Payoneer",
    ],
    datePublished: "2026-07-01",
    dateModified: "2026-07-05",
    readingMinutes: 5,
    excerpt:
      "Local-transfer receiving accounts let platforms and clients pay you as if you had a US or UK bank account. Here's how they work.",
    ctaServiceSlug: "receiving-accounts",
    content: [
      {
        type: "p",
        text: "One of the biggest hurdles for African freelancers isn't finding work — it's getting paid smoothly. Many platforms and clients prefer to pay by local bank transfer to a US, UK or Canadian account. A receiving account gives you exactly that: local account details that let money reach you as if you were based there.",
      },
      { type: "h2", text: "What a receiving account actually is" },
      {
        type: "p",
        text: "A global receiving account provides you with real local bank details — for example, a US routing and account number, or a UK sort code and account number. When a platform like Upwork or a client pays those details by local transfer, the money lands in your account and you withdraw it locally. You don't need to open a foreign bank account or travel anywhere.",
      },
      { type: "h2", text: "Who it helps most" },
      {
        type: "ul",
        items: [
          "Upwork, Fiverr and freelance-platform earners who want faster, cheaper payouts.",
          "Etsy and eBay sellers who need a supported payout account to keep selling.",
          "Anyone invoicing US or UK clients directly who wants to be paid by simple local transfer.",
        ],
      },
      { type: "h2", text: "What you need to set one up" },
      {
        type: "p",
        text: "You'll generally need a verified account with the provider, matching identity documents, and correctly formatted proof of identity and address — the same document-quality rules that apply to Payoneer verification. Get the documents right the first time and setup is quick.",
      },
      { type: "h2", text: "Getting it done" },
      {
        type: "p",
        text: "We help East African freelancers set up US, UK and Canada receiving accounts end to end — preparing your documents to spec and guiding you through each step so your account is ready to receive payments without the usual back-and-forth.",
      },
    ],
  },
];

export function getGuides(): Guide[] {
  return [...guides].sort((a, b) => (a.datePublished < b.datePublished ? 1 : -1));
}

export function getGuideBySlug(slug: string): Guide | undefined {
  return guides.find((g) => g.slug === slug);
}
