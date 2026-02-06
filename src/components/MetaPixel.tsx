import { useEffect } from "react";

const META_PIXEL_ID = "899427785776606";

declare global {
  interface Window {
    fbq: any;
    _fbq: any;
  }
}

export function MetaPixel() {
  useEffect(() => {
    // Avoid double-init
    if (window.fbq) return;

    const f = window;
    const b = document;
    const n = "script";

    if (f.fbq) return;
    const q: any = (f.fbq = function (...args: any[]) {
      q.callMethod ? q.callMethod.apply(q, args) : q.queue.push(args);
    });
    if (!f._fbq) f._fbq = q;
    q.push = q;
    q.loaded = true;
    q.version = "2.0";
    q.queue = [];

    const s = b.createElement(n);
    s.async = true;
    s.src = "https://connect.facebook.net/en_US/fbevents.js";
    const fjs = b.getElementsByTagName(n)[0];
    fjs?.parentNode?.insertBefore(s, fjs);

    window.fbq("init", META_PIXEL_ID);
    window.fbq("track", "PageView");
  }, []);

  return (
    <noscript>
      <img
        height="1"
        width="1"
        style={{ display: "none" }}
        src={`https://www.facebook.com/tr?id=${META_PIXEL_ID}&ev=PageView&noscript=1`}
        alt=""
      />
    </noscript>
  );
}

// Helper to track events from anywhere
export function trackMetaEvent(eventName: string, params?: Record<string, any>) {
  if (window.fbq) {
    window.fbq("track", eventName, params);
  }
}
