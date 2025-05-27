import { getAllDocsFromCollection } from '@/services/FirestoreData/getFirestoreData';
import React, { useEffect, useState } from 'react';
import { AttributeType, ValueType } from '@/types/AttributeType/AttirbuteType';

type Props = {
  initialData?: any;
  setFormData: React.Dispatch<React.SetStateAction<any>>;
  formData: any;
  setLoading: React.Dispatch<React.SetStateAction<boolean>>;
  loading: boolean;
  handleSubmit: () => void;
};

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

  return (
    <div className="p-4">
      <h2 className="text-xl font-semibold mb-4">Variable Product Configuration</h2>

      <div className="mb-6">
        <h3 className="text-lg font-semibold mb-2">Fetched Attributes:</h3>
        <div className="bg-gray-100 p-3 rounded text-sm overflow-x-auto">
          <pre>{JSON.stringify(attributeData, null, 2)}</pre>
        </div>
      </div>

      <div className="mb-6">
        <h3 className="text-lg font-semibold mb-2">Generated Variations:</h3>
        <div className="bg-gray-100 p-3 rounded text-sm overflow-x-auto">
          <pre>{JSON.stringify(combinations, null, 2)}</pre>
        </div>
      </div>

      {/* Future: Map over combinations to allow setting price, stock, SKU, etc */}
    </div>
  );
};

export default VariableProductType;
