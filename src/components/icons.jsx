/**
 * KOMA icon set. 24x24, 1.75 default stroke, currentColor.
 * Decorative (aria-hidden) unless a `title` prop is provided.
 */

function Svg({ children, className, size = 20, strokeWidth = 1.75, title }) {
  const labelled = Boolean(title)
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      role={labelled ? 'img' : undefined}
      aria-hidden={labelled ? undefined : true}
      focusable="false"
    >
      {labelled ? <title>{title}</title> : null}
      {children}
    </svg>
  )
}

export function IconAsk({ className, size, strokeWidth, title }) {
  return (
    <Svg className={className} size={size} strokeWidth={strokeWidth} title={title}>
      <path d="M21 11.5a8.5 8.5 0 0 1-8.5 8.5H8.8L4 23v-4.6A8.5 8.5 0 1 1 21 11.5Z" />
      <path d="M9.6 9.4a2.4 2.4 0 1 1 3.7 2c-.9.7-1.3 1.2-1.3 2.2" />
      <path d="M12 16.7h.01" />
    </Svg>
  )
}

export function IconMap({ className, size, strokeWidth, title }) {
  return (
    <Svg className={className} size={size} strokeWidth={strokeWidth} title={title}>
      <path d="M9 4 3.5 6.3v13.4L9 17.4l6 2.3 5.5-2.3V4L15 6.3 9 4Z" />
      <path d="M9 4v13.4M15 6.3v13.4" />
    </Svg>
  )
}

export function IconMedicine({ className, size, strokeWidth, title }) {
  return (
    <Svg className={className} size={size} strokeWidth={strokeWidth} title={title}>
      <rect x="2.8" y="8.8" width="18.4" height="6.4" rx="3.2" transform="rotate(-45 12 12)" />
      <path d="M8.6 8.6 15.4 15.4" />
    </Svg>
  )
}

export function IconDoctor({ className, size, strokeWidth, title }) {
  return (
    <Svg className={className} size={size} strokeWidth={strokeWidth} title={title}>
      <circle cx="12" cy="7.4" r="3.4" />
      <path d="M5 20.2c.7-3.6 3.5-5.6 7-5.6s6.3 2 7 5.6" />
      <path d="M15.4 13.2c.5 2 1.4 3.4 2.8 4" />
      <circle cx="18.9" cy="18.6" r="1.5" />
    </Svg>
  )
}

export function IconShield({ className, size, strokeWidth, title }) {
  return (
    <Svg className={className} size={size} strokeWidth={strokeWidth} title={title}>
      <path d="M12 3 5 5.7v5.1c0 4.5 2.9 8.2 7 9.9 4.1-1.7 7-5.4 7-9.9V5.7L12 3Z" />
      <path d="m9.2 11.7 2 2 3.6-3.8" />
    </Svg>
  )
}

export function IconSearch({ className, size, strokeWidth, title }) {
  return (
    <Svg className={className} size={size} strokeWidth={strokeWidth} title={title}>
      <circle cx="10.8" cy="10.8" r="6.3" />
      <path d="m15.5 15.5 4.2 4.2" />
    </Svg>
  )
}

export function IconPin({ className, size, strokeWidth, title }) {
  return (
    <Svg className={className} size={size} strokeWidth={strokeWidth} title={title}>
      <path d="M19 10.2c0 4.4-7 10.3-7 10.3s-7-5.9-7-10.3a7 7 0 1 1 14 0Z" />
      <circle cx="12" cy="10" r="2.5" />
    </Svg>
  )
}

export function IconPhone({ className, size, strokeWidth, title }) {
  return (
    <Svg className={className} size={size} strokeWidth={strokeWidth} title={title}>
      <path d="M6.6 3.5h3l1.4 3.6-2 1.4a11.5 11.5 0 0 0 6.5 6.5l1.4-2 3.6 1.4v3c0 1.4-1.1 2.5-2.5 2.5A15.5 15.5 0 0 1 4.1 6c0-1.4 1.1-2.5 2.5-2.5Z" />
    </Svg>
  )
}

export function IconSource({ className, size, strokeWidth, title }) {
  return (
    <Svg className={className} size={size} strokeWidth={strokeWidth} title={title}>
      <path d="M7 3.5h7.5L19 8v12.5H7a2 2 0 0 1-2-2v-13a2 2 0 0 1 2-2Z" />
      <path d="M14 3.5V8h4.5M8.8 12h6.4M8.8 15.4h6.4" />
    </Svg>
  )
}

export function IconSend({ className, size, strokeWidth, title }) {
  return (
    <Svg className={className} size={size} strokeWidth={strokeWidth} title={title}>
      <path d="m21 3-8.2 18-2.6-7.2L3 11.2 21 3Z" />
      <path d="M21 3 10.2 13.8" />
    </Svg>
  )
}

export function IconGlobe({ className, size, strokeWidth, title }) {
  return (
    <Svg className={className} size={size} strokeWidth={strokeWidth} title={title}>
      <circle cx="12" cy="12" r="8.7" />
      <path d="M3.4 9.5h17.2M3.4 14.5h17.2" />
      <path d="M12 3.3c2.3 2.5 3.5 5.5 3.5 8.7s-1.2 6.2-3.5 8.7c-2.3-2.5-3.5-5.5-3.5-8.7S9.7 5.8 12 3.3Z" />
    </Svg>
  )
}

export function IconArrow({ className, size, strokeWidth, title }) {
  return (
    <Svg className={className} size={size} strokeWidth={strokeWidth} title={title}>
      <path d="M4 12h16M14 6l6 6-6 6" />
    </Svg>
  )
}

export function IconCheck({ className, size, strokeWidth, title }) {
  return (
    <Svg className={className} size={size} strokeWidth={strokeWidth} title={title}>
      <path d="m4.5 12.5 5 5 10-11" />
    </Svg>
  )
}

export function IconAlert({ className, size, strokeWidth, title }) {
  return (
    <Svg className={className} size={size} strokeWidth={strokeWidth} title={title}>
      <path d="M12 3.6 2.9 19.4a1.1 1.1 0 0 0 1 1.6h16.2a1.1 1.1 0 0 0 1-1.6L12 3.6Z" />
      <path d="M12 9.2v4.3M12 17.2h.01" />
    </Svg>
  )
}

export function IconClose({ className, size, strokeWidth, title }) {
  return (
    <Svg className={className} size={size} strokeWidth={strokeWidth} title={title}>
      <path d="M6 6l12 12M18 6 6 18" />
    </Svg>
  )
}

export function IconSpark({ className, size, strokeWidth, title }) {
  return (
    <Svg className={className} size={size} strokeWidth={strokeWidth} title={title}>
      <path d="M12 3.2c.7 4.6 3.9 7.8 8.5 8.5-4.6.7-7.8 3.9-8.5 8.5-.7-4.6-3.9-7.8-8.5-8.5 4.6-.7 7.8-3.9 8.5-8.5Z" />
      <path d="M18.5 4.2v3M17 5.7h3" />
    </Svg>
  )
}

export function IconBook({ className, size, strokeWidth, title }) {
  return (
    <Svg className={className} size={size} strokeWidth={strokeWidth} title={title}>
      <path d="M4 4.8c2.8-.6 5.4 0 8 1.7v13.6c-2.6-1.7-5.2-2.3-8-1.7V4.8Z" />
      <path d="M20 4.8c-2.8-.6-5.4 0-8 1.7v13.6c2.6-1.7 5.2-2.3 8-1.7V4.8Z" />
    </Svg>
  )
}

export function IconClock({ className, size, strokeWidth, title }) {
  return (
    <Svg className={className} size={size} strokeWidth={strokeWidth} title={title}>
      <circle cx="12" cy="12" r="8.7" />
      <path d="M12 7.2V12l3.2 2" />
    </Svg>
  )
}

export function IconFilter({ className, size, strokeWidth, title }) {
  return (
    <Svg className={className} size={size} strokeWidth={strokeWidth} title={title}>
      <path d="M3.5 5.4h17L14 12.8v6.2l-4 1.6v-7.8L3.5 5.4Z" />
      <path d="M6.5 8.4h11" />
    </Svg>
  )
}

export function IconChevron({ className, size, strokeWidth, title }) {
  return (
    <Svg className={className} size={size} strokeWidth={strokeWidth} title={title}>
      <path d="m9.5 5.5 6.5 6.5-6.5 6.5" />
    </Svg>
  )
}

export function IconMenu({ className, size, strokeWidth, title }) {
  return (
    <Svg className={className} size={size} strokeWidth={strokeWidth} title={title}>
      <path d="M4 7h16M4 12h16M4 17h16" />
    </Svg>
  )
}

export function IconStop({ className, size, strokeWidth, title }) {
  return (
    <Svg className={className} size={size} strokeWidth={strokeWidth} title={title}>
      <rect x="6.5" y="6.5" width="11" height="11" rx="2" />
    </Svg>
  )
}
