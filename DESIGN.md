# N5Deal Design System

## 0. Research log

- Shortlist: Stripe, Linear, and Vercel.
- Selected direction: Stripe-inspired financial clarity with the calm, premium surface guidance from the soft-skill reference.
- Adaptation: N5Deal uses its own navy, teal, and ivory palette; no third-party logos, copy, or assets are reused.
- The brief is a 24-hour MVP, so visual work focuses on hierarchy, responsive behavior, clear calls to action, and accessible contrast rather than illustrative or animated decoration.

## 1. Product intent

N5Deal helps investors discover quality business opportunities and gives sellers a clear path to market. The base shell should feel considered, discreet, and trustworthy.

## 2. Tokens

- Background: `--color-canvas` and `--color-surface`.
- Content: `--color-ink`, `--color-muted`, and `--color-border`.
- Action: `--color-accent` with `--color-accent-strong` for hover.
- Status highlight: `--color-positive`.
- Validation feedback: `--color-danger` for field and form errors.
- Spacing uses a four-pixel rhythm; page sections use 56px, 80px, or 112px vertical spacing.
- Type uses the system sans stack; display text is tight, compact, and high-contrast.

## 3. Layout and responsiveness

- Content width: 1120px maximum with 24px mobile gutters.
- Desktop: two-column hero with a proof card.
- Tablet and mobile: hero stacks, navigation wraps without hiding essential links, and cards become single-column.
- Interactive targets have a minimum 40px height and visible keyboard focus.

## 4. Accessibility constraints

- Use semantic landmarks, real links, and visible focus rings.
- The decorative grid is CSS-only and hidden from assistive technology.
- No color is the sole carrier of meaning.
- Motion is limited to short opacity/transform transitions and disabled for reduced-motion preferences.

## 5. Reusable primitives

- `SiteHeader`: wordmark, primary navigation, and a contained CTA.
- `SiteFooter`: concise product and status context.
- `LinkButton`: primary and secondary link presentation.
- `N5DealMark`: project-specific SVG wordmark mark.
- `ContactMessageForm`: shared validated outreach composer with pending, success, and error states.

## 6. States and motion

- Links underline or shift to the accent color on hover and retain a 2px focus ring.
- Buttons use a 160ms color/translate transition only when motion is allowed.
- No loading state is needed on the static foundation route.

## 7. Accepted debt

- Full authentication, richer messaging, and data visualizations remain future product phases.
- The foundation does not load remote fonts or imagery; this keeps the first render fast and avoids an external asset dependency.
