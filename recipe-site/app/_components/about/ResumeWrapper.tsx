'use client';

import RequestManager from "@/app/_helpers/RequestManager"
import { Description } from "@mui/icons-material"
import { Link } from "@mui/material"
import useSWR from "swr"

export const ResumeWrapper: React.FC = () => {
    const { data } = useSWR<{ url: string }>("/getLatestResumeUrl", () => RequestManager.get("/getLatestResumeUrl"));
    return <Link href={data?.url ?? ""} target="_blank" rel="noopener noreferrer" alignContent="center">
        <Description />Resume
    </Link>
}