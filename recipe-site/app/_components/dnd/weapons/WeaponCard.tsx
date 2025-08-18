import Weapon from "@/app/_models/Weapon";
import { Typography } from "@mui/material";
import { ModelCard } from "../../ui/ModelCard";

interface WeaponCardProps {
    weapon: Weapon;
    onClick: (weapon: Weapon) => void;
}

export const WeaponCard: React.FC<WeaponCardProps> = ({ weapon, onClick }) => {
    return (
        <ModelCard title={weapon.name} onClick={() => onClick(weapon)}>
            <Typography variant="body2" color="text.secondary" gutterBottom>
                Damage: {weapon.damage}
            </Typography>
            <Typography
                variant="body2"
                sx={{
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    display: '-webkit-box',
                    WebkitLineClamp: 2,
                    WebkitBoxOrient: 'vertical',
                }}
            >
                {weapon.description || "No description"}
            </Typography>
        </ModelCard>
    );
};
