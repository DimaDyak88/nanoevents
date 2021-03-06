var NanoEvents = require('../')

it('is a class', function () {
  var ee = new NanoEvents()
  expect(typeof NanoEvents).toEqual('function')
  expect(ee instanceof NanoEvents).toBeTruthy()
})

it('is empty from the beggining', function () {
  var ee = new NanoEvents()
  expect(ee.events).toEqual({ })
})

it('allows only function as listener', function () {
  var ee = new NanoEvents()
  expect(function () {
    ee.on('event', { })
  }).toThrowError(/function/)
})

it('adds listeners', function () {
  var ee = new NanoEvents()

  ee.on('one', function () { })
  ee.on('two', function () { })
  ee.on('two', function () { })

  expect(Object.keys(ee.events)).toEqual(['one', 'two'])
  expect(ee.events.one.length).toEqual(1)
  expect(ee.events.two.length).toEqual(2)
})

it('calls listener', function () {
  var ee = new NanoEvents()
  var calls = []
  ee.on('event', function () {
    calls.push(Array.prototype.slice.call(arguments))
  })

  ee.emit('event')
  ee.emit('event', 11)
  ee.emit('event', 21, 22)
  ee.emit('event', 31, 32, 33)
  ee.emit('event', 41, 42, 43, 44)

  expect(calls).toEqual([[], [11], [21, 22], [31, 32, 33], [41, 42, 43, 44]])
})

it('unbinds listener', function () {
  var ee = new NanoEvents()

  var calls1 = []
  var unbind = ee.on('event', function (a) {
    calls1.push(a)
  })

  var calls2 = []
  ee.on('event', function (a) {
    calls2.push(a)
  })

  ee.emit('event', 1)
  unbind()
  ee.emit('event', 2)

  expect(calls1).toEqual([1])
  expect(calls2).toEqual([1, 2])
})

it('removes event on no listeners', function () {
  var ee = new NanoEvents()
  var unbind1 = ee.on('one', function () {})
  var unbind2 = ee.on('one', function () {})

  unbind1()
  expect(ee.events.one.length).toEqual(1)

  unbind1()
  expect(ee.events.one.length).toEqual(1)

  unbind2()
  expect(ee.events.one.length).toEqual(0)

  unbind2()
  expect(ee.events.one.length).toEqual(0)
})

it('removes listener during event', function () {
  var ee = new NanoEvents()

  var calls = []
  var remove1 = ee.on('event', function () {
    remove1()
    calls.push(1)
  })
  ee.on('event', function () {
    calls.push(2)
  })

  ee.emit('event')
  expect(calls).toEqual([1, 2])
})

it('does not clash with Object.prototype properties', function () {
  var ee = new NanoEvents()
  expect(function () {
    ee.emit('constructor')
    ee.emit('hasOwnProperty')
    ee.emit('__proto__')
  }).not.toThrowError()
})
