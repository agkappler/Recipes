import { BaseDndResponse, DndItem, getSpellsForClass, LevelInfo, Spell } from "@/app/api/dnd5eapi";
import { ErrorMessage } from "../../ui/ErrorMessage";
import { Box, Chip, TableContainer, Typography, Paper, Table, TableHead, TableRow, TableCell, TableBody, Grid } from "@mui/material";
import { SpellSlotTable } from "./SpellSlotTable";
import useSWR from "swr";
import { LoadingWrapper } from "../../ui/LoadingWrapper";
import { SpellCard } from "./SpellCard";

interface SpellInfoProps {
    levelInfos: LevelInfo[] | undefined;
    currentLevel: number;
    className: string;
}

export const SpellInfo: React.FC<SpellInfoProps> = ({ levelInfos, currentLevel, className }) => {
    if (levelInfos === undefined) return <ErrorMessage errorMessage="Missing level data." />;

    const spellcasting = levelInfos.find(l => l.level === currentLevel)?.spellcasting;
    if (spellcasting === undefined) return <Typography variant="body1">No spells yet!</Typography>;
    const maxSpellLevel = 3;
    const spellLevels = Array.from({ length: 10 }, (_, i) => i);

    const { data: spellData, isLoading } = useSWR<BaseDndResponse>(`/spells/${className}`, () => getSpellsForClass(className));
    const spellsByLevel = (spellData?.results as Spell[])?.reduce((acc, spell) => {
        const key = spell.level;
        if (!acc[key]) {
            acc[key] = [];
        }
        acc[key].push(spell);
        return acc;
    }, {} as Record<number, Spell[]>);
    return <>
        <SpellSlotTable spellSlots={spellcasting} />
        <Typography variant="h6" textAlign="center" marginTop={2} marginBottom={1}>Known Spells</Typography>
        <Box display="flex" justifyContent="center" gap={3}>
            <Chip label={`Cantrips: ${spellcasting.cantrips_known}`} size="medium" />
            <Chip label={`Spells: ${spellcasting.spells_known}`} size="medium" />
        </Box>
        <Typography variant="h6" textAlign="center" marginTop={2}>Available Spells</Typography>
        <LoadingWrapper isLoading={isLoading}>
            {spellLevels.map(spellLevel => (<Box key={spellLevel}>
                <Typography variant="h6" marginTop={2}>{spellLevel === 0 ? 'Cantrips' : `Level ${spellLevel} Spells`}</Typography>
                <Grid container spacing={2}>
                    {(spellsByLevel?.[spellLevel] ?? []).map(spell => (
                        <Grid key={spell.index} size={3}>
                            <SpellCard spell={spell} />
                        </Grid>
                    ))}
                </Grid>
            </Box>))}
        </LoadingWrapper>

        {/* <Box display="flex" flexWrap="wrap" justifyContent="center" gap={2}>
            <Chip label={`Cantrips <br> ${currentSpellSlots.cantrips_known}`} />
            <Chip label={<>Level 1<br />{currentSpellSlots.spell_slots_level_1}</>} />
            <Chip label={`Level 2: ${currentSpellSlots.spell_slots_level_2}`} />
            <Chip label={`Level 3: ${currentSpellSlots.spell_slots_level_3}`} />
            <Chip label={`Level 4: ${ currentSpellSlots.spell_slots_level_4}`} />
            <Chip label={`Level 5: ${currentSpellSlots.spell_slots_level_5}`} />
            <Chip label={`Level 6: ${currentSpellSlots.spell_slots_level_6}`} />
            <Chip label={`Level 7: ${currentSpellSlots.spell_slots_level_7}`} />
            <Chip label={`Level 8: ${currentSpellSlots.spell_slots_level_8}`} />
            <Chip label={`Level 9: ${currentSpellSlots.spell_slots_level_9}`} />
        </Box> */}
    </>
}