import { UNOFFICIAL_DISCLAIMER, WORKING_NAME } from '@mobywatel/brand';
import { useEffect, type ComponentPropsWithoutRef } from 'react';
import Markdown from 'react-markdown';
import { Link } from 'react-router';
import remarkGfm from 'remark-gfm';

// The guide itself, bundled at build time so this page never drifts from the doc.
import source from '../../../../../docs/product/brand-voice.md?raw';
import styles from './brand-voice-page.module.css';
import { IconOptions } from './icon-options.tsx';

// Team page (English, like the doc). Not in the app navigation. The guide's own title and frontmatter are
// dropped: this page supplies the h1 and the explanation.
const guide = source
  .replace(/^---\n[\s\S]*?\n---\n/, '')
  .replace(/^\s*# .*\n/, '')
  .trim();

const updated = /^updated:\s*(.+)$/m.exec(source)?.[1] ?? '';
const status = /^status:\s*(.+)$/m.exec(source)?.[1] ?? '';

// Wide tables scroll inside their own focusable region on phones (WCAG 1.4.10 reflow).
function Table(props: ComponentPropsWithoutRef<'table'>) {
  return (
    <div className={styles.tableWrap} role="region" aria-label="Table" tabIndex={0}>
      <table {...props} />
    </div>
  );
}

export function BrandVoicePage() {
  useEffect(() => {
    document.title = `Brand voice – ${WORKING_NAME}`;
  }, []);

  return (
    <div className={styles.page} lang="en">
      <header className={styles.top}>
        {/* Our own app icon; decorative because the name follows. */}
        <img className={styles.icon} src="/icons/favicon.svg" alt="" width={32} height={32} />
        <span className={styles.brand}>{WORKING_NAME}</span>
        <span className={styles.badge}>Team docs</span>
        <Link className={styles.back} to="/">
          Back to the app
        </Link>
      </header>

      <main className={styles.main}>
        <h1>
          Brand voice
          <span className={styles.subtitle}>How {WORKING_NAME} speaks, and why</span>
        </h1>

        <section className={styles.intro} aria-labelledby="what-heading">
          <h2 id="what-heading">What a brand voice is</h2>
          <p>
            A brand voice is the personality behind every word the product says: on buttons, in errors, in
            reminders and in the assistant. It answers one question for everyone who writes, people and AI
            agents alike: <strong>how do we sound, and how do we not sound?</strong>
          </p>
          <div className={styles.cards}>
            <div className={styles.card}>
              <h3>Voice stays the same</h3>
              <p>
                We always sound like a calm, competent person at the counter who is on your side. That never
                changes, whatever the screen.
              </p>
            </div>
            <div className={styles.card}>
              <h3>Tone changes</h3>
              <p>
                How serious and how detailed we are depends on the moment: brief for a routine check, careful
                before a payment, quiet when someone is grieving.
              </p>
            </div>
            <div className={styles.card}>
              <h3>Values come first</h3>
              <p>
                Five values (Prosto, Z wyprzedzeniem, Dla każdego, Twoje dane – Twoja decyzja, Uczciwie) shape
                both the voice and the look. Each has a test any screen must pass.
              </p>
            </div>
          </div>

          <h2>Why it matters here</h2>
          <ul>
            <li>
              The jury asks for something <em>simpler and more accessible</em> than the reference prototype.
              Most of &ldquo;simpler&rdquo; is words.
            </li>
            <li>
              Our default reader is a 70-year-old on a phone with large text. Plain Polish is accessibility,
              not polish.
            </li>
            <li>
              Several agents write copy. One shared, testable guide keeps the screens, the assistant and the
              submission text sounding like one product.
            </li>
          </ul>

          <h2>How to use it</h2>
          <ul>
            <li>
              <strong>Writing copy:</strong> start from the tone map (§4) and the patterns (§8), then check
              the word list (§7).
            </li>
            <li>
              <strong>Reviewing:</strong> cite rule IDs (V, T, A, P, I, AS) so the writer knows exactly what
              to fix. Rules marked [auto] can be checked by a script.
            </li>
            <li>
              <strong>Owners:</strong> values – <code>product-manager</code>; voice, tone and word list –{' '}
              <code>service-designer</code>; the assistant – <code>conversation-designer</code>; independent
              review – <code>plain-language-editor</code>. Colours and type live in{' '}
              <code>docs/product/visual-identity.md</code>.
            </li>
          </ul>
          <p className={styles.meta}>
            Source: <code>docs/product/brand-voice.md</code> · status: {status} · updated: {updated}
          </p>
        </section>

        <IconOptions />

        <article className={styles.guide} aria-label="The brand voice guide">
          <Markdown remarkPlugins={[remarkGfm]} components={{ table: Table }}>
            {guide}
          </Markdown>
        </article>
      </main>

      <footer className={styles.footer} lang="pl" data-disclaimer>
        {UNOFFICIAL_DISCLAIMER}
      </footer>
    </div>
  );
}
