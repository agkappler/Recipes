import Character from "@/app/_models/Character";
import { Paper, Typography } from "@mui/material";
import { useRouter } from "next/navigation";
import { ImageBox } from "../ui/ImageBox";

interface CharacterCardProps {
    character: Character;
}

export const CharacterCard: React.FC<CharacterCardProps> = ({ character }) => {
    const router = useRouter();
    return <Paper className="p-2 flex flex-col" elevation={3} role="button" onClick={() => router.push(`/dnd/${character.characterId}`)}>
        {character.avatarId && <>
            <ImageBox fileId={character.avatarId} altText="Character avatar" />
        </>}
        <Typography variant="h6" textAlign="center">{character.name}</Typography>
        <Typography variant="body1" textAlign="center">{character.race}</Typography>
        <Typography variant="body1" textAlign="center">{character.className}</Typography>
    </Paper>
}