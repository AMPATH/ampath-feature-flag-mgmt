import { AppFormDialogTypes, AttributeType } from '../shared/types/app.types';

interface AttributeTypes {
  id: number;
  name: string;
  type: AttributeType;
  description: string;
  dateCreated: string;
}

type AttributeDefaultTypes = AttributeTypes & AppFormDialogTypes;

const AttributeDefaultValues: AttributeDefaultTypes = {
  id: 0,
  name: '',
  type: AttributeType.SYSTEM,
  description: '',
  dateCreated: '',
  isUpdate: false,
  title: 'New attribute',
  btnText: 'Save',
};

export type { AttributeTypes, AttributeDefaultTypes };

export { AttributeDefaultValues };
