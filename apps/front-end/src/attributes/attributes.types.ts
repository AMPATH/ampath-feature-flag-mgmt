import { AppFormDialogTypes } from "../shared/types/app.types";

interface AttributeTypes {
    id: number;
    name: string;
    description: string;
    dateCreated: string;
}

type AttributeDefaultTypes = AttributeTypes & AppFormDialogTypes;

const AttributeDefaultValues: AttributeDefaultTypes = {
    id: 0,
    name: "",
    description: "",
    dateCreated: "",
    isUpdate: false,
    title: "New attribute",
    btnText: "Save"
}

export type { AttributeTypes, AttributeDefaultTypes }

export { AttributeDefaultValues }