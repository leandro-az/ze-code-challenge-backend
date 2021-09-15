
import {PartnertDTO} from './partner.dto';

export class ResponseCreateManyPartnersDTO {
    message!: string
    pdvsSuccess!: PartnertDTO[]
    totalRecordsSuccess!: number
    pdvsErros!: PartnertDTO[]
    totalRecordsErros!: number
    statusCode!: number

}
