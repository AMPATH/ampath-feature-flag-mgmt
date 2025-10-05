import { AttributeTypes } from "../attributes/attributes.types";
import { FeatureFlagTypes } from "../feature_flags/feature_flags.types";
import { OperatorTypes } from "../operators/operators.types";
import { AppFormDialogTypes } from "../shared/types/app.types";

interface RuleTypes {
    id: number;
    value: string;
    uuid: string;
    attribute: AttributeTypes;
    operator: OperatorTypes;
    featureFlag: FeatureFlagTypes;
}

type RuleDefaultTypes = AppFormDialogTypes;

const AppFormDialogDefaultValues: RuleDefaultTypes = {
    isUpdate: false,
    title: "New rule",
    btnText: "Save"
}

export type { RuleTypes, RuleDefaultTypes }
export { AppFormDialogDefaultValues }