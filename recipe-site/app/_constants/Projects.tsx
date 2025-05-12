import { Checklist, Description, ListAlt, Settings } from "@mui/icons-material";
import { ProjectStatus } from "./Status";

export const PROJECTS = [
    {
        name: "Site Infrastructure",
        description: "This is for handy things to add to the site that will benefit all projects.",
        imageUrl: "https://via.placeholder.com/150",
        status: ProjectStatus.InProgress,
        icon: <Settings className="mr-1" />,
        url: "/",
        todo: [
            "About page, w/linked in photo and link.",
            "Deployments/hosting",
            "Stores/request manager?",
            "Tech aspects for each project"
        ]
    },
    {
        name: "Recipes",
        description: "This is an app to hold recipes with custom portions.",
        imageUrl: "https://via.placeholder.com/150",
        status: ProjectStatus.InProgress,
        icon: <ListAlt className="mr-1" />,
        url: "/recipes",
        todo: [
            "Ingredients, for shopping list and calories",
            "Total calories/quantity",
            "Clean up recipe table"
        ]
    },
    {
        name: "Daily Bounties",
        description: "This converts repeatable tasks into bounties, similar to a video game.",
        imageUrl: "https://via.placeholder.com/150",
        status: ProjectStatus.Concept,
        icon: <Checklist className="mr-1" />,
        // url: "/",
        todo: ["Task table", "Task Object", "Task List View"]
    },
    {
        name: "DND Character Sheet",
        description: "This is a simple character sheet for D&D to track abilities.",
        imageUrl: "https://via.placeholder.com/150",
        status: ProjectStatus.Concept,
        icon: <Description className="mr-1" />,
        // url: "/",
        todo: ["Explore api", "Figure out desired features"]
    },
];