import { cn } from "../utils.ts";
import GitHubSignInClient from "./github-sign-in-client.tsx";
import GoogleSignInClient from "./google-sign-in-client.tsx";
export interface IOAuthSignInClientProps {
  className?: string;
}

export default function OAuthSignInClient(props: IOAuthSignInClientProps) {
  const { className } = props;

  return (
    <div className={cn("flex flex-col gap-2", className)}>
      <GoogleSignInClient className="w-full" />
      <GitHubSignInClient className="w-full" />
    </div>
  );
}
