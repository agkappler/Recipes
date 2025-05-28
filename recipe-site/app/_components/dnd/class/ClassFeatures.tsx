import { LevelInfo } from "@/app/api/dnd5eapi";
import { Typography } from "@mui/material";
import { ErrorMessage } from "../../ui/ErrorMessage";
import { FeatureCard } from "./FeatureCard";
import { ClassSpecificInfo } from "./ClassSpecificInfo";

interface ClassFeaturesProps {
    currentLevel: number;
    levelInfos: LevelInfo[] | undefined;
}

export const ClassFeatures: React.FC<ClassFeaturesProps> = ({ levelInfos, currentLevel }) => {
    if (levelInfos === undefined || levelInfos.length === 0) return <ErrorMessage errorMessage="Missing level data." />;
    const activeLevelInfos = levelInfos.filter(l => l.level <= currentLevel),
        activeLevelFeatures = activeLevelInfos.flatMap((l: any) => l.features.map((f: any) => ({ ...f, levelInfo: l }))),
        nextLevelFeatures = levelInfos.find(l => l.level === (currentLevel + 1))?.features;
    const currentLevelInfo = levelInfos.find(l => l.level === currentLevel);

    return <>
        <Typography variant="h5" textAlign="center">{levelInfos[0].class.name}</Typography>
        {currentLevelInfo?.class_specific &&
            <ClassSpecificInfo levelInfo={currentLevelInfo} />
        }
        {activeLevelFeatures.map((f: any) => (<FeatureCard key={f.index} feature={f} />))}
        <Typography variant="h6">Next Level Features:</Typography>
        {nextLevelFeatures?.map((f: any) => (<FeatureCard key={f.index} feature={f} />))}
    </>
}