<script lang="ts">
	import type { PageData } from './$types';

	export let data: PageData;

	const { user } = data;
</script>

<h1>Guarded</h1>
{JSON.stringify(user)}
<form method="POST" action="?/logout">
	<button type="submit" name="logout" value="true">Logout</button>
</form>
