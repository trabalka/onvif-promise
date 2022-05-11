# onvif-promise
Promise-based library to work with ONVIF cameras.

# Installation
```javascript
npm install onvif-promise
```

## Usage
```javascript
const { ONVIF } = require('onvif-promise')

async function run(){
	try{
		const cam = new ONVIF({host:'192.168.0.90', user:'root', pass:'root'})
		const camera_time = await cam.getTime()
		const camera_info = await cam.getInfo()
	}catch(e){
		console.log(e)
	}
}

run()

```



# API
`require('onvif-promise')`

## **constructor**(< _object_ >config)
Creates ONVIF camera object. Does not communicate with camera yet.
The config object has following attributes:
  * **host** - _string_ - Hostname or IP address of the camera.
  * **port** - _integer_ - Communication port of camera. **Default:** `80`
  * **user** - _string_ - ONVIF username for camera access.
  * **pass** - _string_ - Password for ONVIF username.
  * **verbose** - _boolean_ - If true, library will print out communication requests and responses.

## **getTime**() - _(Promise)_
Returns camera UTC time.

## **getInfo**() - _(Promise)_
Returns basic camera information.

## **getCapabilities**() - _(Promise)_
Returns camera capabilities.

## **getServices**() - _(Promise)_
Returns camera services.

## **getNet**() - _(Promise)_
Returns camera network interfaces.

## **setIPv4**(< _string_ >ip) - _(Promise)_
Sets manual IP v4 address.
  * **ip** - _string_ - new IP v4 address for the camera (e.g. "192.168.88.1")



# Example outputs
## **getInfo**()
```json
{
  "Manufacturer": "AXIS",
  "Model": "Q1715",
  "FirmwareVersion": "10.11.65",
  "SerialNumber": "B8A44F30BCB3",
  "HardwareId": "7E8"
}
```

## **getCapabilities**()
```json
{
  "Analytics": {
    "XAddr": "http://192.168.0.90/onvif/services",
    "RuleSupport": true,
    "AnalyticsModuleSupport": true
  },
  "Device": {
    "XAddr": "http://192.168.0.90/onvif/device_service",
    "Network": {
      "IPFilter": true,
      "ZeroConfiguration": true,
      "IPVersion6": true,
      "DynDNS": true
    },
    "System": {
      "DiscoveryResolve": true,
      "DiscoveryBye": true,
      "RemoteDiscovery": false,
      "SystemBackup": false,
      "SystemLogging": true,
      "FirmwareUpgrade": false,
      "SupportedVersions": {
        "Major": 1,
        "Minor": 2
      }
    },
    "IO": {
      "InputConnectors": 0,
      "RelayOutputs": 4
    },
    "Security": {
      "TLS1.1": true,
      "TLS1.2": true,
      "OnboardKeyGeneration": true,
      "AccessPolicyConfig": true,
      "X.509Token": false,
      "SAMLToken": false,
      "KerberosToken": false,
      "RELToken": false,
      "Extension": {
        "TLS1.0": true
      }
    }
  },
  "Events": {
    "XAddr": "http://192.168.0.90/onvif/services",
    "WSSubscriptionPolicySupport": false,
    "WSPullPointSupport": true,
    "WSPausableSubscriptionManagerInterfaceSupport": false
  },
  "Imaging": {
    "XAddr": "http://192.168.0.90/onvif/services"
  },
  "Media": {
    "XAddr": "http://192.168.0.90/onvif/services",
    "StreamingCapabilities": {
      "RTPMulticast": true,
      "RTP_TCP": true,
      "RTP_RTSP_TCP": true
    },
    "Extension": {
      "ProfileCapabilities": {
        "MaximumNumberOfProfiles": 32
      }
    }
  },
  "PTZ": {
    "XAddr": "http://192.168.0.90/onvif/services"
  },
  "Extension": {
    "DeviceIO": {
      "XAddr": "http://192.168.0.90/onvif/services",
      "VideoSources": 1,
      "VideoOutputs": 0,
      "AudioSources": 1,
      "AudioOutputs": 0,
      "RelayOutputs": 4
    },
    "Recording": {
      "XAddr": "http://192.168.0.90/onvif/services",
      "ReceiverSource": false,
      "MediaProfileSource": true,
      "DynamicRecordings": true,
      "DynamicTracks": false,
      "MaxStringLength": 4096
    },
    "Search": {
      "XAddr": "http://192.168.0.90/onvif/services",
      "MetadataSearch": false
    },
    "Replay": {
      "XAddr": "http://192.168.0.90/onvif/services"
    }
  }
}
```

## **getServices**()
```json
[
  {
    "Namespace": "http://www.onvif.org/ver20/ptz/wsdl",
    "XAddr": "http://192.168.0.90/onvif/services",
    "Capabilities": {
      "Capabilities": ""
    },
    "Version": {
      "Major": 2,
      "Minor": 41
    }
  },
  {
    "Namespace": "http://www.onvif.org/ver10/events/wsdl",
    "XAddr": "http://192.168.0.90/onvif/services",
    "Capabilities": {
      "Capabilities": ""
    },
    "Version": {
      "Major": 2,
      "Minor": 21
    }
  },
  {
    "Namespace": "http://www.axis.com/vapix/ws/action1",
    "XAddr": "http://192.168.0.90/onvif/services",
    "Version": {
      "Major": 1,
      "Minor": 1
    }
  },
  {
    "Namespace": "http://www.axis.com/vapix/ws/certificates",
    "XAddr": "http://192.168.0.90/onvif/services",
    "Version": {
      "Major": 1,
      "Minor": 1
    }
  },
  {
    "Namespace": "http://www.axis.com/vapix/ws/entry",
    "XAddr": "http://192.168.0.90/onvif/services",
    "Version": {
      "Major": 1,
      "Minor": 1
    }
  },
  {
    "Namespace": "http://www.axis.com/vapix/ws/event1",
    "XAddr": "http://192.168.0.90/onvif/services",
    "Version": {
      "Major": 1,
      "Minor": 1
    }
  },
  {
    "Namespace": "http://www.axis.com/vapix/ws/light",
    "XAddr": "http://192.168.0.90/onvif/services",
    "Capabilities": {
      "Capabilities": {
        "AutomaticIntensitySupport": false,
        "ManualIntensitySupport": false,
        "IndividualIntensitySupport": false,
        "GetCurrentIntensitySupport": false,
        "ManualAngleOfIlluminationSupport": false,
        "AutomaticAngleOfIlluminationSupport": false,
        "DayNightSynchronizeSupport": false
      }
    },
    "Version": {
      "Major": 1,
      "Minor": 0
    }
  },
  {
    "Namespace": "http://www.axis.com/vapix/ws/webserver",
    "XAddr": "http://192.168.0.90/onvif/services",
    "Version": {
      "Major": 1,
      "Minor": 1
    }
  },
  {
    "Namespace": "http://www.onvif.org/ver20/analytics/wsdl",
    "XAddr": "http://192.168.0.90/onvif/services",
    "Capabilities": {
      "Capabilities": ""
    },
    "Version": {
      "Major": 20,
      "Minor": 6
    }
  },
  {
    "Namespace": "http://www.onvif.org/ver10/device/wsdl",
    "XAddr": "http://192.168.0.90/onvif/device_service",
    "Capabilities": {
      "Capabilities": {
        "Network": "",
        "Security": "",
        "System": ""
      }
    },
    "Version": {
      "Major": 2,
      "Minor": 21
    }
  },
  {
    "Namespace": "http://www.onvif.org/ver20/imaging/wsdl",
    "XAddr": "http://192.168.0.90/onvif/services",
    "Capabilities": {
      "Capabilities": ""
    },
    "Version": {
      "Major": 16,
      "Minor": 9
    }
  },
  {
    "Namespace": "http://www.onvif.org/ver10/deviceIO/wsdl",
    "XAddr": "http://192.168.0.90/onvif/services",
    "Capabilities": {
      "Capabilities": ""
    },
    "Version": {
      "Major": 19,
      "Minor": 12
    }
  },
  {
    "Namespace": "http://www.onvif.org/ver20/media/wsdl",
    "XAddr": "http://192.168.0.90/onvif/services",
    "Capabilities": {
      "Capabilities": {
        "ProfileCapabilities": "",
        "StreamingCapabilities": ""
      }
    },
    "Version": {
      "Major": 19,
      "Minor": 6
    }
  },
  {
    "Namespace": "http://www.onvif.org/ver10/recording/wsdl",
    "XAddr": "http://192.168.0.90/onvif/services",
    "Capabilities": {
      "Capabilities": {
        "CapabilitiesExtension": {
          "RecordingCapabilities": ""
        }
      }
    },
    "Version": {
      "Major": 2,
      "Minor": 50
    }
  },
  {
    "Namespace": "http://www.onvif.org/ver10/replay/wsdl",
    "XAddr": "http://192.168.0.90/onvif/services",
    "Capabilities": {
      "Capabilities": {
        "CapabilitiesExtension": {
          "RecordingCapabilities": ""
        }
      }
    },
    "Version": {
      "Major": 2,
      "Minor": 21
    }
  },
  {
    "Namespace": "http://www.onvif.org/ver10/media/wsdl",
    "XAddr": "http://192.168.0.90/onvif/services",
    "Capabilities": {
      "Capabilities": {
        "ProfileCapabilities": "",
        "StreamingCapabilities": ""
      }
    },
    "Version": {
      "Major": 2,
      "Minor": 60
    }
  },
  {
    "Namespace": "http://www.onvif.org/ver10/search/wsdl",
    "XAddr": "http://192.168.0.90/onvif/services",
    "Capabilities": {
      "Capabilities": {
        "CapabilitiesExtension": {
          "RecordingCapabilities": ""
        }
      }
    },
    "Version": {
      "Major": 2,
      "Minor": 42
    }
  }
]
```

## **getNet**()
```json
{
  "Enabled": true,
  "Info": {
    "Name": "eth0",
    "HwAddress": "B8:A4:4F:30:BC:B3",
    "MTU": 1500
  },
  "Link": {
    "AdminSettings": {
      "AutoNegotiation": true,
      "Speed": 1000,
      "Duplex": "Full"
    },
    "OperSettings": {
      "AutoNegotiation": true,
      "Speed": 1000,
      "Duplex": "Full"
    },
    "InterfaceType": 6
  },
  "IPv4": {
    "Enabled": true,
    "Config": {
      "Manual": {
        "Address": "192.168.0.90",
        "PrefixLength": 24
      },
      "DHCP": false
    }
  },
  "IPv6": {
    "Enabled": false,
    "Config": {
      "AcceptRouterAdvert": false,
      "DHCP": "Auto"
    }
  }
}
```

## **setIPv4**()
```json
{
  "RebootNeeded": false
}
```
