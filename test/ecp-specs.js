import chai from 'chai';
import chaiAsPromised from 'chai-as-promised';
import {default as ECP} from '../index';

chai.should();
chai.use(chaiAsPromised);

describe('Ares', function () {
  it('should be start ECP Client', async function () {
    await ECP.createECP({ecpExecTimeout: 60000});
  });
});