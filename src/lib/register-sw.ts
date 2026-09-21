const isPreviewHost = (hostname: string) =>
  hostname.startsWith("id-preview--") ||
  hostname.startsWith("preview--") ||
  hostname === "lovableproject.com" ||
  hostname.endsWith(".lovableproject.com") ||
  hostname === "lovableproject-dev.com" ||
  hostname.endsWith(".lovableproject-dev.com") ||
  hostname === "beta.lovable.dev" ||
  hostname.endsWith(".beta.lovable.dev");

const unregisterAppWorkers = async () => {
  if (!("serviceWorker" in navigator)) return;
  const registrations = await navigator.serviceWorker.getRegistrations();
  await Promise.all(
    registrations
      .filter((registration) => new URL(registration.scope).pathname.includes("/sw"))
      .map((registration) => registration.unregister()),
  );
};

export async function registerAppServiceWorker() {
  if (!("serviceWorker" in navigator)) return;

  const disabled = new URLSearchParams(window.location.search).get("sw") === "off";
  const embedded = window.self !== window.top;
  const blocked = !import.meta.env.PROD || embedded || isPreviewHost(window.location.hostname) || disabled;

  if (blocked) {
    await unregisterAppWorkers();
    return;
  }

  const { registerSW } = await import("virtual:pwa-register");
  registerSW({ immediate: true });
}