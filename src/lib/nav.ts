export type SectionKey =
  | 'operations'
  | 'products'
  | 'campaigns'
  | 'channels'
  | 'customers'
  | 'entitlements'
  | 'intelligence'
  | 'evidence'
  | 'system';

export interface NavItem {
  key: SectionKey;
  label: string;
  href: string;
  group: 'Operate' | 'Commerce' | 'Assurance';
  blurb: string;
}

// The nine top-level sections, grouped into the three spines of the console.
export const NAV: NavItem[] = [
  { key: 'operations', label: 'Operations', href: '/console/operations', group: 'Operate', blurb: 'Live activity, active operations, and incidents.' },
  { key: 'products', label: 'Products', href: '/console/products', group: 'Commerce', blurb: 'The catalogue of offerings and their versions.' },
  { key: 'campaigns', label: 'Campaigns', href: '/console/campaigns', group: 'Commerce', blurb: 'Structured initiatives and their progress.' },
  { key: 'channels', label: 'Channels', href: '/console/channels', group: 'Commerce', blurb: 'Distribution and delivery channels and their health.' },
  { key: 'customers', label: 'Customers', href: '/console/customers', group: 'Commerce', blurb: 'Accounts, plans, and their footprint.' },
  { key: 'entitlements', label: 'Entitlements', href: '/console/entitlements', group: 'Commerce', blurb: 'Grants binding customers to products, with limits.' },
  { key: 'intelligence', label: 'Intelligence', href: '/console/intelligence', group: 'Assurance', blurb: 'Signals, insights, and confidence-scored findings.' },
  { key: 'evidence', label: 'Evidence', href: '/console/evidence', group: 'Assurance', blurb: 'Tamper-evident, hash-chained audit trail.' },
  { key: 'system', label: 'System', href: '/console/system', group: 'Assurance', blurb: 'Services, configuration, and build health.' },
];

export const GROUPS: NavItem['group'][] = ['Operate', 'Commerce', 'Assurance'];

export function sectionFromPath(pathname: string): NavItem | undefined {
  return NAV.find((n) => pathname === n.href || pathname.startsWith(n.href + '/'));
}
