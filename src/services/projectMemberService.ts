import { apiInstance } from '../api/apiInstance';

//https://localhost:7160/api/projectmember/DE562EA1-F67A-45CB-92A1-1199C1BC09E6/FA5AA664-0D66-4620-8FD1-4B42BFC18578
export const getProjectMemberByCompanyIdAndUserId = async (
  companyId: string,
  memberId: string,
  ProjectNameOrCode = '',
  Status = '',
  StartDate = '',
  EndDate = '',
  PageNumber = 1,
  PageSize = 10,
  SortColumn = '',
  SortDescending = null,
) => {
  try {
    console.log('===== FETCH PROJECT MEMBERS =====');
    console.log('companyId:', companyId);
    console.log('memberId:', memberId);
    console.log('ProjectNameOrCode:', ProjectNameOrCode);
    console.log('Status:', Status);
    console.log('StartDate:', StartDate);
    console.log('EndDate:', EndDate);
    console.log('PageNumber:', PageNumber);
    const response = await apiInstance.get(`/projectmember/${companyId}/${memberId}`, {
      params: {
        ProjectNameOrCode,
        Status,
        StartDate,
        EndDate,
        PageNumber,
        PageSize,
        SortColumn,
        SortDescending,
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error in getProjectMemberByCompanyIdAndUserId:', error);
    throw new Error((error as any).response?.data?.message || 'Fail!');
  }
};
