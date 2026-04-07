import { Suspense, lazy } from "react";
// cache-bust v2
import { SalesLanguageProvider } from "@/contexts/SalesLanguageContext";
import type { SalesLang } from "@/i18n/sales-translations";
import SalesHero from "@/components/sales/SalesHero";
import SalesNotifications from "@/components/sales/SalesNotifications";

// Lazy-load below-the-fold sections
const SalesPainSection = lazy(() => import("@/components/sales/SalesPainSection"));
const SalesReliefSection = lazy(() => import("@/components/sales/SalesReliefSection"));
const SalesSolutionSection = lazy(() => import("@/components/sales/SalesSolutionSection"));
const SalesEmergencySection = lazy(() => import("@/components/sales/SalesEmergencySection"));
const SalesCryTranslatorSection = lazy(() => import("@/components/sales/SalesCryTranslatorSection"));
const SalesRoutineSection = lazy(() => import("@/components/sales/SalesRoutineSection"));
const SalesBeforeAfterSection = lazy(() => import("@/components/sales/SalesBeforeAfterSection"));
const SalesTrustSection = lazy(() => import("@/components/sales/SalesTrustSection"));
const SalesTestimonialsSection = lazy(() => import("@/components/sales/SalesTestimonialsSection"));
const SalesWhatsAppTestimonial = lazy(() => import("@/components/sales/SalesWhatsAppTestimonial"));
const SalesBenefitsSection = lazy(() => import("@/components/sales/SalesBenefitsSection"));
const SalesQualificationSection = lazy(() => import("@/components/sales/SalesQualificationSection"));
const SalesPricingSection = lazy(() => import("@/components/sales/SalesPricingSection"));
const SalesGuaranteeSection = lazy(() => import("@/components/sales/SalesGuaranteeSection"));
const SalesFAQSection = lazy(() => import("@/components/sales/SalesFAQSection"));
const SalesCTASection = lazy(() => import("@/components/sales/SalesCTASection"));

function SectionsFallback() {
  return (
    <div className="flex items-center justify-center py-20">
      <div className="animate-pulse text-2xl">🌙</div>
    </div>
  );
}

export default function SalesPage({ lang = "en" }: { lang?: SalesLang }) {
  return (
    <SalesLanguageProvider lang={lang}>
      <div className="min-h-screen bg-background text-foreground overflow-x-hidden">
        <SalesHero />
        <SalesNotifications />

        <Suspense fallback={<SectionsFallback />}>
          <SalesPainSection />
          <SalesReliefSection />
          <SalesSolutionSection />
          <SalesEmergencySection />
          <SalesCryTranslatorSection />
          <SalesRoutineSection />
          <SalesBeforeAfterSection />
          <SalesTrustSection />
          <SalesTestimonialsSection />
          <SalesWhatsAppTestimonial />
          <SalesBenefitsSection />
          <SalesQualificationSection />
          <SalesPricingSection />
          <SalesGuaranteeSection />
          <SalesFAQSection />
          <SalesCTASection />
        </Suspense>
      </div>
    </SalesLanguageProvider>
  );
}
