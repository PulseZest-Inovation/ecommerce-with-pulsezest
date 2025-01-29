export interface EmailType {
    emailType: "custom" | "google";
    smtpServer?: string;
    port?: string;
    customEmail?: string;
    password?: string;
    googleEmail?: string;
    appPassword?: string;
    isEnabled?: boolean;
    emailList?: string[];
    OrderCancelled? : string;
    OrderConfirmed? : string;
    OrderPending? : string;
    OrderPlaced? : string;
    OrderProcessing? : string;
  }
  