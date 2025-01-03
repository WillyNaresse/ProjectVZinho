export type SignupData = {
  email: string,
  password: string,
  passwordConfirm: string,
  dataAgreement: boolean,
  mediaAgreement?: boolean,
  name: string,
  birthDate: Date,
  cep?: number,
  uf?: string,
  city?: string,
  address: string,
  addressNumber: number,
  id?: string
}
