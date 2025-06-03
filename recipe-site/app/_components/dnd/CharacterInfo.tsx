import { MOBILE_BREAK } from "@/app/_constants/Media";
import Character from "@/app/_models/Character";
import { getLevelInfoForClass, LevelInfo } from "@/app/api/dnd5eapi";
import TabContext from '@mui/lab/TabContext';
import TabList from '@mui/lab/TabList';
import TabPanel from '@mui/lab/TabPanel';
import { Box, MenuItem, Select, Tab, useMediaQuery } from "@mui/material";
import { useState } from "react";
import useSWR from "swr";
import { LoadingWrapper } from "../ui/LoadingWrapper";
import { ClassFeatures } from "./class/ClassFeatures";
import { RacialTraits } from "./race/RacialTraits";
import { SpellInfo } from "./spells/SpellInfo";

interface CharacterInfoProps {
    character: Character;
}

export const CharacterInfo: React.FC<CharacterInfoProps> = ({ character }) => {
    const { data: levelInfos, isLoading: isLoadingClassInfo } = useSWR<LevelInfo[]>(`/class/${character.className}/levels`, () => getLevelInfoForClass(character.className));
    const [value, setValue] = useState('1');
    const handleChange = (_: React.SyntheticEvent, newValue: string) => {
        setValue(newValue);
    };

    const isMobile = useMediaQuery(`(max-width:${MOBILE_BREAK})`);
    const characterTabs = [
        { label: "Class Features", value: "1" },
        { label: "Racial Traits", value: "2" },
        { label: "Spells", value: "3" },
        { label: "Weapons", value: "4" },
        { label: "Items", value: "5" },
        { label: "Proficiencies", value: "6" },
    ];

    return <LoadingWrapper isLoading={isLoadingClassInfo}>
        <TabContext value={value}>
            <Box sx={{ borderBottom: 1, borderColor: 'divider', display: 'flex', justifyContent: 'center' }}>
                {isMobile
                    ? <Select
                        value={value}
                        onChange={(e) => setValue(e.target.value)}
                    >
                        {characterTabs.map((tab) => (
                            <MenuItem key={tab.value} value={tab.value}>{tab.label}</MenuItem>
                        ))}
                    </Select>
                    : <TabList onChange={handleChange} aria-label="Character info tabs">
                        {characterTabs.map((tab) => (
                            <Tab key={tab.value} label={tab.label} value={tab.value} />
                        ))}
                    </TabList>}
            </Box>
            <TabPanel value="1">
                <ClassFeatures levelInfos={levelInfos} currentLevel={character.level} />
            </TabPanel>
            <TabPanel value="2">
                <RacialTraits race={character.race} />
            </TabPanel>
            <TabPanel value="3">
                <SpellInfo levelInfos={levelInfos} currentLevel={character.level} className={character.className} />
            </TabPanel>
            <TabPanel value="4">No weapons yet!</TabPanel>
            <TabPanel value="5">No items yet!</TabPanel>
            <TabPanel value="6">No proficiencies yet!</TabPanel>
        </TabContext>
    </LoadingWrapper>
}