import { Box, Typography } from "@mui/material"

interface ProjectHeaderProps {
    project: any;
    variant?: any;
}

export const ProjectHeader: React.FC<ProjectHeaderProps> = ({ project, variant = "h6" }) => {
    return <Box className="flex items-center justify-center w-full">
        {project.icon}
        <Typography variant={variant}>{project.name}</Typography>
    </Box>
}