import type { Prisma } from "@prisma/client";

function GenerateBlockJSON(req: Prisma.FormGetPayload<{ include: { fields: { include: { options: true }}}}>): string {
	const url = `https://sample.chigayuki.com/form/${req.id}`;
	return JSON.stringify({
		blocks: [
			{
				type: "section",
				text: {
					type: "mrkdwn",
					text: `*## ${req.title}*`
				}
			},
			...req.fields.map((field) => {
				return [
					{
						type: "divider"
					},
					{
						type: "section",
						text: {
							type: "mrkdwn",
							text: `*### ${field.label}*`
						}
					},
					...field.options.map((option) => {
						return {
							type: "section",
							text: {
								type: "mrkdwn",
								text: `*${option.label}*`
							},
							accessory: {
								type: "button",
								text: {
									type: "plain_text",
									text: "選択"
								},
								value: "form_test1",
								url: `${url}?${field.id}=${option.id}`
							}
						}
					})
				]
			}).flat()
		]
	})
}

export { GenerateBlockJSON };
