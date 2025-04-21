import { getAllDocsFromCollection } from "@/services/FirestoreData/getFirestoreData";
import { getDataByDocName } from "@/services/FirestoreData/getFirestoreData";
// Attribute Interface
export interface Attribute {
  id: string;
  name: string;
  values: string[];
}

// ✅ Function to Fetch Attributes and Their Values
export const fetchProductAttributes = async (): Promise<Attribute[]> => {
  try {
    const attributes = await getAllDocsFromCollection<Attribute>("attributes");

    // Fetch values for each attribute using getDataByDocName
    const attributesWithValues = await Promise.all(
      attributes.map(async (attr) => {
        const attributeData = await getDataByDocName<{ values: string[] }>(
          "attributes",
          attr.id
        );
        
        return {
          ...attr,
          values: attributeData?.values || [],
        };
      })
    );

    return attributesWithValues;
  } catch (error) {
    console.error("Error fetching attributes:", error);
    return [];
  }
};