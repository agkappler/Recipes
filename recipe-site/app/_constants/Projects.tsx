import { Checklist, Description, ListAlt, Settings } from "@mui/icons-material";
import { ProjectStatus } from "./Status";

export const PROJECTS = [
    {
        name: "Site Infrastructure",
        description: "All things infrastructure! Covers the nitty gritty of deployments, hosting, and quality of life across all levels of the stack.",
        imageUrl: "https://via.placeholder.com/150",
        status: ProjectStatus.InProgress,
        icon: <Settings className="mr-1" />,
        url: "/",
        todo: [
            "About page, w/linked in photo and link.",
            "Deployments/hosting",
            "Tech aspects for each project",
            "i18n",
            "Swap to pnpm",
            "JUnit and Jest tests",
            "Logging",
            "BaseEnum class?"
        ]
    },
    {
        name: "Recipes",
        description: "Recipe management for custom calorie and quantity tracking across all ingredients.",
        imageUrl: "https://via.placeholder.com/150",
        status: ProjectStatus.InProgress,
        icon: <ListAlt className="mr-1" />,
        url: "/recipes",
        todo: [
            "Transaction handling for new ingredient",
            "Total calories and portions",
        ]
    },
    {
        name: "Daily Bounties",
        description: "Gamifying my recurring tasks and making it easy to generate ToDo lists for any occasion.",
        imageUrl: "https://via.placeholder.com/150",
        status: ProjectStatus.InProgress,
        icon: <Checklist className="mr-1" />,
        url: "/bounties",
        todo: ["Task table", "Task Object", "Task List View"]
    },
    {
        name: "Character Catalog",
        description: "Basically a digital player's handbook tailored to a single character's needs.",
        imageUrl: "https://via.placeholder.com/150",
        status: ProjectStatus.InProgress,
        icon: <Description className="mr-1" />,
        url: "/dnd",
        todo: ["Explore api", "Figure out desired features", "Add AI chatbot"]
    },
];