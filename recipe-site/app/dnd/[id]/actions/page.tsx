'use client'

import RequestManager from "@/app/_helpers/RequestManager";
import Character from "@/app/_models/Character";
import { capitalize, Typography } from "@mui/material";
import useSWR from "swr";
import { ActionInfo } from "../../../_components/dnd/ActionInfo";
import { LinkButton } from "../../../_components/ui/buttons/LinkButton";
import { ErrorMessage } from "../../../_components/ui/ErrorMessage";
import { ImageBox } from "../../../_components/ui/ImageBox";
import { LoadingWrapper } from "../../../_components/ui/LoadingWrapper";
import { PageHeader } from "../../../_components/ui/PageHeader";

interface CharacterActionsPageProps {
    params: {
        id: string;
    };
}

export default function CharacterActionsPage({ params }: CharacterActionsPageProps) {
    const { data: character, isLoading: isLoadingCharacter, error } = useSWR<Character>(`/character/${params.id}`, () => RequestManager.get<Character>(`/character/${params.id}`));

    if (error) return <ErrorMessage errorMessage={error.message} />

    return (
        <LoadingWrapper isLoading={isLoadingCharacter}>
            <PageHeader
                title={character?.name}
                leftContainer={<LinkButton
                    label="Back to Character"
                    url={`/dnd/${params.id}`}
                    isForward={false}
                />}
            />
            {character && (<>
                {character.avatarId && <ImageBox fileId={character.avatarId} altText="Character avatar" />}
                <Typography variant="h6" textAlign="center" fontWeight="light" color="textSecondary">
                    {`${capitalize(character.race)}, Level ${character.level} ${capitalize(character.className)}`}
                </Typography>
                <ActionInfo characterId={character.characterId} className={character.className} />
            </>)}
        </LoadingWrapper>
    );
}
