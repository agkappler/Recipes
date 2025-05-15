'use client';

import useSWR from "swr";
import { ErrorMessage } from "../_components/ui/ErrorMessage";
import { LoadingSpinner } from "../_components/ui/LoadingSpinner";
import { PageHeader } from "../_components/ui/PageHeader";
import RequestManager from "../_helpers/RequestManager";
import Bounty from "../_models/Bounty";

export default function BountiesPage() {
    const { data: bounties, error, isLoading, mutate } = useSWR<Bounty[]>('/bounties', () => RequestManager.get('/bounties'));
    if (isLoading) {
        return <LoadingSpinner message="Loading bounties..." />;
    }
    if (error || bounties === undefined) {
        return <ErrorMessage errorMessage={error.message} />;
    }

    return <>
        <PageHeader title="Bounties" />
        {bounties.map(bounty => (
            <div key={bounty.bountyId} className="m-2 p-2 border border-gray-300 rounded">
                <h2 className="text-lg font-bold">{bounty.title}</h2>
                <p>{bounty.description}</p>
                <p>Status: {bounty.status}</p>
                <p>Cadence: {bounty.cadence}</p>
            </div>
        ))}
    </>
}