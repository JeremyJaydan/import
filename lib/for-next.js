/**
* @author JeremyJaydan <jeremy@parmenter.io>
* @license MIT
* @desc Simple iteration script https://github.com/JeremyJaydan/for-next
*/
export const $for = async (target, callback = () => {}, options = {}) => {

  if(target){
    return new Promise((resolve, reject) => {

      const iterator = target;
      const length = iterator.length;

      if(typeof target === "number") iterator = new Array(target).fill().map((a, i) => (i + 1));
      if(target.constructor === Object) iterator = Object.entries(target);
      if(length <= 0) return resolve(iterator);

      const {
        interval = 0
      } = options;

      const values = [];
      const every = (items, index, ctx = {}) => {

        const done = index === length - 1;

        const stop = (options = {}) => {
          const { value = null } = options;
          values.push(value);
          resolve(values);
        };

        let next = (options = {}) => {

          const {
            skip = false,
            value = null
          } = options;

          if(skip){
            index += skip;
            next = () => {};
          }
          values.push(value);

          if(!done){
            if(!interval){
              every(items, index + 1, skip && ctx || {});
            }else{
              setTimeout(every, interval, items, index + 1, skip && ctx || {});
            }
          }else{
            resolve(values);
          }
        };

        callback(items[index], {index, next, stop, values, ctx});
      };

      every(iterator, 0);
    });

  }
}