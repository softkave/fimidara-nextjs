import { AppHeader } from "../internal/app-header.tsx";
import SignInClient from "./sign-in-client.tsx";

export interface ISignInContainerClientProps {
  redirectTo?: string;
}

export function SignInContainerClient({
  redirectTo,
}: ISignInContainerClientProps) {
  return (
    <main className="flex flex-col h-screen">
      <AppHeader />
      <div className="flex items-center justify-items-start flex-1 px-4 m-auto">
        <SignInClient redirectTo={redirectTo} />
      </div>
    </main>
  );
}
