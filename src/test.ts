var A = [1,2,3,4]
var B = [9,8,7,4]
B.forEach(tb => {
   if(!A.some(ta => ta == tb)){
       console.log("nexistuje "+ tb.toString())
   }

})
