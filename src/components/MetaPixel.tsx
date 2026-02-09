// Meta Pixel is now loaded inline in index.html <head> for priority tracking.
// This component is kept for the trackMetaEvent helper and backward compatibility.

declare global {
  interface Window {
    fbq: any;
    _fbq: any;
  }
}

export function MetaPixel() {
  // Pixel script is in index.html — nothing to render here.
  return null;
}

// Helper to track events from anywhere
export function trackMetaEvent(eventName: string, params?: Record<string, any>) {
  if (window.fbq) {
    window.fbq("track", eventName, params);
  }
}
