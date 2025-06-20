export interface ValueType {
  id: string;
  value: string;
  [key: string]: any;
}

export interface AttributeType {
  id: string;
  name: string;
  slug: string;
  createdAt: Date;
  values: ValueType[];  
}
