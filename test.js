'use strict'
const { ONVIF } = require('.')

function printTest(title, result){
	console.log(`========================= ${title} =========================`)
	console.log(typeof(result)=='object' ? JSON.stringify(result, null, '  ') : result)
	console.log()
}

async function run(){
	const host = process.argv[2]
	if(!host) return console.log('Use: node test.js <camera_ip>')
	try{
		const cam = new ONVIF({host:process.argv[2], user:'root', pass:'root', verbose: false})
		printTest('TIME', (await cam.getTime()).toISOString())
		printTest('INFO', await cam.getInfo())
		printTest('CAPABILITIES', await cam.getCapabilities())
		printTest('SERVICES', await cam.getServices())
		const cam_net = await cam.getNet()
		printTest('NETWORK', cam_net)
		const ip = cam_net.IPv4.Config.Manual.Address
		printTest('IP v4 address', ip)
		printTest('IP v4 address change', await cam.setIPv4(ip))
	}catch(e){
		console.log(e)
	}
}

run()
