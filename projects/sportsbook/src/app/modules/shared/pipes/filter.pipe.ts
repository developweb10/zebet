import { Pipe, PipeTransform } from '@angular/core';
import { TaxonomyList } from '../../../dto/live-data.dto';

const sortedPush = function(arr : any[], item){
    if(arr.length === 0 ){ arr.push(item); return arr;}
    let i = 0;
    while(i < arr.length){
        if(arr[i]?.name > item?.name){
            arr.splice(i,0,item);
            return arr;
        }
        i+=1;
    }
    arr.push(item);
    return arr;
}
@Pipe({
    name: 'filter',
    pure: false
})

export class FilterPipe implements PipeTransform {
    transform(items: any[], filter: {[key: string]: any }, sortData ?: TaxonomyList[], isAll : boolean = false): Array<any> {
        let sortedArr = [];
        if(sortData && sortData.length > 0){
            let keys = [];
            let obj = {};
            let last = [];
            let temp = [];
            for(const data of sortData){
                temp = data.type ?? [];
                if(data.scoreType){
                    data.scoreType.forEach((ele,i)=>{
                        if(i===0){
                            temp = temp.map(type=>type+'___'+ele)
                        }else{
                            temp.push(...temp.map(type=>type+'___'+ele))
                        }
                    })
                }
                if(data.period){
                    data.period.forEach((ele,i)=>{
                        if(i===0){
                            temp = temp.map(type=>type+'___'+ele)
                        }else{
                            temp.push(...temp.map(type=>type+'___'+ele))
                        }
                    })
                }
                keys.push(...temp);
            }
            for(let key of keys){
                obj[key] = [];
            }
            items.forEach(ele=>{
                let key_full = ele?.taxonomy?.type+'___'+ele?.taxonomy?.scoreType + '___' + ele?.taxonomy?.period;
                let key_no_period = ele?.taxonomy?.type+'___'+ele?.taxonomy?.scoreType;
                let key_no_scoreType = ele?.taxonomy?.type+'___'+ele?.taxonomy?.period;
                let key_only_type = ele?.taxonomy?.type;
                if(obj.hasOwnProperty(key_full)) obj[key_full] = sortedPush(obj[key_full],ele);
                else if(obj.hasOwnProperty(key_no_period)) obj[key_no_period] = sortedPush(obj[key_no_period],ele);
                else if(obj.hasOwnProperty(key_no_scoreType)) obj[key_no_scoreType] = sortedPush(obj[key_no_scoreType],ele);
                else if(obj.hasOwnProperty(key_only_type)) obj[key_only_type] = sortedPush(obj[key_only_type],ele);
                else if(isAll) last = sortedPush(last,ele);
            })
            sortedArr = [];
            for(let key in obj){
                sortedArr.push(...obj[key])
            }
            if(last.length>0) sortedArr.push(...last);
        }else{
            sortedArr = items;
        }
        return sortedArr.filter(item => {
            const notMatchingField = Object.keys(filter)
                                         .find(key => item[key].indexOf(filter[key]) === -1);

            return !notMatchingField; // true if matches all fields
        
        });
    }
}