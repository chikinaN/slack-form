import { Hono } from "hono";
import { getCookie, setCookie } from "hono/cookie";
import { Layout } from "./lib/html";
import { PrismaClient, Prisma } from '@prisma/client'
import { getConnInfo } from '@hono/node-server/conninfo'

const form = new Hono();
const prisma = new PrismaClient();

function AlreadySubmitted() {
	return (
		<Layout>
			<p>Form already submitted</p>
		</Layout>
	)
}

function NotFound() {
	return (
		<Layout>
			<p>Form not found</p>
		</Layout>
	)
}

function CompleteForm(props: { title: string }) {
	return (
		<Layout>
			<p>{props.title}の回答ありがとうございました！</p>
		</Layout>
	)
}

function FailedForm(props: { title: string }) {
	return (
		<Layout>
			<p>{props.title}の回答に失敗しました</p>
		</Layout>
	)
}

form.get("/:id", async (c) => {
	const { id } = c.req.param();
	const forwardedFor = c.req.header('x-forwarded-for');
	const cfConnectingIp = c.req.header('cf-connecting-ip');
	const ip = forwardedFor || cfConnectingIp || getConnInfo(c).remote.address;
	if (!ip) {
		return c.html(<failedForm title="フォーム" />);
	}
	const form = await prisma.form.findUnique({
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
	if (!form) {
		return c.html(<NotFound />);
	}

	if (getCookie(c, `${id}_submitted`)) {
		return c.html(<AlreadySubmitted />);
	}
	const fieldIds = form.fields.map((field) => field.id);
	const result = await Promise.all(
		fieldIds.map((fieldId) =>
			prisma.submitData.findFirst({
				where: {
					fieldId: fieldId,
					ip: ip,
				},
			})
		)
	);
	console.log(result);
	if (result.some(item => item !== null)) {
		return c.html(<AlreadySubmitted />);
	}
	const fields = form.fields.map((field) => field.id)
	fields.forEach((field) => {
		const query = c.req.query(field);
		if (!query) return;

		prisma.submitData.create({
			data: {
				fieldId: field,
				ip: ip,
				optionId: query,
			}
		}).catch((e) => {
			return c.html(<FailedForm title={form.title} />);
		})
	})
	setCookie(c, `${id}_submitted`, 'true')
	return c.html(<CompleteForm title={form.title} />);
})

export default form;
