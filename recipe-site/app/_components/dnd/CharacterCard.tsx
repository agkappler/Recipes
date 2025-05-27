import Character from "@/app/_models/Character";
import { Paper, Typography } from "@mui/material";
import { useRouter } from "next/navigation";

interface CharacterCardProps {
    character: Character;
}

export const CharacterCard: React.FC<CharacterCardProps> = ({ character }) => {
    const router = useRouter();
    return <Paper className="p-2 flex flex-col" elevation={3} role="button" onClick={() => router.push(`/dnd/${character.characterId}`)}>
        <Typography variant="h6" textAlign="center">{character.name}</Typography>
        <Typography variant="body1" textAlign="center">{character.race}</Typography>
        <Typography variant="body1" textAlign="center">{character.className}</Typography>
    </Paper>
}