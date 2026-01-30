import {TAHSILAT_URL} from '../../service/url';
import {apiSlice} from './apiSlice';

export const tahsilatSlice = apiSlice.injectEndpoints({
  endpoints: builder => ({
    getAllTahsilat: builder.query({
      query: () => ({
        url: `${TAHSILAT_URL}/all`,
      }),
      keepUnusedDataFor: 5,
    }),
    getTahsilatByMonthYear: builder.query({
      query: ({ay, yil}) => ({
        url: `${TAHSILAT_URL}/${ay}/${yil}`,
      }),
      keepUnusedDataFor: 5,
    }),
  }),
});

export const {useGetAllTahsilatQuery, useGetTahsilatByMonthYearQuery} =
  tahsilatSlice;
