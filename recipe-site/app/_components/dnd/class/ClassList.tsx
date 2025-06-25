import { BaseDndResponse, DndItem, getClasses } from "@/app/_api/dnd5eapi";
import { Grid, Paper, Typography } from "@mui/material";
import { useRouter } from "next/navigation";
import useSWR from "swr";
import { LoadingWrapper } from "../../ui/LoadingWrapper";

export const ClassList: React.FC = () => {
    const router = useRouter();
    const { data: apiClassResults, isLoading: isLoadingApi } = useSWR<BaseDndResponse>('/classes', () => getClasses());
    const customClasses: DndItem[] = [],
        isLoadingCustomClasses = false;
    const classes = [...(apiClassResults?.results ?? []), ...customClasses].sort((a, b) => a.name.localeCompare(b.name));
    return <>
        <Typography variant="h5" textAlign="center">Classes</Typography>
        <LoadingWrapper isLoading={isLoadingApi || isLoadingCustomClasses}>
            <Grid container spacing={2} textAlign="center">
                {classes.map((c, index) => (<Grid key={index} size={{ xs: 12, sm: 4 }}>
                    <Paper elevation={3} className="p-2" role="button" onClick={() => router.push(`/dnd/classes`)}>
                        <Typography variant="h6">{c.name}</Typography>
                    </Paper>
                </Grid>))}
            </Grid>
        </LoadingWrapper>
    </>
}