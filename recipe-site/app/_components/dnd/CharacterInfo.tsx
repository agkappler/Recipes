import Character from "@/app/_models/Character";
import { getLevelInfoForClass, LevelInfo } from "@/app/api/dnd5eapi";
import TabContext from '@mui/lab/TabContext';
import TabList from '@mui/lab/TabList';
import TabPanel from '@mui/lab/TabPanel';
import { Box, Tab } from "@mui/material";
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
    const handleChange = (event: React.SyntheticEvent, newValue: string) => {
        setValue(newValue);
    };

    return <LoadingWrapper isLoading={isLoadingClassInfo}>
        <TabContext value={value}>
            <Box sx={{ borderBottom: 1, borderColor: 'divider', display: 'flex', justifyContent: 'center' }}>
                <TabList onChange={handleChange} aria-label="Character info tabs">
                    <Tab label="Class Features" value="1" />
                    <Tab label="Racial Traits" value="2" />
                    <Tab label="Spells" value="3" />
                    <Tab label="Weapons" value="4" />
                    <Tab label="Items" value="5" />
                    <Tab label="Proficiencies" value="6" />
                </TabList>
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