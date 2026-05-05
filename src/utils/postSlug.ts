export function postSlug(id: string): string {
	const parts = id.split('/');
	const last = parts.pop();
	if (last === 'index' && parts.length > 0) return parts.pop()!;
	return last!;
}
