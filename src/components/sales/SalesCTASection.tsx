import { Moon, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useSalesT } from "@/contexts/SalesLanguageContext";
import logo from "@/assets/logo-dr-sleepy.webp";

export default function SalesCTASection() {
  const { t } = useSalesT();
  return (
    <>
      <section className="px-4 py-16 md:py-24 bg-primary/5">
        <div className="max-w-2xl mx-auto text-center">
          <Moon className="w-10 h-10 text-primary mx-auto mb-4" />
          <h2 className="text-2xl md:text-3xl font-bold mb-4 text-foreground">{t("cta.title")}</h2>
          <p className="text-muted-foreground text-base md:text-lg leading-relaxed max-w-md mx-auto mb-8">{t("cta.desc")}</p>
          <Button size="lg" className="rounded-2xl px-8 py-6 text-base font-bold shadow-lg shadow-primary/20 hover:shadow-xl hover:shadow-primary/30 transition-all" onClick={() => document.getElementById("pricing")?.scrollIntoView({ behavior: "smooth" })}>
            {t("cta.button")}
            <ArrowRight className="w-5 h-5 ml-2" />
          </Button>
        </div>
      </section>
      <footer className="px-4 py-8 border-t border-border/40">
        <div className="max-w-2xl mx-auto text-center">
          <img src={logo} alt="Dr. Sleepy" className="h-12 mx-auto mb-4 object-contain" width={160} height={48} />
          <p className="text-xs text-muted-foreground leading-relaxed max-w-sm mx-auto">{t("cta.footer")}</p>
          <p className="text-xs text-muted-foreground mt-4">© {new Date().getFullYear()} Dr. Sleepy. All rights reserved.</p>
        </div>
      </footer>
    </>
  );
}
