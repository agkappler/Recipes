import { BaseDndResponse, getClasses } from "@/app/api/dnd5eapi";
import { Accordion, AccordionDetails, AccordionSummary, Grid, Typography } from "@mui/material";
import useSWR from "swr";
import { LinkButton } from "../../ui/buttons/LinkButton";
import { LoadingWrapper } from "../../ui/LoadingWrapper";

interface ClassListProps { }

export const ClassList: React.FC<ClassListProps> = ({ }) => {
    const { data: apiClassResults, isLoading: isLoadingApi } = useSWR<BaseDndResponse>('/classes', () => getClasses());
    const customClasses: any[] = [],
        isLoadingCustomClasses = false;
    const classes = [...(apiClassResults?.results ?? []), ...customClasses].sort((a, b) => a.name.localeCompare(b.name));
    return <LoadingWrapper isLoading={isLoadingApi || isLoadingCustomClasses} >
        <Accordion>
            <AccordionSummary>
                <Typography variant="h5">Classes</Typography>
            </AccordionSummary>
            <AccordionDetails>
                <LinkButton url="/dnd/classes" label="View Classes" />
                <Grid container spacing={2}>
                    {classes.map((c, index) => (<Grid key={index} size={{ xs: 12, sm: 4 }}>
                        <Typography variant="h6">{c.name}</Typography>
                    </Grid>))}
                </Grid>
            </AccordionDetails>
        </Accordion>
    </LoadingWrapper>
}