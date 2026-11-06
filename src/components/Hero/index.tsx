import { siteConfig } from '@/config/site';
import { ButtonLink } from '@/components/ui/Button';
import { Container } from '@/components/ui/Container';
import { DailySummaryPreview } from '../DailySummaryPreview';


export function Hero() {
  return (
    <section className="relative isolate flex min-h-[calc(100svh-4rem)] items-center overflow-hidden bg-gradient-to-b from-primary-50 to-white">
      <div className="absolute -top-24 -right-24 -z-10 size-96 rounded-full bg-secondary-200 opacity-60 blur-3xl" aria-hidden="true" />
      <div className="absolute -bottom-32 -left-24 -z-10 size-96 rounded-full bg-primary-100 blur-3xl" aria-hidden="true" />

      <Container className="grid items-center gap-12 py-16 lg:grid-cols-2">
        <div>
          <span className="inline-flex items-center rounded-full bg-secondary px-3 py-1 text-xs font-semibold text-neutral-900">
            Free calorie tracking
          </span>
          <h1 className="mt-6 text-4xl font-bold tracking-tight text-neutral-900 sm:text-5xl lg:text-6xl">
            Eat smarter. <span className="text-primary">Stay inside</span> your daily goal.
          </h1>
          <p className="mt-6 max-w-xl text-lg leading-relaxed text-neutral-600">{siteConfig.description}</p>
          <div className="mt-10 flex flex-col gap-3 sm:flex-row">
            <ButtonLink href={siteConfig.routes.signup} size="lg">
              Start tracking for free
            </ButtonLink>
            <ButtonLink href={siteConfig.routes.login} variant="outline" size="lg">
              I already have an account
            </ButtonLink>
          </div>
          <p className="mt-4 text-sm text-neutral-500">No credit card. Set up in under a minute.</p>
        </div>
        <div className="flex justify-center lg:justify-end">
          <DailySummaryPreview />
        </div>
      </Container>
    </section>
  );
}