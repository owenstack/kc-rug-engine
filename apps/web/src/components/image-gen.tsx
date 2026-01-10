import { Download, TrendingUp, Upload } from "lucide-react";
import {
	type ChangeEvent,
	useCallback,
	useMemo,
	useRef,
	useState,
} from "react";

import pepe from "@/assets/images/pepe.jpg";
import { useSolanaPrice } from "@/lib/queries";
import { cn } from "@/lib/utils";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";

const CANVAS_CONFIG = {
	overlayGradientFactor: 0.5,
	overlayOpacityStart: 0.7,
	baseFontSizeFactor: 35,
	largeFontSizeFactor: 350,
	hugeFontSizeFactor: 25,
	leftMarginFactor: 0.04,
	rightColumnFactor: 0.3,
	startYFactor: 0.12,
	lineHeightFactor: 0.12,
	profitStartYFactor: 0.52,
	bottomYFactor: 0.96,
	baseFontScaleFactor: 0.8,
} as const;

interface Metrics {
	profit: string;
	multiplier: string;
	usdValue: number;
}

interface ImageGenProps {
	brandName?: string;
}

const calculateMetrics = (inv: string, sld: string, price: number): Metrics => {
	const investedNum = Number.parseFloat(inv) || 0;
	const soldNum = Number.parseFloat(sld) || 0;
	const profitNum = soldNum - investedNum;
	const multiplier = investedNum > 0 ? soldNum / investedNum : 0;
	const usdValue = profitNum * price;

	return {
		profit: profitNum.toFixed(2),
		multiplier: multiplier.toFixed(2),
		usdValue: Math.round(usdValue),
	};
};

export default function ImageGen({
	brandName = "RugPull Engine",
}: ImageGenProps) {
	const price = useSolanaPrice();
	const [invested, setInvested] = useState("2.10");
	const [sold, setSold] = useState("3.76");
	const [profit, setProfit] = useState("1.66");
	const [backgroundImage, setBackgroundImage] = useState<
		HTMLImageElement | string
	>(pepe);
	const [previewUrl, setPreviewUrl] = useState<string | undefined>();
	const [brandNameInput, setBrandNameInput] = useState(brandName);
	const canvasRef = useRef<HTMLCanvasElement>(null);
	const fileInputRef = useRef<HTMLInputElement>(null);

	const handleInvestedChange = useCallback(
		(value: string) => {
			setInvested(value);
			const metrics = calculateMetrics(value, sold, price);
			setProfit(metrics.profit);
		},
		[sold, price],
	);

	const handleSoldChange = useCallback(
		(value: string) => {
			setSold(value);
			const metrics = calculateMetrics(invested, value, price);
			setProfit(metrics.profit);
		},
		[invested, price],
	);

	const handleProfitChange = useCallback(
		(value: string) => {
			setProfit(value);
			const profitNum = Number.parseFloat(value) || 0;
			const investedNum = Number.parseFloat(invested) || 0;
			const newSold = (investedNum + profitNum).toFixed(2);
			setSold(newSold);
		},
		[invested],
	);

	const handleImageUpload = useCallback((e: ChangeEvent<HTMLInputElement>) => {
		const file = e.target.files?.[0];
		if (!file?.type.startsWith("image/")) return;

		const reader = new FileReader();
		reader.onload = (event) => {
			const dataUrl = event.target?.result?.toString() || "";
			if (!dataUrl) return;

			const img = new Image();
			img.onload = () => {
				setBackgroundImage(img);
				setPreviewUrl(dataUrl);
			};
			img.src = dataUrl;
		};
		reader.readAsDataURL(file);
	}, []);

	const drawCanvas = useCallback(
		(canvas: HTMLCanvasElement, img: HTMLImageElement) => {
			const ctx = canvas.getContext("2d");
			if (!ctx) return;

			// Set canvas size to match image
			const imgWidth = img.width;
			const imgHeight = img.height;
			canvas.width = imgWidth;
			canvas.height = imgHeight;

			// Draw the background image
			ctx.drawImage(img, 0, 0);

			// Add semi-transparent overlay on left side for better text visibility
			const overlayGradient = ctx.createLinearGradient(
				0,
				0,
				imgWidth * CANVAS_CONFIG.overlayGradientFactor,
				0,
			);
			overlayGradient.addColorStop(
				0,
				`rgba(0, 0, 0, ${CANVAS_CONFIG.overlayOpacityStart})`,
			);
			overlayGradient.addColorStop(1, "rgba(0, 0, 0, 0)");
			ctx.fillStyle = overlayGradient;
			ctx.fillRect(
				0,
				0,
				imgWidth * CANVAS_CONFIG.overlayGradientFactor,
				imgHeight,
			);

			// Calculate responsive font sizes based on canvas width
			const baseFontSize = imgWidth / CANVAS_CONFIG.baseFontSizeFactor;
			const largeFontSize = imgWidth / CANVAS_CONFIG.largeFontSizeFactor;
			const hugeFontSize = imgWidth / CANVAS_CONFIG.hugeFontSizeFactor;

			// Calculate positions based on canvas size
			const leftMargin = imgWidth * CANVAS_CONFIG.leftMarginFactor;
			const rightColumn = imgWidth * CANVAS_CONFIG.rightColumnFactor;
			const startY = imgHeight * CANVAS_CONFIG.startYFactor;
			const lineHeight = imgHeight * CANVAS_CONFIG.lineHeightFactor;

			// Draw stats (INVESTED, SOLD, PROFIT)
			ctx.font = `bold ${baseFontSize}px Arial`;
			ctx.fillStyle = "#ffffff";
			ctx.fillText("INVESTED", leftMargin, startY);
			ctx.fillText("SOLD", leftMargin, startY + lineHeight);
			ctx.fillText("PROFIT", leftMargin, startY + lineHeight * 2);

			ctx.fillStyle = "#00ff41";
			ctx.fillText(`${invested} SOL`, rightColumn, startY);
			ctx.fillText(`${sold} SOL`, rightColumn, startY + lineHeight);
			ctx.fillText(`${profit} SOL`, rightColumn, startY + lineHeight * 2);

			// Draw large profit display
			const metrics = calculateMetrics(invested, sold, price);
			const profitStartY = imgHeight * CANVAS_CONFIG.profitStartYFactor;

			ctx.font = `bold ${hugeFontSize}px Arial`;
			ctx.fillStyle = "#00ff41";
			ctx.fillText(`+${profit} SOL`, leftMargin + 30, profitStartY);

			ctx.font = `bold ${largeFontSize}px Arial`;
			ctx.fillText(
				`${metrics.multiplier}X`,
				leftMargin + 90,
				profitStartY + largeFontSize * 1.3,
			);
			ctx.fillText(
				`$${metrics.usdValue}`,
				leftMargin + 80,
				profitStartY + largeFontSize * 2.5,
			);

			// Draw brand name text at bottom
			const bottomY = imgHeight * CANVAS_CONFIG.bottomYFactor;
			ctx.font = `bold ${baseFontSize * CANVAS_CONFIG.baseFontScaleFactor}px Arial`;
			ctx.fillStyle = "#00ff41";
			ctx.fillText(brandNameInput, leftMargin, bottomY);

			const brandWidth = ctx.measureText(brandNameInput).width;

			// Draw chart indicator
			const chartX = leftMargin + brandWidth + 30;
			const chartY = bottomY - 25;
			ctx.strokeStyle = "#00ff41";
			ctx.lineWidth = 3;
			ctx.beginPath();
			ctx.moveTo(chartX, chartY + 10);
			ctx.lineTo(chartX + 30, chartY);
			ctx.lineTo(chartX + 40, chartY + 20);
			ctx.moveTo(chartX + 35, chartY + 5);
			ctx.lineTo(chartX + 45, chartY - 5);
			ctx.stroke();
		},
		[invested, sold, profit, price, brandNameInput],
	);

	const downloadImage = useCallback(() => {
		if (!backgroundImage || !canvasRef.current) {
			return;
		}

		if (backgroundImage instanceof HTMLImageElement) {
			drawCanvas(canvasRef.current, backgroundImage);
		}

		// Download
		const link = document.createElement("a");
		link.download = "crypto-profit.png";
		link.href = canvasRef.current.toDataURL("image/png");
		link.click();
	}, [backgroundImage, drawCanvas]);

	const metrics = useMemo(
		() => calculateMetrics(invested, sold, price),
		[invested, sold, price],
	);

	return (
		<div className="mx-auto mt-10 max-w-5xl">
			<div className="grid gap-8 md:grid-cols-2">
				{/* Controls Panel */}
				<div className="rounded-lg p-8">
					<h2 className="mb-6 font-semibold text-xl">Settings</h2>

					{/* Brand Name Input */}
					<div className="mb-6">
						<Label className="mb-2 block font-medium text-gray-300 text-sm">
							Brand Name
						</Label>
						<Input
							type="text"
							value={brandNameInput}
							onChange={(e) => setBrandNameInput(e.target.value)}
							className="w-full rounded-lg bg-gray-700 px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-green-500"
						/>
					</div>

					{/* Image Upload */}
					<div className="mb-6">
						<Label className="mb-2 block font-medium text-sm">
							Upload Pepe Image
						</Label>
						<Input
							ref={fileInputRef}
							type="file"
							accept="image/*"
							onChange={handleImageUpload}
							className="hidden"
						/>
						<Button
							onClick={() => fileInputRef.current?.click()}
							className="flex w-full items-center justify-center gap-2 rounded-lg bg-gray-700 px-6 py-3 font-bold text-white transition-colors hover:bg-gray-600"
						>
							<Upload size={20} />
							{backgroundImage ? "Change Image" : "Upload Image"}
						</Button>
						{backgroundImage && (
							<p className="mt-2 text-green-400 text-sm">✓ Image loaded</p>
						)}
					</div>

					{/* Number Inputs */}
					<div className="mb-6 grid gap-4">
						<div>
							<Label className="mb-2 block font-medium text-gray-300 text-sm">
								Invested (SOL)
							</Label>
							<Input
								type="number"
								step="0.01"
								value={invested}
								onChange={(e) => handleInvestedChange(e.target.value)}
								className="w-full rounded-lg bg-gray-700 px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-green-500"
							/>
						</div>

						<div>
							<Label className="mb-2 block font-medium text-gray-300 text-sm">
								Sold (SOL)
							</Label>
							<Input
								type="number"
								step="0.01"
								value={sold}
								onChange={(e) => handleSoldChange(e.target.value)}
								className="w-full rounded-lg bg-gray-700 px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-green-500"
							/>
						</div>

						<div>
							<Label className="mb-2 block font-medium text-gray-300 text-sm">
								Profit (SOL)
							</Label>
							<Input
								type="number"
								step="0.01"
								value={profit}
								onChange={(e) => handleProfitChange(e.target.value)}
								className="w-full rounded-lg bg-gray-700 px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-green-500"
							/>
						</div>
					</div>

					{/* Calculated Metrics */}
					<div className="mb-6 rounded-lg bg-gray-700 p-4">
						<div className="space-y-1 text-gray-300 text-sm">
							<div>
								Multiplier:{" "}
								<span className="font-bold text-green-400">
									{metrics.multiplier}X
								</span>
							</div>
							<div>
								USD Value:{" "}
								<span className="font-bold text-green-400">
									${metrics.usdValue}
								</span>
							</div>
						</div>
					</div>

					{/* Download Button */}
					<Button
						onClick={downloadImage}
						className={cn(
							"flex w-full items-center justify-center gap-2 rounded-lg px-6 py-3 font-bold transition-colors",
							"bg-green-600 text-white hover:bg-green-700",
						)}
					>
						<Download size={20} />
						Download Image
					</Button>
				</div>

				{/* Preview Panel */}
				<div className="rounded-lg bg-gray-800 p-8">
					<h2 className="mb-4 font-bold text-white text-xl">Preview</h2>
					<div className="relative overflow-hidden rounded-lg bg-black">
						<img
							src={previewUrl || pepe}
							alt="Preview"
							className="h-auto w-full object-cover"
						/>
						{/* Gradient Overlay matching canvas logic */}
						<div
							className="absolute inset-y-0 left-0 w-1/2"
							style={{
								background:
									"linear-gradient(to right, rgba(0,0,0,0.7) 0%, rgba(0,0,0,0) 100%)",
							}}
						/>

						<div className="pointer-events-none absolute inset-0">
							<div className="flex h-full flex-col justify-between p-4 md:p-6 lg:p-8">
								<div className="relative z-10">
									<div className="mb-1 font-bold text-sm text-white md:text-base lg:text-lg">
										INVESTED{" "}
										<span className="ml-4 text-green-400">{invested} SOL</span>
									</div>
									<div className="mb-1 font-bold text-sm text-white md:text-base lg:text-lg">
										SOLD <span className="ml-4 text-green-400">{sold} SOL</span>
									</div>
									<div className="font-bold text-sm text-white md:text-base lg:text-lg">
										PROFIT{" "}
										<span className="ml-4 text-green-400">{profit} SOL</span>
									</div>
								</div>
								<div className="relative z-10">
									<div className="font-bold text-green-400 text-xl md:text-2xl lg:text-4xl">
										+{profit} SOL
									</div>
									<div className="font-bold text-green-400 text-lg md:text-xl lg:text-2xl">
										{metrics.multiplier}X
									</div>
									<div className="font-bold text-green-400 text-lg md:text-xl lg:text-2xl">
										${metrics.usdValue}
									</div>
								</div>
								<div className="relative z-10 flex items-center gap-2 text-sm md:text-base">
									<span className="font-bold text-green-400">
										{brandNameInput}
									</span>

									{/* Chart SVG matching canvas draw logic */}
									<TrendingUp className="font-bold text-green-400" />
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
			<canvas ref={canvasRef} className="hidden" />
		</div>
	);
}
