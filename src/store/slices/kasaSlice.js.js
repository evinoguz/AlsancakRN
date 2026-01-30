import {KASA_URL} from '../../service/url';
import {apiSlice} from './apiSlice';

export const kasaSlice = apiSlice.injectEndpoints({
  endpoints: builder => ({
    getAllKasa: builder.query({
      query: ({ilktarih, sontarih}) => ({
        url: `${KASA_URL}`,
        params: {
          ilktarih,
          sontarih,
        },
      }),
      keepUnusedDataFor: 5,
    }),
    getKasaDevir: builder.query({
      query: ({tarih}) => ({
        url: `${KASA_URL}/devir`,
        params: {
          tarih,
        },
      }),
      keepUnusedDataFor: 5,
    }),
    getKasaSum: builder.query({
      query: ({ilktarih, sontarih, devnakit}) => ({
        url: `${KASA_URL}/sum`,
        params: {
          ilktarih,
          sontarih,
          devnakit,
        },
      }),
      keepUnusedDataFor: 5,
    }),
  }),
});

export const {useGetAllKasaQuery, useGetKasaDevirQuery, useGetKasaSumQuery} =
  kasaSlice;
