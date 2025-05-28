import { Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography } from "@mui/material";
import React from "react";

interface CreatingSpellSlotsTableProps {
    creatingSpellSlots: { spell_slot_level: number, sorcery_point_cost: number }[]
}

export const CreatingSpellSlotsTable: React.FC<CreatingSpellSlotsTableProps> = ({ creatingSpellSlots }) => {
    return <><Typography variant="body1">Creating Spell Slots</Typography>
        <TableContainer component={Paper}>
            <Table>
                <TableHead>
                    <TableRow>
                        <TableCell>Spell Slot Level</TableCell>
                        <TableCell align="right">Sorcery Points</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {creatingSpellSlots.map((row: any) => (
                        <TableRow
                            key={row.spell_slot_level}
                            sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                        >
                            <TableCell align="right">{row.spell_slot_level}</TableCell>
                            <TableCell align="right">{row.sorcery_point_cost}</TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </TableContainer>
    </>
}