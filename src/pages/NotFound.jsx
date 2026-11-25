import { Button, EmptyState, PageHeader } from '../components/ui.jsx'
import { IconSearch } from '../components/icons.jsx'
import { useI18n } from '../lib/i18n.jsx'

export default function NotFound() {
  const { t } = useI18n()

  return (
    <>
      <PageHeader
        eyebrow="404"
        title={t('common.notFoundTitle')}
        lead={t('common.notFoundBody')}
      />
      <section className="py-8" aria-label={t('common.notFoundTitle')}>
        <EmptyState
          icon={<IconSearch size={24} />}
          title={t('common.notFoundTitle')}
          body={t('common.notFoundBody')}
          action={
            <Button as="a" href="/" variant="primary" size="md">
              {t('common.home')}
            </Button>
          }
        />
      </section>
    </>
  )
}
