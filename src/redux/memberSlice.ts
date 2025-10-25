import { PagedResult } from '@/interfaces/base';
import { MemberFilter, MemberFilterAPI, MemberItem, MemberState } from '@/interfaces/member';
import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { GetPageMemberInCompany } from '../services/memberService';
import { mapSortOrderToBool } from '../utils/mapRelationshipCompany';

// Initial state
const initialState: MemberState = {
  data: [],
  totalCount: 0,
  loading: false,
  error: null,
  filter: {
    memberName: '',
    pageNumber: 1,
    pageSize: 6,
    sortOrder: 'ASC',
    sortColumn: '',
  },
  selectedMember: null,
  statusSummary: null,
  statusLoading: false,
};

// ⚡ Thunk: fetch paged members
export const fetchMembersThunk = createAsyncThunk<
  PagedResult<MemberItem>,
  { companyId: string; filter?: Partial<MemberFilter> },
  { state: { member: MemberState }; rejectValue: string }
>('member/fetchPaged', async ({ companyId, filter }, { getState, rejectWithValue }) => {
  try {
    const { member } = getState();
    const mergedFilter = { ...member.filter, ...filter };
    const apiFilter: MemberFilterAPI = {
      memberName: mergedFilter.memberName,
      pageNumber: mergedFilter.pageNumber,
      pageSize: mergedFilter.pageSize,
      sortColumn: mergedFilter.sortColumn,
      sortOrder: mapSortOrderToBool(mergedFilter.sortOrder),
      fromDate: mergedFilter.dateRange?.from || null,
      toDate: mergedFilter.dateRange?.to || null,
    };

    console.log('filter apiV2', apiFilter);

    const result = await GetPageMemberInCompany(companyId, apiFilter);
    return result;
  } catch (error: any) {
    return rejectWithValue(error?.message || 'Failed to fetch members');
  }
});

const memberSlice = createSlice({
  name: 'member',
  initialState,
  reducers: {
    resetMembers: (state) => {
      state.data = [];
      state.totalCount = 0;
      state.filter.pageNumber = 1;
      state.error = null;
    },
    updateMemberFilter: (state, action: PayloadAction<Partial<MemberFilter>>) => {
      state.filter = { ...state.filter, ...action.payload };
    },
    setSelectedMember: (state, action: PayloadAction<MemberItem | null>) => {
      state.selectedMember = action.payload;
    },
    clearSelectedMember: (state) => {
      state.selectedMember = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchMembersThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchMembersThunk.fulfilled, (state, action) => {
        state.loading = false;
        const newPage = action.payload.pageNumber;
        if (newPage === 1) state.data = action.payload.items;
        else state.data = [...state.data, ...action.payload.items];
        state.totalCount = action.payload.totalCount;
        state.filter.pageNumber = newPage;
      })
      .addCase(fetchMembersThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Failed to load members';
      });
  },
});

export const { resetMembers, updateMemberFilter, setSelectedMember, clearSelectedMember } =
  memberSlice.actions;

export default memberSlice.reducer;
