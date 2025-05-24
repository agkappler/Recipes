'use client';

import { Add } from "@mui/icons-material";
import { Box, Button, Chip, Grid, Typography } from "@mui/material";
import { useState } from "react";
import useSWR from "swr";
import { BountyCard } from "../_components/bounties/BountyCard";
import { BountyCategoryForm } from "../_components/bounties/BountyCategoryForm";
import { BountyForm } from "../_components/bounties/BountyForm";
import { ErrorMessage } from "../_components/ui/ErrorMessage";
import { LoadingWrapper } from "../_components/ui/LoadingWrapper";
import { PageHeader } from "../_components/ui/PageHeader";
import RequestManager from "../_helpers/RequestManager";
import Bounty from "../_models/Bounty";
import BountyCategory from "../_models/BountyCategory";

export default function BountiesPage() {
    const [isOpen, setIsOpen] = useState(false);
    const onClose = () => {
        setIsOpen(false);
    }
    const [isCategoryOpen, setIsCategoryOpen] = useState(false);
    const onCategoryClose = () => {
        setIsCategoryOpen(false);
    }

    const { data: bounties, error: bountiesError, isLoading: isLoadingBounties, mutate } = useSWR<Bounty[]>('/bounties', () => RequestManager.get('/bounties'));
    const { data: bountyCategories, error: bountyCategoriesError, isLoading: isLoadingBountyCategories, mutate: mutateCategories } = useSWR<BountyCategory[]>('/bountyCategories', () => RequestManager.get('/bountyCategories'));
    if (bountiesError || bountyCategoriesError) {
        return <ErrorMessage errorMessage={(bountiesError ?? bountyCategoriesError)?.message} />;
    }

    return <>
        <PageHeader
            title="Bounties"
            rightContainer={<Button startIcon={<Add />} onClick={() => setIsOpen(true)}>Post Bounty</Button>}
        />
        <Box display="flex" justifyContent="center" gap={2} marginBottom={2}>
            <Typography variant="subtitle1">Bounty Categories:</Typography>
            <Chip label="Add Category" icon={<Add />} onClick={() => setIsCategoryOpen(true)} />
            <LoadingWrapper isLoading={isLoadingBountyCategories}>
                {bountyCategories?.map((category) => (
                    <Chip key={category.categoryId} label={category.name} />
                ))}
            </LoadingWrapper>
        </Box>
        <Grid container spacing={1} className="mx-2">
            <LoadingWrapper isLoading={isLoadingBounties}>
                {bounties?.map(bounty => (
                    <Grid size={6} key={bounty.bountyId}>
                        <BountyCard key={bounty.bountyId} bounty={bounty} />
                    </Grid>
                ))}
            </LoadingWrapper>
        </Grid>
        <BountyForm
            isOpen={isOpen}
            onClose={onClose}
            updateBounties={mutate}
            bountyCategories={bountyCategories ?? []}
        />
        <BountyCategoryForm
            isOpen={isCategoryOpen}
            onClose={onCategoryClose}
            updateBountyCategories={mutateCategories}
        />
    </>
}