import {createFileRoute} from "@tanstack/react-router";
import {FeaturesPage} from "@/features/homepage/features";

export const Route = createFileRoute("/_protected/features")({
  component: RouteComponent,
});
function RouteComponent() {
  return (
    <>
      <title>Features Page</title>
      <div className="bg-black flex min-h-svh flex-col items-center justify-center gap-6 p-6 md:p-10">
        <FeaturesPage />
      </div>
    </>
  );
}