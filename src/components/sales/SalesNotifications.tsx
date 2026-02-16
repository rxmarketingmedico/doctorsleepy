import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";

const names = [
  "Sarah", "Emma", "Jessica", "Camila", "Rachel", "Patricia", "Lauren",
  "Amanda", "Caroline", "Beatrice", "Rebecca", "Lisa", "Gabriella",
  "Tanya", "Renee", "Michelle", "Daniela", "Vanessa", "Priscilla", "Natalie",
];

const cities = [
  "New York", "Los Angeles", "Chicago", "Houston", "Miami",
  "San Francisco", "Boston", "Denver", "Seattle", "Austin", "Dallas",
  "Portland", "Atlanta", "Phoenix", "San Diego", "Nashville", "Charlotte",
];

const plans = ["Monthly", "Semi-Annual", "Annual"];
const times = ["just now", "2 min ago", "5 min ago", "8 min ago", "12 min ago", "15 min ago"];

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

    setTimeout(() => setNotification(null), 4000);
  }, []);

  useEffect(() => {
    const initial = setTimeout(showNotification, 8000);
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
                {notification.name} from {notification.city}
              </p>
              <p className="text-xs text-muted-foreground mt-0.5">
                Subscribed to <span className="font-bold text-primary">{notification.plan}</span> · {notification.time}
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
