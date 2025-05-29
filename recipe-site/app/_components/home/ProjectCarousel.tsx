'use client';

import { PROJECTS } from "@/app/_constants/Projects";
import { ChevronLeft, ChevronRight } from "@mui/icons-material";
import CircleIcon from "@mui/icons-material/Circle";
import CircleOutlinedIcon from "@mui/icons-material/CircleOutlined";
import { Box, Button, IconButton, Paper, Typography } from "@mui/material";
import React, { useState } from "react";
import { StatusChip } from "../ui/StatusChip";
import { ProjectHeader } from "./ProjectHeader";

export const ProjectCarousel: React.FC = () => {
    const [currentIndex, setCurrentIndex] = useState(0);
    const handleNext = () => setCurrentIndex((prevIndex) => (prevIndex + 1) % PROJECTS.length);
    const handlePrev = () => setCurrentIndex((prevIndex) => (prevIndex - 1 + PROJECTS.length) % PROJECTS.length);
    const currentProject = PROJECTS[currentIndex];

    return (
        <Box display="flex" flexDirection="column" alignItems="center" gap={2} marginTop={4}>
            {/* Carousel Section */}
            <Box
                display="flex"
                flexDirection="row"
                alignItems="center"
                justifyContent="space-between"
                gap={2}
                width="100%"
                paddingX={2}
            >
                {/* Back Arrow */}
                <IconButton onClick={handlePrev}><ChevronLeft /></IconButton>

                {/* Projects */}
                <Box gap={2} sx={{
                    width: "100%",
                    height: "200px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                }}>
                    {PROJECTS.map((project, index) => {
                        const isCurrent = index === currentIndex;
                        const isLeft = index === (currentIndex - 1 + PROJECTS.length) % PROJECTS.length;
                        const isRight = index === (currentIndex + 1) % PROJECTS.length;

                        return (
                            <Paper
                                key={index}
                                elevation={3}
                                sx={{
                                    width: "30%",
                                    height: "200px",
                                    opacity: isCurrent ? 1 : ((isLeft || isRight) ? 0.75 : 0),
                                    // opacity: (isCurrent || isLeft || isRight) ? 1 : 0,
                                    transform: isCurrent
                                        ? "scale(1)"
                                        : isLeft
                                            ? "translateX(-50%) scale(0.75)"
                                            : "translateX(50%) scale(0.75)",
                                    transition: "all 0.5s ease-in-out, opacity 0.5s ease-in-out, left 0.5s ease-in-out",
                                    position: "absolute",
                                    left: isCurrent ? "35%" : isLeft ? "20%" : "50%",
                                    textAlign: "center",
                                    padding: 2,
                                    zIndex: isCurrent ? 3 : (isRight || isLeft) ? 2 : 1,

                                    display: "flex",
                                    flexDirection: "column",
                                    gap: 1,
                                    alignItems: "center"
                                }}
                            >
                                <ProjectHeader project={project} />
                                <StatusChip label={project.status} />
                                <Typography variant="body1" textAlign="center">{project.description}</Typography>
                            </Paper>
                        );
                    })}
                </Box>

                {/* Forward Arrow */}
                <IconButton onClick={handleNext}><ChevronRight /></IconButton>
            </Box>

            {/* Pagination Indicators */}
            <Box display="flex" justifyContent="center" gap={1} marginTop={2}>
                {PROJECTS.map((_, index) => (
                    <IconButton key={index} size="small" onClick={() => setCurrentIndex(index)}>
                        {index === currentIndex
                            ? <CircleIcon fontSize="small" />
                            : <CircleOutlinedIcon fontSize="small" />
                        }
                    </IconButton>
                ))}
            </Box>

            {/* Description Section */}
            <Box sx={{ maxWidth: "600px", textAlign: "center", marginTop: 2, }}>
                <Box display="flex" justifyContent="center" gap={2}>
                    <Button
                        variant="contained"
                        color="primary"
                        href={`/projects/${currentIndex}`}
                    >
                        Project Details
                    </Button>
                    <Button
                        variant="contained"
                        color="primary"
                        href={currentProject.url}
                    >
                        View Project
                    </Button>
                </Box>
            </Box>
        </Box>
    );
};