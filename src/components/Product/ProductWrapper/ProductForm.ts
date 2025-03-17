import { Product } from "@/types/Product";

export const handleInputChange = (
  key: keyof Product,
  value: any,
  formData: Product,
  setFormData: React.Dispatch<React.SetStateAction<Product>>
) => {
  if (key === "productTitle" && !formData.id) {
    const slug = generateSlug(value);
    setFormData((prev) => ({ ...prev, [key]: value, slug }));
  } else {
    setFormData((prev) => ({ ...prev, [key]: value }));
  }
};

export const generateSlug = (name: string): string =>
  name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");
