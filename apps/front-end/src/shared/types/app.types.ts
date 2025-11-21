interface AppFormDialogTypes {
  isUpdate: boolean;
  title: string;
  btnText: string;
}

export interface Location {
  uuid: string;
  display: string;
  name: string;
  description: string;
}

export interface LocationResponseLink {
  rel: string;
  uri: string;
  resourceAlias: string;
}

export interface AmrsLocationResponse {
  results: Location[];
}

export enum AttributeType {
  LOCATION = 'location',
  USER = 'user',
  SYSTEM = 'system',
}

export type { AppFormDialogTypes };
