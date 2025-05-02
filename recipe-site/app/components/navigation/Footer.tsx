import { Box, Typography } from "@mui/material"

export const Footer: React.FC = () => {
    return (
        <footer className="bg-gray-100 mt-10">
            <Box className="container" color="primary" width="100">
                <Typography variant="body1" color="textSecondary">
                    Footer Content
                    </Typography>
                </Box>
        </footer>
    )
}