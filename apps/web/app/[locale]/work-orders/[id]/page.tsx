import { getWorkOrderById } from "@saas/work-orders/lib/server";
import { Card, CardContent, CardHeader, CardTitle } from "@ui/components/card";
import { notFound } from "next/navigation";

interface WorkOrderDetailsPageProps {
	params: { id: string };
}

export default async function WorkOrderDetailsPage({
	params,
}: WorkOrderDetailsPageProps) {
	const { id } = params;
	const workOrder = await getWorkOrderById(id);

	if (!workOrder) {
		notFound();
	}

	return (
		<div className="flex flex-col gap-6">
			<div>
				<h1 className="text-3xl font-semibold">Work Order Details</h1>
				<p className="text-muted-foreground">WO #{workOrder.wo_number}</p>
			</div>
			<Card>
				<CardHeader>
					<CardTitle>{workOrder.client_name ?? "Unknown client"}</CardTitle>
				</CardHeader>
				<CardContent className="space-y-2 text-sm text-muted-foreground">
					<p>
						<strong className="text-foreground">Status:</strong>{" "}
						{workOrder.status ?? "Unknown"}
					</p>
					<p>
						<strong className="text-foreground">Location:</strong>{" "}
						{formatLocation(workOrder) || "No location details"}
					</p>
					<p>
						<strong className="text-foreground">Priority:</strong>{" "}
						{workOrder.job_priority ?? "Not set"}
					</p>
					<p className="text-foreground">
						{workOrder.scope ?? "No scope provided"}
					</p>
				</CardContent>
			</Card>
		</div>
	);
}

function formatLocation(order: {
	store_name: string | null;
	city: string | null;
	region: string | null;
}): string {
	return [order.store_name, order.city, order.region]
		.filter((segment): segment is string => Boolean(segment))
		.join(" · ");
}
