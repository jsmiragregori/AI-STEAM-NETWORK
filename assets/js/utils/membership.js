export function resolveMembershipAction(config = {}, context = 'network') {
  const formVisible = config.formVisible ?? config.membershipFormVisible;
  if (formVisible === false) return { kind: 'hidden' };

  const formMode = config.formMode || 'demo';
  if (formMode !== 'microsoftForms') return { kind: 'internal' };

  const microsoftForms = config.microsoftForms || {};
  const url = String(microsoftForms.url || '').trim();
  if (!url) return { kind: 'hidden' };

  if ((microsoftForms.presentation || 'newTab') === 'newTab') {
    return { kind: 'external', url };
  }

  return context === 'network'
    ? { kind: 'embed', url }
    : { kind: 'internal' };
}
