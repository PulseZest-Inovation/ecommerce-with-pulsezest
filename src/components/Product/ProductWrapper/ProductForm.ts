import { ProductType } from "@/types/ProductType";

export const handleInputChange = (
  key: keyof ProductType,
  value: any,
  formData: ProductType,
  setFormData: React.Dispatch<React.SetStateAction<ProductType>>
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
