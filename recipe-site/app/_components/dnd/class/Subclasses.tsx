import { BaseDndResponse, getSubclasses } from "@/app/api/dnd5eapi";
import { Box, MenuItem, Select } from "@mui/material";
import { useState } from "react";
import useSWR from "swr";
import { LoadingWrapper } from "../../ui/LoadingWrapper";
import { SubclassInfo } from "./SubclassInfo";

interface SubclassesProps {
    className: string;
}

export const Subclasses: React.FC<SubclassesProps> = ({ className }) => {
    const { data: apiSubclassResults, isLoading: isLoadingApi } = useSWR<BaseDndResponse>(`/classes/${className}/subclasses`, () => getSubclasses(className), { onSuccess: (data) => setSelectedSubclass(data.results[0].index ?? "") });
    const isLoadingCustomSubclasses = false,
        customSubclasses: any[] = [];
    const subclasses = [...(apiSubclassResults?.results ?? []), ...customSubclasses].sort((a, b) => a.name.localeCompare(b.name));

    const [selectedSubclass, setSelectedSubclass] = useState<string>(subclasses[0]?.index ?? "");
    return <>
        <LoadingWrapper isLoading={isLoadingApi || isLoadingCustomSubclasses}>
            <Box display="flex" justifyContent="center">
                <Select
                    value={selectedSubclass}
                    onChange={(e) => setSelectedSubclass(e.target.value as string)}
                >
                    {subclasses.map((c, index) => (
                        <MenuItem key={index} value={c.index}>{c.name}</MenuItem>
                    ))}
                </Select>
            </Box>
        </LoadingWrapper>
        {selectedSubclass && <SubclassInfo subclassName={selectedSubclass} />}
    </>
}