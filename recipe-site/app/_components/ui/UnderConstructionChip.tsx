import React from "react";
import { Alert, Chip } from "@mui/material";
import ConstructionIcon from "@mui/icons-material/Construction";

export const UnderConstructionChip: React.FC = () => {
    return (<>
        <Alert
            severity="warning"
            icon={<ConstructionIcon />}
            title="Under Construction"
            color="warning"
            variant="standard"
            sx={{ fontWeight: "bold", margin: 2 }}
        >
            Under Construction
        </Alert>
    </>);
};