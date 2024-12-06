import { PrismaClient } from "@prisma/client";
import { Hono } from "hono";
import type { FormRequest } from "./types/form";
import { GenerateBlockJSON } from "./lib/build";

const admin = new Hono();
const prisma = new PrismaClient();

async function GenerateForm(req: FormRequest) {
	return await prisma.form.create({
		data: {
			title: req.title,
			fields: {
				create: req.field.map((field) => ({
					label: field.label,
					options: {
						create: field.options.map((option) => ({
							label: option.label,
						}),
					)}
				})),
			}
		},
		include: {
			fields: {
				include: {
					options: true,
				},
			},
		},
	});
}

admin.get("/", async (c) => {
	const form = await GenerateForm({
		title: "テストフォーム",
		field: [
			{
				label: "質問1",
				options: [
					{
						label: "選択肢1",
					},
					{
						label: "選択肢2",
					},
					{
						label: "選択肢3",
					},
				],
			},
			{
				label: "質問2",
				options: [
					{
						label: "選択肢1",
					},
					{
						label: "選択肢2",
					},
					{
						label: "選択肢3",
					},
				],
			},
		],
	})
	const generateBlock = GenerateBlockJSON(form);
	return c.text(`https://app.slack.com/block-kit-builder/T0HTW2RH7#${generateBlock}`);
});

export default admin;
