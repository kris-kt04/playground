import { createFileRoute } from "@tanstack/react-router";
import {HomePage} from "@/features/hello";

export const Route = createFileRoute("/hello")({
  component: RouteComponent,
});
function RouteComponent() {
  return (
    <>
      <title>Hello Page</title>
      <div className="bg-black flex min-h-svh flex-col items-center justify-center gap-6 p-6 md:p-10">
        <HomePage />
      </div>
    </>
  );
}