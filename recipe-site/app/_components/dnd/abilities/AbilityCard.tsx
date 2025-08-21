import Ability from "@/app/_models/Ability";
import { Box, Chip, Paper, Typography } from "@mui/material";
import { getLabelForAbilitySource } from "@/app/_constants/AbilitySource";
import { useState } from "react";
import { AbilityDetailsModal } from "./AbilityDetailsModal";
import { AbilityForm } from "./AbilityForm";

interface AbilityCardProps {
    ability: Ability;
    characterId?: number;
    canEdit?: boolean;
    onAbilityUpdate?: () => void;
}

export const AbilityCard: React.FC<AbilityCardProps> = ({
    ability,
    characterId,
    canEdit = false,
    onAbilityUpdate
}) => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);

    return (
        <>
            <Paper
                elevation={3}
                className="p-2 m-2"
                role="button"
                onClick={() => canEdit ? setIsEditModalOpen(true) : setIsModalOpen(true)}
                sx={{ position: 'relative' }}
            >
                <Chip
                    label={getLabelForAbilitySource(ability.source)}
                    size="small"
                    sx={{
                        position: 'absolute',
                        top: 8,
                        left: 8,
                        zIndex: 1
                    }}
                />
                <Typography variant="h6" textAlign="center" sx={{ mt: 3 }}>
                    {ability.name}
                </Typography>
                <Box display="flex" flexWrap="wrap" gap={1} mb={2} justifyContent="center">
                    <Chip
                        label={`Usage: ${ability.usage}`}
                        size="small"
                    />
                </Box>
            </Paper>

            <AbilityDetailsModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                ability={ability}
            />
            <AbilityForm
                isOpen={isEditModalOpen}
                onClose={() => setIsEditModalOpen(false)}
                characterId={characterId}
                ability={ability}
                onAbilityUpdate={onAbilityUpdate}
            />
        </>
    );
};
