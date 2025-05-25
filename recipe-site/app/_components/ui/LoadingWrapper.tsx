import { Box } from "@mui/material";
import { PropsWithChildren } from "react";
import { LoadingSpinner } from "./LoadingSpinner";

interface LoadingWrapperProps extends PropsWithChildren {
    isLoading: boolean;
    size?: number;
}

export const LoadingWrapper: React.FC<LoadingWrapperProps> = ({ isLoading, size, children }) => {
    return isLoading ? <Box justifyContent="center" width="100%"><LoadingSpinner size={size} /></Box> : <>{children}</>;
}