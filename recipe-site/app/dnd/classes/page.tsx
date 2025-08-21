'use client';

import { BaseDndResponse, getClasses } from "@/app/_api/dnd5eapi";
import { ClassFeatures } from "@/app/_components/dnd/class/ClassFeatures";
import { Subclasses } from "@/app/_components/dnd/class/Subclasses";
import { LinkButton } from "@/app/_components/ui/buttons/LinkButton";
import { LoadingWrapper } from "@/app/_components/ui/LoadingWrapper";
import { PageHeader } from "@/app/_components/ui/PageHeader";
import { DndClass } from "@/app/_constants/DndClass";
import { Add } from "@mui/icons-material";
import { TabContext, TabList, TabPanel } from "@mui/lab";
import { Box, Button, MenuItem, Select, Tab } from "@mui/material";
import { useState } from "react";
import useSWR from "swr";

export default function DnDClassesPage() {
    const { data: apiClassResults, isLoading: isLoadingApi } = useSWR<BaseDndResponse>('/classes', () => getClasses(), { onSuccess: (data) => setSelectedClass(data.results[0].index as DndClass ?? DndClass.Barbarian) });
    const customClasses: any[] = [],
        isLoadingCustomClasses = false;
    const classes = [...(apiClassResults?.results ?? []), ...customClasses].sort((a, b) => a.name.localeCompare(b.name));
    const [selectedClass, setSelectedClass] = useState<DndClass>(classes[0]?.index as DndClass ?? DndClass.Barbarian);
    const [value, setValue] = useState("1");
    const handleChange = (_: React.SyntheticEvent, newValue: string) => {
        setValue(newValue);
    };

    return <>
        <PageHeader
            title="DnD Classes"
            rightContainer={<Button startIcon={<Add />}>Add Class</Button>}
            leftContainer={<LinkButton url="/dnd" label={"Back to Characters"} isForward={false} />}
        />
        <LoadingWrapper isLoading={isLoadingApi || isLoadingCustomClasses}>
            <Box display="flex" justifyContent="center">
                <Select
                    value={selectedClass}
                    onChange={(e) => setSelectedClass(e.target.value as DndClass)}
                >
                    {classes.map((c, index) => (
                        <MenuItem key={index} value={c.index}>{c.name}</MenuItem>
                    ))}
                </Select>
            </Box>
            <TabContext value={value}>
                <Box sx={{ borderBottom: 1, borderColor: 'divider', display: 'flex', justifyContent: 'center' }}>
                    <TabList onChange={handleChange} aria-label="Character info tabs">
                        <Tab label="Class Info" value="1" />
                        <Tab label="Subclasses" value="2" />
                    </TabList>
                </Box>
                <TabPanel value="1">
                    {selectedClass && <ClassFeatures currentLevel={20} className={selectedClass} />}
                </TabPanel>
                <TabPanel value="2">
                    <Subclasses className={selectedClass} />
                </TabPanel>
            </TabContext>
        </LoadingWrapper>
    </>
}