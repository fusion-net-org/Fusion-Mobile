// Dành cho Project Progress (Inreview, Inprogress, Todo...)
export function projectProgressColorBorder(status?: string) {
  switch ((status || '').toLowerCase()) {
    case 'inreview':
      return 'border-purple-300';
    case 'inprogress':
      return 'border-blue-300';
    case 'todo':
      return 'border-yellow-300';
    case 'overdue':
      return 'border-red-300';
    case 'submitted':
      return 'border-green-300';
    default:
      return 'border-gray-200';
  }
}

export function projectProgressColorText(status?: string) {
  switch ((status || '').toLowerCase()) {
    case 'inreview':
      return 'text-purple-600';
    case 'inprogress':
      return 'text-blue-600';
    case 'todo':
      return 'text-yellow-600';
    case 'overdue':
      return 'text-red-600';
    case 'submitted':
      return 'text-green-600';
    default:
      return 'text-gray-500';
  }
}

// Dành cho Filter Status (Pending, Accepted, Rejected, Finished, All)
export function requestStatusColorBorder(status?: string) {
  switch ((status || '').toLowerCase()) {
    case 'pending':
      return 'border-yellow-300';
    case 'accepted':
      return 'border-green-300';
    case 'rejected':
      return 'border-red-200';
    case 'finished':
      return 'border-blue-300';
    default:
      return 'border-gray-200';
  }
}

export function requestStatusColorText(status?: string) {
  switch ((status || '').toLowerCase()) {
    case 'pending':
      return 'text-yellow-600';
    case 'accepted':
      return 'text-green-600';
    case 'rejected':
      return 'text-red-600';
    case 'finished':
      return 'text-blue-600';
    default:
      return 'text-gray-500'; // "All" hoặc undefined
  }
}

export function getStatusColors(
  type: 'progress' | 'request',
  status?: string,
): { border: string; text: string } {
  if (type === 'progress') {
    return {
      border: projectProgressColorBorder(status),
      text: projectProgressColorText(status),
    };
  }

  return {
    border: requestStatusColorBorder(status),
    text: requestStatusColorText(status),
  };
}

const _keepClasses = `
  border-yellow-300 border-green-300 border-red-300 border-blue-300 border-gray-200
  text-yellow-600 text-green-600 text-red-600 text-blue-600 text-gray-500
`;
