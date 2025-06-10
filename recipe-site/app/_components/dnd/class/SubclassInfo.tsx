import { DndItem, getLevelInfoForSubclass, LevelInfo } from "@/app/api/dnd5eapi";
import useSWR from "swr";
import { LoadingWrapper } from "../../ui/LoadingWrapper";
import { FeatureCard } from "./FeatureCard";

interface SubclassInfoProps {
    subclassName: string;
}

export const SubclassInfo: React.FC<SubclassInfoProps> = ({ subclassName }) => {
    const { data: subclassInfo, isLoading } = useSWR(`/subclasses/${subclassName}/levels`, () => getLevelInfoForSubclass(subclassName));
    const features = subclassInfo?.flatMap((l: LevelInfo) => l.features.map((f: DndItem) => ({ ...f, levelInfo: l }))) ?? [];
    console.log('subclass info', subclassInfo);
    return <>
        <LoadingWrapper isLoading={isLoading}>
            {features.map((feature: { levelInfo: LevelInfo } & DndItem, index: number) => (
                <FeatureCard key={index} feature={feature} />
            ))}
        </LoadingWrapper>
    </>
}