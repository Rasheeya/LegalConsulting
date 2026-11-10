/**
 * STACKLY LEGAL & CONSULTING — BLOG & INSIGHTS LOGIC (blog.js)
 * Real-time search, category filtering, full-article reader modal, newsletter subscription
 */

document.addEventListener('DOMContentLoaded', () => {
  'use strict';

  // Article Full Data Dictionary for Modal Reader
  const articlesData = {
    'cross-border-mergers': {
      category: 'Corporate Governance',
      title: 'Cross-Border Mergers in 2026: Navigating Tightening Antitrust Scrutiny and FDI Clearance',
      author: 'Sarah Jenkins, Esq.',
      role: 'Managing Partner',
      authorImg: 'assets/team-partner-1.webp',
      date: 'November 3, 2026',
      readTime: '6 min read',
      image: 'assets/hero-legal-office.webp',
      body: `
        <p>Cross-border merger and acquisition activity in 2026 is operating under unprecedented regulatory scrutiny. Global antitrust agencies and foreign direct investment (FDI) review committees in both developed and emerging jurisdictions have intensified enforcement thresholds, expanding their substantive review horizons well beyond traditional market-share calculations.</p>
        
        <h3>The Shift Toward Expanded National Security & FDI Reviews</h3>
        <p>Where cross-border transactions once cleared competition reviews predominantly through economic concentration matrices (such as the Herfindahl-Hirschman Index), regulators now routinely invoke statutory national security, technological sovereignty, and critical data infrastructure mandates. Transactions involving enterprise software, semiconductor supply chains, genetic data, or communications infrastructure must now satisfy multi-jurisdictional clearances that can add months to deal closing timelines.</p>
        
        <blockquote>
          "Deal teams can no longer view antitrust and FDI reviews as consecutive post-signing hurdles; they must be structured as core determinants of deal valuation, reverse breakup fees, and ticking covenants from term sheet inception."
        </blockquote>

        <h3>Tactical Contractual Mitigations</h3>
        <p>In response to prolonged regulatory timelines, market practice has evolved substantially across key transaction covenants:</p>
        
        <div class="modal-key-takeaways">
          <h4><i class="fa-solid fa-scale-balanced"></i> Key Strategic Takeaways</h4>
          <ul>
            <li><strong>Hell-or-High-Water Clauses:</strong> Acquirers must strictly define the boundaries of required divestitures, behavioral remedies, or operational hold-separates before signing.</li>
            <li><strong>Staggered Long-Stop Dates:</strong> Drafting bilateral extension rights tied to designated regulatory phases preserves flexibility without triggering premature breach claims.</li>
            <li><strong>Reverse Termination Fees:</strong> Risk-weighted breakup fees ranging between 3.5% and 6.0% of enterprise value are increasingly standardized when clearances face high agency resistance.</li>
          </ul>
        </div>

        <h3>Conclusion</h3>
        <p>Navigating cross-border transactions in this heightened climate demands synchronized counsel across corporate transaction leads, international trade specialists, and regulatory litigators. Early risk modeling remains the single most effective hedge against deal erosion and regulatory termination.</p>
      `
    },
    'executive-severance': {
      category: 'Commercial Law',
      title: 'The Evolution of Executive Severance Agreements under Emerging Labor Directives',
      author: 'Elena Rostova, Esq.',
      role: 'Senior Commercial Counsel',
      authorImg: 'assets/team-partner-2.webp',
      date: 'October 28, 2026',
      readTime: '5 min read',
      image: 'assets/practice-employment.webp',
      body: `
        <p>Recent statutory revisions and appellate decisions have fundamentally altered the drafting of executive separation agreements, non-disclosure provisions, and post-employment restrictive covenants. General counsel and compensation committees must adapt standard employment templates to remain enforceable.</p>
        
        <h3>Scrutiny on Post-Employment Non-Competes</h3>
        <p>Regulatory authorities across multiple jurisdictions have placed sweeping restrictions on non-compete agreements. In the executive suite, non-competition clauses are increasingly subjected to stringent 'protectable interest' tests, requiring demonstrable proprietary trade secrets, customer relationship custody, or customized intellectual property creation rather than generic market protection.</p>
        
        <div class="modal-key-takeaways">
          <h4><i class="fa-solid fa-file-contract"></i> Core Enforceability Pillars</h4>
          <ul>
            <li><strong>Tailored Geographic & Temporal Scope:</strong> Geographic restrictions must directly reflect territories where the executive exercised operational oversight, rarely exceeding 12 months.</li>
            <li><strong>Specific Non-Solicitation Carve-outs:</strong> Non-solicitation of clients must distinguish between existing key accounts and general industry inquiries.</li>
            <li><strong>Protected Whistleblower Language:</strong> Strict statutory exclusions ensuring executives retain rights to report regulatory concerns without forfeiting severance benefits.</li>
          </ul>
        </div>

        <p>Ensuring compliance requires annual audits of executive employment agreements, bespoke transition protocols, and carefully structured deferred severance payout mechanics.</p>
      `
    },
    'ai-data-governance': {
      category: 'Regulatory Compliance',
      title: 'Navigating Mandatory AI & Data Governance Compliance for Financial Institutions',
      author: 'Marcus Sterling',
      role: 'Senior Regulatory Consultant',
      authorImg: 'assets/team-partner-5.webp',
      date: 'October 22, 2026',
      readTime: '7 min read',
      image: 'assets/practice-compliance.webp',
      body: `
        <p>The convergence of algorithmic trading, automated underwriting, and large language model integration within financial institutions has triggered a robust wave of statutory regulatory frameworks. Financial service providers face strict liability for model transparency, systemic bias, and operational resilience.</p>
        
        <h3>The Mandate for Algorithmic Auditing</h3>
        <p>Regulatory frameworks now mandate that financial institutions maintain a comprehensive inventory of high-risk automated decision-making systems. Institutions must demonstrate clear lines of senior accountability, explainability mechanisms for credit decisions, and rigorous stress-testing against model drift.</p>
        
        <blockquote>
          "Compliance with emerging AI governance standards is no longer an IT compliance exercise; it constitutes a fiduciary governance requirement subject to direct board oversight."
        </blockquote>

        <div class="modal-key-takeaways">
          <h4><i class="fa-solid fa-shield-halved"></i> Actionable Compliance Roadmap</h4>
          <ul>
            <li><strong>Model Risk Management (MRM) Modernization:</strong> Update existing MRM frameworks to explicitly incorporate continuous generative model evaluation and training data provenance.</li>
            <li><strong>Vendor Due Diligence:</strong> Impose strict indemnity and verification obligations on third-party SaaS and foundation model vendors.</li>
            <li><strong>Audit-Ready Documentation:</strong> Establish verifiable audit trails documenting training data sources, alignment protocols, and human-in-the-loop validation checkpoints.</li>
          </ul>
        </div>
      `
    },
    'mae-clauses': {
      category: 'Mergers & Acquisitions',
      title: 'Mastering Material Adverse Effect (MAE) Clauses in Volatile Markets',
      author: 'David Thorne',
      role: 'M&A and Restructuring Specialist',
      authorImg: 'assets/team-partner-3.webp',
      date: 'October 16, 2026',
      readTime: '6 min read',
      image: 'assets/practice-corporate.webp',
      body: `
        <p>Material Adverse Effect (MAE) clauses remain among the most fiercely negotiated provisions in purchase agreements. In turbulent macroeconomic environments characterized by interest rate fluctuations and supply-chain realignments, the precision of MAE carve-outs can dictate multi-million dollar closing determinations.</p>
        
        <h3>The High Judicial Burden of MAE Invocations</h3>
        <p>Chancery courts and commercial tribunals maintain a notoriously high threshold for buyers seeking to terminate transactions based on MAE events. A buyer must generally prove that an adverse event is consequence-heavy, durationally significant (measured in years rather than quarters), and uniquely impacts the target disproportionately compared to industry peers.</p>

        <div class="modal-key-takeaways">
          <h4><i class="fa-solid fa-handshake"></i> Essential Negotiation Insights</h4>
          <ul>
            <li><strong>Specific Industry Carve-Outs:</strong> Sellers must explicitly carve out macroeconomic shifts, interest rate changes, and geopolitical conflicts from the MAE definition.</li>
            <li><strong>Disproportionate Impact Qualifiers:</strong> Buyers must ensure that general industry exemptions do not apply if the target suffers disproportionately compared to peers.</li>
            <li><strong>Interim Operating Covenants:</strong> Pair MAE protections with clear 'ordinary course of business' operational covenants to restrict post-signing asset dissipation.</li>
          </ul>
        </div>
      `
    },
    'trade-secrets-remote': {
      category: 'Intellectual Property',
      title: 'Protecting Proprietary Trade Secrets in Decentralized & Remote Operations',
      author: 'Clara Vance, LL.M.',
      role: 'IP & Commercial Counsel',
      authorImg: 'assets/team-partner-4.webp',
      date: 'October 10, 2026',
      readTime: '4 min read',
      image: 'assets/practice-ip.webp',
      body: `
        <p>With distributed teams and cloud-native workflows becoming the default operating model for growth enterprises, physical perimeter security has been superseded by digital rights management and contractual safeguards. Maintaining trade secret protection under statutory law requires affirmative proof of 'reasonable efforts' to maintain secrecy.</p>
        
        <h3>The 'Reasonable Efforts' Evidentiary Standard</h3>
        <p>Courts consistently dismiss trade secret misappropriation claims where the plaintiff failed to implement affirmative, multi-layered safeguards. Simply labelling documents as 'Confidential' is legally insufficient without corresponding technical and contractual barriers.</p>

        <div class="modal-key-takeaways">
          <h4><i class="fa-solid fa-lightbulb"></i> Trade Secret Protection Checklist</h4>
          <ul>
            <li><strong>Role-Based Access Controls:</strong> Restrict sensitive IP, algorithms, and customer data strictly on a need-to-know basis with logged access.</li>
            <li><strong>Delineated Onboarding & Offboarding:</strong> Require signed acknowledgement of specific trade secret categories upon joining and certified data deletion upon departure.</li>
            <li><strong>Clean Room Development Protocols:</strong> Protect software assets by documenting independent developer provenance to defeat contamination claims.</li>
          </ul>
        </div>
      `
    },
    'lease-renegotiations': {
      category: 'Commercial Law',
      title: 'Commercial Lease Renegotiations and Subletting Rights for Growth Companies',
      author: 'Elena Rostova, Esq.',
      role: 'Senior Commercial Counsel',
      authorImg: 'assets/team-partner-2.webp',
      date: 'September 29, 2026',
      readTime: '5 min read',
      image: 'assets/practice-realestate.webp',
      body: `
        <p>As corporate real estate footprints adjust to hybrid work models, commercial tenants face substantial lease liabilities. Renegotiating lease terms, securing flexible subletting rights, and restructuring guarantor commitments require strategic legal positioning.</p>
        
        <h3>Key Leverage Points in Lease Restructuring</h3>
        <p>Landlords are increasingly receptive to lease modifications where tenants offer lease term extensions in exchange for immediate space reductions or temporary rent abatements. Crucially, tenants must review assignment and subletting covenants to eliminate unreasonable landlord consent withholdings.</p>

        <div class="modal-key-takeaways">
          <h4><i class="fa-solid fa-building"></i> Commercial Lease Levers</h4>
          <ul>
            <li><strong>Contraction Options:</strong> Pre-negotiate fixed contraction dates with agreed penalty schedules rather than unilateral surrender.</li>
            <li><strong>Profit-Sharing on Subleases:</strong> Cap landlord profit-sharing on excess sublease revenue after factoring in tenant build-out and broker commission costs.</li>
            <li><strong>Release of Parent Guarantees:</strong> Seek progressive burn-down of security deposits and corporate parent guaranties tied to milestone lease performance.</li>
          </ul>
        </div>
      `
    },
    'esg-reporting-board': {
      category: 'Corporate Governance',
      title: 'Statutory ESG Reporting Obligations: What Every Board Director Needs to Know',
      author: 'Sarah Jenkins, Esq.',
      role: 'Managing Partner',
      authorImg: 'assets/team-partner-1.webp',
      date: 'September 18, 2026',
      readTime: '8 min read',
      image: 'assets/meeting-room.webp',
      body: `
        <p>Statutory sustainability and climate disclosure mandates have transitioned from voluntary investor relations presentations into rigorous regulatory filings backed by civil and administrative enforcement. Board directors now face direct fiduciary exposure for oversight failures regarding environmental and supply-chain governance.</p>
        
        <h3>Scope 1, 2, and 3 Assurance Standards</h3>
        <p>Enterprises operating above statutory revenue thresholds must prepare audited non-financial disclosures. The inclusion of Scope 3 supply-chain emissions presents the highest compliance risk, necessitating enforceable contractual reporting mandates across all third-party supplier agreements.</p>

        <div class="modal-key-takeaways">
          <h4><i class="fa-solid fa-landmark"></i> Board Fiduciary Directives</h4>
          <ul>
            <li><strong>Dedicated Governance Committee:</strong> Formally assign ESG disclosure oversight to an existing audit committee or a dedicated governance sub-committee.</li>
            <li><strong>Independent Verification:</strong> Retain certified independent assurance providers to verify non-financial metrics prior to annual publication.</li>
            <li><strong>Directors & Officers (D&O) Coverage Audit:</strong> Ensure existing D&O insurance policies do not contain exclusions for sustainability-related shareholder derivative actions.</li>
          </ul>
        </div>
      `
    },
    'dispute-resolution-clauses': {
      category: 'Contract Advisory',
      title: 'Drafting Dispute Resolution & Multi-Tiered Arbitration Clauses That Hold Up',
      author: 'David Thorne',
      role: 'M&A and Restructuring Specialist',
      authorImg: 'assets/team-partner-3.webp',
      date: 'September 09, 2026',
      readTime: '5 min read',
      image: 'assets/practice-dispute.webp',
      body: `
        <p>Dispute resolution clauses are often drafted as boilerplate 'midnight clauses' during late-night closing negotiations. Defective, ambiguous, or pathological arbitration provisions can result in costly jurisdictional battles before the substantive dispute is even heard.</p>
        
        <h3>Multi-Tiered Escalation Mechanisms</h3>
        <p>Well-crafted commercial contracts establish structured dispute tiers: good-faith senior executive negotiation, followed by mandatory mediation, followed by binding international arbitration. Each tier must specify strict calendar day deadlines to prevent tactical delays.</p>

        <div class="modal-key-takeaways">
          <h4><i class="fa-solid fa-gavel"></i> Clause Drafting Best Practices</h4>
          <ul>
            <li><strong>Seat vs. Venue Clarity:</strong> Explicitly distinguish between the juridical seat of arbitration (which governs procedural law) and the physical hearing venue.</li>
            <li><strong>Number of Arbitrators & Institutional Rules:</strong> For claims under designated thresholds, specify a sole arbitrator to minimize procedural expense and timeline.</li>
            <li><strong>Emergency Relief Carve-outs:</strong> Explicitly preserve the right to seek interim injunctive relief or freezing orders from court tribunals pending tribunal constitution.</li>
          </ul>
        </div>
      `
    },
    'capital-restructuring': {
      category: 'Mergers & Acquisitions',
      title: 'Capital Restructuring Strategies for Mid-Market Enterprises Facing Credit Tightening',
      author: 'Marcus Sterling',
      role: 'Senior Regulatory Consultant',
      authorImg: 'assets/team-partner-5.webp',
      date: 'August 26, 2026',
      readTime: '7 min read',
      image: 'assets/business-consulting.webp',
      body: `
        <p>In cycles of monetary discipline and syndicated loan tightening, mid-market enterprises frequently find existing debt service ratios under pressure. Proactive balance sheet reorganization—executed well before formal insolvency thresholds are crossed—remains the most reliable path to preserving enterprise equity value.</p>
        
        <h3>Out-of-Court Workouts vs. Formal Workouts</h3>
        <p>Consensual lender negotiations yield dramatically higher recovery rates and brand preservation than formal court proceedings. Corporate counsel must orchestrate standstill agreements, liquidity stress modeling, and covenant resets while maintaining commercial trade creditor alignment.</p>

        <div class="modal-key-takeaways">
          <h4><i class="fa-solid fa-chart-line"></i> Strategic Restructuring Tools</h4>
          <ul>
            <li><strong>Covenant Holiday Protocols:</strong> Structure temporary debt-service holidays in exchange for equity warrants or increased monitoring rights.</li>
            <li><strong>Mezzanine & Subordinated Tranches:</strong> Introduce structured hybrid capital to refinance senior debt maturities without immediate shareholder dilution.</li>
            <li><strong>Intercreditor Alignment:</strong> Enforce strict waterfall rights and voting thresholds to prevent holdout factions from disrupting consensual turnaround plans.</li>
          </ul>
        </div>
      `
    },
    'digital-tax-structuring': {
      category: 'Corporate Governance',
      title: 'Cross-Border Tax Structuring & Permanent Establishment Safeguards in Digital Commerce',
      author: 'Sarah Jenkins, Esq.',
      role: 'Managing Partner',
      authorImg: 'assets/team-partner-1.webp',
      date: 'August 14, 2026',
      readTime: '6 min read',
      image: 'assets/corporate-law.webp',
      body: `
        <p>The global rollout of OECD Pillar Two rules alongside expanding unilateral digital services taxation has fundamentally changed cross-border enterprise architecture. Operating multinational digital sales channels without triggering unexpected 'significant economic presence' permanent establishments requires comprehensive tax treaty mapping.</p>
        
        <h3>Digital Nexus Realities in 2026</h3>
        <p>Revenue authorities are aggressively probing enterprise software subscriptions, server location agreements, and local sales support entities. Corporate groups must prove genuine economic substance in intermediate holding jurisdictions to defend against aggressive double taxation assessments.</p>

        <div class="modal-key-takeaways">
          <h4><i class="fa-solid fa-coins"></i> Cross-Border Tax Risk Pillars</h4>
          <ul>
            <li><strong>Pillar Two Top-Up Tax Modeling:</strong> Model effective tax rates across every operating jurisdiction to manage global 15% minimum corporate tax liabilities.</li>
            <li><strong>Transfer Pricing Documentation:</strong> Ensure intra-group IP licensing agreements reflect OECD DEMPE (Development, Enhancement, Maintenance, Protection, Exploitation) functional realities.</li>
            <li><strong>Dependent Agent Risk Management:</strong> Clearly circumscribe the contracting authority of in-country business development teams to prevent unwanted taxable presence triggers.</li>
          </ul>
        </div>
      `
    },
    'ai-licensing-msa': {
      category: 'Intellectual Property',
      title: 'AI Licensing & Foundation Model Warranties in Enterprise Master Service Agreements',
      author: 'Clara Vance, LL.M.',
      role: 'IP & Commercial Counsel',
      authorImg: 'assets/team-partner-4.webp',
      date: 'August 02, 2026',
      readTime: '5 min read',
      image: 'assets/practice-ip.webp',
      body: `
        <p>As enterprises integrate generative AI foundation models into critical workflow pipelines, procurement and legal teams must re-engineer traditional Master Service Agreements (MSAs). Standard software-as-a-service indemnities fail to address the unique copyright, output contamination, and training-data risks inherent in generative neural architectures.</p>
        
        <h3>Uncapped IP Indemnification for Model Outputs</h3>
        <p>Enterprise buyers should insist that vendor IP indemnities cover not only the underlying platform code, but also synthetic outputs generated in the ordinary course of business. Concurrently, vendors must warrant that enterprise customer inputs are never ingested to train foundation models accessible to third parties.</p>

        <div class="modal-key-takeaways">
          <h4><i class="fa-solid fa-robot"></i> Key MSA Negotiation Terms</h4>
          <ul>
            <li><strong>Zero Training Retention Guarantees:</strong> Explicit contractual commitments prohibiting vendors from utilizing customer prompts, enterprise telemetry, or data embeds for broader model fine-tuning.</li>
            <li><strong>Model Weight & Fine-Tuning Escrow:</strong> For mission-critical bespoke deployments, preserve access to checkpoint weights in the event of vendor insolvency or service deprecation.</li>
            <li><strong>Strict Output Non-Infringement Covenants:</strong> Ensure statutory copyright and patent indemnification caps do not apply to third-party infringement claims arising from model hallucination or verbatim output replication.</li>
          </ul>
        </div>
      `
    },
    'whistleblower-investigations': {
      category: 'Regulatory Compliance',
      title: 'Whistleblower Protocols & Internal Investigations Under Modern Corporate Directives',
      author: 'Marcus Sterling',
      role: 'Senior Regulatory Consultant',
      authorImg: 'assets/team-partner-5.webp',
      date: 'July 21, 2026',
      readTime: '7 min read',
      image: 'assets/meeting-room.webp',
      body: `
        <p>Heightened statutory whistleblower protection directives have raised the stakes for corporate boards handling internal grievance reports. Failing to establish secure, credible intake channels or attempting retaliatory measures can trigger severe regulatory penalties and shareholder derivative liability.</p>
        
        <h3>Establishing the Attorney-Client Privilege Umbrella</h3>
        <p>From the moment an intake report touches an audit or compliance committee, internal investigation steps must be cloaked under legal counsel privilege to protect factual work product from involuntary disclosure in subsequent civil discovery or government subpoenas.</p>

        <div class="modal-key-takeaways">
          <h4><i class="fa-solid fa-user-shield"></i> Internal Investigation Blueprint</h4>
          <ul>
            <li><strong>Independent Outside Counsel Mandate:</strong> Retain independent legal counsel rather than internal management when allegations implicate executive leadership.</li>
            <li><strong>Digital Evidence Lockdown:</strong> Issue immediate electronic litigation holds across cloud repositories, encrypted messaging accounts, and email archives within 24 hours.</li>
            <li><strong>Strict Non-Retaliation Protections:</strong> Implement formal isolation protocols ensuring reporting employees experience zero adverse impact on duties, compensation, or reporting lines.</li>
          </ul>
        </div>
      `
    },
    'minority-shareholder-rights': {
      category: 'Mergers & Acquisitions',
      title: 'Structuring Minority Shareholder Rights and Drag-Along / Tag-Along Protections',
      author: 'David Thorne',
      role: 'M&A and Restructuring Specialist',
      authorImg: 'assets/team-partner-3.webp',
      date: 'July 08, 2026',
      readTime: '6 min read',
      image: 'assets/practice-corporate.webp',
      body: `
        <p>Shareholders' agreements (SHAs) represent the constitutional framework of privately held enterprises. When market consolidation creates acquisition opportunities, poorly drafted drag-along or tag-along clauses frequently result in paralysis, board deadlocks, or minority shareholder litigation.</p>
        
        <h3>Balancing Founder Agility and Investor Protection</h3>
        <p>Majority founders need clean mechanisms to deliver 100% of the corporate equity to prospective strategic buyers. However, institutional minority co-investors must ensure drag-along rights cannot be exercised below minimum valuation thresholds or upon non-cash consideration terms that prejudice their investment thesis.</p>

        <div class="modal-key-takeaways">
          <h4><i class="fa-solid fa-users-gear"></i> Shareholder Governance Essentials</h4>
          <ul>
            <li><strong>Minimum Floor Valuations:</strong> Drag-along covenants should only activate if the exit transaction achieves a pre-agreed hurdle price or IRR return for all share classes.</li>
            <li><strong>Equal Consideration Parity:</strong> Tag-along rights must guarantee that minority shareholders receive identical per-share pricing, terms, and representation warranties as majority sellers.</li>
            <li><strong>Deadlock Resolution Mechanisms:</strong> Incorporate structured Russian roulette or Texas shoot-out clauses to break irreconcilable 50/50 board deadlocks without forcing judicial dissolution.</li>
          </ul>
        </div>
      `
    }
  };

  // Elements
  const searchInput = document.getElementById('blogSearch');
  const pillBtns = document.querySelectorAll('.blog-pill');
  const blogCards = document.querySelectorAll('.blog-card');
  const noResults = document.getElementById('blogNoResults');

  // Modal Elements
  const modalOverlay = document.getElementById('articleModal');
  const modalCloseBtn = document.getElementById('modalCloseBtn');
  const modalCategory = document.getElementById('modalCategory');
  const modalTitle = document.getElementById('modalTitle');
  const modalAuthorName = document.getElementById('modalAuthorName');
  const modalAuthorRole = document.getElementById('modalAuthorRole');
  const modalAuthorImg = document.getElementById('modalAuthorImg');
  const modalDate = document.getElementById('modalDate');
  const modalReadTime = document.getElementById('modalReadTime');
  const modalHeroImg = document.getElementById('modalHeroImg');
  const modalBody = document.getElementById('modalBody');
  const modalBioImg = document.getElementById('modalBioImg');
  const modalBioName = document.getElementById('modalBioName');
  const modalBioRole = document.getElementById('modalBioRole');

  let activeCategory = 'all';
  let searchQuery = '';

  // Filter Function
  function filterArticles() {
    let visibleCount = 0;

    blogCards.forEach(card => {
      const category = card.getAttribute('data-category');
      const title = card.querySelector('.blog-card-title').textContent.toLowerCase();
      const excerpt = card.querySelector('.blog-card-excerpt').textContent.toLowerCase();
      const author = card.querySelector('.blog-card-author-name').textContent.toLowerCase();

      const matchesCat = (activeCategory === 'all' || category === activeCategory);
      const matchesSearch = !searchQuery || 
        title.includes(searchQuery) || 
        excerpt.includes(searchQuery) || 
        author.includes(searchQuery) ||
        category.includes(searchQuery);

      if (matchesCat && matchesSearch) {
        card.style.display = 'flex';
        visibleCount++;
      } else {
        card.style.display = 'none';
      }
    });

    if (noResults) {
      noResults.style.display = visibleCount === 0 ? 'block' : 'none';
    }
  }

  // Filter Pill buttons redirect to 404 page
  pillBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      window.location.href = '404.html';
    });
  });

  // Search input listener redirects to 404 page on enter / search
  if (searchInput) {
    searchInput.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        e.preventDefault();
        window.location.href = '404.html';
      }
    });
  }

  // Click on Article Cards / Read Button redirects to 404 page
  document.querySelectorAll('[data-article-id]').forEach(elem => {
    elem.addEventListener('click', (e) => {
      e.preventDefault();
      window.location.href = '404.html';
    });
  });

  // Modal Close Events
  if (modalCloseBtn) {
    modalCloseBtn.addEventListener('click', closeArticleModal);
  }

  if (modalOverlay) {
    modalOverlay.addEventListener('click', (e) => {
      if (e.target === modalOverlay) {
        closeArticleModal();
      }
    });
  }

  // Escape key to close modal
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modalOverlay && modalOverlay.classList.contains('active')) {
      closeArticleModal();
    }
  });

  // Check URL query parameters (e.g. ?cat=compliance)
  const urlParams = new URLSearchParams(window.location.search);
  const catParam = urlParams.get('cat');
  if (catParam) {
    const targetPill = document.querySelector(`.blog-pill[data-category="${catParam}"]`);
    if (targetPill) {
      targetPill.click();
    }
  }
});
