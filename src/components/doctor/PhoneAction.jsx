import { useI18n } from '../../lib/i18n.jsx'
import { Button } from '../ui.jsx'
import { IconPhone } from '../icons.jsx'
import COPY from './copy.js'
import { telHref } from './helpers.js'

/**
 * Contact action built only from the phone value on record. When the record has
 * no phone we render a muted, non-interactive line instead of a dead link.
 */
export default function PhoneAction({
  doctor,
  size = 'sm',
  fullWidth = false,
  className,
}) {
  const { tl } = useI18n()
  const tel = telHref(doctor?.phone)

  if (!tel) {
    return (
      <span
        className={[
          'inline-flex min-h-[44px] items-center gap-1.5 text-xs leading-relaxed text-ink-faint',
          fullWidth ? 'w-full' : '',
          className || '',
        ]
          .filter(Boolean)
          .join(' ')}
      >
        <IconPhone size={15} className="flex-none" />
        <span>{tl(COPY.noPhone)}</span>
      </span>
    )
  }

  return (
    <Button
      as="a"
      href={tel}
      variant="secondary"
      size={size}
      aria-label={tl({
        km: `ទូរស័ព្ទទៅ ${doctor.nameKm} តាមលេខ ${doctor.phone}`,
        en: `Call ${doctor.nameEn} at ${doctor.phone}`,
      })}
      className={[fullWidth ? 'w-full' : '', className || '']
        .filter(Boolean)
        .join(' ')}
    >
      <IconPhone size={16} className="flex-none" />
      <span className="break-all font-mono text-[13px] leading-tight">
        {doctor.phone}
      </span>
    </Button>
  )
}
