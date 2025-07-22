interface Window {
  gtag: (
    command: "config" | "event" | "js",
    targetId: string | Date,
    params?: { [key: string]: string | number | boolean | undefined }
  ) => void;
  dataLayer: unknown[];
}
