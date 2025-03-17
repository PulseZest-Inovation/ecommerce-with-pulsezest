import { setDocWithCustomId } from "@/services/FirestoreData/postFirestoreData";
import { getAllDocsFromCollection } from "@/services/FirestoreData/getFirestoreData";
import { message } from "antd";
import { AppDataType } from "@/types/AppData";
import { Product } from "@/types/Product";
import { getAppData } from "@/services/getApp";
import { useRouter } from "next/navigation"; // Corrected import
import { generateSlug } from "./ProductForm";
import { FormatIndentDecreaseSharp } from "@mui/icons-material";

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
  formData: Product,
  setLoading: React.Dispatch<React.SetStateAction<boolean>>,
  router: ReturnType<typeof useRouter> // Corrected type
): Promise<void> => {
  if (!formData.productTitle) {
    message.error("Product Title is required!");
    return;
  }

  console.log(formData);

  setLoading(true);
  try {
    const slug = generateSlug(formData.productTitle);
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
