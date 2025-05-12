import { Box, Typography } from "@mui/material"

export const Footer: React.FC = () => {
    return (
        <footer className="bg-gray-100 mt-10">
            <Box className="container" color="primary" width="100">
                <Typography variant="body1" color="textSecondary" textAlign="center">
                    This site is maintained by Alex "Fargo" Kappler.
                </Typography>
            </Box>
        </footer>
    )
}