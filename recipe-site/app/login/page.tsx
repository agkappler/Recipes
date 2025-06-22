import { LoginForm } from "../_components/LoginForm";
import { AlertMessage } from "../_components/ui/AlertMessage";

export default function LoginPage() {
    return <>
        <AlertMessage message="Authentication is only required for write actions, so feel free to take a look around!" />
        <LoginForm />
    </>;
}