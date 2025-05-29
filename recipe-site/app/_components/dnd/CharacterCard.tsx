import Character from "@/app/_models/Character";
import { Paper, Typography } from "@mui/material";
import { useRouter } from "next/navigation";
import { ImageBox } from "../ui/ImageBox";
import { getNameForClass } from "@/app/_constants/DndClass";
import { getNameForRace } from "@/app/_constants/DndRace";

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
        <Typography variant="body1" textAlign="center">{getNameForRace(character.race)}</Typography>
        <Typography variant="body1" textAlign="center">{getNameForClass(character.className)}</Typography>
    </Paper>
}