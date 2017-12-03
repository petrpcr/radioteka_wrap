"use strict";
var A = [1, 2, 3, 4];
var B = [9, 8, 7, 4];
B.forEach(function (tb) {
    if (!A.some(function (ta) { return ta == tb; })) {
        console.log("nexistuje " + tb.toString());
    }
});
//# sourceMappingURL=test.js.map