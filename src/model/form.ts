import type { PrismaClient } from "@prisma/client";
import { Prisma } from '@prisma/client'

function GetForm(prisma: PrismaClient, id: string) {
	return prisma.form.findUnique({
		where: {
			id: id,
		},
		include: {
			fields: {
				include: {
					options: true,
				},
			},
		}
	});
}

export type ResForm = Prisma.PromiseReturnType<typeof GetForm>;


export { GetForm };
