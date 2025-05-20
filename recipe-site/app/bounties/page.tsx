'use client';

import { Add } from "@mui/icons-material";
import { Button, Grid } from "@mui/material";
import { useState } from "react";
import useSWR from "swr";
import { BountyCard } from "../_components/bounties/BountyCard";
import { BountyForm } from "../_components/bounties/BountyForm";
import { ErrorMessage } from "../_components/ui/ErrorMessage";
import { LoadingSpinner } from "../_components/ui/LoadingSpinner";
import { PageHeader } from "../_components/ui/PageHeader";
import RequestManager from "../_helpers/RequestManager";
import Bounty from "../_models/Bounty";

export default function BountiesPage() {
    const [isOpen, setIsOpen] = useState(false);
    const onClose = () => {
        setIsOpen(false);
    }

    // const { data: bounties, error, isLoading, mutate } = useSWR<Bounty[]>('/bounties', () => RequestManager.get('/bounties'));
    // if (isLoading) {
    //     return <LoadingSpinner message="Loading bounties..." />;
    // }
    // if (error || bounties === undefined) {
    //     return <ErrorMessage errorMessage={error.message} />;
    // }

    const bounties = [] as Bounty[],
        mutate = () => { };

    return <>
        <PageHeader
            title="Bounties"
            rightContainer={<Button startIcon={<Add />} onClick={() => setIsOpen(true)}>Post Bounty</Button>}
        />
        <Grid container spacing={1} className="mx-2">
            {bounties.map(bounty => (
                <Grid size={6} key={bounty.bountyId}>
                    <BountyCard key={bounty.bountyId} bounty={bounty} />
                </Grid>
            ))}
        </Grid>
        <BountyForm
            isOpen={isOpen}
            onClose={onClose}
            updateBounties={mutate}
        />
    </>
}