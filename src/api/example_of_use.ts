// import { ApiClient, FILE_API, EndpointsEnum } from "./index";
import { ApiClient, EndpointsEnum } from "./index";

export const createNewProduct = async (data: any) => {
  const { data } = await ApiClient<ResponseType>({
    url: `${EndpointsEnum.PRODUCTS}`,
    method: "POST",
    data: data,
  });

  return { data };
};

// если надо сделать запрос на другой урл (не базовый)
// export const createNewProduct2 = async (data: any) => {
//   const result = await ApiClient(
//     {
//       url: `${EndpointsEnum.PRODUCTS}`,
//       method: "POST",
//       data: data,
//     },
//     FILE_API // добавляем второй параметр с другим апи
//   );

//   return result;
// };
