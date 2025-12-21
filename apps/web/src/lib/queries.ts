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
