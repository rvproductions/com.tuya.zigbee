'use strict';

const Homey = require('homey');
const { ZigBeeDevice } = require('homey-zigbeedriver');
const { CLUSTER } = require('zigbee-clusters');

class luxsensor extends ZigBeeDevice {
	
	async onNodeInit({zclNode}) {

		this.printNode();

   		if (this.isFirstInit()){
			await this.configureAttributeReporting([
				{
					endpointId: 1,
					cluster: CLUSTER.POWER_CONFIGURATION,
					attributeName: 'batteryPercentageRemaining',
					minInterval: 60, // Minimum interval (1 minute)
					maxInterval: 21600, // Maximum interval (6 hours)
					minChange: 1, // Report changes greater than 1%
				}
			]).catch(this.error);
		}
		
		this.log(zclNode.endpoints[1].clusters.iasZone);
		
		zclNode.endpoints[1].clusters.iasZone.onZoneEnrollRequest = payload => {
			this.log('luxsensor | onZoneEnrollRequest', payload);
			zclNode.endpoints[1].clusters.iasZone.zoneEnrollResponse({
				enrollResponseCode: 0, // Success
				zoneId: 11, // Choose a zone id
			});
		};

		zclNode.endpoints[1].clusters[CLUSTER.IAS_ZONE.NAME].onZoneStatusChangeNotification = payload => {
			this.onIASZoneStatusChangeNotification(payload);
		}
		
		// measure_luminance
		zclNode.endpoints[1].clusters[CLUSTER.ILLUMINANCE_MEASUREMENT.NAME]
			.on('attr.measuredValue', this.onIlluminanceMeasuredAttributeReport.bind(this));

		// measure_battery // alarm_battery
		zclNode.endpoints[1].clusters[CLUSTER.POWER_CONFIGURATION.NAME]
		 	.on('attr.batteryPercentageRemaining', this.onBatteryPercentageRemainingAttributeReport.bind(this));

	}
	
	onIASZoneStatusChangeNotification({ zoneStatus, extendedStatus, zoneId, delay,}) {
		this.log('LuxSensor IASZoneStatusChangeNotification received:', zoneStatus, extendedStatus, zoneId, delay, this.node, this.zclNode);
	//	this.setCapabilityValue('alarm_battery', zoneStatus.battery).catch(this.error);
	}

	onIlluminanceMeasuredAttributeReport(measuredValue) {
	 	const parsedValue = 10 ** ((measuredValue - 1) / 10000);
		this.log('measure_luminance | Luminance - measuredValue (lux):', parsedValue, measuredValue, this.node, this.zclNode);
	 	this.setCapabilityValue('measure_luminance', parsedValue).catch(this.error);
	}

	onBatteryPercentageRemainingAttributeReport(batteryPercentageRemaining) {
		this.log("measure_battery | powerConfiguration - batteryPercentageRemaining (%): ", batteryPercentageRemaining/2);
		this.setCapabilityValue('measure_battery', batteryPercentageRemaining/2).catch(this.error);
	}

	onDeleted(){
		this.log("luxsensor removed")
	}

}

module.exports = luxsensor;

/*
"ids": {
	"modelId": "TS0222",
		"manufacturerName": "_TZ3000_hy6ncvmw"
},
"endpoints": {
	"ieeeAddress": "a4:c1:38:15:54:f0:60:8e",
		"networkAddress": 6453,
			"modelId": "TS0222",
				"manufacturerName": "_TZ3000_hy6ncvmw",
					"endpointDescriptors": [
						{
							"status": "SUCCESS",
							"nwkAddrOfInterest": 6453,
							"_reserved": 28,
							"endpointId": 1,
							"applicationProfileId": 260,
							"applicationDeviceId": 262,
							"applicationDeviceVersion": 0,
							"_reserved1": 1,
							"inputClusters": [
								1,
								3,
								1026,
								1029,
								1024,
								1280,
								0
							],
							"outputClusters": [
								3,
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
				"temperatureMeasurement": {
					"attributes": [
						{
							"acl": [
								"readable",
								"reportable"
							],
							"id": 0,
							"name": "measuredValue",
							"value": 0,
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
							"name": "minMeasuredValue",
							"value": 0,
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
							"name": "maxMeasuredValue",
							"value": 0,
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
							"value": 2,
							"reportingConfiguration": {
								"status": "NOT_FOUND",
								"direction": "reported"
							}
						}
					]
				},
				"relativeHumidity": {
					"attributes": [
						{
							"acl": [
								"readable",
								"reportable"
							],
							"id": 0,
							"name": "measuredValue",
							"value": 0,
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
							"name": "minMeasuredValue",
							"value": 0,
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
							"name": "maxMeasuredValue",
							"value": 0,
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
							"value": 2,
							"reportingConfiguration": {
								"status": "NOT_FOUND",
								"direction": "reported"
							}
						}
					]
				},
				"illuminanceMeasurement": {
					"attributes": [
						{
							"acl": [
								"readable",
								"reportable"
							],
							"id": 0,
							"name": "measuredValue",
							"value": 19244,
							"reportingConfiguration": {
								"status": "NOT_FOUND",
								"direction": "reported"
							}
						}
					]
				},
				"iasZone": {
					"attributes": [
						{
							"acl": [
								"readable",
								"writable",
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
								"writable",
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
							"value": 67
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
							"value": "_TZ3000_hy6ncvmw"
						},
						{
							"acl": [
								"readable",
								"reportable"
							],
							"id": 5,
							"name": "modelId",
							"value": "TS0222"
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
				"ota": { },
				"time": {
					"attributes": [
						{
							"acl": [
								"readable"
							],
							"id": 65533,
							"name": "clusterRevision",
							"value": 1
						}
					]
				}
			}
		}
	}
}
*/