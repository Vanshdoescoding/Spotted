import { Badge } from "../ui/Badge";
import type { ConservationStatus } from "../../security/sightingPrivacy";

const labels: Record<ConservationStatus, string> = {
  not_evaluated: "Not evaluated",
  least_concern: "Least concern",
  near_threatened: "Near threatened",
  vulnerable: "Vulnerable",
  endangered: "Endangered",
  critically_endangered: "Critically endangered",
  extinct_in_wild: "Extinct in wild",
};

export function ConservationStatusBadge({ status }: { status: ConservationStatus }) {
  const tone = status === "endangered" || status === "critically_endangered" ? "danger" : status === "vulnerable" ? "warning" : "success";

  return <Badge label={labels[status]} tone={tone} />;
}

