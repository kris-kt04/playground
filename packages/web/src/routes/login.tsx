import { createFileRoute } from "@tanstack/react-router";
import {LoginPage} from "@/features/login/login";

export const Route = createFileRoute("/login")({
  component: RouteComponent,
});
function RouteComponent() {
  return (
    <div className="bg-black flex min-h-svh flex-col items-center justify-center gap-6 p-6 md:p-10">
      <LoginPage />
    </div>
  );
}