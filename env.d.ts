/// <reference types="vite/client" />


interface ImportMetaEnv {
  readonly VITE_API_URL: string;
  readonly VITE_NJ_SITE_URL: string;
  readonly VITE_TX_SITE_URL: string;  
  readonly VITE_INVOICEGENERATOR_URL: string;
  readonly VITE_INVOICEGENERATOR_URL_TEXAS: string;
  readonly VITE_IMAGE_REPOSITORY_URL: string;
  readonly VITE_REPAIRFORM_URL: string;

  readonly VITE_INVOICE_TRACKING_URL_FORMAT_AIRBORN: string;
  readonly VITE_INVOICE_TRACKING_URL_FORMAT_UPS: string;  
  readonly VITE_INVOICE_TRACKING_URL_FORMAT_FEDEX: string;
  
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}