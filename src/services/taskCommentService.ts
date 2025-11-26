import { apiInstance } from '../api/apiInstance';

export const CreateComment = async (commentData: any) => {
  try {
    const res = await apiInstance.post('/comments', commentData);
    return res.data;
  } catch (error) {
    console.error('Create ticket comment error:', error);
    throw error;
  }
};

export const DeleteComment = async (commentId: number) => {
  try {
    const res = await apiInstance.delete(`/comments/${commentId}`);
    return res.data;
  } catch (error) {
    console.error('Delete ticket comment error:', error);
    throw error;
  }
};
