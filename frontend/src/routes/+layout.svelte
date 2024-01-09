<script>
	import '../app.css';
</script>

<div class="navbar bg-base-100 flex items-center justify-center">
  
  <div class="navbar-center">
    <div class="logo">
			<img src="/logo.png" alt="logo" class="w-16 h-16 rounded-full shadow-lg shadow-indigo-500/50" />
		</div>
  </div>
  
</div>

<div class="flex min-w-screen flex-col items-center justify-center mt-20">
	<slot />
</div>
