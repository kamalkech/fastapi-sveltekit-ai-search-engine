<script lang="ts">
	import { Formly, type IField } from 'svelte-formly';

	const msg_required = 'هدا الحقل ضروري';

	const form_name = 'form_singup';
	const fields: IField[] = [
		{
			type: 'input', // required
			name: 'firstname', // required
			attributes: {
				type: 'text',
				id: 'firstname', // required
				classes: ['input input-bordered input-secondary dark:input-primary w-full'],
				placeholder: 'الإسم الشخصي'
			},
			rules: ['required'],
			messages: {
				required: msg_required
			},
			prefix: {
				tag: 'div',
				classes: ['mb-4']
			}
		},
		{
			type: 'input', // required
			name: 'lastname', // required
			attributes: {
				type: 'text',
				id: 'lastname', // required
				classes: ['input input-bordered input-secondary dark:input-primary w-full'],
				placeholder: 'الإسم العائلي'
			},
			rules: ['required'],
			messages: {
				required: msg_required
			},
			prefix: {
				tag: 'div',
				classes: ['mb-4']
			}
		},
		{
			type: 'input', // required
			name: 'email', // required
			attributes: {
				type: 'text',
				id: 'email', // required
				classes: ['input input-bordered input-secondary dark:input-primary w-full'],
				placeholder: 'البريد'
			},
			rules: ['required', 'email'],
			messages: {
				required: msg_required,
				email: 'تنسيق البريد الإلكتروني غير صحيح'
			},
			prefix: {
				tag: 'div',
				classes: ['mb-4']
			}
		},
		{
			type: 'input', // required
			name: 'password', // required
			attributes: {
				type: 'password',
				id: 'password', // required
				classes: ['input input-bordered input-secondary dark:input-primary w-full'],
				placeholder: 'كلمة المرور',
				autocomplete: 'off'
			},
			rules: ['required', 'min:6', 'max:10'],
			messages: {
				required: msg_required,
				min: 'كلمة المرور الخاصة بك قصيرة جدًا الأدنى = 6',
				max: 'كلمة المرور الخاصة بك طويلة جدًا الحد الأقصى = 10'
			},
			prefix: {
				tag: 'div',
				classes: ['mb-4']
			}
		},
		{
			type: 'input', // required
			name: 'password-confirm', // required
			attributes: {
				type: 'password',
				id: 'password-confirm', // required
				classes: ['input input-bordered input-secondary dark:input-primary w-full'],
				placeholder: 'كلمة المرور',
				autocomplete: 'off'
			},
			rules: ['required', 'min:6', 'max:10'],
			messages: {
				required: msg_required,
				min: 'كلمة المرور الخاصة بك قصيرة جدًا الأدنى = 6',
				max: 'كلمة المرور الخاصة بك طويلة جدًا الحد الأقصى = 10'
			},
			prefix: {
				tag: 'div',
				classes: ['mb-4']
			}
		}
	];

	let data = {};
	const onSubmit = ({ detail }: any) => {
		data = detail;
	};
</script>

<Formly
	{fields}
	{form_name}
	on:submit={onSubmit}
	btnSubmit={{
		text: 'اشتراك',
		classes: ['btn btn-sm btn-filled btn-neutral dark:text-primary text-secondary']
	}}
	btnReset={{
		text: 'الغاء',
		classes: ['btn btn-sm btn-filled btn-neutral dark:text-primary text-secondary']
	}}
/>
