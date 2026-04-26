import { Badge } from "../ui/Badge";
import type { SightingVerificationStatus } from "../../features/sightings/sightings.types";

const labels: Record<SightingVerificationStatus, string> = {
  pending: "Pending review",
  community_checked: "Community checked",
  verified: "Verified",
  rejected: "Rejected",
};

export function VerificationBadge({ status }: { status: SightingVerificationStatus }) {
  const tone = status === "verified" ? "success" : status === "rejected" ? "danger" : "neutral";

  return <Badge label={labels[status]} tone={tone} />;
}

