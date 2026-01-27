import path from "node:path";
import tailwindcss from "@tailwindcss/vite";
import { tanstackRouter } from "@tanstack/router-plugin/vite";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";
import { VitePWA } from "vite-plugin-pwa";

export default defineConfig({
	plugins: [
		tailwindcss(),
		tanstackRouter({}),
		react(),
		VitePWA({
			registerType: "autoUpdate",
			includeAssets: ["favicon.ico", "apple-touch-icon.png", "mask-icon.svg"],
			manifest: {
				name: "RugPull Engine",
				short_name: "RugEngine",
				description: "RugPull Engine Web App",
				theme_color: "#ffffff",
				icons: [
					{
						src: "icon.jpg",
						sizes: "192x192",
						type: "image/jpeg",
					},
					{
						src: "icon.jpg",
						sizes: "512x512",
						type: "image/jpeg",
					},
				],
			},
		}) as any,
	],
	resolve: {
		alias: {
			"@": path.resolve(__dirname, "./src"),
		},
	},
});
