import { useQuery } from "@tanstack/react-query";

export const useSolanaPrice = () => {
	const { data: solPrice } = useQuery({
		queryKey: ["solana-price"],
		queryFn: async () => {
			const res = await fetch(
				"https://api.coingecko.com/api/v3/simple/price?ids=solana&vs_currencies=usd",
			);
			const data = await res.json();
			return data.solana.usd as number;
		},
		refetchInterval: 60000, // refetch every minute
	});
	return solPrice || 0;
};

export const useBnbPrice = () => {
	const { data: bnbPrice } = useQuery({
		queryKey: ["bnb-price"],
		queryFn: async () => {
			const res = await fetch(
				"https://api.coingecko.com/api/v3/simple/price?ids=binancecoin&vs_currencies=usd",
			);
			const data = await res.json();
			return data.binancecoin.usd as number;
		},
		refetchInterval: 60000, // refetch every minute
	});
	return bnbPrice || 0;
};

interface CryptoPriceData {
	usd: number;
	usd_24h_change: number;
}

interface CryptoPricesResponse {
	bitcoin?: CryptoPriceData;
	ethereum?: CryptoPriceData;
	solana?: CryptoPriceData;
	binancecoin?: CryptoPriceData;
	tether?: CryptoPriceData;
}

// Fallback static prices (approximate as of early 2026)
const FALLBACK_PRICES = {
	BTC: { price: 98450.32, change24h: 2.34 },
	ETH: { price: 3567.89, change24h: 1.87 },
	SOL: { price: 142.75, change24h: 3.45 },
	BNB: { price: 612.45, change24h: 1.92 },
	USDT: { price: 1.0, change24h: 0.01 },
};

export const useCryptoPrices = () => {
	const { data, isLoading } = useQuery({
		queryKey: ["crypto-prices-all"],
		queryFn: async () => {
			try {
				const res = await fetch(
					"https://api.coingecko.com/api/v3/simple/price?ids=bitcoin,ethereum,solana,binancecoin,tether&vs_currencies=usd&include_24hr_change=true",
				);

				// If rate limited or other error, return fallback
				if (!res.ok) {
					console.warn(
						"CoinGecko API rate limit or error, using fallback prices",
					);
					return FALLBACK_PRICES;
				}

				const data: CryptoPricesResponse = await res.json();
				return {
					BTC: {
						price: data.bitcoin?.usd || FALLBACK_PRICES.BTC.price,
						change24h:
							data.bitcoin?.usd_24h_change || FALLBACK_PRICES.BTC.change24h,
					},
					ETH: {
						price: data.ethereum?.usd || FALLBACK_PRICES.ETH.price,
						change24h:
							data.ethereum?.usd_24h_change || FALLBACK_PRICES.ETH.change24h,
					},
					SOL: {
						price: data.solana?.usd || FALLBACK_PRICES.SOL.price,
						change24h:
							data.solana?.usd_24h_change || FALLBACK_PRICES.SOL.change24h,
					},
					BNB: {
						price: data.binancecoin?.usd || FALLBACK_PRICES.BNB.price,
						change24h:
							data.binancecoin?.usd_24h_change || FALLBACK_PRICES.BNB.change24h,
					},
					USDT: {
						price: data.tether?.usd || FALLBACK_PRICES.USDT.price,
						change24h:
							data.tether?.usd_24h_change || FALLBACK_PRICES.USDT.change24h,
					},
				};
			} catch (error) {
				console.warn("Failed to fetch crypto prices, using fallback:", error);
				return FALLBACK_PRICES;
			}
		},
		refetchInterval: 300000, // refetch every 5 minutes (reduced to avoid rate limits)
		retry: 1, // Only retry once on failure
		staleTime: 120000, // Consider data fresh for 2 minutes
	});

	// Always return fallback if data is undefined
	return {
		prices: data || FALLBACK_PRICES,
		isLoading,
	};
};

export const useBitcoinPrice = () => {
	const { data: btcPrice } = useQuery({
		queryKey: ["bitcoin-price"],
		queryFn: async () => {
			const res = await fetch(
				"https://api.coingecko.com/api/v3/simple/price?ids=bitcoin&vs_currencies=usd&include_24hr_change=true",
			);
			const data = await res.json();
			return {
				price: data.bitcoin.usd as number,
				change24h: data.bitcoin.usd_24h_change as number,
			};
		},
		refetchInterval: 60000,
	});
	return btcPrice || { price: 0, change24h: 0 };
};
