import SalesHero from "@/components/sales/SalesHero";
import SalesPainSection from "@/components/sales/SalesPainSection";
import SalesReliefSection from "@/components/sales/SalesReliefSection";
import SalesSolutionSection from "@/components/sales/SalesSolutionSection";
import SalesTrustSection from "@/components/sales/SalesTrustSection";
import SalesBenefitsSection from "@/components/sales/SalesBenefitsSection";
import SalesQualificationSection from "@/components/sales/SalesQualificationSection";
import SalesPricingSection from "@/components/sales/SalesPricingSection";
import SalesFAQSection from "@/components/sales/SalesFAQSection";
import SalesCTASection from "@/components/sales/SalesCTASection";

export default function SalesPage() {
  return (
    <div className="min-h-screen bg-background text-foreground overflow-x-hidden">
      <SalesHero />
      <SalesPainSection />
      <SalesReliefSection />
      <SalesSolutionSection />
      <SalesTrustSection />
      <SalesBenefitsSection />
      <SalesQualificationSection />
      <SalesPricingSection />
      <SalesFAQSection />
      <SalesCTASection />
    </div>
  );
}
