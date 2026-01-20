"use client";

import type { PropsWithChildren } from "react";

interface AppErrorProps {
	error: Error & { digest?: string };
	reset: () => void;
}

export default function AppError({ error, reset }: AppErrorProps) {
	return (
		<div className="flex min-h-screen items-center justify-center bg-background px-6 py-12 text-foreground">
			<div className="w-full max-w-lg space-y-4 rounded-lg border border-border bg-card p-6 shadow-sm">
				<div>
					<h1 className="text-xl font-semibold">Something went wrong</h1>
					<p className="text-sm text-muted-foreground">
						We hit an error while loading this page. Try again or contact
						support if it persists.
					</p>
				</div>
				{error?.message && (
					<p className="rounded-md bg-muted px-3 py-2 text-xs text-muted-foreground">
						{error.message}
					</p>
				)}
				<button
					type="button"
					className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground"
					onClick={() => reset()}
				>
					Try again
				</button>
			</div>
		</div>
	);
}
