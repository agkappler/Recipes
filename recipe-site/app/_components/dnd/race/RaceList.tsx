import { BaseDndResponse, getRaces } from "@/app/api/dnd5eapi";
import { Accordion, AccordionDetails, AccordionSummary, Grid, Typography } from "@mui/material";
import useSWR from "swr";
import { LinkButton } from "../../ui/buttons/LinkButton";
import { LoadingWrapper } from "../../ui/LoadingWrapper";

interface RaceCarouselProps { }

export const RaceList: React.FC<RaceCarouselProps> = ({ }) => {
    const { data: apiRaceResults, isLoading: isLoadingApi } = useSWR<BaseDndResponse>('/races', () => getRaces());
    const customRaces: any[] = [],
        isLoadingCustomRaces = false;
    const races = [...(apiRaceResults?.results ?? []), ...customRaces].sort((a, b) => a.name.localeCompare(b.name));
    return <LoadingWrapper isLoading={isLoadingApi || isLoadingCustomRaces} >
        <Accordion>
            <AccordionSummary>
                <Typography variant="h5">Races</Typography>
            </AccordionSummary>
            <AccordionDetails>
                <LinkButton url="/dnd/races" label="View Races" />
                <Grid container spacing={2}>
                    {races.map((r, index) => (<Grid key={index} size={{ xs: 12, sm: 4 }}>
                        <Typography variant="h6">{r.name}</Typography>
                    </Grid>))}
                </Grid>
            </AccordionDetails>
        </Accordion>
        {/* <Carousel
            cardContents={races.map(r => (<>
                <Typography variant="h6">{r.name}</Typography>
            </>))}
        /> */}
    </LoadingWrapper>
}