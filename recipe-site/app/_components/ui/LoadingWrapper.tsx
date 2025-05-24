import { PropsWithChildren } from "react";
import { LoadingSpinner } from "./LoadingSpinner";

interface LoadingWrapperProps extends PropsWithChildren {
    isLoading: boolean;
}

export const LoadingWrapper: React.FC<LoadingWrapperProps> = ({ isLoading, children }) => {
    return isLoading ? <LoadingSpinner /> : <>{children}</>;
}