
// Sorts an objet bey keys
function sortObject(object) {
    let object_ = {};
    Object.keys(object).sort()
        .forEach(key => {
            object_[key] = object[key];
        });
    return object_;
};

function exclude(object, key) {

    let test = Object.keys(object).reduce((_obj, _key) => {
        if(_key !== key) {
            _obj[_key] = object[_key];
        }
        return _obj;
    }, {});
    // console.log(test);

    let _object = {};

    Object.keys(object).filter(_key =>  _key !== key).map(_key => {
        _object[_key] = object[_key]
    });

    return _object;
}

function isEmpty(object) {
    return Object.keys(object).length < 1;
}
module.exports = {sort: sortObject, exclude: exclude, isEmpty: isEmpty};
