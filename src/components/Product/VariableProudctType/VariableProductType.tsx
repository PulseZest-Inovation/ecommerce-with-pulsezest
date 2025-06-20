import { getAllDocsFromCollection } from '@/services/FirestoreData/getFirestoreData';
import React, { useEffect, useState } from 'react';
import { AttributeType, ValueType } from '@/types/AttributeType/AttirbuteType';
import { Collapse, Checkbox, Button, Tabs } from 'antd';
import ProdutOtherTab from '../ProductOtherTab/page';
import ProductGalleryImage from '../ProductGalleryTab/ProductGallery';
import VariableProductDetailTab from '../VariableProductDetailTab/page';
import ParticularVariationDetailTab from '../VariableProductDetailTab/ParticularVariationDetailTab';
const { Panel } = Collapse;
const { TabPane } = Tabs;

type Props = {
  initialData?: any;
  setFormData: React.Dispatch<React.SetStateAction<any>>;
  formData: any;
  setLoading: React.Dispatch<React.SetStateAction<boolean>>;
  loading: boolean;
  handleSubmit: () => void;
};

const VariableProductType: React.FC<Props> = ({
  setFormData,
  formData,
  setLoading,
  loading,
  handleSubmit,
}) => {
  const [attributeData, setAttributeData] = useState<AttributeType[]>([]);
  const [combinations, setCombinations] = useState<Record<string, string>[]>([]);
  const [selectedIndexes, setSelectedIndexes] = useState<number[]>([]);

  useEffect(() => {
    // console.log(`formData from VariableProductType`, formData);
    const loadAttributes = async () => {
      try {
        setLoading(true);

        const attributes = await getAllDocsFromCollection<AttributeType>('attributes');

        const attributesWithValues = await Promise.all(
          attributes.map(async (attribute) => {
            const valuesPath = `attributes/${attribute.id}/values`;
            const values = await getAllDocsFromCollection<ValueType>(valuesPath);

            return {
              ...attribute,
              values,
            };
          })
        );

        setAttributeData(attributesWithValues);

        const generatedCombinations = generateCombinations(attributesWithValues);
        setCombinations(generatedCombinations);
      } catch (error) {
        console.error('Error loading attributes and values:', error);
      } finally {
        setLoading(false);
      }
    };

    loadAttributes();
  }, []);

  const generateCombinations = (attributes: AttributeType[]): Record<string, string>[] => {
    if (attributes.length === 0) return [];

    const cartesian = (arrays: ValueType[][]): ValueType[][] =>
      arrays.reduce<ValueType[][]>(
        (acc, curr) => acc.flatMap((a) => curr.map((b) => [...a, b])),
        [[]]
      );

    const allValues = attributes.map((attr) => attr.values || []);
    const product = cartesian(allValues);

    const formatted = product.map((combination) => {
      const combo: Record<string, string> = {};
      combination.forEach((value, idx) => {
        combo[String(attributes[idx].name)] = value.value;
      });
      return combo;
    });

    return formatted;
  };

  const handleCheckboxChange = (idx: number, checked: boolean) => {
    setSelectedIndexes((prev) =>
      checked ? [...prev, idx] : prev.filter((i) => i !== idx)
    );
  };

  const handleVariationChange = (idx: number, key: any, value: any) => {
    const updated = [...(formData.variations || [])];
    updated[idx] = { ...updated[idx], ...combinations[idx], [key]: value };
    setFormData((prev: any) => ({ ...prev, variations: updated }));
  };

  return (
    <div className="p-4">
      <h2 className="text-xl font-semibold mb-4">Variable Product Configuration</h2>
      <VariableProductDetailTab 
      formData={formData} 
          onFormDataChange={(key, value) => setFormData((prev: any) => ({ ...prev, [key]: value }))}
      />
      <div className="mb-6">
        <h3 className="text-lg font-semibold mb-2">
          {combinations.length} Variations combinations found
        </h3>
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm border">
            <thead>
              <tr>
                <th className="border px-2 py-1">Select</th>
                {attributeData.map(attr => (
                  <th key={attr.id} className="border px-2 py-1">{attr.name}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {combinations.map((combo, idx) => (
                <tr key={idx}>
                  <td className="border px-2 py-1 text-center">
                    <Checkbox
                      checked={selectedIndexes.includes(idx)}
                      onChange={e => handleCheckboxChange(idx, e.target.checked)}
                    />
                  </td>
                  {attributeData.map(attr => (
                    <td key={attr.id} className="border px-2 py-1">
                      {combo[String(attr.name)]}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {selectedIndexes.length > 0 && (
        <div className="mb-6">
          <h3 className="text-lg font-semibold mb-2">
            Enter Details for Selected Variations
          </h3>
          <Collapse>
            {selectedIndexes.map((idx) => (
              <Panel
                header={attributeData.map(attr => `${attr.name}: ${combinations[idx][String(attr.name)]}`).join(', ')}
                key={idx}
              >
                <Tabs defaultActiveKey="details">
                  <TabPane tab="Details" key="details">
                    <ParticularVariationDetailTab
                      formData={{
                        ...combinations[idx],
                        ...(formData.variations?.[idx] || {}),
                          description: Array.isArray(formData.variations?.[idx]?.description)
                        ? formData.variations[idx].description
                        : [
                            { heading: "Details", content: "" },
                            { heading: "Description", content: "" },
                            { heading: "Shipping", content: "" },
                            { heading: "Return & Exchange", content: "" },
                            { heading: "Manufacturing Information", content: "" },
                            { heading: "Support", content: "" },
                          ],
                      }}
                      onFormDataChange={(key, value) => handleVariationChange(idx, key, value)}
                    />
                  </TabPane>

                  <TabPane tab="Other Details" key="other-details">
                    <ProdutOtherTab
                      formData={formData.variations?.[idx] || {}}
                      onFormDataChange={( key, value) => handleVariationChange(idx, key, value)}
                    />
                  </TabPane>

                  <TabPane tab="Product Gallery" key="images">
                    <ProductGalleryImage
                      galleryImages={formData.variations?.[idx]?.images || []}
                      onGalleryChange={(newGalleryImages) => {
                        handleVariationChange(idx, "images", newGalleryImages);
                      }}
                      slug={"product-slug"}
                    />
                  </TabPane>
                </Tabs>
              </Panel>
            ))}
          </Collapse>
        </div>
      )}

      <div className="mt-6">
        <Button
          type="primary"
          onClick={handleSubmit}
          disabled={loading || selectedIndexes.length === 0}
        >
          Save Variations
        </Button>
      </div>
    </div>
  );
};

export default VariableProductType;