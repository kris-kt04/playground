import { createFileRoute } from '@tanstack/react-router'
import {PricingPage} from "@/features/homepage/pricing";

export const Route = createFileRoute('/_protected/pricing')({
  component: PricingPage,
})

function RouteComponent() {
  return (
    <PricingPage />
  )
}
