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
import { useState, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import useSWR from "swr";

export default function DnDClassesPage() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const { data: apiClassResults, isLoading: isLoadingApi } = useSWR<BaseDndResponse>('/classes', () => getClasses());
    const customClasses: any[] = [],
        isLoadingCustomClasses = false;
    const classes = [...(apiClassResults?.results ?? []), ...customClasses].sort((a, b) => a.name.localeCompare(b.name));
    const [selectedClass, setSelectedClass] = useState<DndClass>(DndClass.Barbarian);
    const [value, setValue] = useState("1");
    const handleChange = (_: React.SyntheticEvent, newValue: string) => {
        setValue(newValue);
    };

    // Handle query parameter for selected class
    useEffect(() => {
        const classParam = searchParams.get('class');
        if (classParam && classes.length > 0) {
            const classObj = classes.find(c => c.index === classParam);
            if (classObj) {
                setSelectedClass(classParam as DndClass);
            }
        } else if (classes.length > 0 && !selectedClass) {
            // Default to first class if no query param and no class selected
            const firstClass = classes[0];
            setSelectedClass(firstClass.index as DndClass);
        }
    }, [searchParams, classes]);

    const handleClassChange = (classIndex: string) => {
        // Update the URL with the new class selection
        const newSearchParams = new URLSearchParams(searchParams.toString());
        newSearchParams.set('class', classIndex);
        router.replace(`/dnd/glossary/classes?${newSearchParams.toString()}`);
    };

    return <>
        <PageHeader
            title="DnD Classes"
            rightContainer={<Button startIcon={<Add />}>Add Class</Button>}
            leftContainer={<LinkButton url="/dnd/glossary" label={"Glossary"} isForward={false} />}
        />
        <LoadingWrapper isLoading={isLoadingApi || isLoadingCustomClasses}>
            <Box display="flex" justifyContent="center">
                <Select
                    value={selectedClass}
                    onChange={(e) => handleClassChange(e.target.value as string)}
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
                    {selectedClass && <Subclasses classIndex={selectedClass} />}
                </TabPanel>
            </TabContext>
        </LoadingWrapper>
    </>
}