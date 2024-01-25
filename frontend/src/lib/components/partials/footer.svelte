<script lang="ts">
	import { t } from '$lib/translations';
	const currentYear = new Date().getFullYear();
</script>

<footer class="footer footer-center p-4 text-base-content absolute -bottom-40">
	<aside>
		<p>
			{$t('footer.copyright').replace('$$$', currentYear)}
			<a href="https://kamal.gg" target="_blank" rel="noopener noreferrer">
				<span class="badge badge-sm badge-secondary dark:badge-primary font-bold"
					>{$t('footer.kamal')}</span
				>
			</a>
		</p>
	</aside>
</footer>
