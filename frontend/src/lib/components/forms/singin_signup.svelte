<script>
	import { t } from '$lib/translations';

	import SignupForm from './signup.svelte';
	import SigninForm from './signin.svelte';
</script>

<dialog id="form_signup" class="modal">
	<div class="modal-box">
		<div role="tablist" class="tabs tabs-bordered">
			<input type="radio" name="my_tabs_1" role="tab" class="tab" aria-label={$t('form.signin')} />
			<div role="tabpanel" class="tab-content mt-6">
				<SigninForm />
			</div>

			<input
				type="radio"
				name="my_tabs_1"
				role="tab"
				class="tab"
				aria-label={$t('form.signup')}
				checked
			/>
			<div role="tabpanel" class="tab-content mt-6">
				<SignupForm />
			</div>
		</div>
		<div class="modal-action">
			<form method="dialog">
				<button class="btn btn-warning">{$t('form.close')}</button>
			</form>
		</div>
	</div>
</dialog>
