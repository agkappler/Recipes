'use client'

import { CharacterForm } from "@/app/_components/dnd/CharacterForm";
import { CharacterInfo } from "@/app/_components/dnd/CharacterInfo";
import { LinkButton } from "@/app/_components/ui/buttons/LinkButton";
import { ErrorMessage } from "@/app/_components/ui/ErrorMessage";
import { ImageBox } from "@/app/_components/ui/ImageBox";
import { LoadingWrapper } from "@/app/_components/ui/LoadingWrapper";
import { PageHeader } from "@/app/_components/ui/PageHeader";
import RequestManager from "@/app/_helpers/RequestManager";
import SlugProps from "@/app/_helpers/SlugProps";
import Character from "@/app/_models/Character";
import { Casino, Edit, MoreVert } from "@mui/icons-material";
import { capitalize, IconButton, Menu, MenuItem, Typography } from "@mui/material";
import { useRouter } from "next/navigation";
import { useState } from "react";
import useSWR from "swr";

export default function CharacterPage({ params }: SlugProps) {
    const [isOpen, setIsOpen] = useState(false);
    const [menuAnchor, setMenuAnchor] = useState<null | HTMLElement>(null);
    const { data: character, isLoading, error, mutate } = useSWR<Character>(`/character/${params.id}`, () => RequestManager.get<Character>(`/character/${params.id}`));
    const router = useRouter();

    const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
        setMenuAnchor(event.currentTarget);
    };

    const handleMenuClose = () => {
        setMenuAnchor(null);
    };

    const handleEdit = () => {
        setIsOpen(true);
        handleMenuClose();
    };

    const handleActions = () => {
        router.push(`/dnd/${params.id}/actions`);
        handleMenuClose();
    };

    if (error) return <ErrorMessage errorMessage={error.message} />
    return <>
        <LoadingWrapper isLoading={isLoading} >
            <PageHeader
                title={character?.name}
                leftContainer={<LinkButton label="All Characters" url="/dnd" isForward={false} />}
                rightContainer={
                    <>
                        <IconButton size="medium" aria-label="menu" onClick={handleMenuOpen}>
                            <MoreVert />
                        </IconButton>
                        <Menu
                            anchorEl={menuAnchor}
                            open={Boolean(menuAnchor)}
                            onClose={handleMenuClose}
                        >
                            <MenuItem onClick={handleEdit}>
                                <Edit sx={{ mr: 1 }} />
                                Edit Character
                            </MenuItem>
                            <MenuItem onClick={handleActions}>
                                <Casino sx={{ mr: 1 }} />
                                Actions
                            </MenuItem>
                        </Menu>
                    </>
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