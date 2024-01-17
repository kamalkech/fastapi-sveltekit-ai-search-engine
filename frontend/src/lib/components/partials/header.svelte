<script lang="ts">
	import { createEventDispatcher } from 'svelte';
	import { questions } from '$lib/questions';
	import { t, locales, locale } from '$lib/translations';
	import { browser } from '$app/environment';

	$: if ($locale) {
		if (browser) {
			const one_year = 60 * 60 * 24 * 365;
			document.cookie = `lng=${$locale}; max-age=${one_year}; path=/`;
			document.documentElement.setAttribute('dir', $locale === 'en' ? 'ltr' : 'rtl');
		}
	}

	let showDropdown = false;
	export let user;
	const dispatch = createEventDispatcher();

	const onSelectQuestion = async (question: string) => {
		showDropdown = false;
		dispatch('onSelectQuestion', { question });
	};
</script>

<ul class="menu bg-base-200 lg:menu-horizontal rounded-box mb-4">
	<li>
		<div class="dropdown dropdown-bottom rounded-box text-sm flex justify-center">
			<div
				tabindex="-1"
				id="show-questions"
				role="button"
				class="text-black dark:text-white"
				on:focus={() => {
					showDropdown = true;
				}}
			>
				<span class="badge badge-xs badge-warning"></span>
				{$t('menu.selected_questions')}
			</div>
			{#if showDropdown}
				<ul
					tabindex="-1"
					class="dropdown-content z-[1] menu p-2 shadow bg-base-100 rounded-box w-96"
				>
					{#each questions as question}
						<li>
							<button on:click={async () => await onSelectQuestion(question)}>{question}</button>
						</li>
					{/each}
				</ul>
			{/if}
		</div>
	</li>
	<li>
		<div class="dropdown dropdown-bottom dropdown-hover rounded-box text-sm flex justify-center">
			{#if user}
				<form method="POST" action="?/logout">
					<button type="submit" class="text-red-400 btn-error" name="logout" value="true">
						<span class="badge badge-xs badge-error"></span>
						خروج
					</button>
				</form>
			{:else}
				<button
					class="text-black dark:text-white"
					on:click={() => document.getElementById('form_signup').showModal()}
				>
					<span class="badge badge-xs badge-primary"></span>
					{$t('menu.account')}
				</button>
			{/if}
		</div>
	</li>
	<li>
		<div class="dropdown dropdown-bottom rounded-box text-sm flex justify-center">
			<div tabindex="-3" role="button" id="show-questions" class="text-black dark:text-white">
				<span class="badge badge-xs badge-secondary"></span>
				{$t('menu.select_language')}
			</div>
			<ul tabindex="-3" class="dropdown-content z-[1] menu p-2 shadow bg-base-100 rounded-box">
				{#each $locales as value}
					<li>
						<button
							disabled={value == $locale ? true : false}
							class={value == $locale ? 'btn-disabled' : ''}
							on:click={() => {
								if (value != $locale) {
									locale.set(value);
								}
							}}
						>
							{$t(`menu.${value}`)}
						</button>
					</li>
				{/each}
			</ul>
		</div>
	</li>
</ul>

<style>
	.btn-disabled {
		pointer-events: none;
		cursor: not-allowed;
		opacity: 0.5;
	}
</style>
