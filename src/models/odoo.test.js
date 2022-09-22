import OdooLib from './odoo';

let odoo;
beforeAll(() => {
  odoo = new OdooLib();
  odoo.odoo_url = 'http://localhost:8069';
  odoo.odoo_db = 'od9bms';
  odoo.password = 'saya';
  odoo.uid = 1;
});

describe('Login Function ', () => {
  test('Login should be success', async () => {
    await expect(odoo.login('admin', 'saya')).resolves.toBe(1);
  });
  test('Login username and password not found', async () => {
    await expect(odoo.login('admin1', 'saya')).rejects.toThrow();
  });
});

describe('Get Purchase Picking ids Function ', () => {
  test('should be success', async () => {
    const res = await odoo.getListPickingIds(3858);
    expect(res[0]).toBe(61668);
  });
  test('Purchase data not found', async () => {
    await expect(odoo.getListPickingIds(389811)).resolves.toBeFalsy();
  });
  test('Purchase data should be error', async () => {
    await expect(odoo.getListPickingIds('anjing')).resolves.toThrow();
  });
});

describe('Get Picking Function ', () => {
  test('should be success', async () => {
    const res = await odoo.getPicking(3858);
    expect(res.id).toBe(4180);
  });
  test('many ids should be success', async () => {
    const res = await odoo.getPicking([4180, 41801]);
    expect(res.length).toBe(2);
  });
  test('Picking Data not found ', async () => {
    const res = await odoo.getPicking(1223241801);
    expect(res).toBe(false);
  });
  test('Picking data should be error', async () => {
    await expect(odoo.getPicking('anjing')).resolves.toThrow();
  });
});

describe('Get Pack Function ', () => {
  test('should be success', async () => {
    const res = await odoo.getPackOperation([35623, 35624, 35625, 35626]);
    expect(res.length).toBe(4);
  });
  test('Pack Data not found ', async () => {
    const res = await odoo.getPackOperation(1223241801);
    expect(res).toBe(false);
  });
  test('Pack data should be error', async () => {
    await expect(odoo.getPackOperation('anjing')).resolves.toThrow();
  });
});
