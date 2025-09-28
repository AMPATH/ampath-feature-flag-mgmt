import { AppFormDialogTypes } from "../shared/types/app.types";

interface OperatorTypes {
    id: number;
    name: string;
    description: string;
    dateCreated: string;
}

type OperatorDefaultTypes = OperatorTypes & AppFormDialogTypes;

const OperatorDefaultValues: OperatorDefaultTypes = {
    id: 0,
    name: "",
    description: "",
    dateCreated: "",
    isUpdate: false,
    title: "New operator",
    btnText: "Save"
}

export type { OperatorTypes, OperatorDefaultTypes }

export { OperatorDefaultValues }