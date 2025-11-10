import { PagedResult } from '@/interfaces/base';
import {
  PartnerFilter,
  PartnerItem,
  PartnerState,
  PartnerStatusSummary,
} from '@/interfaces/partner';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { GetPagePartner, GetPartnerStatusSummary } from '../services/partnerService';
import { mapSortOrderToBool } from '../utils/mapRelationshipCompany';

// ⚙️ Initial state
const initialState: PartnerState = {
  data: [],
  totalCount: 0,
  loading: false,
  error: null,
  filter: {
    keyword: '',
    sortColumn: '',
    sortOrder: 'ASC',
    fromDate: undefined,
    toDate: undefined,
    pageNumber: 1,
    pageSize: 6,
  },
  selectedPartner: null,
  statusSummary: null, // 👈 Thêm
  statusLoading: false,
};

// ⚡ Thunk: fetch paged partners (có truyền companyId)
export const fetchPartnersThunk = createAsyncThunk<
  PagedResult<PartnerItem>,
  { companyId: string; filter?: Partial<PartnerFilter> },
  { state: { partner: PartnerState }; rejectValue: string }
>('partner/fetchPaged', async ({ companyId, filter }, { getState, rejectWithValue }) => {
  try {
    const { partner } = getState();
    const mergedFilter = { ...partner.filter, ...filter };
    const apiFilter = {
      ...mergedFilter,
      sortOrder: mapSortOrderToBool(mergedFilter.sortOrder),
    };

    const result = await GetPagePartner(companyId, apiFilter);
    return result;
  } catch (error: any) {
    const status = error.response?.status;

    if (status === 404) {
      return {
        items: [],
        totalCount: 0,
        pageNumber: filter?.pageNumber,
        pageSize: filter?.pageSize,
      } as any;
    }
    return rejectWithValue(error?.message || 'Failed to fetch partners');
  }
});

export const fetchPartnerStatusSummaryThunk = createAsyncThunk<
  PartnerStatusSummary,
  string,
  { rejectValue: string }
>('partner/fetchStatusSummary', async (companyId, { rejectWithValue }) => {
  try {
    const result = await GetPartnerStatusSummary(companyId);
    return result;
  } catch (error: any) {
    return rejectWithValue(error?.message || 'Failed to fetch partner status summary');
  }
});

// ⚡ Load cache
export const loadPartnerFromCache = createAsyncThunk('partner/loadFromCache', async () => {
  const saved = await AsyncStorage.getItem('selectedPartner');
  if (saved) return JSON.parse(saved);
  return null;
});

const partnerSlice = createSlice({
  name: 'partner',
  initialState,
  reducers: {
    resetPartners: (state) => {
      state.data = [];
      state.totalCount = 0;
      state.filter.pageNumber = 1;
    },
    updatePartnerFilter: (state, action: PayloadAction<Partial<PartnerFilter>>) => {
      state.filter = { ...state.filter, ...action.payload };
    },
    setSelectedPartner: (state, action) => {
      state.selectedPartner = action.payload;
      AsyncStorage.setItem('selectedPartner', JSON.stringify(action.payload));
    },
    clearSelectedPartner: (state) => {
      state.selectedPartner = null;
      AsyncStorage.removeItem('selectedPartner');
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchPartnersThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchPartnersThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.totalCount = action.payload.totalCount;

        const newPage = action.payload.pageNumber;
        if (newPage === 1) state.data = action.payload.items;
        else state.data = [...state.data, ...action.payload.items];

        state.filter.pageNumber = newPage;
      })
      .addCase(fetchPartnersThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Failed to load partners';
      })
      .addCase(fetchPartnerStatusSummaryThunk.pending, (state) => {
        state.statusLoading = true;
      })
      .addCase(fetchPartnerStatusSummaryThunk.fulfilled, (state, action) => {
        state.statusLoading = false;
        state.statusSummary = action.payload;
      })
      .addCase(fetchPartnerStatusSummaryThunk.rejected, (state, action) => {
        state.statusLoading = false;
        state.error = action.payload || 'Failed to load partner status summary';
      });
  },
});

export const { resetPartners, updatePartnerFilter, setSelectedPartner, clearSelectedPartner } =
  partnerSlice.actions;

export default partnerSlice.reducer;
