import { apiInstance } from './../api/apiInstance';

export const GetCommentsByTicketId = async (
  TicketId: string,
  SearchText = '',
  From = '',
  To = '',
  AuthorUserId = '',
  PageNumber = 1,
  PageSize = 1000,
  SortColumn = '',
  SortDescending = null,
) => {
  try {
    const res = await apiInstance.get('/ticket-comment/paged', {
      params: {
        TicketId,
        SearchText,
        From,
        To,
        AuthorUserId,
        PageNumber,
        PageSize,
        SortColumn,
        SortDescending,
      },
    });
    return res.data;
  } catch (error) {
    console.error('Get ticket comments error:', error);
    throw error;
  }
};

export const GetCommentById = async (commentId: string) => {
  try {
    const res = await apiInstance.get(`/ticket-comment/${commentId}`);
    return res.data;
  } catch (error) {
    console.error('Get ticket comment by ID error:', error);
    throw error;
  }
};

export const CreateComment = async (commentData: any) => {
  try {
    const res = await apiInstance.post('/ticket-comment', commentData);
    return res.data;
  } catch (error) {
    console.error('Create ticket comment error:', error);
    throw error;
  }
};

export const UpdateComment = async (commentId: string, commentData: any) => {
  try {
    const res = await apiInstance.put(`/ticket-comment/${commentId}`, commentData);
    return res.data;
  } catch (error) {
    console.error('Update ticket comment error:', error);
    throw error;
  }
};

export const DeleteComment = async (commentId: string) => {
  try {
    const res = await apiInstance.delete(`/ticket-comment/${commentId}`);
    return res.data;
  } catch (error) {
    console.error('Delete ticket comment error:', error);
    throw error;
  }
};
