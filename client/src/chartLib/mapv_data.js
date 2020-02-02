/***********************
 * @name mapV 使用的数据集
 * @author veaba
 * @date 2020/1/20 0020
 * @todo 这样式太丑了，下个迭代优化下
 ***********************/
import {geo} from "./map_geo";

export function getCoorDinates(cityName, mapv) {
	let coordinates = geo[cityName] || [];
	if (!coordinates.length) {
		const {lng = "", lat = ""} = mapv.utilCityCenter.getCenterByCityName(cityName) || {};
		if (!lng) {
			coordinates = ["", ""];
		} else {
			coordinates = [lng, lat];
		}
	}
	return coordinates;
}

/**
 * @desc 文字图层data
 * @format [{geometry:{type:'Point',coordinates:[140,99]},text:'武汉【1例】'}]
 * */
export const textData = (mapv, worldData = []) => {
	return worldData.map(item => {
		const cityName = item.city;
		const count = item.confirm || 0;
		// 先手动库找到，如果找不到，再去内置库找，真的没有，丢空数组
		// 这里会产生一个默认的坐标，地图上会看一个错误的坐标点
		let coordinates = getCoorDinates(cityName, mapv);
		return {
			geometry: {
				type: 'Point',
				coordinates
			},
			text: `${cityName}`
		};
	});
};

/**
 * @desc 热点图层data
 * @format [{geometry:{type:'Point',coordinates:[140,99]},count:11}]
 */
export const heatMapData = (worldData = []) => {
	return worldData.map(item => {
		const cityName = item.city;
		const count = item.confirm;
		let coordinates = getCoorDinates(cityName, mapv);
		return {
			geometry: {
				type: 'Point',
				coordinates
			},
			count
		};
	});
};

/**
 * @desc 迁徙data,动画
 * @format [{geometry:{type:'Point',coordinates:[140,99]},count:11}]
 */
export const movePointData = function (mapv, worldData = []) {
	let data = [];
	worldData.map(item => {
		const cityName = item.city;
		const count = item.confirm || 0;
		const fromCenter = {lng: geo['湖北'][0], lat: geo['湖北'][1]};
		const [lng, lat] = getCoorDinates(cityName, mapv);
		let toCenter = {lng, lat};
		const curve = mapv.utilCurve.getPoints([fromCenter, toCenter]);
		curve.map((cur, i) => {
			data.push({
				geometry: {
					type: 'Point',
					coordinates: cur
				},
				count,
				time: i
			});
		});
	});
	return data;
};


/**
 * @desc 迁徙线条
 * */
export const moveLineData = function (mapv, worldData = []) {
	return worldData.map(item => {
		const cityName = item.city;
		const count = item.confirm;
		const fromCenter = {lng: geo['武汉'][0], lat: geo['武汉'][1]};
		const [lng, lat] = getCoorDinates(cityName, mapv);
		const toCenter = {lng, lat};
		const curve = mapv.utilCurve.getPoints([fromCenter, toCenter]);
		return {
			geometry: {
				type: 'LineString',
				coordinates: curve
			},
			count
		};
	});
};
