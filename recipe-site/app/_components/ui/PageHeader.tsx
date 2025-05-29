import { Box, Grid, Typography } from "@mui/material";
import { PropsWithChildren, ReactNode } from "react";

interface PageHeaderProps extends PropsWithChildren {
    title?: string;
    leftContainer?: ReactNode;
    rightContainer?: ReactNode;
    headerColor?: string;
}

export const PageHeader: React.FC<PageHeaderProps> = ({ children, title, leftContainer, rightContainer, headerColor }) => {
    return <Grid container spacing={1}>
        <Box className="p-2 w-full flex mb-1" sx={{ backgroundColor: headerColor }}>
            <Grid size={3}>
                {leftContainer !== undefined && leftContainer}
            </Grid>
            <Grid size={6}>
                {title !== undefined &&
                    <Typography variant="h4" textAlign="center">
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