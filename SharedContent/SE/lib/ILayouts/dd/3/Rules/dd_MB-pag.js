dd_MB_pag = function (a, b) {
    console.log(a,b);
    return [{
        c: a.aLen <= 8,
        s: "/Styles/dd_mb_8-pag.json"
    }, {
        c: a.aLen <= 15,
        s: "/Styles/dd_mb_9-15-pag.json"
    }, {
        c:true,
        s: "/Styles/dd_mb_16-pag.json"
    }];
};
