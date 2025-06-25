import { DndItem, getLevelInfoForClass, LevelInfo } from "@/app/_api/dnd5eapi";
import { capitalize, Typography } from "@mui/material";
import useSWR from "swr";
import { LoadingWrapper } from "../../ui/LoadingWrapper";
import { ClassSpecificInfo } from "./ClassSpecificInfo";
import { FeatureCard } from "./FeatureCard";

interface ClassFeaturesProps {
    currentLevel: number;
    className: string;
    subclassName?: string;
}

export interface FeatureAndLevel extends DndItem {
    levelInfo: LevelInfo;
}

export const ClassFeatures: React.FC<ClassFeaturesProps> = ({ currentLevel, className }) => {
    const { data: levelInfos, isLoading: isLoadingClassInfo } = useSWR<LevelInfo[]>(`/class/${className}/levels`, () => getLevelInfoForClass(className));
    const currentLevelInfo = levelInfos?.find(l => l.level === currentLevel);
    const activeLevelInfos = levelInfos?.filter(l => l.level <= currentLevel),
        activeLevelFeatures = activeLevelInfos?.flatMap((l: LevelInfo) => l.features.map((f: DndItem) => ({ ...f, levelInfo: l }))),
        nextLevelFeatures = levelInfos?.find(l => l.level === (currentLevel + 1))?.features;

    return <>
        <Typography variant="h5" textAlign="center">{capitalize(className)}</Typography>
        <LoadingWrapper isLoading={isLoadingClassInfo}>
            {currentLevelInfo?.class_specific &&
                <ClassSpecificInfo levelInfo={currentLevelInfo} />
            }
            {activeLevelFeatures?.map((f: FeatureAndLevel) => (<FeatureCard key={f.index} feature={f} />))}
            {currentLevel < 20 && (<>
                <Typography variant="h6">Next Level Features:</Typography>
                {nextLevelFeatures?.map((f: any) => (<FeatureCard key={f.index} feature={f} />))}
            </>)}
        </LoadingWrapper>
    </>
}