import * as z from "zod";
import { publicProcedure } from "..";

export const miscellaneousRouter = {
	healthCheck: publicProcedure.output(z.enum(["OK"])).handler(() => {
		return "OK";
	}),
};
