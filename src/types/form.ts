export type FormRequest = {
	title: string;
	field: Field[];
}

export type Field = {
	label: string;
	options: Option[];
}

export type Option = {
	label: string;
}
