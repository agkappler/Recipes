import { ClassList } from "@/app/_components/dnd/class/ClassList";
import { RaceList } from "@/app/_components/dnd/race/RaceList";
import { LinkButton } from "@/app/_components/ui/buttons/LinkButton";
import { PageHeader } from "@/app/_components/ui/PageHeader";
import { Box } from "@mui/material";

export default function GlossaryPage() {
    return <>
        <PageHeader
            title="DnD Glossary"
            leftContainer={<LinkButton url="/dnd" label="Characters" isForward={false} />}
        />
        <Box className="px-2 mt-2">
            <ClassList />
            <LinkButton url="/dnd/glossary/classes" label="Classes" />
        </Box>
        <Box className="px-2 mt-2">
            <RaceList />
            <LinkButton url="/dnd/glossary/races" label="Races" />
        </Box>
    </>;
}