'use client';
import React from 'react';
import { Collapse, Input, Button } from 'antd';
import { Product } from "@/types/Product";

const { Panel } = Collapse;

interface ExpandedDescription {
  heading: string;
  content: string;
}

interface ExpandableDescriptionsPageProps {
  expandedDescriptions: ExpandedDescription[];
  onDescriptionChange: (index: number, value: string) => void;
  onBack: () => void; // Function to go back to ProductWrapper
}

const ExpandableDescriptionsPage: React.FC<ExpandableDescriptionsPageProps> = ({
  expandedDescriptions,
  onDescriptionChange,
  onBack,
}) => {
  return (
    <div className="container mx-auto">
      <Button onClick={onBack} style={{ marginBottom: 20 }}>
        Back
      </Button>
      <Collapse>
        {expandedDescriptions.map((section, index) => (
          <Panel header={section.heading} key={index}>
            <Input.TextArea
              value={section.content}
              onChange={(e) => onDescriptionChange(index, e.target.value)}
              rows={4} // Adjust as needed
            />
          </Panel>
        ))}
      </Collapse>
    </div>
  );
};

export default ExpandableDescriptionsPage;
