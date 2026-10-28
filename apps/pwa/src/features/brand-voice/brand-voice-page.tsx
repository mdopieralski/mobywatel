import { UNOFFICIAL_DISCLAIMER, WORKING_NAME } from '@mobywatel/brand';
import { useEffect, type ComponentPropsWithoutRef } from 'react';
import Markdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

// The guide itself, bundled at build time so this page never drifts from the doc.
import source from '../../../../../docs/product/brand-voice.md?raw';
import { IconOptions } from './icon-options.tsx';

// Team page (English, like the doc). Not in the app navigation. The guide's own title and frontmatter are
// dropped: this page supplies the h1 and the explanation.
const guide = source
  .replace(/^---\n[\s\S]*?\n---\n/, '')
  .replace(/^\s*# .*\n/, '')
  .trim();

const updated = /^updated:\s*(.+)$/m.exec(source)?.[1] ?? '';
const status = /^status:\s*(.+)$/m.exec(source)?.[1] ?? '';

// A reading page, not an app screen: full width up to a comfortable measure, normal page scroll.
const pageClass =
  'min-h-dvh flex flex-col [&_code]:px-1 [&_code]:rounded-sm [&_code]:bg-accent-soft [&_code]:text-[0.9em] [&_code]:[overflow-wrap:anywhere]';

const cardClass =
  'p-4 border border-border rounded-lg bg-surface [&_h3]:m-0 [&_h3]:mb-2 [&_h3]:text-lg [&_p]:m-0';

// The rendered guide.
const guideClass =
  '[&_h2]:mt-12 [&_h2]:pt-4 [&_h2]:border-t [&_h2]:border-border [&_h2:first-child]:mt-0 [&_h2:first-child]:pt-0 [&_h2:first-child]:border-t-0 [&_:is(ul,ol)]:pl-5 [&_li]:mb-2 [&_li>ul]:mt-2 [&_strong]:font-semibold [&_a]:[overflow-wrap:anywhere]';

const tableWrapClass =
  'overflow-x-auto mx-0 my-4 border border-border rounded-md bg-surface [&_table]:w-full [&_table]:min-w-[36rem] [&_table]:border-collapse [&_table]:text-sm [&_:is(th,td)]:py-2 [&_:is(th,td)]:px-3 [&_:is(th,td)]:border-b [&_:is(th,td)]:border-border [&_:is(th,td)]:text-left [&_:is(th,td)]:align-top [&_th]:bg-bg [&_th]:font-semibold [&_tr:last-child_td]:border-b-0';

// Wide tables scroll inside their own focusable region on phones (WCAG 1.4.10 reflow).
function Table(props: ComponentPropsWithoutRef<'table'>) {
  return (
    <div className={tableWrapClass} role="region" aria-label="Table" tabIndex={0}>
      <table {...props} />
    </div>
  );
}

export function BrandVoicePage() {
  useEffect(() => {
    document.title = `Brand voice – ${WORKING_NAME}`;
  }, []);

  return (
    <div className={pageClass} lang="en">
      <header className="sticky top-0 z-1 flex items-center gap-3 pt-[calc(env(safe-area-inset-top)_+_var(--space-3))] px-4 pb-3 bg-surface border-b border-border">
        {/* Our own app icon; decorative because the name follows. */}
        <img className="flex-none block rounded-sm" src="/icons/favicon.svg" alt="" width={32} height={32} />
        <span className="-ml-1 font-semibold">{WORKING_NAME}</span>
        <span className="py-1 px-2 rounded-pill bg-accent-soft text-accent text-sm font-semibold">
          Team docs
        </span>
        <a className="inline-flex items-center min-h-target ml-auto font-semibold" href="/">
          Back to the app
        </a>
      </header>

      <main className="w-full max-w-[56rem] mx-auto pt-6 px-4 pb-12">
        <h1>
          Brand voice
          <span className="block mt-2 text-text-muted text-lg font-normal">
            How {WORKING_NAME} speaks, and why
          </span>
        </h1>

        <section
          className="mb-12 pb-6 border-b border-border [&_ul]:pl-5 [&_li]:mb-2"
          aria-labelledby="what-heading"
        >
          <h2 id="what-heading">What a brand voice is</h2>
          <p>
            A brand voice is the personality behind every word the product says: on buttons, in errors, in
            reminders and in the assistant. It answers one question for everyone who writes, people and AI
            agents alike: <strong>how do we sound, and how do we not sound?</strong>
          </p>
          <div className="grid grid-cols-[repeat(auto-fit,minmax(14rem,1fr))] gap-3 mt-4 mx-0 mb-6">
            <div className={cardClass}>
              <h3>Voice stays the same</h3>
              <p>
                We always sound like a calm, competent person at the counter who is on your side. That never
                changes, whatever the screen.
              </p>
            </div>
            <div className={cardClass}>
              <h3>Tone changes</h3>
              <p>
                How serious and how detailed we are depends on the moment: brief for a routine check, careful
                before a payment, quiet when someone is grieving.
              </p>
            </div>
            <div className={cardClass}>
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
          <p className="text-text-muted text-sm">
            Source: <code>docs/product/brand-voice.md</code> · status: {status} · updated: {updated}
          </p>
        </section>

        <IconOptions />

        <article className={guideClass} aria-label="The brand voice guide">
          <Markdown remarkPlugins={[remarkGfm]} components={{ table: Table }}>
            {guide}
          </Markdown>
        </article>
      </main>

      <footer
        className="mt-auto p-4 border-t border-border text-text-muted text-sm text-center"
        lang="pl"
        data-disclaimer
      >
        {UNOFFICIAL_DISCLAIMER}
      </footer>
    </div>
  );
}
