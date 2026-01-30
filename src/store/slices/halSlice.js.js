import {HAL_URL} from '../../service/url';
import {apiSlice} from './apiSlice';

export const halSlice = apiSlice.injectEndpoints({
  endpoints: builder => ({
    getAllHal: builder.query({
      query: () => ({
        url: `${HAL_URL}`,
      }),
      keepUnusedDataFor: 5,
    }),
    getHalBagcari: builder.query({
      query: ({id}) => ({
        url: `${HAL_URL}/bagcari/${id}`,
      }),
      keepUnusedDataFor: 5,
    }),
  }),
});

export const {useGetAllHalQuery, useGetHalBagcariQuery} = halSlice;
