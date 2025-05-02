import { ProjectCards } from "./components/home/ProjectCards";

export default function Home({
}: {
    params: { id: string };
    searchParams: { [key: string]: string | string[] | undefined };
}) {
    return <ProjectCards />
}