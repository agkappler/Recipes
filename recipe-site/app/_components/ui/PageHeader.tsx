import { ChevronLeft, ChevronRight } from "@mui/icons-material";
import { Box, Button, Grid } from "@mui/material";
import { PropsWithChildren } from "react";

type LinkInfo = {
    label: string;
    url: string;
}

interface PageHeaderProps extends PropsWithChildren {
    backInfo?: LinkInfo;
    forwardInfo?: LinkInfo;
}

export const PageHeader: React.FC<PageHeaderProps> = ({ children, backInfo, forwardInfo }) => {
    return <Grid container spacing={1}>
        <Box className="mt-2 w-full flex">
            <Grid size={3}>
                {backInfo !== undefined &&
                    <Button variant="text" startIcon={<ChevronLeft />} href={backInfo.url} className="float-left">
                        {backInfo.label}
                    </Button>
                }
            </Grid>
            <Grid size={6}>{children}</Grid>
            <Grid size={3}>
                {forwardInfo !== undefined &&
                    <Button variant="text" endIcon={<ChevronRight />} href={forwardInfo.url} className="float-right">
                        {forwardInfo.label}
                    </Button>
                }
            </Grid>
        </Box>
    </Grid>;
}