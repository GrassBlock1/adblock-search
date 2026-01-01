export type SearchEngine = 'google' | 'bing' | 'duckduckgo' | 'yahoo' | 'brave' | 'ecosia'

export const searchEngines: { id: SearchEngine; name: string; description: string }[] = [
  { id: 'google', name: 'Google', description: 'Google Search' },
  { id: 'bing', name: 'Bing', description: 'Microsoft Bing' },
  { id: 'duckduckgo', name: 'DuckDuckGo', description: 'DuckDuckGo Search' },
  { id: 'yahoo', name: 'Yahoo', description: 'Yahoo Search' },
  { id: 'brave', name: 'Brave Search', description: 'Brave Search' },
  { id: 'ecosia', name: 'Ecosia', description: 'Ecosia Search' },
]

export function generateFilterRules(domains: string[], engines: SearchEngine[]): string {
  const rules: string[] = []
  const timestamp = new Date().toISOString()

  rules.push(`! Title: Search Result Blacklist for ${domains.join(',')}`)
  rules.push(`! Description: Hide search results from specified domains`)
  rules.push(`! Generated: ${timestamp} using https://github.com/GrassBlock1/adblock-search`);
  rules.push(`! Domains: ${domains.length}`)
  rules.push(`! Search Engines: ${engines.join(', ')}`)
  rules.push(`!`)
  rules.push(`! Usage: Import this file into uBlock Origin or AdGuard`)
  rules.push(`!`)
  rules.push('')

  for (const domain of domains) {
    const cleanDomain = domain.trim().toLowerCase()
    if (!cleanDomain) continue

    if (engines.includes('google')) {
      rules.push(`! Google - ${cleanDomain}`)
			rules.push(`google.*##div[data-rpos]:has(a[href*="${cleanDomain}"])`);
      rules.push(`google.*##.g:has(a[href*="${cleanDomain}"])`)
      rules.push(`google.*##.Gx5Zad:has(a[href*="${cleanDomain}"])`)
      rules.push('')
    }

    if (engines.includes('bing')) {
      rules.push(`! Bing - ${cleanDomain}`)
      rules.push(`bing.com##cite:has-text(${cleanDomain}):upward(6)`);
      rules.push('')
    }

    if (engines.includes('duckduckgo')) {
      rules.push(`! DuckDuckGo - ${cleanDomain}`)
			rules.push(`duckduckgo.com##li:has(a[href*="${cleanDomain}"])`)
			rules.push(`duckduckgo.com##a[href*="${cleanDomain}"]:upward(4)`)
      rules.push(`duckduckgo.com##article:has(a[href*="${cleanDomain}"])`)
      rules.push(`duckduckgo.com##li[data-layout="organic"]:has(a[href*="${cleanDomain}"])`)
      rules.push('')
    }

    if (engines.includes('yahoo')) {
      rules.push(`! Yahoo - ${cleanDomain}`)
      rules.push(`search.yahoo.com##.dd.algo:has(a[href*="${cleanDomain}"])`)
      rules.push('')
    }

    if (engines.includes('brave')) {
      rules.push(`! Brave Search - ${cleanDomain}`)
      rules.push(`search.brave.com##div.snippet:has(a[href*="${cleanDomain}"])`)
      rules.push('')
    }

    if (engines.includes('ecosia')) {
      rules.push(`! Ecosia - ${cleanDomain}`)
      rules.push(`ecosia.org##.result:has(a[href*="${cleanDomain}"])`)
      rules.push('')
    }
  }

  return rules.join('\n')
}
