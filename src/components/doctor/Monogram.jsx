const SIZES = {
  md: 'h-11 w-11 text-[13px]',
  lg: 'h-16 w-16 text-xl',
}

/**
 * Initials avatar. Decorative, so the doctor's full name is always rendered as
 * real text beside it — no photos and no faces.
 */
export default function Monogram({ initials, size = 'md', className }) {
  return (
    <span
      aria-hidden="true"
      className={[
        'flex flex-none select-none items-center justify-center rounded-full border border-teal-100 bg-teal-50 font-display font-semibold uppercase tracking-wide text-teal-600',
        SIZES[size] || SIZES.md,
        className || '',
      ]
        .filter(Boolean)
        .join(' ')}
    >
      {initials}
    </span>
  )
}
