import { setDocWithCustomId } from "@/services/FirestoreData/postFirestoreData";
import { message } from "antd";
import { AppDataType } from "@/types/AppData";
import { ProductType } from "@/types/ProductType";
import { getAppData } from "@/services/getApp";
import { useRouter } from "next/navigation";  
import { generateSlug } from "./ProductForm";

export const fetchApplicationData = async (
  setAppData: React.Dispatch<React.SetStateAction<AppDataType | null>>
): Promise<void> => {
  try {
    const data = await getAppData<AppDataType>();
    setAppData(data);
  } catch (error) {
    console.log(error);
  }
};

export const handleSubmit = async (
  formData: ProductType,
  setLoading: React.Dispatch<React.SetStateAction<boolean>>,
  router: ReturnType<typeof useRouter>
): Promise<void> => {
  console.log(formData);
  if (!formData.productTitle) {
    message.error("Product Title is required!");
    return;
  }

  setLoading(true);
  try {
    const slug = formData.slug && formData.slug.trim() !== ""
      ? formData.slug
      : generateSlug(formData.productTitle);

    formData.slug = slug;
    formData.id = slug;

    await setDocWithCustomId("products", slug, formData);
    message.success("Product Saved Successfully!");
    router.push("/dashboard/manage-product/view-all-product");
  } catch (error) {
    message.error("Error saving product.");
  } finally {
    setLoading(false);
  }
};


export const handleVariableProductSave = async (
  formData: ProductType,
  selectedIndexes: number[],
  combinations: Record<string, string>[],
  setLoading: React.Dispatch<React.SetStateAction<boolean>>,
  router: ReturnType<typeof useRouter>
): Promise<void> => {
  if (!formData.productTitle) {
    message.error("Product Title is required!");
    return;
  }

  setLoading(true);
  try {
    const slug = formData.slug && formData.slug.trim() !== ""
      ? formData.slug
      : generateSlug(formData.productTitle);

    const attributes = selectedIndexes.map(idx => combinations[idx]);
    const variableProductData = {
      ...formData,
      ...(formData.variations?.[0] || {}),
      slug,
      id: slug,
      attributes,
    };


    await setDocWithCustomId("products", slug, variableProductData);
    message.success("Variable Product Saved Successfully!");
    router.push("/dashboard/manage-product/view-all-product");
  } catch (error) {
    message.error("Error saving variable product.");
  } finally {
    setLoading(false);
  }
};