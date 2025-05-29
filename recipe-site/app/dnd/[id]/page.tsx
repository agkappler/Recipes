'use client'

import { CharacterForm } from "@/app/_components/dnd/CharacterForm";
import { CharacterInfo } from "@/app/_components/dnd/CharacterInfo";
import { ErrorMessage } from "@/app/_components/ui/ErrorMessage";
import { ImageBox } from "@/app/_components/ui/ImageBox";
import { LinkButton } from "@/app/_components/ui/buttons/LinkButton";
import { LoadingWrapper } from "@/app/_components/ui/LoadingWrapper";
import { PageHeader } from "@/app/_components/ui/PageHeader";
import RequestManager from "@/app/_helpers/RequestManager";
import SlugProps from "@/app/_helpers/SlugProps";
import Character from "@/app/_models/Character";
import { Edit } from "@mui/icons-material";
import { capitalize, IconButton, Typography } from "@mui/material";
import { useState } from "react";
import useSWR from "swr";

export default function CharacterPage({ params }: SlugProps) {
    const [isOpen, setIsOpen] = useState(false);
    const { data: character, isLoading, error, mutate } = useSWR<Character>(`/character/${params.id}`, () => RequestManager.get(`/character/${params.id}`));

    if (error) return <ErrorMessage errorMessage={error.message} />
    return <>
        <LoadingWrapper isLoading={isLoading} >
            <PageHeader
                title={character?.name}
                leftContainer={<LinkButton label="All Characters" url="/dnd" isForward={false} />}
                rightContainer={<IconButton size="medium" aria-label="edit" onClick={() => setIsOpen(!isOpen)}><Edit /></IconButton>}
            />
            {character && <>
                {character.avatarId && <ImageBox fileId={character.avatarId} altText="Character avatar" />}
                <Typography variant="h6" textAlign="center" fontWeight="light" color="textSecondary">
                    {`${capitalize(character.race)}, Level ${character.level} ${capitalize(character.className)}`}
                </Typography>
                <CharacterInfo character={character} />
            </>}
        </LoadingWrapper>
        <CharacterForm
            isOpen={isOpen}
            onClose={() => setIsOpen(false)}
            updateCharacters={mutate}
            character={character}
        />
    </>
}