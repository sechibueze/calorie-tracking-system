import { ButtonLink } from '@/components/ui/Button';
import { Container } from '@/components/ui/Container';
import { Logo } from '@/components/ui/Logo';
import { siteConfig } from '@/config/site';

export function MarketingNavbar() {
  return (
    <header className="sticky top-0 z-50 border-b border-neutral-200/70 bg-white/80 backdrop-blur">
      <Container className="flex h-16 items-center justify-between">
        <Logo />
        <nav aria-label="Account" className="flex items-center gap-2">
          <ButtonLink href={siteConfig.routes.login} variant="ghost" size="sm">
            Login
          </ButtonLink>
          <ButtonLink href={siteConfig.routes.signup} size="sm">
            Sign up
          </ButtonLink>
        </nav>
      </Container>
    </header>
  );
}