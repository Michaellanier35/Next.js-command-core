import { getWorkOrders } from "@saas/work-orders/lib/server";
import { Card, CardContent } from "@ui/components/card";
import Link from "next/link";

const WORK_ORDER_STATUSES = [
	"NEW_WORK_ORDERS",
	"READY_FOR_DISPATCH",
	"IN_PROGRESS",
	"NEEDS_OFFICE_FOLLOW_UP",
	"ESTIMATE_SUBMITTED_PENDING_APPROVAL",
	"WAITING_ON_PARTS_MATERIALS",
	"READY_FOR_RETURN_ETA_NOT_SET",
	"READY_FOR_INVOICING",
	"INVOICED_PENDING_PAYMENT",
] as const;

type WorkOrderStatus = (typeof WORK_ORDER_STATUSES)[number];

const COLUMN_LABELS: Record<WorkOrderStatus, string> = {
	NEW_WORK_ORDERS: "New work orders",
	READY_FOR_DISPATCH: "Ready for dispatch",
	IN_PROGRESS: "In progress",
	NEEDS_OFFICE_FOLLOW_UP: "Needs office follow-up",
	ESTIMATE_SUBMITTED_PENDING_APPROVAL: "Estimate submitted (pending approval)",
	WAITING_ON_PARTS_MATERIALS: "Waiting on parts/materials",
	READY_FOR_RETURN_ETA_NOT_SET: "Ready for return (ETA not set)",
	READY_FOR_INVOICING: "Ready for invoicing",
	INVOICED_PENDING_PAYMENT: "Invoiced (pending payment)",
};

interface WorkOrdersPageProps {
	params: Promise<{ locale: string }>;
}

export default async function WorkOrdersPage({ params }: WorkOrdersPageProps) {
	const { locale } = await params;
	const workOrders = await getWorkOrders();
	const columns = WORK_ORDER_STATUSES.map((status) => ({
		status,
		orders: workOrders.filter((order) => order.status === status),
	}));

	return (
		<div className="flex h-full flex-col gap-6">
			<div className="flex flex-col gap-2">
				<h1 className="text-3xl font-semibold">Work Orders</h1>
				<p className="text-muted-foreground">
					Read-only overview of active work orders by status.
				</p>
			</div>
			<div className="flex gap-4 overflow-x-auto pb-4">
				{columns.map((column) => (
					<div
						key={column.status}
						className="flex w-80 flex-shrink-0 flex-col gap-3"
					>
						<div className="flex items-center justify-between">
							<h2 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">
								{COLUMN_LABELS[column.status]}
							</h2>
							<span className="text-xs font-medium text-muted-foreground">
								{column.orders.length}
							</span>
						</div>
						<div className="flex flex-col gap-3">
							{column.orders.map((order) => (
								<Link
									key={order.id}
									href={`/${locale}/work-orders/${order.id}`}
									className="block"
								>
									<Card className="transition hover:border-primary/40 hover:shadow-sm">
										<CardContent className="space-y-2 p-4">
											<div className="flex items-center justify-between">
												<p className="text-xs font-semibold text-muted-foreground">
													WO #{order.wo_number ?? "—"}
												</p>
											</div>
											<div>
												<p className="text-base font-semibold">
													{order.client_name ?? "Unknown client"}
												</p>
												<p className="text-xs text-muted-foreground">
													{formatSubtitle(order)}
												</p>
											</div>
											<p className="text-sm text-foreground">
												{shortenScope(order.scope)}
											</p>
										</CardContent>
									</Card>
								</Link>
							))}
							{column.orders.length === 0 && (
								<Card className="border-dashed">
									<CardContent className="p-4 text-xs text-muted-foreground">
										No work orders in this status.
									</CardContent>
								</Card>
							)}
						</div>
					</div>
				))}
			</div>
		</div>
	);
}

function formatSubtitle(order: {
	store_name: string | null;
	city: string | null;
	region: string | null;
	job_priority: string | null;
}): string {
	const segments = [
		order.store_name,
		order.city,
		order.region,
		order.job_priority,
	].filter((segment): segment is string => Boolean(segment));

	return segments.length > 0 ? segments.join(" · ") : "No location details";
}

function shortenScope(scope: string | null, maxLength = 140): string {
	if (!scope) {
		return "No scope provided";
	}

	if (scope.length <= maxLength) {
		return scope;
	}

	return `${scope.slice(0, maxLength).trim()}…`;
}
