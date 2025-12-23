// src/redux/slices/companySlice.ts
import { PagedResult } from '@/interfaces/base';
import { Company, CompanyFilter, CompanyState } from '@/interfaces/company';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { GetCompanyById, GetPagedCompanies } from '../services/companyServices';
import { mapRelationshipCompany, mapSortOrderToBool } from '../utils/mapRelationshipCompany';

const initialState: CompanyState = {
  data: [],
  totalCount: 0,
  loading: false,
  error: null,
  filter: {
    keyword: '',
    sortColumn: '',
    sortOrder: 'ASC',
    totalProject: undefined,
    totalMember: undefined,
    relationship: 'All',
    pageNumber: 1,
    pageSize: 4,
  },
  selectedCompany: null,
};

export const fetchCompaniesThunk = createAsyncThunk<
  PagedResult<Company>,
  Partial<CompanyFilter>,
  { state: { company: CompanyState }; rejectValue: string }
>('company/fetchPaged', async (filter, { getState, rejectWithValue }) => {
  try {
    const { company } = getState();
    const mergedFilter = { ...company.filter, ...filter };
    const apiFilter = {
      ...mergedFilter,
      sortOrder: mapSortOrderToBool(mergedFilter.sortOrder),
      relationship: mapRelationshipCompany(mergedFilter.relationship),
    };
    const result = await GetPagedCompanies(apiFilter);
    return result;
  } catch (error: any) {
    return rejectWithValue(error?.message || 'Failed to fetch companies');
  }
});

export const fetchCompanyByIdThunk = createAsyncThunk<Company, string, { rejectValue: string }>(
  'company/fetchById',
  async (id, { rejectWithValue }) => {
    try {
      const result = await GetCompanyById(id);
      return result;
    } catch (error: any) {
      return rejectWithValue(error?.message || 'Failed to fetch company by ID');
    }
  },
);

export const loadCompanyFromCache = createAsyncThunk('company/loadFromCache', async () => {
  const saved = await AsyncStorage.getItem('selectedCompany');
  if (saved) return JSON.parse(saved);
  return null;
});

const companySlice = createSlice({
  name: 'company',
  initialState,
  reducers: {
    resetCompanies: (state) => {
      state.data = [];
      state.totalCount = 0;
      state.filter.pageNumber = 1;
    },
    updateFilter: (state, action: PayloadAction<Partial<CompanyFilter>>) => {
      state.filter = { ...state.filter, ...action.payload };
    },
    setSelectedCompany: (state, action) => {
      state.selectedCompany = action.payload;
      AsyncStorage.setItem('selectedCompany', JSON.stringify(action.payload));
    },
    clearSelectedCompany: (state) => {
      state.selectedCompany = null;
      AsyncStorage.removeItem('selectedCompany');
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchCompaniesThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCompaniesThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.totalCount = action.payload.totalCount;

        const newPage = action.payload.pageNumber;
        if (newPage === 1) state.data = action.payload.items;
        else state.data = [...state.data, ...action.payload.items];

        state.filter.pageNumber = newPage;
      })
      .addCase(fetchCompaniesThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Failed to load companies';
      })
      .addCase(loadCompanyFromCache.fulfilled, (state, action) => {
        state.selectedCompany = action.payload;
      })
      .addCase(fetchCompanyByIdThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Failed to load company details';
        state.selectedCompany = null; // 👈 xoá data cũ khi fetch lỗi
      });
  },
});

export const { resetCompanies, updateFilter, setSelectedCompany, clearSelectedCompany } =
  companySlice.actions;
export default companySlice.reducer;
