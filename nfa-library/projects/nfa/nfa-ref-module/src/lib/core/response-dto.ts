// prima di utilizzarlo pensare a come strutturarlo, la d è troppo olingo style
export interface ResponseDTO {
  error: ResponseErrorDTO;
  d: any;
  responseService: any;
}

export interface ResponseDTOMessageLocalization {
  lang: string;
  value: string;
}

export interface ResponseErrorDTO {
  message: ResponseDTOMessageLocalization;
  code: string;
}

export interface ResultObject {
  results: any;
}
