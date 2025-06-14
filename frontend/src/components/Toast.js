import { useEffect } from "react";
import { useToast } from "../context/ToastContext";

const Toast = () => {
	const { toasts, removeToast } = useToast();

	useEffect(() => {
		toasts.forEach((toast) => {
			const timer = setTimeout(() => {
				removeToast(toast.id);
			}, 5000);

			return () => clearTimeout(timer);
		});
	}, [toasts, removeToast]);

	if (toasts.length === 0) return null;

	return (
		<div className="fixed top-4 right-4 z-50 space-y-2">
			{toasts.map((toast) => (
				<div
					key={toast.id}
					className={`max-w-sm p-4 rounded-lg shadow-lg transition-all duration-300 ${
						toast.type === "success"
							? "bg-green-500 text-white"
							: toast.type === "error"
							? "bg-red-500 text-white"
							: toast.type === "warning"
							? "bg-yellow-500 text-white"
							: "bg-blue-500 text-white"
					}`}
				>
					<div className="flex justify-between items-center">
						<p className="text-sm font-medium">{toast.message}</p>
						<button
							onClick={() => removeToast(toast.id)}
							className="ml-4 text-white hover:text-gray-200"
						>
							<svg
								className="w-4 h-4"
								fill="none"
								stroke="currentColor"
								viewBox="0 0 24 24"
							>
								<path
									strokeLinecap="round"
									strokeLinejoin="round"
									strokeWidth={2}
									d="M6 18L18 6M6 6l12 12"
								/>
							</svg>
						</button>
					</div>
				</div>
			))}
		</div>
	);
};

export default Toast;
