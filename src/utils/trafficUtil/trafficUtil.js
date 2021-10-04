import config from "../../config";

export function trafficServerCheck(trafficFromProps) {
    let demands = null;
    if (config.server) {
        demands = trafficFromProps;
    } else {
        demands = config.traffic;
    }
    return demands
}

export function checkLightPathIsThereInTraffic(trafficFile, lightPath, source, dest) {
    console.log(trafficFile);
    return trafficFile.main.lightpaths[lightPath]
}


export function checkGroomoutIsThereInTraffic(trafficFile, groomout, source, dest) {
    let final_groomouts = every_demands_of_groom_of_traffic(trafficFile, groomout);
    console.log('demands_of_mp2x', final_groomouts);
    console.log('demands_of_mp2x', groomout);
    return final_groomouts
}

export function every_demands_of_groom_of_traffic(trafficFile, groomout) {
    let final_groomouts = {};
    for (const demand_of_mp2x of Object.entries(trafficFile.main.low_rate_grooming_result.demands)) {
        let groomouts = demand_of_mp2x[1].groomouts;
        if (groomouts[groomout]) {
            final_groomouts = groomouts[groomout];
            final_groomouts['source'] = demand_of_mp2x[1].source;
            final_groomouts['destination'] = demand_of_mp2x[1].destination;
            break;
        }
    }
    return final_groomouts;
}

export function traffic_mapping(trafficFile) {


    for (const demand_of_mp2x of Object.entries(trafficFile.main.low_rate_grooming_result.demands)) {
        let groomouts = demand_of_mp2x[1].groomouts;
        for (const groom of Object.entries(groomouts)) {
            let array_of_service_groom_cart = [];
            // console.log(groom[1].service_id_list)
            for (let i = 0; i < groom[1].service_id_list.length; i++) {
                //در ترافیک بخش گروم ما چون در ابتدا ایدی نداشتیم این کد و زدیم ولی چون در اپدیت های جدید در لیستهامون ایدی داریم دیگه این کد و مپینگ نیازی نیست
                // array_of_service_groom_cart.push({id: groom[1].service_id_list[i], type: 'normal'});
                groom[1].service_id_list[i]['type'] = 'normal';
            }
            // groom[1].service_id_list = array_of_service_groom_cart;

        }


    }
    return trafficFile;
}

export function filter_grooming_demands(remainGrooming, demand_id) {

    let grooming = remainGrooming[demand_id];
    grooming = grooming.map((row, index) => {
        let obj = {};
        obj['id'] = index + 1;
        obj['name'] = `groom ${index + 1} `;
        obj['value'] = row;
        return obj
    });
    console.log('filter groom of demands : ', grooming, demand_id, remainGrooming[demand_id]);
    return grooming;
}

export function capacity(servicetype) {

    let cap = 0;
    // if (servicetype === '100GE') {
    //     cap = 100;
    // }
    // if (servicetype === '10GE') {
    //     cap = 10;
    // }
    // if (servicetype === 'GE') {
    //     cap = 1;
    // }
    // if (servicetype === 'STM4') {
    //     cap = 0.622;
    // }
    // if (servicetype === 'STM16') {
    //     cap = 2.488;
    // }
    // if (servicetype === 'STM64') {
    //     cap = 9.953;
    // }
    
   
    return cap;

}




