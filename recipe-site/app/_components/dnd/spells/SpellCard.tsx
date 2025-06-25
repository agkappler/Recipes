import { Spell } from "@/app/_api/dnd5eapi"
import { InfoOutline } from "@mui/icons-material"
import { Paper, Typography } from "@mui/material"
import { useState } from "react"
import { SpellDetailsModal } from "./SpellDetailsModal"

interface SpellCardProps {
    spell: Spell
}

export const SpellCard: React.FC<SpellCardProps> = ({ spell }) => {
    const [isOpen, setIsOpen] = useState(false);

    return <>
        <Paper elevation={3} className="p-2 flex justify-between" role="button" onClick={() => setIsOpen(true)}>
            <Typography variant="body1" textAlign="center">{spell.name}</Typography>
            <InfoOutline fontSize="small" />
        </Paper>
        {isOpen &&
            <SpellDetailsModal
                isOpen={isOpen}
                onClose={() => setIsOpen(false)}
                spell={spell}
            />
        }
    </>
}