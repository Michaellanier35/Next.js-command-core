import "server-only";
import { db } from "@repo/database";
import { cache } from "react";

export interface WorkOrder {
	id: string;
	client_name: string | null;
	store_name: string | null;
	urgency: string | null;
	job_priority: string | null;
	region: string | null;
	wo_number: string | null;
	city: string | null;
	status: string | null;
	status_rank: number | null;
	scope: string | null;
	created_at: Date;
	updated_at: Date;
}

export const getWorkOrders = cache(async (): Promise<WorkOrder[]> => {
	try {
		const workOrders = await db.$queryRaw<WorkOrder[]>`
			SELECT
				id,
				client_name,
				store_name,
				urgency,
				job_priority,
				region,
				wo_number,
				city,
				status,
				status_rank,
				scope,
				created_at,
				updated_at
			FROM work_orders
			ORDER BY status_rank ASC NULLS LAST, created_at DESC
		`;

		return workOrders;
	} catch {
		return [];
	}
});

export const getWorkOrderById = cache(
	async (id: string): Promise<WorkOrder | null> => {
		try {
			const workOrders = await db.$queryRaw<WorkOrder[]>`
				SELECT
					id,
					client_name,
					store_name,
					urgency,
					job_priority,
					region,
					wo_number,
					city,
					status,
					status_rank,
					scope,
					created_at,
					updated_at
				FROM work_orders
				WHERE id = ${id}
				LIMIT 1
			`;

			return workOrders[0] ?? null;
		} catch {
			return null;
		}
	},
);
