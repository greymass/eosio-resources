import 'mocha'
import {strict as assert} from 'assert'
import {join as joinPath} from 'path'

import {APIClient, Name} from '@greymass/eosio'
import {MockProvider} from './utils/mock-provider'

import {Resources} from '../src'
import {REXState} from '../src/rex'

const eos = new APIClient({
    provider: new MockProvider(joinPath(__dirname, 'data'), 'https://eos.greymass.com'),
})

const resources = new Resources({api: eos})

suite('rex', function () {
    this.slow(200)
    test('v1.rex.get_state', async function () {
        const rex = await resources.v1.rex.get_state()
        assert.equal(rex instanceof REXState, true)
    })
    test('rex.reserved', async function () {
        const rex = await resources.v1.rex.get_state()
        assert.equal(rex.reserved, 0.5565968415413414)
        // 55.66151698897704% represented as float
    })
    test('rex.price_per_ms(1)', async function () {
        const rex = await resources.v1.rex.get_state()
        const usage = await resources.getSampledUsage()
        const price = rex.price_per_ms(usage)
        assert.equal(String(price), '0.0037 EOS')
        assert.equal(price.value, 0.0037)
        assert.equal(Number(price.units), 37)
    })
    test('rex.price_per_ms(10)', async function () {
        const rex = await resources.v1.rex.get_state()
        const usage = await resources.getSampledUsage()
        const price = rex.price_per_ms(usage, 10)
        assert.equal(String(price), '0.0370 EOS')
        assert.equal(price.value, 0.037)
        assert.equal(Number(price.units), 370)
    })
    test('rex.price_per_ms(1000)', async function () {
        const rex = await resources.v1.rex.get_state()
        const usage = await resources.getSampledUsage()
        const price = rex.price_per_ms(usage, 1000)
        assert.equal(String(price), '3.7010 EOS')
        assert.equal(price.value, 3.701)
        assert.equal(Number(price.units), 37010)
    })
})
