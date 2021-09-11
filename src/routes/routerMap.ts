import { Router } from 'express';
import {PartnerController} from '../controllers/partner.controller';

export  class RouterMapper {
    public AppRouter = Router();
    private API_BASE_URL='/api/v1'
    constructor(
        private readonly partnerController: PartnerController
    ) {
      this.buildRoutes();
    }
    private buildRoutes(){
      this.AppRouter.get(`${this.API_BASE_URL}/`, async (_req, res) => res
        .status(200)
        .json('**** :-) RAIZ DO PROJETO DE LEANDRO ALMEIDA :-) ****')
      );
      this.AppRouter.get(`${this.API_BASE_URL}/pdv/:id`, this.partnerController.findPartnerById);
      this.AppRouter.post(`${this.API_BASE_URL}/pdv`, this.partnerController.insertOnePartner);
    }
}
