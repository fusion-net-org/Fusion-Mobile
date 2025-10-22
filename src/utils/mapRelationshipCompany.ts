export const mapRelationshipCompany = (relationship?: string): number | undefined => {
  const map: Record<'Owner' | 'Member', number> = { Owner: 0, Member: 1 };
  return relationship === 'Owner' || relationship === 'Member' ? map[relationship] : undefined;
};
export const mapSortOrderToBool = (sortOrder?: 'ASC' | 'DESC'): boolean | undefined => {
  if (sortOrder === 'ASC') return true;
  if (sortOrder === 'DESC') return false;
  return undefined;
};

export const mapProjectRequestStatus = (
  status?: 'Pending' | 'Accepted' | 'Rejected' | 'Finished' | 'All',
): number | undefined => {
  const map: Record<'Pending' | 'Accepted' | 'Rejected' | 'Finished', number> = {
    Pending: 0,
    Accepted: 1,
    Rejected: 2,
    Finished: 3,
  };
  return status && status !== 'All' ? map[status] : undefined;
};

export const mapProjectRequestViewMode = (
  viewMode?: 'Requester' | 'Executor' | 'Both',
): number | undefined => {
  const map: Record<'Requester' | 'Executor', number> = {
    Requester: 0,
    Executor: 1,
  };
  return viewMode && viewMode !== 'Both' ? map[viewMode] : undefined;
};

export const mapProjectRequestDateFilterType = (
  type?: 'Created' | 'Start - End' | 'Approved' | 'Rejected' | 'Pending' | 'All',
): number | undefined => {
  const map: Record<'Created' | 'Start - End' | 'Approved' | 'Rejected' | 'Pending', number> = {
    Created: 0,
    'Start - End': 1,
    Approved: 2,
    Rejected: 3,
    Pending: 4,
  };
  return type && type !== 'All' ? map[type] : undefined;
};
