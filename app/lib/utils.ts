export let mergeObjList = (objList: object[]) => objList.reduce((result: object, current: object) => Object.assign({}, result, current));
