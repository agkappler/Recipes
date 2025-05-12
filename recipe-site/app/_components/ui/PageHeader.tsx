import { Box, Grid, Typography } from "@mui/material";
import { PropsWithChildren, ReactNode } from "react";

interface PageHeaderProps extends PropsWithChildren {
    title?: string;
    leftContainer?: ReactNode;
    rightContainer?: ReactNode;
}

export const PageHeader: React.FC<PageHeaderProps> = ({ children, title, leftContainer, rightContainer }) => {
    return <Grid container spacing={1}>
        <Box className="mt-2 w-full flex">
            <Grid size={3}>
                {leftContainer !== undefined && leftContainer}
            </Grid>
            <Grid size={6}>
                {title !== undefined &&
                    <Typography variant="h4" className="mb-3" textAlign="center">
                        {title}
                    </Typography>}
                {children}
            </Grid>
            <Grid size={3} className="flex justify-end">
                {rightContainer !== undefined && rightContainer}
            </Grid>
        </Box>
    </Grid>;
}