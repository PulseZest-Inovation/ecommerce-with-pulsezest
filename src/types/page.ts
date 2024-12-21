import { Timestamp } from "firebase/firestore"; // Firebase Timestamp import

export interface Page {
  title: string;
  slug: string;
  content: string; // Could also be an HTML string
  createdAt: Timestamp;
  updatedAt: Timestamp;
  metaTitle: string; // SEO title
  metaDescription: string; // SEO description
  metaTags: string[]; // Keywords for SEO
  status: "published" | "draft" | "archived"; // Page status
  author: string; // Author/creator of the page
  featuredImage: string | null; // URL of the image, null if no image
  isVisible: boolean; // Whether the page is visible on the website
  category: string | null; // Category like 'Legal', 'Policies', etc.
  url: string; // Full URL of the page
}
