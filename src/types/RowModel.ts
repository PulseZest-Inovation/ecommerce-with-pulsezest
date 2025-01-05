export interface RowModel {
    id: string; // Unique identifier for the row
    name: string; // Name of the file
    description: string; // Description of the file
    type: string; // File type (e.g., pdf, docx, jpg)
    size: number; // File size in bytes
    createdBy: string; // User who created the file
    createdAt: string; // Creation timestamp in ISO 8601 format
    updatedAt: string; // Last updated timestamp in ISO 8601 format
    state: 'uploaded' | 'pending' | 'error'; // State of the file
  }
  