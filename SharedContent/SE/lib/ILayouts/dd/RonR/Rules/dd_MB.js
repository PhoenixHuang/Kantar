dd_MB = function (a, b) {
    return [{
        c: b.aLen <= 9,
        s: "/Styles/dd_MB_9.json"
    }, {
        c: b.aLen <= 16,
        s: "/Styles/dd_MB_16.json"
    }, {
        c:true,
        s: "/Styles/dd_MB_16.json"
    }]
};
