export type CountryData<FieldKeys extends string = string> = {
  country: string,
  fields: FieldKeys[],
  placeholders: Record<FieldKeys, string>,
  endpoint: string,
  label?: string
};
declare const countryList: CountryData[];
export default countryList;
