'use client';

import { Add } from "@mui/icons-material";
import { Box, Chip, Grid, Typography } from "@mui/material";
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
        setSelectedBounty(undefined);
    }
    const [selectedBounty, setSelectedBounty] = useState<Bounty>();
    const onBountyClick = (bounty: Bounty) => {
        setSelectedBounty(() => bounty);
        setIsOpen(true);
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
        <PageHeader title="Bounty Board" />
        <Box display="flex" justifyContent="center" gap={2} marginBottom={2}>
            <LoadingWrapper isLoading={isLoadingBountyCategories} size={20}>
                <Chip label="Add Category" icon={<Add />} onClick={() => setIsCategoryOpen(true)} />
                {bountyCategories?.map((category) => (
                    <Chip key={category.categoryId} label={category.name} />
                ))}
            </LoadingWrapper>
        </Box>
        <Grid container spacing={1} className="mx-2" alignItems="stretch">
            <LoadingWrapper isLoading={isLoadingBounties}>
                <Grid size={3}>
                    <Box
                        border="dashed"
                        borderColor="primary.main"
                        borderRadius="4px"
                        className="p-2 flex h-full shadow-md hover:shadow-lg"
                        justifyContent="center"
                        alignItems="center"
                        role="button"
                        onClick={() => setIsOpen(true)}
                    >
                        <Add color="primary" />
                        <Typography variant="subtitle1" color="primary">Post Bounty</Typography>
                    </Box>
                </Grid>
                {bounties?.map(bounty => (
                    <Grid size={3} key={bounty.bountyId} onClick={() => onBountyClick(bounty)} role="button">
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
            bounty={selectedBounty}
        />
        <BountyCategoryForm
            isOpen={isCategoryOpen}
            onClose={onCategoryClose}
            updateBountyCategories={mutateCategories}
        />
    </>
}