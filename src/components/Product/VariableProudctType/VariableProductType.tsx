import { getAllDocsFromCollection } from '@/services/FirestoreData/getFirestoreData';
import React, { useEffect, useState } from 'react';
import { AttributeType, ValueType } from '@/types/AttributeType/AttirbuteType';
import { Collapse, Checkbox, Button } from 'antd';
// import ProductDetailTab from '../ProductDetailTab/page';
import VariationDetailForm from './VariationDetailsTab';

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
  // const [combinations, setCombinations] = useState<Record<string, string>[]>([]);
  const [selectedIndexes, setSelectedIndexes] = useState<number[]>([]);
  const [activePanels, setActivePanels] = useState<string[]>([]); // controlled collapse
  const [isManual, setIsManual] = useState(false);

  // load attribute
  useEffect(() => {
    const loadAttributes = async () => {
      try {
        setLoading(true);
      //1. Fetch all attributes
        const attributes = await getAllDocsFromCollection<AttributeType>('attributes');
      //2. Fetch all values for each attributes
        const attributesWithValues = await Promise.all(
          attributes.map(async (attribute) => {
            const valuesPath = `attributes/${attribute.id}/values`;
            const values = await getAllDocsFromCollection<ValueType>(valuesPath);

            return {
              ...attribute,
              values : values || [],
            };
          })
        );

        setAttributeData(attributesWithValues);
 
        //3. Generate all possible combinations
        // const generatedCombinations = generateCombinations(attributesWithValues);
        // setCombinations(generatedCombinations);
      } catch (error) {
        console.error('Error loading attributes and values:', error);
      } finally {
        setLoading(false);
      }
    };

    loadAttributes();
    // eslint-disable-next-line
  }, [setLoading]);

  useEffect(() => {
  if (initialData?.variation && initialData.variation.length > 0) {
    // Load the variation data into form state
    setFormData((prev: any) => ({
      ...prev,
      variation: initialData.variation,
    }));

    // Preselect and expand those variations
    const indexes = initialData.variation.map((_: any, idx: number) => idx);
    setSelectedIndexes(indexes);
    setActivePanels(indexes.map(String));
  }
}, [initialData]);

useEffect(() => {
  if (!isManual && selectedIndexes.length > 0) {
    setFormData((prev: any) => {
      const updated = [...(prev.variation || [])];

      selectedIndexes.forEach((idx) => {
        if (!updated[idx]) {
          updated[idx] = attributeData.reduce((acc, attr) => {
            acc[attr.id] = attr.values?.[idx]?.value || "";
            return acc;
          }, {} as Record<string, string>);
        }
      });

      return { ...prev, variation: updated };
    });
  }
}, [selectedIndexes, attributeData, isManual, setFormData]);


  //  When user clicks "Add Manually"
const handleAddVariation = () => {
  const newIndex = (formData.variation?.length || 0);

  const newVariation = {
    // id: Date.now(),
    color: '',
    size: '',
    weight: '',
    price: '',
    stock: '',
  };

  setFormData((prev: any) => ({
    ...prev,
    variation: [...(prev.variation || []), newVariation],
  }));
  setIsManual(true);
  //  and open the new panel
 setActivePanels((prev) => [...prev, newIndex.toString()]);
  setSelectedIndexes([]);
};


  // const generateCombinations = (attributes: AttributeType[]): Record<string, string>[] => {
  //   if (!attributes ||attributes.length === 0) return [];

  //   const cartesian = (arrays: ValueType[][]): ValueType[][] => {
  //     return arrays.reduce<ValueType[][]>(
  //       (acc, curr) => acc.flatMap((a) => curr.map((b) => [...a, b])),
  //       [[]]
  //     );
  //   };

  //   const allValues = attributes.map((attr) => attr.values || []);

  //   const product = cartesian(allValues);

  //   const formatted = product.map((combination) => {
  //     const combo: Record<string, string> = {};
  //     combination.forEach((value, idx) => {
  //       combo[attributes[idx].name] = value.value;
  //     });
  //     return combo;
  //   });

  //   return formatted;
  // };


  // Handle checkbox selection
  const handleCheckboxChange = (idx: number, checked: boolean) => {
    setSelectedIndexes((prev) =>
      checked ? [...prev, idx] : prev.filter((i) => i !== idx)
    );

    // setFormData((prev: any) => {
    //   const updated = [...(prev.variation || [])];
    //   if (checked) {
    //     updated[idx] = { ...updated[idx], ...combinations[idx], price: updated[idx]?.price || '' };
    //   } else {
    //     updated[idx] = null;
    //   }
    //   return { ...prev, variation: updated.filter(Boolean) };
    // });

    // update collapse active panels
    setActivePanels((prev) =>
      checked
        ? [...prev, idx.toString()]
        : prev.filter((key) => key !== idx.toString())
    );
  };

  return (
    <div className="p-4">
      
      <h2 className="text-xl font-semibold mb-4">Variable Product Configuration</h2>
      {/* Toolbar */}
      <div className="flex gap-2 mb-4">
        <Button className='bg-blue-500 rounded text-white' onClick={handleAddVariation}>Add Manually</Button>
      </div>

      {/* Step 1: Show all combinations with checkboxes */}
      <div className="mb-6">
        <h3 className="text-lg font-semibold mb-2 bg-gradient-to-r from-blue-100 via-purple-100 to-pink-100 p-4 rounded-lg shadow-lg">
          1. Select Variations ( <span className='text-blue-600'>{attributeData.length}</span> combinations found)
        </h3>
        <div className="overflow-x-auto mt-5"> 
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
            {attributeData.length === 0 ? (
            <tr>
              <td colSpan={attributeData.length + 1} className="text-center py-2">
                Loading...
              </td>
            </tr>
            ) : (
            (() => {
            // Determine maximum number of rows based on attributes' values
            const maxRows = Math.max(...attributeData.map((attr) => attr.values?.length || 0));
              return Array.from({ length: maxRows }).map((_, idx) => (
            <tr key={idx}>
              {/* First column with checkbox */}
              <td className="border px-2 py-1 text-center">
                <Checkbox
                checked={selectedIndexes.includes(idx)}
                onChange={(e) => handleCheckboxChange(idx, e.target.checked)}
                />
              </td>

              {/* ✅ Render attribute values */}
              {attributeData.map((attr) => {
                const valueObj = attr.values?.[idx];
                return (
                  <td key={attr.id + idx} className="border px-2 py-1 text-center">
                    {valueObj ? valueObj.value : ""}
                  </td>
                );
              })}
            </tr>
              ));
              })()
            )}
            </tbody>
          </table>
        </div>
    </div>
      {/* Step 2: Show collapses for selected combinations */}
{(selectedIndexes.length > 0 || isManual) && (
  <div className="mb-6">
    <h3 className="text-lg font-semibold mb-2 bg-gradient-to-r from-blue-100 via-purple-100 to-pink-100 p-4 rounded-lg shadow-lg">
      2. Enter Details for {isManual ? "Manual" : "Selected"} Variations
    </h3>

    <Collapse
      activeKey={activePanels}
      onChange={(keys) => setActivePanels(keys as string[])}
    >
      {/*  If manual mode is ON — show all variations */}
      {isManual
        ? (formData.variation || []).map((variation: any, idx: number) => (
            <Panel
              key={idx.toString()}
              header={`Manual Variation ${idx + 1}${
                variation.color ? ` - ${variation.color}` : ""
              }${variation.size ? ` / ${variation.size}` : ""}`}
            >
              <VariationDetailForm
                formData={formData.variation?.[idx] || {}}
                onFormDataChange={(key, value) => {
                  setFormData((prev: any) => {
                    const updated = [...(prev.variation || [])];
                    updated[idx] = { ...(updated[idx] || {}), [key]: value };
                    return { ...prev, variation: updated };
                  });
                }}
                isManual={isManual}
                attributeData={attributeData}
              />
            </Panel>
          ))
        : /* Otherwise show forms only for selected (auto) variations */
          selectedIndexes.map((idx) => (
            <Panel
              key={idx.toString()}
              header={attributeData
                .map((attr) => {
                  const valueObj = attr.values?.[idx];
                  return `${attr.name}: ${valueObj ? valueObj.value : ""}`;
                })
                .join(", ")}
            >
              <VariationDetailForm
                formData={{
                  ...(formData.variation?.[idx] || {}),
                  ...attributeData.reduce((acc, attr) => {
                    acc[attr.id] = attr.values?.[idx]?.value || "";
                    return acc;
                  }, {} as Record<string, string>),
                }}
                onFormDataChange={(key, value) => {
                  setFormData((prev: any) => {
                    const updated = [...(prev.variation || [])];
                    updated[idx] = {
                      ...(updated[idx] || {}),
                      [key]: value,
                    };
                    return { ...prev, variation: updated };
                  });
                }}
                isManual={isManual}
                attributeData={attributeData}
              />
            </Panel>
          ))}
    </Collapse>
  </div>
)}
      {/* {selectedIndexes.length > 0 && (
        <div className="mb-6">
          <h3 className="text-lg font-semibold mb-2">
            2. Enter Details for Selected Variations
          </h3>
          <Collapse
            activeKey={activePanels}
            onChange={(keys) => setActivePanels(keys as string[])}
          >
            {selectedIndexes.map((idx) => (
              <Panel
                header={attributeData.map((attr) => `${attr.name}: ${combinations[idx][attr.id]}`).join(', ')}
                key={idx.toString()}
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
                    setFormData((prev: any) => {
                      const updated = [...(prev.variations || [])];
                      const existingIndex = updated.findIndex((v) =>
                        Object.keys(combinations[idx]).every(
                          (key) => v[key] === combinations[idx][key]
                        )
                      );
                      if (existingIndex >= 0) {
                        updated[existingIndex] = { ...updated[existingIndex], [key]: value };
                      } else {
                        updated.push({ ...combinations[idx], [key]: value });
                      }
                      return { ...prev, variations: updated };
                    });
                  }}
                />
              </Panel>
            ))}
          </Collapse>
        </div>
      )} */}

      <div className="mt-6">
        <Button
          type="primary"
          onClick={handleSubmit}
          disabled={loading || (!isManual && selectedIndexes.length === 0)}
        >
          Save Variations
        </Button>
      </div>
    </div>
  );
};

export default VariableProductType;
