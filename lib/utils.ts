export function formatBudget(lead: any) {
  if (!lead.budget_numeric) return 'Negotiable';
  return `${lead.budget_currency || '$'}${lead.budget_numeric}`;
}

export function getTimeAgo(dateString: string) {
  const date = new Date(dateString);
  const now = new Date();
  const diffDays = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24));
  if (diffDays === 0) return 'Today';
  if (diffDays === 1) return 'Yesterday';
  if (diffDays < 7) return `${diffDays} days ago`;
  return `${Math.floor(diffDays / 7)} weeks ago`;
}
