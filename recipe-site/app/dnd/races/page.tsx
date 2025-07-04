'use client';

import { RaceForm } from "@/app/_components/dnd/race/RaceForm";
import { RacialTraits } from "@/app/_components/dnd/race/RacialTraits";
import { Subraces } from "@/app/_components/dnd/race/Subraces";
import { LinkButton } from "@/app/_components/ui/buttons/LinkButton";
import { LoadingWrapper } from "@/app/_components/ui/LoadingWrapper";
import { PageHeader } from "@/app/_components/ui/PageHeader";
import RequestManager from "@/app/_helpers/RequestManager";
import CustomDndRace from "@/app/_models/CustomDndRace";
import { BaseDndResponse, getRaces } from "@/app/_api/dnd5eapi";
import { Add } from "@mui/icons-material";
import { TabContext, TabList, TabPanel } from "@mui/lab";
import { Box, Button, MenuItem, Select, Tab } from "@mui/material";
import { useState } from "react";
import useSWR from "swr";

export default function DnDRacesPage() {
    const { data: apiRaceResults, isLoading: isLoadingApi } = useSWR<BaseDndResponse>('/races', () => getRaces(), { onSuccess: (data) => setSelectedRace(data.results[0].index ?? "") });
    const { data: customRaces, isLoading: isLoadingCustomRaces, mutate } = useSWR<CustomDndRace[]>('/customRaces', () => RequestManager.get<CustomDndRace[]>('/races'));
    const races = [...(apiRaceResults?.results ?? []), ...(customRaces ?? []).map(r => new CustomDndRace(r))].sort((a, b) => a.name.localeCompare(b.name));
    const [selectedRace, setSelectedRace] = useState<string>(races[0]?.index ?? "");
    const [value, setValue] = useState("1");
    const handleChange = (_: React.SyntheticEvent, newValue: string) => {
        setValue(newValue);
    };

    const [isOpen, setIsOpen] = useState(false);

    return <>
        <PageHeader
            title="DnD Races"
            rightContainer={<Button startIcon={<Add />} onClick={() => setIsOpen(true)}>Add Race</Button>}
            leftContainer={<LinkButton url="/dnd" label={"Back to Characters"} isForward={false} />}
        />
        <LoadingWrapper isLoading={isLoadingApi || isLoadingCustomRaces}>
            <Box display="flex" justifyContent="center">
                <Select
                    value={selectedRace}
                    onChange={(e) => setSelectedRace(e.target.value as string)}
                >
                    {races.map((r, index) => (
                        <MenuItem key={index} value={r.index}>{r.name}</MenuItem>
                    ))}
                </Select>
            </Box>
            <TabContext value={value}>
                <Box sx={{ borderBottom: 1, borderColor: 'divider', display: 'flex', justifyContent: 'center' }}>
                    <TabList onChange={handleChange} aria-label="Character info tabs">
                        <Tab label="Race Info" value="1" />
                        <Tab label="Subraces" value="2" />
                    </TabList>
                </Box>
                <TabPanel value="1">
                    {selectedRace && <RacialTraits race={selectedRace} />}
                </TabPanel>
                <TabPanel value="2">
                    <Subraces race={selectedRace} />
                </TabPanel>
            </TabContext>
        </LoadingWrapper>
        <RaceForm
            isOpen={isOpen}
            onClose={() => setIsOpen(false)}
            updateDndRaces={mutate}
        />
    </>
}