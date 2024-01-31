<script lang="ts">
	import { Formly, type IField } from 'svelte-formly';
	import { t } from '$lib/translations';

	const msg_required = $t('form.msg_field_required');
	let error = '';
	let loading = false;
	let status: number;

	const form_name = 'form_singup';
	const fields: IField[] = [
		{
			value: 'kamal',
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
			value: 'kamal',
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
			value: 'maroc.develop@gmail.com',
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
				email: $t('form.msg_mail_format')
			},
			prefix: {
				tag: 'div',
				classes: ['mb-4']
			}
		},
		{
			value: '123456',
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
				min: $t('form.msg_password_min') + ' 6',
				max: $t('form.msg_password_max') + ' 10'
			},
			prefix: {
				tag: 'div',
				classes: ['mb-4']
			}
		},
		{
			value: '123456',
			type: 'input', // required
			name: 'password_confirm', // required
			attributes: {
				type: 'password',
				id: 'password_confirm', // required
				classes: ['input input-bordered input-secondary dark:input-primary w-full'],
				placeholder: 'كلمة المرور',
				autocomplete: 'off'
			},
			rules: ['required', 'min:6', 'max:10'],
			messages: {
				required: msg_required,
				min: $t('form.msg_password_min') + ' 6',
				max: $t('form.msg_password_max') + ' 10'
			},
			prefix: {
				tag: 'div',
				classes: ['mb-4']
			}
		}
	];

	let data: any;
	const onSubmit = async ({ detail }: any) => {
		loading = true;
		data = detail;
		delete data.password_confirm;
		delete data.valid;

		const response = await fetch('/api/auth/signup', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify(data)
		});

		status = response.status;
		const result = await response.json();
		console.log('result', result);
		loading = false;
	};
</script>

{#if status === 200}
	<div role="alert" class="alert alert-success mt-6">
		<span>
			تم إنشاء حسابك بالبريد الإلكتروني بنجاح. لتفعيله، ما عليك سوى نسخ الرمز المكون من 6 أرقام من
			البريد الإلكتروني المرسل إليك. إذا كانت لديك أي أسئلة، تواصل مع فريق الدعم لدينا.
		</span>
	</div>
{:else}
	<Formly
		{fields}
		{form_name}
		on:submit={onSubmit}
		btnSubmit={{
			text: $t('form.submit'),
			classes: ['btn btn-sm btn-filled btn-neutral dark:text-primary text-secondary']
		}}
		btnReset={{
			text: $t('form.reset'),
			classes: ['btn btn-sm btn-filled btn-neutral dark:text-primary text-secondary']
		}}
	/>
{/if}

{#if loading}
	<div class="my-4 text-center">
		<span class="loading loading-ring loading-lg"></span>
	</div>
{/if}

{#if error != ''}
	<div role="alert" class="alert alert-error mt-6">
		<svg
			xmlns="http://www.w3.org/2000/svg"
			class="stroke-current shrink-0 h-6 w-6"
			fill="none"
			viewBox="0 0 24 24"
			><path
				stroke-linecap="round"
				stroke-linejoin="round"
				stroke-width="2"
				d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"
			/></svg
		>
		<span>{error}</span>
	</div>
{/if}
