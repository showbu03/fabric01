import BalanceService from '../../services/balance/balance.service';

export class Controller {
  getBalance(req, res) {
    BalanceService
      .getBalance(req, res)
      .then(r => {
        if (r) res.json(r);
        else res.status(404).end();
      });
  }

  move(req, res) {
    BalanceService
      .move(req, res)
      .then(r => {
        if (r) res.json(r);
        else res.status(404).end();
      });
  }

  addUser(req, res) {
    BalanceService
      .addUser(req, res)
      .then(r => {
        if (r) res.json(r);
        else res.status(404).end();
      });
  }
}
export default new Controller();
