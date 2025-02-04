'use strict';

const Homey = require('homey');
const { ZigBeeDevice } = require('homey-zigbeedriver');
const { CLUSTER } = require('zigbee-clusters');

class doorwindowsensor_3 extends ZigBeeDevice {
		
	async onNodeInit({zclNode}) {

		this.printNode();

		if (this.isFirstInit()) {
			await this.configureAttributeReporting([
				{
					endpointId: 1,
					cluster: CLUSTER.POWER_CONFIGURATION,
					attributeName: 'batteryPercentageRemaining',
					minInterval: 60, // Minimum interval (1 minute)
					maxInterval: 21600, // Maximum interval (6 hours)
					minChange: 2, // Report changes greater than 1%
				}
			]).catch(this.error);
		}
		
		// alarm_contact
		zclNode.endpoints[1].clusters[CLUSTER.IAS_ZONE.NAME].onZoneStatusChangeNotification = payload => {
			this.onIASZoneStatusChangeNotification(payload);
		}
	}

	onIASZoneStatusChangeNotification({zoneStatus, extendedStatus, zoneId, delay,}) {
		this.log('IASZoneStatusChangeNotification received:', zoneStatus, extendedStatus, zoneId, delay);
		this.setCapabilityValue('alarm_contact', zoneStatus.alarm1).catch(this.error);
		this.setCapabilityValue('alarm_battery', zoneStatus.battery).catch(this.error);
	}

	onDeleted(){
		this.log("Door/Window Sensor removed")
	}

}

module.exports = doorwindowsensor_3;


/*

"ids": {
	"modelId": "TS0203",
	"manufacturerName": "_TZ3000_bwjstafw"
},
"endpoints": {
	"ieeeAddress": "a4:c1:38:03:f7:59:43:68",
	"networkAddress": 38443,
	"modelId": "TS0203",
	"manufacturerName": "_TZ3000_bwjstafw",
	"endpointDescriptors": [
		{
			"status": "SUCCESS",
			"nwkAddrOfInterest": 38443,
			"_reserved": 32,
			"endpointId": 1,
			"applicationProfileId": 260,
			"applicationDeviceId": 1026,
			"applicationDeviceVersion": 0,
			"_reserved1": 1,
			"inputClusters": [
				1,
				3,
				1280,
				0
			],
			"outputClusters": [
				3,
				4,
				5,
				6,
				8,
				4096,
				25,
				10
			]
		}
	],
	"deviceType": "enddevice",
	"receiveWhenIdle": false,
	"capabilities": {
		"alternatePANCoordinator": false,
		"deviceType": false,
		"powerSourceMains": false,
		"receiveWhenIdle": false,
		"security": false,
		"allocateAddress": true
	},
	"extendedEndpointDescriptors": {
		"1": {
			"clusters": {
				"powerConfiguration": {
					"attributes": [
						{
							"acl": [
								"readable",
								"reportable"
							],
							"id": 0,
							"reportingConfiguration": {
								"status": "NOT_FOUND",
								"direction": "reported"
							}
						},
						{
							"acl": [
								"readable",
								"reportable"
							],
							"id": 32,
							"name": "batteryVoltage",
							"value": 30,
							"reportingConfiguration": {
								"status": "NOT_FOUND",
								"direction": "reported"
							}
						},
						{
							"acl": [
								"readable",
								"reportable"
							],
							"id": 33,
							"name": "batteryPercentageRemaining",
							"value": 200,
							"reportingConfiguration": {
								"status": "NOT_FOUND",
								"direction": "reported"
							}
						},
						{
							"acl": [
								"readable",
								"reportable"
							],
							"id": 65533,
							"name": "clusterRevision",
							"value": 1,
							"reportingConfiguration": {
								"status": "NOT_FOUND",
								"direction": "reported"
							}
						}
					]
				},
				"identify": {
					"attributes": []
				},
				"iasZone": {
					"attributes": [
						{
							"acl": [
								"readable",
								"reportable"
							],
							"id": 0,
							"name": "zoneState",
							"value": "notEnrolled",
							"reportingConfiguration": {
								"status": "NOT_FOUND",
								"direction": "reported"
							}
						},
						{
							"acl": [
								"readable",
								"reportable"
							],
							"id": 1,
							"name": "zoneType",
							"value": "contactSwitch",
							"reportingConfiguration": {
								"status": "NOT_FOUND",
								"direction": "reported"
							}
						},
						{
							"acl": [
								"readable",
								"reportable"
							],
							"id": 2,
							"name": "zoneStatus",
							"value": {
								"type": "Buffer",
								"data": [
									0,
									0
								]
							},
							"reportingConfiguration": {
								"status": "NOT_FOUND",
								"direction": "reported"
							}
						},
						{
							"acl": [
								"readable",
								"writable",
								"reportable"
							],
							"id": 16,
							"name": "iasCIEAddress",
							"value": "0c:ef:f6:ff:fe:5e:70:3f",
							"reportingConfiguration": {
								"status": "NOT_FOUND",
								"direction": "reported"
							}
						},
						{
							"acl": [
								"readable",
								"reportable"
							],
							"id": 17,
							"name": "zoneId",
							"value": 255,
							"reportingConfiguration": {
								"status": "NOT_FOUND",
								"direction": "reported"
							}
						},
						{
							"acl": [
								"readable",
								"reportable"
							],
							"id": 65533,
							"name": "clusterRevision",
							"value": 1,
							"reportingConfiguration": {
								"status": "NOT_FOUND",
								"direction": "reported"
							}
						}
					]
				},
				"basic": {
					"attributes": [
						{
							"acl": [
								"readable",
								"reportable"
							],
							"id": 0,
							"name": "zclVersion",
							"value": 3
						},
						{
							"acl": [
								"readable",
								"reportable"
							],
							"id": 1,
							"name": "appVersion",
							"value": 70
						},
						{
							"acl": [
								"readable",
								"reportable"
							],
							"id": 2,
							"name": "stackVersion",
							"value": 0
						},
						{
							"acl": [
								"readable",
								"reportable"
							],
							"id": 3,
							"name": "hwVersion",
							"value": 1
						},
						{
							"acl": [
								"readable",
								"reportable"
							],
							"id": 4,
							"name": "manufacturerName",
							"value": "_TZ3000_bwjstafw"
						},
						{
							"acl": [
								"readable",
								"reportable"
							],
							"id": 5,
							"name": "modelId",
							"value": "TS0203"
						},
						{
							"acl": [
								"readable",
								"reportable"
							],
							"id": 6,
							"name": "dateCode",
							"value": ""
						},
						{
							"acl": [
								"readable",
								"reportable"
							],
							"id": 7,
							"name": "powerSource",
							"value": "battery"
						},
						{
							"acl": [
								"readable",
								"writable",
								"reportable"
							],
							"id": 65502
						},
						{
							"acl": [
								"readable",
								"reportable"
							],
							"id": 65533,
							"name": "clusterRevision",
							"value": 2
						},
						{
							"acl": [
								"readable",
								"reportable"
							],
							"id": 65534,
							"name": "attributeReportingStatus",
							"value": "PENDING"
						},
						{
							"acl": [
								"readable",
								"reportable"
							],
							"id": 65506
						},
						{
							"acl": [
								"readable",
								"reportable"
							],
							"id": 65507
						}
					]
				}
			},
			"bindings": {
				"identify": {
					"attributes": []
				},
				"groups": {
					"attributes": [
						{
							"acl": [
								"readable"
							],
							"id": 0,
							"name": "nameSupport",
							"value": {
								"type": "Buffer",
								"data": [
									0
								]
							}
						},
						{
							"acl": [
								"readable"
							],
							"id": 65533,
							"name": "clusterRevision",
							"value": 2
						}
					]
				},
				"scenes": {},
				"onOff": {
					"attributes": [
						{
							"acl": [
								"readable"
							],
							"id": 0,
							"name": "onOff",
							"value": false
						},
						{
							"acl": [
								"readable"
							],
							"id": 65533,
							"name": "clusterRevision",
							"value": 2
						}
					]
				},
				"levelControl": {
					"attributes": [
						{
							"acl": [
								"readable",
								"writable"
							],
							"id": 0,
							"name": "currentLevel",
							"value": 0
						},
						{
							"acl": [
								"readable"
							],
							"id": 65533,
							"name": "clusterRevision",
							"value": 1
						}
					]
				},
				"touchlink": {},
				"ota": {},
				"time": {}
			}
		}
	}
}

*/