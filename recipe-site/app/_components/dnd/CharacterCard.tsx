import { getNameForClass } from "@/app/_constants/DndClass";
import { getNameForRace } from "@/app/_constants/DndRace";
import Character from "@/app/_models/Character";
import { Typography } from "@mui/material";
import { useRouter } from "next/navigation";
import { ImageBox } from "../ui/ImageBox";
import { ModelCard } from "../ui/ModelCard";

interface CharacterCardProps {
    character: Character;
}

export const CharacterCard: React.FC<CharacterCardProps> = ({ character }) => {
    const router = useRouter();
    return <ModelCard title={character.name} onClick={() => router.push(`/dnd/${character.characterId}`)}>
        {character.avatarId && <>
            <ImageBox fileId={character.avatarId} altText="Character avatar" />
        </>}
        <Typography variant="body1" color="textSecondary">
            {getNameForRace(character.race)} | {getNameForClass(character.className)}
        </Typography>
    </ModelCard>
}