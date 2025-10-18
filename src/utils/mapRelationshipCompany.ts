export const mapRelationshipCompany = (relationship?: string): number | undefined => {
  const map: Record<'Owner' | 'Member', number> = { Owner: 0, Member: 1 };
  return relationship === 'Owner' || relationship === 'Member' ? map[relationship] : undefined;
};
export const mapSortOrderToBool = (sortOrder?: 'ASC' | 'DESC'): boolean | undefined => {
  if (sortOrder === 'ASC') return true;
  if (sortOrder === 'DESC') return false;
  return undefined;
};
