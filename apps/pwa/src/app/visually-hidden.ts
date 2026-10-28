/**
 * Hidden from sight, still read by screen readers. Not Tailwind's `sr-only`: that one also sets a negative
 * margin and `clip`, and this keeps the exact rule the app had before.
 */
export const visuallyHidden = 'absolute w-px h-px overflow-hidden [clip-path:inset(50%)] whitespace-nowrap';
