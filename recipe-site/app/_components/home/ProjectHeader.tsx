import { Box, Typography } from "@mui/material"

interface ProjectHeaderProps {
    project: any; // Replace 'any' with the actual type of your project object
}

export const ProjectHeader: React.FC<ProjectHeaderProps> = ({ project }) => {
    return <Box className="flex items-center justify-center w-full">
        {project.icon}
        <Typography variant="h6">{project.name}</Typography>
    </Box>
}