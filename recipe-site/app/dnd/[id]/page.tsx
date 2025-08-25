'use client'

import { CharacterForm } from "@/app/_components/dnd/CharacterForm";
import { CharacterInfo } from "@/app/_components/dnd/CharacterInfo";
import { ActionMenu, MenuOption } from "@/app/_components/ui/ActionMenu";
import { LinkButton } from "@/app/_components/ui/buttons/LinkButton";
import { ErrorMessage } from "@/app/_components/ui/ErrorMessage";
import { ImageBox } from "@/app/_components/ui/ImageBox";
import { LoadingWrapper } from "@/app/_components/ui/LoadingWrapper";
import { PageHeader } from "@/app/_components/ui/PageHeader";
import RequestManager from "@/app/_helpers/RequestManager";
import SlugProps from "@/app/_helpers/SlugProps";
import Character from "@/app/_models/Character";
import { Casino, Edit } from "@mui/icons-material";
import { capitalize, Typography } from "@mui/material";
import { useRouter } from "next/navigation";
import { useState } from "react";
import useSWR from "swr";

export default function CharacterPage({ params }: SlugProps) {
    const [isOpen, setIsOpen] = useState(false);
    const { data: character, isLoading, error, mutate } = useSWR<Character>(`/character/${params.id}`, () => RequestManager.get<Character>(`/character/${params.id}`));
    const router = useRouter();

    const handleEdit = () => {
        setIsOpen(true);
    };

    const handleActions = () => {
        router.push(`/dnd/${params.id}/actions`);
    };

    const menuOptions: MenuOption[] = [
        {
            label: "Edit Character",
            icon: <Edit />,
            onClick: handleEdit
        },
        {
            label: "Actions",
            icon: <Casino />,
            onClick: handleActions
        }
    ];

    if (error) return <ErrorMessage errorMessage={error.message} />
    return <>
        <LoadingWrapper isLoading={isLoading} >
            <PageHeader
                title={character?.name}
                leftContainer={<LinkButton label="All Characters" url="/dnd" isForward={false} />}
                rightContainer={
                    <ActionMenu
                        options={menuOptions}
                        size="medium"
                        ariaLabel="Character options"
                    />
                }
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