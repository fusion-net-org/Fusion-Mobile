import { PagedResult } from '@/interfaces/base';
import {
  ProjectRequest,
  ProjectRequestFilter,
  ProjectRequestState,
} from '@/interfaces/project_request';
import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { GetProjectRequestPartnerPaged } from '../services/project_requestService';
import {
  mapProjectRequestDateFilterType,
  mapProjectRequestStatus,
  mapProjectRequestViewMode,
  mapSortOrderToBool,
} from '../utils/mapRelationshipCompany';

const initialState: ProjectRequestState = {
  data: [],
  totalCount: 0,
  loading: false,
  error: null,
  filter: {
    partnerId: '', // bắt buộc có
    keyword: '',
    sortColumn: '',
    sortOrder: 'DESC',
    status: 'All',
    viewMode: 'Both',
    dateFilterType: 'All',
    dateRange: undefined,
    pageNumber: 1,
    pageSize: 10,
  },
};

// =====================
// ASYNC THUNK
// =====================
export const fetchProjectRequestPaged = createAsyncThunk<
  PagedResult<ProjectRequest>,
  { filter: Partial<ProjectRequestFilter>; companyId: string },
  { state: { projectRequest: ProjectRequestState }; rejectValue: string }
>('projectRequest/fetchPaged', async ({ filter, companyId }, { getState, rejectWithValue }) => {
  try {
    if (!filter.partnerId) return rejectWithValue('Missing partnerId');
    const { projectRequest } = getState();

    const mergedFilter = { ...projectRequest.filter, ...filter };
    const apiFilter = {
      ...mergedFilter,
      sortOrder: mapSortOrderToBool(mergedFilter.sortOrder),
      status: mapProjectRequestStatus(mergedFilter.status),
      viewMode: mapProjectRequestViewMode(mergedFilter.viewMode),
      dateFilterType: mapProjectRequestDateFilterType(mergedFilter.dateFilterType),
    };

    const data = await GetProjectRequestPartnerPaged(apiFilter, companyId);
    return data;
  } catch (error: any) {
    return rejectWithValue(error.message || 'Fetch failed');
  }
});

const projectRequestSlice = createSlice({
  name: 'projectRequest',
  initialState,
  reducers: {
    setFilter(state, action: PayloadAction<Partial<ProjectRequestFilter>>) {
      state.filter = { ...state.filter, ...action.payload };
    },
    resetFilter(state) {
      state.filter = { ...initialState.filter, partnerId: state.filter.partnerId };
    },
    clearData(state) {
      state.data = [];
      state.totalCount = 0;
    },
    resetProjectRequest(state) {
      const partnerId = state.filter.partnerId;
      Object.assign(state, {
        ...initialState,
        filter: { ...initialState.filter, partnerId },
      });
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchProjectRequestPaged.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProjectRequestPaged.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload.items;
        state.totalCount = action.payload.totalCount;
      })
      .addCase(fetchProjectRequestPaged.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Error fetching project requests';
      });
  },
});

export const { setFilter, resetFilter, clearData, resetProjectRequest } =
  projectRequestSlice.actions;
export default projectRequestSlice.reducer;
