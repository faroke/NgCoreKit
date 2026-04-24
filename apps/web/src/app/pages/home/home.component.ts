import { ChangeDetectionStrategy, Component } from '@angular/core';
import { HeroSectionComponent } from './sections/hero-section.component';
import { FeaturesSectionComponent } from './sections/features-section.component';
import { BentoSectionComponent } from './sections/bento-section.component';
import { PainSectionComponent } from './sections/pain-section.component';
import { StatsSectionComponent } from './sections/stats-section.component';
import { ReviewSectionComponent } from './sections/review-section.component';
import { PricingSectionComponent } from './sections/pricing-section.component';
import { FaqSectionComponent } from './sections/faq-section.component';
import { CtaSectionComponent } from './sections/cta-section.component';

@Component({
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-home',
  imports: [
    HeroSectionComponent,
    FeaturesSectionComponent,
    BentoSectionComponent,
    PainSectionComponent,
    StatsSectionComponent,
    ReviewSectionComponent,
    PricingSectionComponent,
    FaqSectionComponent,
    CtaSectionComponent,
  ],
  template: `
    <div class="mx-auto max-w-6xl px-4">
      <app-hero-section />
    </div>
    <app-stats-section />
    <div class="mx-auto max-w-6xl px-4">
      <app-features-section />
      <app-bento-section />
      <app-pain-section />
      <app-review-section />
      <app-pricing-section />
      <app-faq-section />
      <app-cta-section />
    </div>
  `,
})
export class HomeComponent {}
