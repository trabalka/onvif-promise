'use strict'

const http = require('http')
const crypto = require('crypto')
const { XMLParser, XMLBuilder } = require('fast-xml-parser')
const parser = new XMLParser({
	ignoreDeclaration: true,
	removeNSPrefix: true,
})
function parseXML(xml) { return parser.parse(xml) }

// promise-based HTTP request
function httpRequest(params, postData, verbose) {
	return new Promise((resolve, reject)=>{
		const req = http.request(params)
		req.on('response', (res)=>{
			if(res.statusCode<200 || res.statusCode>=300) {
				return reject(new Error(res.statusCode))
			}
			let chunks = []
			res.on('data', (chunk)=>chunks.push(chunk))
			res.on('end', ()=>{
				try{
					if(verbose) console.log('=====RESULT=====',Buffer.concat(chunks).toString('utf-8'),'=====END=====')
					resolve(Buffer.concat(chunks).toString('utf-8'))
				}catch(e){
					reject(e)
				}
			})
		})
		req.on('error', (err)=>reject(err))
		if(verbose) console.log(`===== REQUEST PARAMS =====\n${JSON.stringify(params, null, '  ')}\n`)
		if(postData) {
			if(verbose) console.log(`===== REQUEST BODY =====\n${postData}\n`)
			req.write(postData)
		}
		if(verbose) console.log(`===== REQUEST END =====\n\n`)
		req.end()
	})
} // httpRequest

class ONVIF {
	constructor({host, port, user, pass, verbose}){
		this.host = host
		this.port = port
		this.user = user
		this.pass = pass
		this.verbose = !!verbose
	} // constructor

  // used to calculate digest authentication according to ONVIF spec
	digest(){
		const timestamp = (new Date((process.uptime() * 1000) + (this.time_shift || 0))).toISOString()
		let nonce = Buffer.alloc(16)
		nonce.writeUIntLE(Math.ceil(Math.random() * 0x100000000), 0, 4)
		nonce.writeUIntLE(Math.ceil(Math.random() * 0x100000000), 4, 4)
		nonce.writeUIntLE(Math.ceil(Math.random() * 0x100000000), 8, 4)
		nonce.writeUIntLE(Math.ceil(Math.random() * 0x100000000), 12, 4)
		let cryptoDigest = crypto.createHash('sha1')
		cryptoDigest.update(Buffer.concat([nonce, Buffer.from(timestamp, 'ascii'), Buffer.from(this.pass, 'ascii')]))
		const password = cryptoDigest.digest('base64')
		nonce = nonce.toString('base64')
		return { timestamp, password, nonce }
	} // digest

  // encpasulation of SOAP post
	async post(bodyData, nosecurity){
    // all commands except getTime need to be authenticated
    // getting time from camera is necessary as a first step to be able to calculate authentication digest
		if(!this.time_shift && !nosecurity) await this.getTime()

    let postData = `<s:Envelope xmlns:s="http://www.w3.org/2003/05/soap-envelope" xmlns:a="http://www.w3.org/2005/08/addressing">`

		if(!nosecurity && this.user && this.pass) {
			const { timestamp, password, nonce } = this.digest()
			postData += `
				<s:Header>
					<Security s:mustUnderstand="1" xmlns="http://docs.oasis-open.org/wss/2004/01/oasis-200401-wss-wssecurity-secext-1.0.xsd">
						<UsernameToken>
							<Username>${this.user}</Username>
							<Password Type="http://docs.oasis-open.org/wss/2004/01/oasis-200401-wss-username-token-profile-1.0#PasswordDigest">${password}</Password>
							<Nonce EncodingType="http://docs.oasis-open.org/wss/2004/01/oasis-200401-wss-soap-message-security-1.0#Base64Binary">${nonce}</Nonce>
							<Created xmlns="http://docs.oasis-open.org/wss/2004/01/oasis-200401-wss-wssecurity-utility-1.0.xsd">${timestamp}</Created>
						</UsernameToken>
					</Security>
				</s:Header>`
		}

    bodyData = bodyData.replace(/\n\s*$/,'')
		postData += `
				<s:Body xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:xsd="http://www.w3.org/2001/XMLSchema">${bodyData}
        </s:Body>
			</s:Envelope>`

    postData = postData.replace(/\t/g,'  ').replace(/^      /gm,'')

		const request = {
			method: 'POST',
			hostname: this.host,
			port: this.port || 80,
			path: '/onvif/device_service',
			headers: {
				'Content-Type': 'application/soap+xml',
				'Content-Length': postData.length,
				charset: 'utf-8',
			}
		}
		const xml = await httpRequest(request, postData, this.verbose)
		const soap = parseXML(xml)
		return soap.Envelope.Body
	} // post

	async getTime(){
		const xml = await this.post(`
          <GetSystemDateAndTime xmlns="http://www.onvif.org/ver10/device/wsdl"/>
    `, true)
		const { Date:d, Time:t } = xml.GetSystemDateAndTimeResponse.SystemDateAndTime.UTCDateTime
		const dt = new Date(Date.UTC(d.Year, d.Month-1, d.Day, t.Hour, t.Minute, t.Second))
		if(!this.time_shift) this.time_shift = dt.valueOf() - (process.uptime() * 1000)
		return dt
	} // getTime

	async getInfo(){
		const xml = await this.post(`
          <GetDeviceInformation xmlns="http://www.onvif.org/ver10/device/wsdl"/>
		`)
		return xml.GetDeviceInformationResponse
	} // getInfo

	async getCapabilities(){
		const xml = await this.post(`
          <GetCapabilities xmlns="http://www.onvif.org/ver10/device/wsdl">
            <Category>All</Category>
          </GetCapabilities>
		`)
		return xml.GetCapabilitiesResponse.Capabilities
	} // getCapabilities

	async getServices(){
		const xml = await this.post(`
          <GetServices xmlns="http://www.onvif.org/ver10/device/wsdl">
            <IncludeCapability>true</IncludeCapability>
          </GetServices>
		`)
		return xml.GetServicesResponse.Service
	} // getServices

	async getNet(){
		const xml = await this.post(`
          <GetNetworkInterfaces xmlns="http://www.onvif.org/ver10/device/wsdl"/>
		`)
		return xml.GetNetworkInterfacesResponse.NetworkInterfaces
	} // getNet

	async setIPv4(ip){
		const xml = await this.post(`
          <SetNetworkInterfaces xmlns="http://www.onvif.org/ver10/device/wsdl">
            <InterfaceToken>en0</InterfaceToken>
            <NetworkInterface>
              <IPv4 xmlns="http://www.onvif.org/ver10/schema">
                <Enabled>true</Enabled>
                <DHCP>false</DHCP>
                <Manual>
                  <Address>${ip}</Address>
                  <PrefixLength>16</PrefixLength>
                </Manual>
              </IPv4>
            </NetworkInterface>
          </SetNetworkInterfaces>
		`)
		return xml.SetNetworkInterfacesResponse
	} // setIPv4

} // ONVIF

module.exports = {ONVIF}
