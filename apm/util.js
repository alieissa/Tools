
// Sorts an objet bey keys
function sortObject(object) {
    let object_ = {};
    Object.keys(object).sort()
        .forEach(key => {
            object_[key] = object[key];
        });
    return object_;
};

module.exports = {sortObject};
