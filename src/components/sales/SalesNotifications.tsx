import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";

const names = [
  "Maria", "Ana", "Juliana", "Camila", "Fernanda", "Patrícia", "Luciana",
  "Bruna", "Carolina", "Beatriz", "Rafaela", "Larissa", "Gabriela",
  "Tatiana", "Renata", "Amanda", "Daniela", "Vanessa", "Priscila", "Natália",
];

const cities = [
  "São Paulo", "Rio de Janeiro", "Belo Horizonte", "Curitiba", "Porto Alegre",
  "Salvador", "Brasília", "Fortaleza", "Recife", "Goiânia", "Campinas",
  "Florianópolis", "Manaus", "Vitória", "Belém", "Natal", "João Pessoa",
];

const plans = ["Mensal", "Semestral", "Anual"];
const times = ["agora", "há 2 min", "há 5 min", "há 8 min", "há 12 min", "há 15 min"];

function getRandomItem<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

export default function SalesNotifications() {
  const [notification, setNotification] = useState<{
    name: string;
    city: string;
    plan: string;
    time: string;
    id: number;
  } | null>(null);

  const showNotification = useCallback(() => {
    setNotification({
      name: getRandomItem(names),
      city: getRandomItem(cities),
      plan: getRandomItem(plans),
      time: getRandomItem(times),
      id: Date.now(),
    });

    // Hide after 4 seconds
    setTimeout(() => setNotification(null), 4000);
  }, []);

  useEffect(() => {
    // First notification after 8 seconds
    const initial = setTimeout(showNotification, 8000);

    // Then every 15-25 seconds
    const interval = setInterval(() => {
      showNotification();
    }, 15000 + Math.random() * 10000);

    return () => {
      clearTimeout(initial);
      clearInterval(interval);
    };
  }, [showNotification]);

  return (
    <div className="fixed bottom-4 left-4 z-50 max-w-xs">
      <AnimatePresence>
        {notification && (
          <motion.div
            key={notification.id}
            initial={{ opacity: 0, y: 40, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ duration: 0.4, ease: "easeOut" }}
            className="bg-background rounded-xl shadow-2xl border border-primary/20 p-3 flex items-start gap-3"
          >
            <div className="flex-shrink-0 w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-lg">
              🎉
            </div>
            <div className="min-w-0">
              <p className="text-sm font-semibold text-foreground leading-tight">
                {notification.name} de {notification.city}
              </p>
              <p className="text-xs text-muted-foreground mt-0.5">
                Assinou o plano <span className="font-bold text-primary">{notification.plan}</span> · {notification.time}
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
