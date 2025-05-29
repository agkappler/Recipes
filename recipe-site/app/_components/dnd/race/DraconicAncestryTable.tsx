import { DndItem } from "@/app/api/dnd5eapi";
import { Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography } from "@mui/material";
import { DraconicAncestryRow } from "./DraconicAncestryRow";

interface DraconicAncestryTableProps {
    subOptions: any;
}

export const DraconicAncestryTable: React.FC<DraconicAncestryTableProps> = ({ subOptions }) => {
    return <>
        <TableContainer component={Paper}>
            <Table size="small">
                <TableHead>
                    <TableRow>
                        <TableCell>Dragon</TableCell>
                        <TableCell align="center">Damage Type</TableCell>
                        <TableCell align="center">Breath Weapon</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {subOptions.from.options.map((option: { item: DndItem }, index: number) => (
                        <DraconicAncestryRow key={index} ancestryOption={option.item} />
                    ))}
                </TableBody>
            </Table>
        </TableContainer>
    </>;
}

