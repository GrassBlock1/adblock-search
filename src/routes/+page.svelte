<script lang="ts">
	import { onMount } from 'svelte'
	import { searchEngines, generateFilterRules, type SearchEngine } from '$lib/filterRules'

	let domainInput = ''
	let domains: string[] = []
	let selectedEngines: SearchEngine[] = ['google']
	let filterContent = ''
	let isDark = false
	let shareUrl = ''
	let saveSuccess = false

	onMount(async () => {
		isDark = window.matchMedia('(prefers-color-scheme: dark)').matches
		window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
			isDark = e.matches
		})
	})

	function addDomain() {
		const domain = domainInput.trim().toLowerCase()
		if (domain && !domains.includes(domain)) {
			domains = [...domains, domain]
			domainInput = ''
		}
	}

	function removeDomain(domain: string) {
		domains = domains.filter(d => d !== domain)
	}

	function toggleEngine(engine: SearchEngine) {
		if (selectedEngines.includes(engine)) {
			selectedEngines = selectedEngines.filter(e => e !== engine)
		} else {
			selectedEngines = [...selectedEngines, engine]
		}
	}

	function generateRules() {
		if (domains.length === 0 || selectedEngines.length === 0) return
		filterContent = generateFilterRules(domains, selectedEngines)
	}

	function downloadRules() {
		if (!filterContent) return

		const blob = new Blob([filterContent], { type: 'text/plain' })
		const url = URL.createObjectURL(blob)
		const a = document.createElement('a')
		a.href = url
		a.download = 'search-filter-rules.txt'
		a.click()
		URL.revokeObjectURL(url)
	}

	function copyToClipboard() {
		if (!filterContent) return
		navigator.clipboard.writeText(filterContent)
	}



	function copyShareUrl() {
		if (!shareUrl) return
		navigator.clipboard.writeText(shareUrl)
	}

	$: if (domains.length > 0 && selectedEngines.length > 0) {
		generateRules()
	} else {
		filterContent = ''
	}
</script>

<div class="min-h-screen transition-colors duration-200" class:dark={isDark}>
	<div class="container mx-auto px-4 py-8 max-w-4xl">
		<header class="text-center mb-12">
			<h1 class="text-4xl font-bold mb-3 text-gray-900 dark:text-white">
				Search Filter Generator
			</h1>
			<p class="text-gray-600 dark:text-gray-400">
				Create custom adblock rules to hide unwanted domains from search results
			</p>
		</header>

		<div class="space-y-6">
			<section class="card">
				<h2 class="text-2xl font-semibold mb-4 text-gray-900 dark:text-white">
					Add Domains
				</h2>
				<div class="flex gap-2 mb-4">
					<input
						type="text"
						bind:value={domainInput}
						on:keydown={(e) => e.key === 'Enter' && addDomain()}
						placeholder="example.com"
						class="input flex-1"
					/>
					<button on:click={addDomain} class="btn btn-primary">
						Add
					</button>
				</div>

				{#if domains.length > 0}
					<div class="flex flex-wrap gap-2">
						{#each domains as domain (domain)}
							<div class="badge">
								<span>{domain}</span>
								<button
									on:click={() => removeDomain(domain)}
									class="ml-2 text-red-500 hover:text-red-700 font-bold"
								>
									×
								</button>
							</div>
						{/each}
					</div>
				{:else}
					<p class="text-gray-500 dark:text-gray-500 text-sm">
						No domains added yet. Enter a domain above to get started.
					</p>
				{/if}
			</section>

			<section class="card">
				<h2 class="text-2xl font-semibold mb-4 text-gray-900 dark:text-white">
					Select Search Engines
				</h2>
				<div class="grid grid-cols-2 md:grid-cols-3 gap-3">
					{#each searchEngines as engine (engine.id)}
						<label class="checkbox-card" class:selected={selectedEngines.includes(engine.id)}>
							<input
								type="checkbox"
								checked={selectedEngines.includes(engine.id)}
								on:change={() => toggleEngine(engine.id)}
								class="sr-only"
							/>
							<div class="flex items-center">
								<div class="checkbox-box">
									{#if selectedEngines.includes(engine.id)}
										<div class="i-carbon-checkmark text-white" ></div>
									{/if}
								</div>
								<div class="ml-3">
									<div class="font-medium text-gray-900 dark:text-white">
										{engine.name}
									</div>
								</div>
							</div>
						</label>
					{/each}
				</div>
			</section>

			{#if filterContent}
				<section class="card">
					<div class="flex justify-between items-center mb-4">
						<h2 class="text-2xl font-semibold text-gray-900 dark:text-white">
							Generated Rules
						</h2>
						<div class="flex gap-2 flex-wrap justify-end">
							<button on:click={copyToClipboard} class="btn btn-secondary">
								Copy
							</button>
							<button on:click={downloadRules} class="btn btn-primary">
								Download
							</button>
						</div>
					</div>
					<pre class="code-block">{filterContent}</pre>

					{#if shareUrl}
						<div class="share-section">
							<div class="share-header">
								<h3 class="text-sm font-semibold text-gray-900 dark:text-white">
									Shareable Link
								</h3>
								{#if saveSuccess}
                  <span class="text-sm text-green-600 dark:text-green-400 font-medium">
                    Saved!
                  </span>
								{/if}
							</div>
							<div class="share-link-container">
								<input
									type="text"
									value={shareUrl}
									readonly
									class="share-link-input"
								/>
								<button on:click={copyShareUrl} class="btn btn-secondary btn-small">
									Copy Link
								</button>
							</div>
							<p class="text-xs text-gray-600 dark:text-gray-400 mt-2">
								Share this link with others to let them import these rules automatically.
							</p>
						</div>
					{/if}

					<p class="text-sm text-gray-600 dark:text-gray-400 mt-4">
						Import this file into uBlock Origin, AdGuard, or any compatible ad blocker.
					</p>
				</section>
			{/if}
		</div>
	</div>
</div>

<style>
    :global(body) {
        margin: 0;
        padding: 0;
    }

    .dark {
        background-color: #1a1a1a;
        color: white;
    }

    .card {
        background: white;
        border-radius: 12px;
        padding: 24px;
        box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
        transition: all 0.2s;
    }

    .dark .card {
        background: #2a2a2a;
        box-shadow: 0 1px 3px rgba(0, 0, 0, 0.3);
    }

    .input {
        padding: 10px 14px;
        border: 1px solid #e5e7eb;
        border-radius: 8px;
        font-size: 14px;
        transition: all 0.2s;
        background: white;
        color: #1a1a1a;
    }

    .dark .input {
        background: #1a1a1a;
        border-color: #404040;
        color: white;
    }

    .input:focus {
        outline: none;
        border-color: #3b82f6;
        box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
    }

    .btn {
        padding: 10px 20px;
        border-radius: 8px;
        font-weight: 500;
        font-size: 14px;
        cursor: pointer;
        transition: all 0.2s;
        border: none;
    }

    .btn-primary {
        background: #3b82f6;
        color: white;
    }

    .btn-primary:hover {
        background: #2563eb;
        transform: translateY(-1px);
        box-shadow: 0 4px 12px rgba(59, 130, 246, 0.3);
    }

    .btn-secondary {
        background: #6b7280;
        color: white;
    }

    .btn-secondary:hover {
        background: #4b5563;
        transform: translateY(-1px);
    }

    .btn-small {
        padding: 8px 16px;
        font-size: 13px;
    }

    .badge {
        display: inline-flex;
        align-items: center;
        padding: 6px 12px;
        background: #eff6ff;
        color: #1e40af;
        border-radius: 6px;
        font-size: 14px;
        font-weight: 500;
    }

    .dark .badge {
        background: #1e3a8a;
        color: #93c5fd;
    }

    .checkbox-card {
        padding: 14px;
        border: 2px solid #e5e7eb;
        border-radius: 8px;
        cursor: pointer;
        transition: all 0.2s;
    }

    .dark .checkbox-card {
        border-color: #404040;
    }

    .checkbox-card:hover {
        border-color: #3b82f6;
        background: #f9fafb;
    }

    .dark .checkbox-card:hover {
        border-color: #3b82f6;
        background: #1a1a1a;
    }

    .checkbox-card.selected {
        border-color: #3b82f6;
        background: #eff6ff;
    }

    .dark .checkbox-card.selected {
        background: #1e3a8a;
    }

    .checkbox-box {
        width: 20px;
        height: 20px;
        border-radius: 4px;
        background: white;
        border: 2px solid #d1d5db;
        display: flex;
        align-items: center;
        justify-content: center;
        transition: all 0.2s;
    }

    .dark .checkbox-box {
        background: #1a1a1a;
        border-color: #404040;
    }

    .checkbox-card.selected .checkbox-box {
        background: #3b82f6;
        border-color: #3b82f6;
    }

    .code-block {
        background: #f9fafb;
        border: 1px solid #e5e7eb;
        border-radius: 8px;
        padding: 16px;
        font-size: 12px;
        font-family: 'Courier New', monospace;
        overflow-x: auto;
        max-height: 400px;
        overflow-y: auto;
        color: #1a1a1a;
    }

    .dark .code-block {
        background: #1a1a1a;
        border-color: #404040;
        color: #e5e7eb;
    }

    .sr-only {
        position: absolute;
        width: 1px;
        height: 1px;
        padding: 0;
        margin: -1px;
        overflow: hidden;
        clip: rect(0, 0, 0, 0);
        white-space: nowrap;
        border-width: 0;
    }

    .share-section {
        margin-top: 16px;
        padding-top: 16px;
        border-top: 1px solid #e5e7eb;
    }

    .dark .share-section {
        border-top-color: #404040;
    }

    .share-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 12px;
    }

    .share-link-container {
        display: flex;
        gap: 8px;
    }

    .share-link-input {
        flex: 1;
        padding: 10px 14px;
        border: 1px solid #e5e7eb;
        border-radius: 8px;
        font-size: 13px;
        font-family: 'Courier New', monospace;
        background: #f9fafb;
        color: #1a1a1a;
        word-break: break-all;
    }

    .dark .share-link-input {
        background: #1a1a1a;
        border-color: #404040;
        color: #e5e7eb;
    }
</style>
