import { Router } from 'express';
import {PartnerController} from '../controllers/partner.controller';
export  class RouterMapper {
    public AppRouter = Router();
    partnerController: PartnerController= new PartnerController()
    constructor(
    ) {
      this.buildRoutes();
    }
    private buildRoutes(){
      this.AppRouter.get('/', async (_req, res) => res
        .status(200)
        .json('**** :-) RAIZ DO PROJETO DE LEANDRO ALMEIDA :-) ****')
      );
      this.AppRouter.get('/pdv/:id', this.partnerController.findPartnerById);
      this.AppRouter.post('/pdv', this.partnerController.insertOnePartner);
      this.AppRouter.post('/pdv/closer', this.partnerController.findPartnerByLocalization);
      this.AppRouter.post('/pdv/fill', this.partnerController.insertManyPartners);
    }
}
