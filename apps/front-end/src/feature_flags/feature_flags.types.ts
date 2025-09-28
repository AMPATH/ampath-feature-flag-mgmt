import { AppFormDialogTypes } from "../shared/types/app.types";

interface FeatureFlagTypes {
    id: number;
    name: string;
    description: string;
    status: boolean;
    createdBy: string;
    createdAt: string;
    updatedBy: string;
    updatedAt: string;
    retired: boolean;
    retiredBy: string;
    retiredDate: string;
}

type FeatureFlagDefaultTypes = FeatureFlagTypes & AppFormDialogTypes;

const FeatureFlagDefaultValues: FeatureFlagDefaultTypes = {
    id: 0,
    name: "",
    description: "",
    status: false,
    createdBy: "",
    createdAt: "",
    updatedBy: "",
    updatedAt: "",
    retired: false,
    retiredBy: "",
    retiredDate: "",
    isUpdate: false,
    title: "New feature flag",
    btnText: "Save"
}

export type { FeatureFlagTypes, FeatureFlagDefaultTypes }
export { FeatureFlagDefaultValues }