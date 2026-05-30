import { useNavigate } from "@tanstack/react-router";
import { AlertCircle, Home } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ErrorBoundaryProps {
	error: unknown;
	statusCode?: number;
	title?: string;
}

export function ErrorBoundary({
	error,
	statusCode = 500,
	title = "Something went wrong",
}: ErrorBoundaryProps) {
	const navigate = useNavigate();

	const getErrorDetails = () => {
		if (error instanceof Error) {
			return {
				message: error.message,
				details: error.toString(),
			};
		}

		if (typeof error === "object" && error !== null) {
			const err = error as Record<string, unknown>;
			return {
				message: (err.message as string) || "Unknown error",
				details: JSON.stringify(err),
			};
		}

		return {
			message: String(error),
			details: "",
		};
	};

	const { message, details } = getErrorDetails();

	const getErrorDescription = () => {
		switch (statusCode) {
			case 401:
				return "Your session has expired. Please log in again.";
			case 403:
				return "You don't have permission to access this resource.";
			case 404:
				return "The page you're looking for doesn't exist.";
			case 500:
				return "An internal server error occurred. Please try again later.";
			case 503:
				return "The service is temporarily unavailable. Please try again later.";
			default:
				return "An unexpected error occurred.";
		}
	};

	return (
		<div className="flex min-h-screen items-center justify-center">
			<div className="w-full max-w-md space-y-6">
				{/* Error Icon */}
				<div className="flex justify-center">
					<div className="rounded-full bg-red-100 p-4 dark:bg-red-950">
						<AlertCircle className="h-8 w-8 text-red-600 dark:text-red-400" />
					</div>
				</div>

				{/* Error Content */}
				<div className="space-y-2 text-center">
					<div className="flex items-center justify-center gap-2">
						<h1 className="font-bold text-3xl text-slate-900 dark:text-white">
							{statusCode}
						</h1>
						<div className="h-10 w-px bg-slate-300 dark:bg-slate-700" />
						<h2 className="font-semibold text-lg text-slate-700 dark:text-slate-300">
							{title}
						</h2>
					</div>
					<p className="text-slate-600 dark:text-slate-400">
						{getErrorDescription()}
					</p>
				</div>

				{/* Error Details (Dev only) */}
				{process.env.NODE_ENV === "development" && message && (
					<div className="space-y-2">
						<details className="text-sm">
							<summary className="cursor-pointer font-medium text-slate-700 hover:text-slate-900 dark:text-slate-300 dark:hover:text-white">
								Error Details
							</summary>
							<div className="mt-2 max-h-40 space-y-1 overflow-auto rounded bg-slate-900 p-3 text-slate-100 text-xs dark:bg-slate-800">
								<p className="font-mono text-red-400">{message}</p>
								{details && (
									<pre className="wrap-break-word whitespace-pre-wrap text-slate-400">
										{details}
									</pre>
								)}
							</div>
						</details>
					</div>
				)}

				{/* Actions */}
				<div className="flex justify-center gap-3 pt-2">
					<Button
						variant="outline"
						onClick={() => window.history.back()}
						className="gap-2"
					>
						Go Back
					</Button>
					<Button onClick={() => navigate({ to: "/" })} className="gap-2">
						<Home className="h-4 w-4" />
						Home
					</Button>
				</div>
			</div>
		</div>
	);
}
