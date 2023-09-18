/* eslint-disable prettier/prettier */
import xmlrpc from 'xmlrpc';

export default class OdooLib {
  constructor() {
    this.odoo_url = localStorage.getItem('odoo_url');
    this.odoo_db = localStorage.getItem('odoo_db');
    this.uid = parseInt(localStorage.getItem('uid'), 10);
    this.username = localStorage.getItem('username');
    this.password = localStorage.getItem('password');
    this.login = this.login.bind(this);
    this.getListPickingIds = this.getListPickingIds.bind(this);
    this.getPicking = this.getPicking.bind(this);
    this.getPackOperation = this.getPackOperation.bind(this);
    this.setPackOperation = this.setPackOperation.bind(this);
    this.deleteOperation = this.deleteOperation.bind(this);
    this.getListPickingbyPOName = this.getListPickingbyPOName.bind(this);
    this.createInvoices = this.createInvoices.bind(this);
    this.getPickingType = this.getPickingType.bind(this);
    this.getProductAll = this.getProductAll.bind(this);
    this.getProductToSale = this.getProductToSale.bind(this);
    this.getProductById = this.getProductById.bind(this);
    this.createPicking = this.createPicking.bind(this);
    this.cancelPicking = this.cancelPicking.bind(this);
    this.getUomAll = this.getUomAll.bind(this);
    this.getAccessUser = this.getAccessUser.bind(this);
    this.getMachine = this.getMachine.bind(this);
    this.getProductionDie = this.getProductionDie.bind(this);
    this.addProdOutput = this.addProdOutput.bind(this);
    this.getOutput = this.getOutput.bind(this);
    this.setDoneDie = this.setDoneDie.bind(this);
    this.getInProgressWO = this.getInProgressWO.bind(this);
    this.getProductionPress = this.getProductionPress.bind(this);
    this.getCorrective = this.getCorrective.bind(this);
    this.getConsume = this.getConsume.bind(this);
    this.getWorkOrder = this.getWorkOrder.bind(this);
    this.getPotong = this.getPotong.bind(this);
    this.getWorkOrderMelting = this.getWorkOrderMelting.bind(this);
    this.createPress = this.createPress.bind(this);
    this.remBillet = this.remBillet.bind(this);
    this.recalculatePress = this.recalculatePress.bind(this);
    this.endPress = this.endPress.bind(this);
    this.getOutputLines = this.getOutputLines.bind(this);
    this.saveBillet = this.saveBillet.bind(this);
    this.saveConsume = this.saveConsume.bind(this);
    this.saveProducePress = this.saveProducePress.bind(this);
    this.getShift = this.getShift.bind(this);
    this.updateRack = this.updateRack.bind(this);
    this.getOutputLineRack = this.getOutputLineRack.bind(this);
    this.processRack = this.processRack.bind(this);
    this.getCompute = this.getCompute.bind(this);
    this.actionDone = this.actionDone.bind(this);
    this.addScrapOLine = this.addScrapOLine.bind(this);
    this.getChildLine = this.getChildLine.bind(this);
    this.getQcExport = this.getQcExport.bind(this);
    this.createQcExport = this.createQcExport.bind(this);
    this.getProductionEtching = this.getProductionEtching.bind(this);
    this.changeDie = this.changeDie.bind(this);
    this.addBillet = this.addBillet.bind(this);
    this.endEtching = this.endEtching.bind(this);
    this.saveProduceEtc = this.saveProduceEtc.bind(this);
    this.setOutput = this.setOutput.bind(this);
    this.printPicking = this.printPicking.bind(this);
    this.getPickingTypeProd = this.getPickingTypeProd.bind(this);
    this.addPackingProduce = this.addPackingProduce.bind(this);
    this.addProduce = this.addProduce.bind(this);
    this.getFinished = this.getFinished.bind(this);
    this.actValidate = this.actValidate.bind(this);
    this.getReportAll = this.getReportAll.bind(this);
    this.addPackingConsume = this.addPackingConsume.bind(this);
    this.actCancel = this.actCancel.bind(this);
    this.checkState = this.checkState.bind(this);
    this.getWoCorrective = this.getWoCorrective.bind(this);
    this.getActCorr = this.getActCorr.bind(this);
    this.actCreateCorr = this.actCreateCorr.bind(this);
    this.setStartBubut = this.setStartBubut.bind(this);
    this.setStartPotong = this.setStartPotong.bind(this);
    this.getProductMUI = this.getProductMUI.bind(this);
    this.getMachineCorr = this.getMachineCorr.bind(this);
    this.getBubut = this.getBubut.bind(this);
    this.addCorrAct = this.addCorrAct.bind(this);
    this.getNitrid = this.getNitrid.bind(this);
    this.createNitrid = this.createNitrid.bind(this);
    this.getNitridLines = this.getNitridLines.bind(this);
    this.nitridStart = this.nitridStart.bind(this);
    this.nitridDone = this.nitridDone.bind(this);
    this.delNitLines = this.delNitLines.bind(this);
    this.getCD = this.getCD.bind(this);
    this.getCDIp = this.getCDIp.bind(this);
    this.getWoCD = this.getWoCD.bind(this);
    this.actCreateCD = this.actCreateCD.bind(this);
    this.getRoll = this.getRoll.bind(this);
    this.createRoll = this.createRoll.bind(this);
    this.addRoll = this.addRoll.bind(this);
    this.setDoneRoll = this.setDoneRoll.bind(this);
    this.getProductionMelting = this.getProductionMelting.bind(this);
    this.getListCMlt = this.getListCMlt.bind(this);
    this.saveCMlt = this.saveCMlt.bind(this);
    this.addCMelting = this.addCMelting.bind(this);
    this.addPMelting = this.addPMelting.bind(this);
    this.saveProduceMlt = this.saveProduceMlt.bind(this);
    this.remProduce = this.remProduce.bind(this);
    this.remCMlt = this.remCMlt.bind(this);
    this.getListProduce = this.getListProduce.bind(this);
    this.endMelting = this.endMelting.bind(this);
    this.startMelting = this.startMelting.bind(this);
    this.computeQty = this.computeQty.bind(this);
    this.pickMelting = this.pickMelting.bind(this);
    this.getLocation = this.getLocation.bind(this);
    this.getQuantMelting = this.getQuantMelting.bind(this);
    this.createLoss = this.createLoss.bind(this);
    this.dieState = this.dieState.bind(this);
    this.printSaved = this.printSaved.bind(this);
    this.getLotPress = this.getLotPress.bind(this);
    this.addPotBillet = this.addPotBillet.bind(this);
    this.addBattScrap = this.addBattScrap.bind(this);
    this.printOutSo = this.printOutSo.bind(this);
    this.createOrder = this.createOrder.bind(this);
    this.asyncgetLocation = this.asyncgetLocation.bind(this);
    this.getInvLot = this.getInvLot.bind(this);
    this.getQtyAvailable = this.getQtyAvailable.bind(this);
    this.getUser = this.getUser.bind(this);
    this.getSaleProduct = this.getSaleProduct.bind(this);
    this.getQuantBaja = this.getQuantBaja.bind(this);
    this.getCustomer = this.getCustomer.bind(this);
    this.getOrderSale = this.getOrderSale.bind(this);
    this.getSoType = this.getSoType.bind(this);
    this.delSo = this.delSo.bind(this);
    this.getDailyTransferData = this.getDailyTransferData.bind(this);
    this.getTonase = this.getTonase.bind(this);
    this.getPickTarget = this.getPickTarget.bind(this);
    this.getProductCategory = this.getProductCategory.bind(this);
    this.getPrintInvReport = this.printInvReport.bind(this);
  }

  login(username, password) {
    const client = xmlrpc.createClient({
      url: `${this.odoo_url}/xmlrpc/2/common`,
    });
    return new Promise((resolve, reject) => {
      client.methodCall(
        'login',
        [this.odoo_db, username, password],
        (err, value) => {
          if (err) {
            reject(err);
          } else if (value) {
            // Saving credential the dummy way
            localStorage.setItem('uid', value);
            this.uid = value;
            localStorage.setItem('username', username);
            this.username = username;
            localStorage.setItem('password', password);
            this.password = password;
            resolve(value);
          } else reject(new Error('Username and password not match.'));
        }
      );
    });
  }

  executeKW(model, operation, params) {
    const client = xmlrpc.createClient({
      url: `${this.odoo_url}/xmlrpc/2/object`,
    });
    return new Promise((resolve, reject) => {
      client.methodCall(
        'execute_kw',
        [this.odoo_db, this.uid, this.password, model, operation, params],
        (err, value) => {
          if (err) {
            reject(err);
          } else {
            resolve(value);
          }
        }
      );
    });
  }

  async setDoneDie(outputID, dateStart, dateFinished) {
    try {
      await this.executeKW('mrp.production.output', 'write', [
        outputID,
        {
          shift_id: localStorage.getItem('shiftId'),
          manager_id: this.uid,
          date_start: dateStart.replace('T', ' '),
          date_finished: dateFinished.replace('T', ' '),
        },
      ]);
      let result = await this.executeKW('mrp.production.output', 'set_done', [
        outputID,
      ]);
      result = await this.executeKW('mrp.production.output', 'search_read', [
        [['id', '=', outputID]],
        ['date_start', 'date_finished', 'state'],
        0,
        1,
      ]);
      return result;
    } catch (e) {
      return e;
    }
  }

  async getPickTarget() {
    try {
      const result = await this.executeKW('mrp.workcenter', 'search_read', [
        [
          ['code', 'in', ['PE', 'PL']],
          ['resource_type', '=', 'machine'],
        ],
        ['target_g', 'capacity_per_cycle'],
        0,
        2,
        'code',
      ]);
      console.log(result);
      return result;
    } catch (e) {
      return e;
    }
  }

  async getOrderSale() {
    try {
      const result = await this.executeKW('sale.order', 'getOrderSale', [
        false,
      ]);
      return result;
    } catch (e) {
      return e;
    }
  }

  async delSo(id) {
    try {
      const result = await this.executeKW('sale.order', 'unlink', [id]);
      return result;
    } catch (e) {
      return e;
    }
  }

  async getSoType() {
    try {
      const result = await this.executeKW(
        'bizoft.doc.type',
        'search_read',
        // eslint-disable-next-line no-sequences
        [[['is_sales', '=', true]], ['id', 'name'], 0, 5]
      );
      if (result.length !== 0) {
        return result.map((cust) => ({
          value: cust.id,
          label: cust.name,
        }));
      }
      return [];
    } catch (e) {
      return e;
    }
  }

  async getTonase(productId, qty) {
    try {
      const tonase = await this.executeKW('sale.order.line', 'getTonase', [
        false,
        productId,
        qty,
      ]);
      return tonase;
    } catch (e) {
      return e;
    }
  }

  async printPicking() {
    try {
      const print = await this.executeKW('stock.picking', 'printPicking', [
        125,
      ]);
      return print;
    } catch (e) {
      return e;
    }
  }

  async printOutSo(form) {
    try {
      const print = await this.executeKW('sale.order', 'printOutSO', [
        false,
        form,
      ]);
      return print;
    } catch (e) {
      return e;
    }
  }

  async printInvReport(form) {
    try {
      const print = await this.executeKW('stock.picking', 'printInvReport', [
        false,
        form,
      ]);
      return print;
    } catch (e) {
      return e;
    }
  }

  async createOrder(id, order) {
    try {
      const res = await this.executeKW('sale.order', 'createOrder', [
        id,
        order,
      ]);
      return res;
    } catch (e) {
      return e;
    }
  }

  async getDailyTransferData(month, targetLk, targetExp, volLokal, volExport) {
    try {
      const result = await this.executeKW(
        'stock.picking',
        'get_daily_tf_report',
        [false, month, targetLk, targetExp, volLokal, volExport]
      );
      return result;
    } catch (e) {
      return e;
    }
  }

  async getSaleProduct(page, limit, search, sort) {
    try {
      const res = await this.executeKW('sale.order', 'getProductSale', [
        [false],
        page,
        limit,
        search,
        sort,
      ]);
      return res;
    } catch (e) {
      return e;
    }
  }

  async addProdOutput(die) {
    try {
      const output = await this.executeKW(
        'mrp.production.output',
        'create',
        [
          {
            workorder_id: die.woId,
            resource_id: die.machine,
            workcenter_id: die.workCid,
            date_start: die.dateStart,
            type: 'normal',
            name: '/',
            shift_id: localStorage.getItem('shiftId'),
          },
        ],
        ['name', 'date_start', 'date_finished']
      );

      await this.executeKW('mrp.production.output', 'set_inwork', [output]);
      const success = await this.executeKW(
        'mrp.production.output',
        'search_read',
        [[['id', '=', output]], ['date_start', 'date_finished', 'name'], 0, 1]
      );
      return success;
    } catch (e) {
      return e;
    }
  }

  async cancelNitrid(id) {
    try {
      const res = await this.executeKW('mrp.nitriding', 'set_cancel', [id]);
      return res;
    } catch (e) {
      return e;
    }
  }

  async getRoll(nm) {
    try {
      const res = await this.executeKW(
        'mrp.production.workcenter.line',
        'getRoll',
        [false, nm]
      );
      return res;
    } catch (e) {
      return e;
    }
  }

  async getProductionMelting(moName) {
    try {
      const res = await this.executeKW(
        'mrp.production.output',
        'getNewMelting',
        [false, moName]
      );
      return res;
    } catch (e) {
      return e;
    }
  }

  async getListCMlt(outputId) {
    try {
      const res = await this.executeKW('mrp.production.output', 'getListCMlt', [
        outputId,
      ]);
      return res;
    } catch (e) {
      return e;
    }
  }

  async setDoneRoll(rolls) {
    try {
      const res = await this.executeKW('mrp.production.output', 'setDoneRoll', [
        false,
        rolls,
      ]);
      return res;
    } catch (e) {
      return e;
    }
  }

  async getRollIp(ids) {
    try {
      const res = await this.executeKW(
        'mrp.production.output',
        'getRollInprogress',
        [false, ids]
      );
      return res;
    } catch (e) {
      return e;
    }
  }

  async computeQty(productId, pjg, btg) {
    try {
      const result = await this.executeKW('stock.move', 'computeQty', [
        false,
        productId,
        pjg,
        btg,
      ]);
      return result;
    } catch (e) {
      return e;
    }
  }

  async createRoll(roll) {
    try {
      const res = await this.executeKW('mrp.production.output', 'createRoll', [
        false,
        roll,
        Number(localStorage.getItem('shiftId')),
        Number(localStorage.getItem('rollMchId')),
      ]);
      return res;
    } catch (e) {
      return e;
    }
  }

  async getQtyAvailable(productId, loc, lot) {
    try {
      const res = await this.executeKW('product.product', 'read', [
        productId,
        ['qty_available'],
        {
          location: loc,
          lot_id: lot,
        },
      ]);
      return res.qty_available;
    } catch (e) {
      return e;
    }
  }

  async getInvLot(locId, productId) {
    try {
      const dt = await this.executeKW('mrp.production', 'getInvLot', [
        false,
        locId,
        productId,
      ]);
      return dt;
    } catch (e) {
      return e;
    }
  }

  async getNitrid(nm) {
    try {
      let exists = [];
      if (localStorage.getItem('nitridId')) {
        const dt = await this.executeKW('mrp.nitriding.line', 'search_read', [
          [['nitrid_id', '=', Number(localStorage.getItem('nitridId'))]],
          ['product_id'],
        ]);
        exists = dt.map((d) => d.product_id[0]);
      }
      const result = await this.executeKW('product.product', 'search_read', [
        [
          ['categ_id.parent_id', 'child_of', 1000],
          ['die_state', '=', 'nitrid'],
          ['default_code', 'ilike', nm],
        ],
        [
          'default_code',
          'billet_nitrid',
          'max_billet_nitrid',
          'times_nitrid',
          'die_state',
        ],
      ]);
      const dataLines = await this.executeKW('mrp.workcenter', 'getMchNitrid', [
        false,
        result,
      ]);
      return dataLines.filter((res) => exists.indexOf(res.id) === -1);
    } catch (e) {
      return e;
    }
  }

  async nitridStart(nitrid) {
    try {
      await this.executeKW('mrp.nitriding', 'set_inwork', [nitrid]);
      const result = await this.executeKW('mrp.nitriding', 'read', [
        nitrid,
        ['date_start', 'name', 'state'],
      ]);
      return result;
    } catch (e) {
      return e;
    }
  }

  async nitridDone(nitrid) {
    try {
      await this.executeKW('mrp.nitriding', 'set_done', [nitrid]);
      const result = await this.executeKW('mrp.nitriding', 'read', [
        nitrid,
        ['date_finished', 'state'],
      ]);
      return result;
    } catch (e) {
      return e;
    }
  }

  async getNitridLines(nitridId) {
    try {
      const result = await this.executeKW('mrp.nitriding.line', 'search_read', [
        [['nitrid_id', '=', nitridId]],
        [
          'product_id',
          'billet_nitrid',
          'max_billet_nitrid',
          'times_nitrid',
          'note',
        ],
      ]);
      const nitrid = await this.executeKW('mrp.nitriding', 'search_read', [
        [['id', '=', nitridId]],
        ['state', 'date_start', 'name'],
      ]);
      const lines = result.map((res) => ({
        default_code: res.product_id[1],
        billet_nitrid: res.billet_nitrid,
        max_billet_nitrid: res.max_billet_nitrid,
        times_nitrid: res.times_nitrid,
        die_state: 'nitrid',
        id: res.product_id[0],
        tableId: res.id,
      }));
      const dataLines = await this.executeKW('mrp.workcenter', 'getMchNitrid', [
        false,
        lines,
      ]);
      return {
        state: nitrid ? nitrid[0].state : '',
        lines: dataLines,
        dateStart: nitrid ? nitrid[0].date_start : '',
        name: nitrid ? nitrid[0].name : '',
      };
    } catch (e) {
      return e;
    }
  }

  async delNitLines(tableId) {
    try {
      await this.executeKW('mrp.nitriding.line', 'unlink', [tableId]);
      return true;
    } catch (e) {
      return e;
    }
  }

  async createNitrid(lines) {
    try {
      const result = await this.executeKW('mrp.nitriding', 'createNitrid', [
        Number(localStorage.getItem('nitridId')),
        Number(localStorage.getItem('nitridMchId')),
        Number(localStorage.getItem('uid')),
        lines,
        Number(localStorage.getItem('shiftId')),
      ]);
      return result;
    } catch (e) {
      return e;
    }
  }

  async updateRack(item, pallet) {
    let res;
    if (Number(item.transQty) === Number(item.qty)) {
      res = await this.executeKW('mrp.production.output.line', 'write', [
        [item.id],
        {
          rack: pallet,
        },
      ]);
    } else {
      res = await this.executeKW('mrp.production.output.line', 'copy', [
        item.id,
        {
          product_qty: item.transQty,
          rack: pallet,
        },
      ]);
      await this.executeKW('mrp.production.output.line', 'write', [
        [item.id],
        {
          product_qty: item.qty - item.transQty,
        },
      ]);
    }
    await this.executeKW('mrp.production.output', 'message_post', [
      item.outId,
      `Rack changed => ${pallet}`,
    ]);
    return res;
  }

  async processRack(data, pallet) {
    const outId = data.map((x) => x.outId);
    const res = await this.executeKW('mrp.production.output', 'check_rack', [
      outId,
      pallet,
    ]);
    if (!res.faultCode) {
      return Promise.all(data.map((item) => this.updateRack(item, pallet)));
    }
    return res;
  }

  async actCreateCD(corr, mchID) {
    try {
      const calc = await this.executeKW(
        'mrp.production.output',
        'actCreateCD',
        [corr.mpo_id, corr, Number(localStorage.getItem('shiftId')), mchID]
      );

      return calc;
    } catch (e) {
      return e;
    }
  }

  async actCreateCorr(corr) {
    try {
      const calc = await this.executeKW(
        'mrp.production.output',
        'actCreateCorr',
        [corr.mpo_id, corr, Number(localStorage.getItem('shiftId'))]
      );

      return calc;
    } catch (e) {
      return e;
    }
  }

  async recalculatePress(press) {
    try {
      const calc = await this.executeKW(
        'mrp.production.output',
        'recalculatePress',
        [press.outputId, press.sample, press.rarm_speed, press.presure]
      );

      return calc;
    } catch (e) {
      return e;
    }
  }

  async saveBillet(outputId, name, dateStart, productionId, lines) {
    try {
      const wiz = await this.executeKW('mrp.production.output', 'saveBillet', [
        outputId,
        name,
        dateStart,
        productionId,
        lines,
      ]);
      return wiz;
    } catch (e) {
      return e;
    }
  }

  async saveConsume(outputId, name, dateStart, productionId, lines) {
    try {
      const wiz = await this.executeKW('mrp.production.output', 'saveConsume', [
        outputId,
        name,
        dateStart,
        productionId,
        lines,
      ]);
      return wiz;
    } catch (e) {
      return e;
    }
  }

  async saveCMlt(outputId, name, dateStart, productionId, lines) {
    try {
      const wiz = await this.executeKW('mrp.production.output', 'saveCMlt', [
        outputId,
        name,
        dateStart,
        productionId,
        lines,
      ]);
      return wiz;
    } catch (e) {
      return e;
    }
  }

  async saveProduceEtc(outputId, produce) {
    try {
      const res = await this.executeKW(
        'mrp.production.output',
        'saveProduceEtc',
        [outputId, produce]
      );
      return res;
    } catch (e) {
      return e;
    }
  }

  async checkState(press) {
    try {
      const pressStatus = await this.executeKW(
        'mrp.production.output',
        'read',
        [[press.id, ['state']]]
      );
      const state = pressStatus ? pressStatus[0].state : '';
      if (state) {
        return state;
      }
      return false;
    } catch (e) {
      return e;
    }
  }

  async saveProducePress(outputId, produce) {
    try {
      // eslint-disable-next-line no-restricted-syntax
      const res = await this.executeKW(
        'mrp.production.output',
        'saveProducePress',
        [outputId, produce]
      );

      return res;
    } catch (e) {
      return e;
    }
  }

  async saveProduceMlt(outputId, produce) {
    try {
      // eslint-disable-next-line no-restricted-syntax
      const res = await this.executeKW(
        'mrp.production.output',
        'saveProduceMlt',
        [outputId, produce]
      );

      return res;
    } catch (e) {
      return e;
    }
  }

  async endEtching(press) {
    try {
      const result = await this.executeKW(
        'mrp.production.output',
        'endEtching',
        [press.outputId, press.mchID, press.note]
      );
      return result;
    } catch (e) {
      return e;
    }
  }

  async endMelting(press) {
    try {
      const result = await this.executeKW(
        'mrp.production.output',
        'endMelting',
        [
          press.outputId,
          press.mchID,
          press.note,
          Number(localStorage.getItem('shiftId')),
          press.produce,
        ]
      );
      return result;
    } catch (e) {
      return e;
    }
  }

  async startMelting(woId, mchID, wcId, shiftId, note) {
    try {
      const result = await this.executeKW(
        'mrp.production.output',
        'startMelting',
        [false, woId, mchID, wcId, shiftId, note]
      );
      return result;
    } catch (e) {
      return e;
    }
  }

  async endPress(press) {
    try {
      const result = await this.executeKW('mrp.production.output', 'endPress', [
        press.outputId,
        press.mchID,
        press.sample,
        press.rarm_speed,
        press.presure,
        this.uid,
        press.shiftId,
        press.dieId,
        press.lotBillet,
        press.note,
        press.dateEnd,
      ]);
      return result;
    } catch (e) {
      return e;
    }
  }

  async getShift() {
    try {
      const result = await this.executeKW('res.shift', 'search_read', [
        [],
        ['id', 'name'],
      ]);
      return result;
    } catch (e) {
      return [];
    }
  }

  async saveCorr(die, outputId, problem) {
    try {
      const wizId = await this.executeKW('wizard.issue.corrective', 'create', [
        {
          die_id: die,
          output_id: outputId,
          problem,
        },
      ]);
      const result = await this.executeKW(
        'wizard.issue.corrective',
        'action_create',
        [wizId]
      );
      return result;
    } catch (e) {
      return e;
    }
  }

  async createPress(
    woId,
    mchID,
    wcId,
    shiftId,
    dieId,
    lotBillet,
    note,
    dateStart
  ) {
    try {
      const output = await this.executeKW(
        'mrp.production.output',
        'setInwork',
        [
          false,
          woId,
          mchID,
          wcId,
          shiftId,
          this.uid,
          note,
          lotBillet,
          dieId,
          localStorage.getItem('spvId'),
          dateStart,
        ]
      );
      return output;
    } catch (e) {
      return e;
    }
  }

  async getChildLine(outputId) {
    try {
      const detail = await this.executeKW(
        'mrp.production.output.line',
        'search_read',
        [
          [['output_id', '=', Number(outputId)]],
          [
            'product_qty',
            'output_id',
            'product_uom',
            'product_id',
            'result_type',
            'note',
          ],
          0,
          0,
          'id',
        ]
      );

      return detail;
    } catch (e) {
      return e;
    }
  }

  async getOutputLines(outputIds) {
    try {
      const detail = await this.executeKW(
        'mrp.production.output.line',
        'read',
        [outputIds, ['product_qty', 'product_uom', 'product_id']]
      );
      return detail;
    } catch (e) {
      return e;
    }
  }

  async addScrapOLine(md, type, qty, note, prdQty, id, newId, productId) {
    let data;
    try {
      if (md === 'add') {
        let lines;
        if (productId) {
          lines = {
            product_id: productId,
            result_type: type,
            product_qty: qty,
            note,
          };
        } else {
          lines = {
            result_type: type,
            product_qty: qty,
            note,
          };
        }
        if (prdQty > 0) {
          data = await this.executeKW('mrp.production.output.line', 'copy', [
            Number(id),
            lines,
          ]);

          await this.executeKW('mrp.production.output.line', 'write', [
            [Number(id)],
            {
              product_qty: prdQty,
            },
          ]);
        } else {
          await this.executeKW('mrp.production.output.line', 'write', [
            [Number(id)],
            lines,
          ]);
          data = Number(id);
        }
      } else {
        data = await this.executeKW('mrp.production.output.line', 'unlink', [
          [newId],
        ]);
        await this.executeKW('mrp.production.output.line', 'write', [
          [Number(id)],
          {
            product_qty: prdQty,
          },
        ]);
      }
      return data;
    } catch (e) {
      return e;
    }
  }

  async getOutputLineRack(outputIds) {
    try {
      const detail = await this.executeKW(
        'mrp.production.output.line',
        'search_read',
        [
          [
            ['rack', '=', null],
            ['id', 'in', outputIds],
          ],
          ['product_qty', 'product_uom', 'product_id', 'date_finished'],
        ]
      );
      return detail;
    } catch (e) {
      return e;
    }
  }

  async getOutputRack() {
    try {
      const detail = await this.executeKW(
        'mrp.production.output',
        'getOutputRack',
        [false, Number(localStorage.getItem('palletMchId'))]
      );

      return detail;
    } catch (e) {
      return e;
    }
  }

  async remBillet(pressID, id) {
    try {
      const billet = await this.executeKW(
        'mrp.production.output',
        'remBillet',
        [pressID, id]
      );
      return billet;
    } catch (e) {
      return e;
    }
  }

  async remProduce(outID, id) {
    try {
      const produce = await this.executeKW(
        'mrp.production.output',
        'remProduce',
        [outID, id]
      );
      return produce;
    } catch (e) {
      return e;
    }
  }

  async getListProduce(outID) {
    try {
      const produce = await this.executeKW(
        'mrp.production.output',
        'getListProduce',
        [outID]
      );
      return produce;
    } catch (e) {
      return e;
    }
  }

  async remCMlt(outID, id) {
    try {
      const produce = await this.executeKW('mrp.production.output', 'remCMlt', [
        outID,
        id,
      ]);
      return produce;
    } catch (e) {
      return e;
    }
  }

  async getOutput(woId) {
    try {
      const output = await this.executeKW(
        'mrp.production.output',
        'search_read',
        [
          [
            ['workorder_id', '=', woId],
            ['workcenter_id.type', '=', 'die_oven'],
            ['state', 'not in', ['done', 'cancel', 'draft']],
          ],
          ['date_start', 'date_finished', 'state', 'name'],
          0,
          1,
        ]
      );
      return output;
    } catch (e) {
      return e;
    }
  }

  async dieState(dieId) {
    try {
      const output = await this.executeKW('product.product', 'read', [
        [Number(dieId)],
        ['die_state'],
        0,
        1,
      ]);
      const dieS = output.map((prd) => {
        if (prd.die_state === 'ready') {
          return 'Ready';
        }
        if (prd.die_state === 'ok') {
          return 'Ok';
        }
        if (prd.die_state === 'notok') {
          return 'Not Ok';
        }
        if (prd.die_state === 'repair') {
          return 'Need Repair';
        }
        if (prd.die_state === 'nitrid') {
          return 'Need Nitrid';
        }
        return 'In Use';
      });
      return dieS ? dieS[0] : '';
    } catch (e) {
      return e;
    }
  }

  async getProductionDie(sDate, eDate, machine, mo, tabValue) {
    try {
      const die = await this.executeKW(
        'mrp.production.workcenter.line',
        'search_read',
        [
          [
            ['resource_id', '=', machine],
            ['workcenter_id.type', '=', 'die_oven'],
            ['state', '=', tabValue],
            ['production_id.name', 'ilike', mo],
            '|',
            '&',
            ['date_planned', '>=', sDate],
            ['date_planned', '<=', eDate],
            ['state', '=', 'startworking'],
          ],
          [
            'name',
            'date_planned',
            'product',
            'state',
            'output_ids',
            'production_id',
            'workcenter_id',
            'date_start',
          ],
          0,
          25,
          'date_planned desc',
        ]
      );
      return die;
    } catch (e) {
      return e;
    }
  }

  async actionDone(data, scrapbs, racks, date) {
    try {
      const result = await this.executeKW('mrp.production.output', 'outDone', [
        data,
        localStorage.getItem('uid'),
        localStorage.getItem('shiftId'),
        scrapbs,
        racks,
        date,
      ]);
      return result;
    } catch (e) {
      return e;
    }
  }

  async setOutput(data, mchID) {
    try {
      const result = await this.executeKW(
        'mrp.production.output',
        'setOutput',
        [
          false,
          data,
          localStorage.getItem('shiftId'),
          mchID,
          localStorage.getItem('uid'),
        ]
      );
      return result;
    } catch (e) {
      return e;
    }
  }

  async getCompute(type, pallet, mode, mchId) {
    try {
      const rack = pallet instanceof Array ? pallet : [pallet];
      const data = await this.executeKW(
        'mrp.production.output',
        'getOutStandingOutput',
        [
          false,
          rack,
          type,
          localStorage.getItem('shiftId'),
          mchId,
          localStorage.getItem('uid'),
          mode,
        ]
      );
      return data;
    } catch (e) {
      return e;
    }
  }

  async setStartBubut(bubut) {
    try {
      const worder = await this.executeKW(
        'mrp.production.output',
        'actCreateB',
        [
          bubut.outputId,
          bubut,
          localStorage.getItem('shiftId'),
          localStorage.getItem('bubutMchId'),
        ]
      );
      return worder;
    } catch (e) {
      return e;
    }
  }

  async setStartPotong(potong) {
    try {
      const worder = await this.executeKW(
        'mrp.production.output',
        'actCreateB',
        [
          potong.outputId,
          potong,
          localStorage.getItem('shiftId'),
          localStorage.getItem('potongMchId'),
        ]
      );
      return worder;
    } catch (e) {
      return e;
    }
  }

  async getWorkOrder(woId) {
    try {
      const worder = await this.executeKW('mrp.production.output', 'getWo', [
        false,
        [Number(woId)],
      ]);
      return worder;
    } catch (e) {
      return e;
    }
  }

  async getWorkOrderMelting(woId) {
    try {
      const worder = await this.executeKW(
        'mrp.production.output',
        'getWoMelting',
        [false, [Number(woId)]]
      );
      return worder;
    } catch (e) {
      return e;
    }
  }

  async changeDie(pressId, die, prodId) {
    try {
      const result = await this.executeKW('wiz.toolset', 'create', [
        {
          die_copy: die,
        },
      ]);
      await this.executeKW('wiz.toolset', 'set_toolset', [
        result,
        {
          active_id: Number(prodId),
        },
      ]);
      if (result) {
        await this.executeKW('mrp.production.output', 'write', [
          pressId,
          {
            die,
          },
        ]);
      }

      return result;
    } catch (e) {
      return e;
    }
  }

  async addPotBillet(row, typeId, length, btg, qty, moName, outputId) {
    try {
      const res = await this.executeKW('stock.picking', 'cSimpleProd', [
        false,
        row,
        typeId,
        length,
        btg,
        qty,
        moName,
        outputId,
      ]);
      return res;
    } catch (e) {
      return e;
    }
  }

  async addBillet(outputId) {
    try {
      const res = await this.executeKW('mrp.production.output', 'addBillet', [
        outputId,
      ]);
      return res;
    } catch (e) {
      return e;
    }
  }

  async addCMelting(outputId) {
    try {
      const res = await this.executeKW('mrp.production.output', 'addCMelting', [
        outputId,
      ]);
      return res;
    } catch (e) {
      return e;
    }
  }

  async addPMelting(outputId) {
    try {
      const res = await this.executeKW('mrp.production.output', 'addPMelting', [
        outputId,
      ]);
      return res;
    } catch (e) {
      return e;
    }
  }

  async addScrap(outputId) {
    try {
      const res = await this.executeKW('mrp.production.output', 'addScrap', [
        outputId,
      ]);
      return res;
    } catch (e) {
      return e;
    }
  }

  async addBattScrap(outputId) {
    try {
      const res = await this.executeKW(
        'mrp.production.output',
        'addBattScrap',
        [outputId]
      );
      return res;
    } catch (e) {
      return e;
    }
  }

  async addRoll(outputId) {
    try {
      const res = await this.executeKW('mrp.production.output', 'addRoll', [
        outputId,
      ]);
      return res;
    } catch (e) {
      return e;
    }
  }

  async getBubut(MoName, dieName) {
    try {
      const result = await this.executeKW('mrp.production.output', 'getNewCD', [
        false,
        'bubut',
        MoName,
        dieName,
      ]);
      return result;
    } catch (e) {
      return e;
    }
  }

  async getPotong(MoName, dieName) {
    try {
      const result = await this.executeKW('mrp.production.output', 'getNewCD', [
        false,
        'potong',
        MoName,
        dieName,
      ]);
      return result;
    } catch (e) {
      return e;
    }
  }

  async getCD(code, MoName, dieName, wcId) {
    try {
      const result = await this.executeKW('mrp.production.output', 'getNewCD', [
        false,
        code,
        MoName,
        dieName,
        wcId,
      ]);
      return result;
    } catch (e) {
      return e;
    }
  }

  async getCDIp(code, MoName, die, wcId) {
    try {
      const result = await this.executeKW(
        'mrp.production.output',
        'getCDInprogress',
        [false, code, MoName, die, wcId]
      );
      return result;
    } catch (e) {
      return e;
    }
  }

  async getWoCD(woID) {
    try {
      const result = await this.executeKW('mrp.production.output', 'getWoCd', [
        false,
        woID,
      ]);
      return result;
    } catch (e) {
      return e;
    }
  }

  async getProductionPress(MoName) {
    try {
      const result = await this.executeKW('mrp.production.output', 'getNewWo', [
        false,
        MoName,
        Number(localStorage.getItem('pressMchId')),
      ]);
      return result;
    } catch (e) {
      return e;
    }
  }

  async getWoCorrective(woId, type) {
    try {
      const result = await this.executeKW(
        'mrp.production.output',
        'getWoCorrective',
        [false, woId, type]
      );
      return result;
    } catch (e) {
      return e;
    }
  }

  async getCorrective(type, MoName, mchID, code) {
    try {
      const result = await this.executeKW(
        'mrp.production.output',
        'getNewCorr',
        [false, type, MoName, mchID, code]
      );
      return result;
    } catch (e) {
      return e;
    }
  }

  async addCorrAct(code, name, note) {
    try {
      const result = await this.executeKW('res.corrective_action', 'create', [
        {
          code,
          name,
          note,
        },
      ]);
      return { id: result, name };
    } catch (e) {
      return e;
    }
  }

  async getProductionEtching(MoName, type) {
    try {
      const etching = await this.executeKW(
        'mrp.production.workcenter.line',
        'search_read',
        [
          [
            ['name', 'ilike', MoName],
            ['workcenter_id.type', '=', type],
            ['state', 'not in', ['cancel', 'pause', 'done']],
            [
              'production_id.state',
              'in',
              ['confirmed', 'ready', 'in_production'],
            ],
          ],
          [
            'name',
            'date_planned',
            'product',
            'uom',
            'qty',
            'production_id',
            'workcenter_id',
          ],
          0,
          10,
        ]
      );

      return etching;
    } catch (e) {
      return e;
    }
  }

  async getInProgressWO(moName, workCenterType, mchID) {
    try {
      const wo = await this.executeKW(
        'mrp.production.output',
        'get_inprogress_wo',
        [false, moName, workCenterType, mchID]
      );
      return wo;
    } catch (e) {
      return e;
    }
  }

  async getInProgressCorr(MoName, wcType, mchID, code) {
    try {
      const wo = await this.executeKW(
        'mrp.production.output',
        'get_inprogress_corr',
        [false, MoName, wcType, mchID, code]
      );
      return wo;
    } catch (e) {
      return e;
    }
  }

  async getConsume(prodID) {
    try {
      const consume = await this.executeKW('stock.move', 'search_read', [
        [['raw_material_production_id', '=', Number(prodID)]],
        ['product_id', 'product_qty'],
      ]);
      return consume;
    } catch (e) {
      return e;
    }
  }

  async getQcExport(name) {
    try {
      const result = await this.executeKW(
        'mrp.production.output',
        'getQCexport',
        [false, name]
      );
      return result;
    } catch (e) {
      return e;
    }
  }

  async createQcExport(data) {
    try {
      const result = await this.executeKW(
        'mrp.production.output',
        'createQcExport',
        [
          false,
          localStorage.getItem('shiftId'),
          localStorage.getItem('uid'),
          data,
        ]
      );
      return result;
    } catch (e) {
      return e;
    }
  }

  async getAccessUser(user) {
    try {
      const menu = await this.executeKW('res.groups', 'search_read', [
        [
          ['users', 'in', [user]],
          ['category_id', 'in', ['application']],
        ],
        ['name', 'id', 'comment'],
        0,
        false,
        'name',
      ]);
      return menu;
    } catch (e) {
      return e;
    }
  }

  async getUser(user) {
    try {
      const users = await this.executeKW('res.users', 'search_read', [
        [
          ['active', '=', true],
          ['name', 'ilike', user],
        ],

        ['id', 'name'],
        0,
        8,
        'name',
      ]);
      return users;
    } catch (e) {
      return e;
    }
  }

  async cancelPicking(picking) {
    try {
      await this.executeKW('stock.picking', 'do_unreserve', [picking]);
      await this.executeKW('stock.picking', 'action_cancel', [picking]);
    } catch (e) {
      return e;
    }
    return true;
  }

  async printSaved(pickId, totalC, totalF, reportId, printHost) {
    try {
      const res = await this.executeKW('stock.picking', 'printSaved', [
        pickId,
        totalC,
        totalF,
        reportId,
        printHost,
        localStorage.getItem('lotMchId'),
        localStorage.getItem('shiftId'),
      ]);
      return res;
    } catch (e) {
      return e;
    }
  }

  async actValidate(pickId, totalC, totalF) {
    try {
      const res = await this.executeKW('stock.picking', 'actValidate', [
        pickId,
        totalC,
        totalF,
      ]);
      return res;
    } catch (e) {
      return e;
    }
  }

  async pickMelting(picking, moveLines) {
    try {
      const res = await this.executeKW('stock.picking', 'pickMelting', [
        false,
        picking,
        moveLines,
      ]);
      return res;
    } catch (e) {
      return e;
    }
  }

  async createPicking(picking, moveLines) {
    try {
      const pickingIds = await this.executeKW('stock.picking', 'create', [
        {
          picking_type_id: picking.type,
          wc_id: picking.machine_id,
          shift_id: picking.shift_id,
          invoice_state: 'none',
          state: 'draft',
          location_id: picking.location_id,
          location_dest_id: picking.location_dest_id,
          origin: picking.sourceDocument,
          move_lines: moveLines,
        },
      ]);

      if (pickingIds) {
        await this.executeKW('stock.picking', 'action_confirm', [pickingIds]);
        await this.executeKW('stock.picking', 'action_assign', [pickingIds]);
        const result = await this.executeKW('stock.move', 'search_read', [
          [
            ['picking_id', '=', pickingIds],
            ['state', '!=', 'assigned'],
          ],
          ['name', 'picking_id'],
        ]);
        if (result.length > 0) {
          return { warning: result };
        }
        await this.executeKW('stock.picking', 'do_transfer', [pickingIds]);
        const pickVals = await this.executeKW('stock.picking', 'search_read', [
          [['id', '=', pickingIds]],
          ['name', 'id'],
        ]);
        return pickVals;
      }
    } catch (e) {
      return e;
    }
    return '';
  }

  async getActCorr(name) {
    try {
      const resActions = await this.executeKW(
        'res.corrective_action',
        'search_read',
        [[['name', 'ilike', name]], ['id', 'name'], 0, 5]
      );

      if (resActions.length !== 0) {
        return resActions.map((act) => ({
          value: act.id,
          label: `${act.name}`,
        }));
      }
      // eslint-disable-next-line camelcase
      return resActions;
    } catch (e) {
      return e;
    }
  }

  async getProductCategory(name) {
    try {
      let domain;
      if (name !== '') {
        domain = [['name', 'ilike', name]];
      } else {
        domain = [];
      }
      const categIds = await this.executeKW('product.category', 'search_read', [
        domain,
        ['id', 'name'],
        0,
        5,
      ]);

      if (categIds.length !== 0) {
        return categIds.map((categ) => ({
          value: categ.id,
          label: `${categ.name}`,
        }));
      }
      return false;
    } catch (e) {
      return e;
    }
  }

  async getProductAll(name) {
    try {
      let domain;
      if (name !== '') {
        domain = [
          ['active', '=', true],
          ['type', '=', 'product'],
          '|',
          ['default_code', 'ilike', name],
          ['name_template', 'ilike', name],
        ];
      } else {
        domain = [
          ['active', '=', true],
          ['type', '=', 'product'],
        ];
      }
      const productIds = await this.executeKW(
        'product.product',
        'search_read',
        [domain, ['id', 'default_code', 'name', 'uom_id'], 0, 5]
      );

      if (productIds.length !== 0) {
        return productIds.map((product) => ({
          value: product.id,
          label: `[${product.default_code}] ${product.name}`,
          uom_id: product.uom_id,
        }));
      }
      return false;
    } catch (e) {
      return e;
    }
  }

  async getProductToSale(name) {
    try {
      let domain;
      if (name !== '') {
        domain = [
          ['active', '=', true],
          ['type', '=', 'product'],
          ['sale_ok', '=', true],
          '|',
          ['default_code', 'ilike', name],
          ['name_template', 'ilike', name],
        ];
      } else {
        domain = [
          ['active', '=', true],
          ['type', '=', 'product'],
        ];
      }
      const productIds = await this.executeKW(
        'product.product',
        'search_read',
        [domain, ['id', 'default_code', 'name', 'uom_id'], 0, 5]
      );

      if (productIds.length !== 0) {
        return productIds.map((product) => ({
          value: product.id,
          label: `[${product.default_code}] ${product.name}`,
          uom_id: product.uom_id,
        }));
      }
      return false;
    } catch (e) {
      return e;
    }
  }

  async createLoss(moves) {
    try {
      const res = await this.executeKW('stock.picking', 'createLoss', [
        false,
        moves,
      ]);
      return res;
    } catch (e) {
      return e;
    }
  }

  async getProductMUI(name) {
    try {
      let domain;
      if (name !== '') {
        domain = [
          ['active', '=', true],
          ['type', '=', 'product'],
          '|',
          ['default_code', 'ilike', name],
          ['name_template', 'ilike', name],
        ];
      } else {
        domain = [
          ['active', '=', true],
          ['type', '=', 'product'],
        ];
      }
      const productIds = await this.executeKW(
        'product.product',
        'search_read',
        [domain, ['id', 'default_code', 'name', 'uom_id'], 0, 7]
      );

      if (productIds.length !== 0) {
        return productIds.map((product) => ({
          id: product.id,
          name: `[${product.default_code}] ${product.name}`,
          uomId: product.uom_id[0],
          uom: product.uom_id[1],
        }));
      }
      return false;
    } catch (e) {
      return e;
    }
  }

  async getUomAll() {
    try {
      const uomIds = await this.executeKW('product.uom', 'search_read', [
        [['active', '=', true]],
        ['id', 'name'],
      ]);
      if (uomIds.length !== 0) return uomIds;
      return false;
    } catch (e) {
      return e;
    }
  }

  async getProductById(prdId) {
    try {
      const productIds = await this.executeKW(
        'product.product',
        'search_read',
        [[['id', '=', prdId]], ['id', 'default_code', 'name', 'uom_id'], 0, 5]
      );
      return productIds[0].name;
    } catch (e) {
      return e;
    }
  }

  async getFinished(pickingId) {
    try {
      const pick = await this.executeKW('stock.picking', 'read', [
        [Number(pickingId)],
        ['finished', 'picking_type_id', 'consume', 'name'],
      ]);
      const consume = await this.executeKW('stock.move', 'read', [
        pick[0].consume,
        [
          'name',
          'product_id',
          'product_uom_qty',
          'id',
          'restrict_lot_id',
          'product_uom',
        ],
      ]);
      const moves = await this.executeKW('stock.move', 'read', [
        pick[0].finished,
        ['name', 'product_id', 'product_uom_qty', 'id', 'restrict_lot_id'],
      ]);
      const type = await this.executeKW('stock.picking.type', 'read', [
        pick[0].picking_type_id[0],
        [
          'id',
          'name',
          'default_location_src_id',
          'default_location_dest_id',
          'default_location_prod_id',
        ],
      ]);
      return { type, moves, consume, name: pick[0].name };
    } catch (e) {
      return e;
    }
  }

  async delFinished(pickingId, moveId) {
    try {
      const result = await this.executeKW('stock.picking', 'delFinished', [
        pickingId,
        moveId,
      ]);
      return result;
    } catch (e) {
      return e;
    }
  }

  async actCancel(picking) {
    try {
      const res = await this.executeKW('stock.picking', 'action_cancel', [
        picking,
      ]);
      return res;
    } catch (e) {
      return e;
    }
  }

  async addPackingConsume(
    pickingId,
    type,
    productId,
    productName,
    qty,
    locId,
    destId,
    prodId,
    lotId,
    uomId
  ) {
    try {
      const res = await this.executeKW('stock.picking', 'addPackingConsume', [
        pickingId,
        type,
        productId,
        productName,
        qty,
        locId,
        destId,
        prodId,
        lotId,
        uomId,
      ]);
      return res;
    } catch (e) {
      return e;
    }
  }

  async addProduce(
    pickingId,
    type,
    productId,
    productName,
    qty,
    locId,
    destId,
    prodId,
    lotId,
    uomId
  ) {
    try {
      const res = await this.executeKW('stock.picking', 'addProduce', [
        pickingId,
        productId,
        productName,
        qty,
        locId,
        destId,
        prodId,
        lotId,
        uomId,
      ]);
      return res;
    } catch (e) {
      return e;
    }
  }

  async addPackingProduce(
    pickingId,
    type,
    productId,
    productName,
    qty,
    locId,
    destId,
    prodId,
    lotId,
    uomId,
    qtyMultiply
  ) {
    try {
      const res = await this.executeKW('stock.picking', 'addPackingProduce', [
        pickingId,
        type,
        productId,
        productName,
        qty,
        locId,
        destId,
        prodId,
        lotId,
        uomId,
        qtyMultiply,
      ]);
      return res;
    } catch (e) {
      return e;
    }
  }

  async getLocation() {
    try {
      const res = await this.executeKW('stock.location', 'search_read', [
        [['usage', '=', 'internal']],
        ['name'],
      ]);
      return res;
    } catch (e) {
      return e;
    }
  }

  async asyncgetLocation(locName) {
    try {
      const res = await this.executeKW('stock.location', 'search_read', [
        [
          ['usage', '=', 'internal'],
          ['name', 'ilike', locName],
        ],
        ['name'],
      ]);
      if (res.length !== 0) {
        return res.map((loc) => ({
          value: loc.id,
          label: `${loc.name}`,
        }));
      }
      return res;
    } catch (e) {
      return e;
    }
  }

  async getLotPress(productId, locId, lotName) {
    try {
      const res = await this.executeKW(
        'wizard.consumed.billet.line',
        'getLot',
        [false, productId, locId, lotName]
      );
      return res;
    } catch (e) {
      return {};
    }
  }

  async getQuant(lotName, locId, productId) {
    try {
      const res = await this.executeKW('stock.picking', 'getQuant', [
        false,
        lotName,
        locId,
        productId,
      ]);
      return res;
    } catch (e) {
      return {};
    }
  }

  async getQuantMelting(lotName, locId) {
    try {
      const res = await this.executeKW('stock.picking', 'getQuantMelting', [
        false,
        lotName,
        locId,
      ]);
      return res;
    } catch (e) {
      return {};
    }
  }

  async getQuantBaja(lotName, locId) {
    try {
      const res = await this.executeKW('stock.picking', 'getQuantBaja', [
        false,
        lotName,
        locId,
      ]);
      return res;
    } catch (e) {
      return {};
    }
  }

  async getReportAll() {
    try {
      const result = await this.executeKW('ir.config_parameter', 'get_param', [
        'api.report.barcode',
      ]);
      // eslint-disable-next-line array-callback-return
      return JSON.parse(result);
    } catch (e) {
      return e;
    }
  }

  async getCustomer(filtername) {
    try {
      const customer = await this.executeKW(
        'res.partner',
        'search_read',
        // eslint-disable-next-line no-sparse-arrays
        [
          [
            ['name', 'ilike', filtername],
            ['customer', '=', true],
            ['active', '=', true],
          ],
          ['id', 'name'],
          0,
          5,
        ]
      );
      if (customer.length !== 0) {
        return customer.map((cust) => ({
          value: cust.id,
          label: cust.name,
        }));
      }
      return [];
    } catch (e) {
      return e;
    }
  }

  async getPickingTypeProd(filtername) {
    try {
      const pickingTypeIds = await this.executeKW(
        'stock.picking.type',
        'search_read',
        [
          [
            ['name', 'ilike', filtername],
            ['code', 'in', ['production', 'manufact']],
          ],
        ],
        {
          fields: [
            'id',
            'name',
            'default_location_src_id',
            'default_location_dest_id',
            'default_location_prod_id',
          ],
        }
      );
      if (pickingTypeIds.length !== 0) {
        return pickingTypeIds.map((pick) => ({
          value: pick.id,
          label: pick.name,
          locId: pick.default_location_src_id,
          locDestId: pick.default_location_dest_id,
          locProdId: pick.default_location_prod_id,
        }));
      }
      return [];
    } catch (e) {
      return e;
    }
  }

  async getPickingType(filtername) {
    try {
      const pickingTypeIds = await this.executeKW(
        'stock.picking.type',
        'search_read',
        [
          [
            ['name', 'ilike', filtername],
            ['user_ids', 'in', [Number(localStorage.getItem('uid'))]],
          ],
        ],
        {
          fields: [
            'id',
            'name',
            'default_location_src_id',
            'default_location_dest_id',
          ],
        }
      );
      if (pickingTypeIds.length !== 0) return pickingTypeIds;
      return false;
    } catch (e) {
      return e;
    }
  }

  async getListPickingbyPOName(poName) {
    try {
      const pickingIds = await this.executeKW(
        'stock.picking',
        'search_read',
        [
          [
            ['origin', '=ilike', `%${poName}%`],
            ['state', '=', 'assigned'],
          ],
        ],
        { fields: ['name'] }
      );

      if (pickingIds.length !== 0) return pickingIds;

      return false;
    } catch (err) {
      return err;
    }
  }

  async getMachine(wc) {
    try {
      const result = await this.executeKW(
        'mrp.production.output',
        'getMachine',
        [false, wc, Number(localStorage.getItem('uid'))]
      );
      return result;
    } catch (e) {
      return [];
    }
  }

  async getMachineCorr() {
    try {
      const result = await this.executeKW(
        'mrp.production.output',
        'getMachine',
        [false, ['press'], false]
      );
      if (result.length !== 0) {
        return result.map((pick) => ({
          value: pick.id,
          label: pick.name,
        }));
      }
      return [];
    } catch (e) {
      return [];
    }
  }

  async getListPickingIds(purchaseID) {
    try {
      const pickingIds = await this.executeKW('purchase.order', 'read', [
        purchaseID,
        ['picking_ids'],
      ]);
      if (pickingIds.picking_ids) {
        const availPickingIds = await this.executeKW(
          'stock.picking',
          'search_read',
          [
            [
              ['id', 'in', pickingIds.picking_ids],
              ['state', '=', 'assigned'],
            ],
          ],
          { fields: ['name', 'origin', 'id'] }
        );
        if (availPickingIds.length !== 0) return availPickingIds;
      }
      return false;
    } catch (err) {
      return err;
    }
  }

  async getPicking(pickingID) {
    try {
      const pickingIds = await this.executeKW('stock.picking', 'read', [
        pickingID,
      ]);
      if (pickingIds) {
        return pickingIds;
      }
      return false;
    } catch (err) {
      return err;
    }
  }

  async deleteOperation(opId) {
    try {
      const rmOp = await this.executeKW('stock.pack.operation', 'write', [
        [opId],
        {
          trans_qty: 0,
          qty_done: 0,
        },
      ]);
      if (rmOp === true) {
        return rmOp;
      }

      return false;
    } catch (e) {
      return e;
    }
  }

  async onValidateOperation(pickId) {
    try {
      let backorder = await this.executeKW('stock.picking', 'do_new_transfer', [
        [pickId],
        {},
      ]);
      if (backorder.res_id) {
        backorder = await this.executeKW(
          'stock.backorder.confirmation',
          'process',
          [[backorder.res_id], {}]
        );
      }
      return backorder;
    } catch (err) {
      return err;
    }
  }

  async getPackOperation(packIds) {
    try {
      const operation = await this.executeKW(
        'stock.pack.operation',
        'search_read',
        [[['id', 'in', packIds]]],
        { fields: ['name'] }
      );
      if (operation) {
        return operation;
      }
      return false;
    } catch (err) {
      return err;
    }
  }

  async setPackOperation(operations, pickingID, custRef, noPol, sopir) {
    try {
      const result = await this.executeKW('stock.picking', 'setIncomingApp', [
        [pickingID],
        operations,
        custRef,
        noPol,
        sopir,
      ]);

      return result;
    } catch (err) {
      return err;
    }
  }

  // eslint-disable-next-line consistent-return
  async createInvoices(pickingID) {
    try {
      const journalID = await this.executeKW(
        'stock.invoice.onshipping',
        'default_get',
        [
          ['journal_id', 'payment_term_id', 'invoice_date'],
          {
            active_ids: [pickingID],
            active_id: pickingID,
            active_model: 'stock.picking',
          },
        ]
      );

      const Invoices = await this.executeKW(
        'stock.picking',
        'action_invoice_create',
        [
          [pickingID],
          journalID.journal_id[0],
          false,
          'in_invoice',
          {
            payment_term_id: journalID.payment_term_id[0],
            date_inv: journalID.invoice_date,
          },
        ]
      );

      // let backorder = await this.executeKW('stock.invoice.onshipping', 'create_invoice',
      //     [[],{'active_id':pickingID},]);
      return Invoices;
    } catch (err) {
      return err;
    }
  }

  static formatDateTime(str) {
    const dt = new Date(str);
    dt.setHours(dt.getHours() + 7);
    const mnth = `0${dt.getMonth() + 1}`.slice(-2);
    const day = `0${dt.getDate()}`.slice(-2);
    const hours = `0${dt.getHours()}`.slice(-2);
    const minutes = `0${dt.getMinutes()}`.slice(-2);
    return `${[dt.getFullYear(), mnth, day].join('-')}T${hours}:${minutes}`;
  }

  static OdooDateTime(str) {
    const dt = new Date(str);
    dt.setHours(dt.getHours() - 7);
    const mnth = `0${dt.getMonth() + 1}`.slice(-2);
    const day = `0${dt.getDate()}`.slice(-2);
    const hours = `0${dt.getHours()}`.slice(-2);
    const minutes = `0${dt.getMinutes()}`.slice(-2);
    return `${[dt.getFullYear(), mnth, day].join('-')}T${hours}:${minutes}`;
  }

  static CurrentTime(str) {
    const dt = new Date(str);
    dt.setHours(dt.getHours());
    const mnth = `0${dt.getMonth() + 1}`.slice(-2);
    const day = `0${dt.getDate()}`.slice(-2);
    const hours = `0${dt.getHours()}`.slice(-2);
    const minutes = `0${dt.getMinutes()}`.slice(-2);
    return `${[dt.getFullYear(), mnth, day].join('-')}T${hours}:${minutes}`;
  }

  static MinDateTime(str) {
    const dt = new Date(str);
    dt.setDate(dt.getDate() - 1);
    const mnth = `0${dt.getMonth() + 1}`.slice(-2);
    const day = `0${dt.getDate()}`.slice(-2);

    return `${[dt.getFullYear(), mnth, day].join('-')}T00:00`;
  }
}
