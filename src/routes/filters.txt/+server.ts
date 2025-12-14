import { error } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import type { SearchEngine } from '$lib/filterRules';
import { generateFilterRules, searchEngines as availableSearchEngines } from '$lib/filterRules';

export const prerender = false;

export const GET: RequestHandler = ({ url }) => {
	const domainsQuery = url.searchParams.get('d')
	const searchEnginesQuery = url.searchParams.get('s') || "google"

	const domains = domainsQuery
		? domainsQuery
				.split(',')
				.map((d) => d.trim())
				.filter(Boolean)
		: [];

	if (domains.length === 0) {
		throw error(400, 'at least one domain name is required');
	}

	const allowed = new Set(availableSearchEngines.map(e => e.id));
	const engines = (searchEnginesQuery ?? 'google')
		.split(',')
		.map(s => s.trim().toLowerCase())
		.filter(s => s && allowed.has(s as SearchEngine)) as SearchEngine[];

	const rules = generateFilterRules(domains, engines);
	return new Response(rules, { headers: { 'Content-Type': 'text/plain; charset=utf-8' } });
};
