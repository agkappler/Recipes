import { Circle } from "@mui/icons-material";
import { List, ListItem, ListItemIcon, ListItemText, ListSubheader, Paper, Typography } from "@mui/material";

interface ProjectTodosProps {
    todos: string[];
}

export const ProjectTodos: React.FC<ProjectTodosProps> = ({ todos }) => {
    return <Paper elevation={3} className="m-2 p-2">
        <Typography variant="subtitle1">Todo:</Typography>
        <List>
            {todos.map((item, index) => (
                <ListItem key={index}>
                    <ListItemIcon><Circle fontSize="small" /></ListItemIcon>
                    <ListItemText primary={item} />
                </ListItem>
            ))}
        </List>
    </Paper>
}