import { getAllDocsFromCollection } from '@/services/FirestoreData/getFirestoreData';
import React, { useEffect, useState } from 'react';
import { AttributeType, ValueType } from '@/types/AttributeType/AttirbuteType';
import { Collapse, Checkbox, Button } from 'antd';
import ProductDetailTab from '../ProductDetailTab/page';

type Props = {
  initialData?: any;
  setFormData: React.Dispatch<React.SetStateAction<any>>;
  formData: any;
  setLoading: React.Dispatch<React.SetStateAction<boolean>>;
  loading: boolean;
  handleSubmit: () => void;
};

const { Panel } = Collapse;

const VariableProductType: React.FC<Props> = ({
  initialData,
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
    const loadAttributes = async () => {
      try {
        setLoading(true);

        // 1. Fetch all attributes
        const attributes = await getAllDocsFromCollection<AttributeType>('attributes');

        // 2. Fetch all values for each attribute
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

        // 3. Generate all possible combinations
        const generatedCombinations = generateCombinations(attributesWithValues);
        setCombinations(generatedCombinations);
      } catch (error) {
        console.error('Error loading attributes and values:', error);
      } finally {
        setLoading(false);
      }
    };

    loadAttributes();
    // eslint-disable-next-line
  }, []);

  const generateCombinations = (attributes: AttributeType[]): Record<string, string>[] => {
    if (attributes.length === 0) return [];

    const cartesian = (arrays: ValueType[][]): ValueType[][] => {
      return arrays.reduce<ValueType[][]>(
        (acc, curr) => acc.flatMap((a) => curr.map((b) => [...a, b])),
        [[]]
      );
    };

    const allValues = attributes.map((attr) => attr.values || []);

    const product = cartesian(allValues);

    const formatted = product.map((combination) => {
      const combo: Record<string, string> = {};
      combination.forEach((value, idx) => {
        combo[attributes[idx].name] = value.value;
      });
      return combo;
    });

    return formatted;
  };

  // Handle checkbox selection
  const handleCheckboxChange = (idx: number, checked: boolean) => {
    setSelectedIndexes((prev) =>
      checked ? [...prev, idx] : prev.filter((i) => i !== idx)
    );
  };

  return (
    <div className="p-4">
      <h2 className="text-xl font-semibold mb-4">Variable Product Configuration</h2>

      {/* Step 1: Show all combinations with checkboxes */}
      <div className="mb-6">
        <h3 className="text-lg font-semibold mb-2">
          1. Select Variations ({combinations.length} combinations found)
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
                      {combo[attr.name]}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Step 2: Show collapses for selected combinations */}
      {selectedIndexes.length > 0 && (
        <div className="mb-6">
          <h3 className="text-lg font-semibold mb-2">
            2. Enter Details for Selected Variations
          </h3>
          <Collapse>
            {selectedIndexes.map((idx) => (
              <Panel
                header={attributeData.map(attr => `${attr.name}: ${combinations[idx][attr.name]}`).join(', ')}
                key={idx}
              >
                <ProductDetailTab
                  formData={{
                    ...combinations[idx],
                    ...(formData.variations?.[idx] || {}),
                    description: Array.isArray(formData.variations?.[idx]?.description)
                      ? formData.variations[idx].description
                      : [],
                  }}
                  onFormDataChange={(key, value) => {
                    const updated = [...(formData.variations || [])];
                    updated[idx] = { ...updated[idx], ...combinations[idx], [key]: value };
                    setFormData((prev: any) => ({ ...prev, variations: updated }));
                  }}
                />
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