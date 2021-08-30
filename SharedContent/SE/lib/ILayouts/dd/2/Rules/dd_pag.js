dd_pag = function (r, c) {
    return [
        {
            c: r.aLen <= 8 && c.aLen == 2,
            s: "/Styles/dd_pag-8-2.json"
        },
        {
            c: r.aLen <= 8 && c.aLen == 3,
            s: "/Styles/dd_pag-8-3.json"
        },
        {
            c: r.aLen <= 8 && c.aLen == 4,
            s: "/Styles/dd_pag-8-4.json"
        },
        {
            c: r.aLen <= 8 && c.aLen == 5,
            s: "/Styles/dd_pag-8-5.json"
        },
        {
            c: r.aLen <= 8 && c.aLen == 6,
            s: "/Styles/dd_pag-8-6.json"
        },
        {
            c: r.aLen <= 15 && c.aLen == 2,
            s: "/Styles/dd_pag-9-15-2.json"
        },
        {
            c: r.aLen <= 15 && c.aLen == 3,
            s: "/Styles/dd_pag-9-15-3.json"
        },
        {
            c: r.aLen <= 15 && c.aLen == 4,
            s: "/Styles/dd_pag-9-15-4.json"
        },
        {
            c: r.aLen <= 15 && c.aLen == 5,
            s: "/Styles/dd_pag-9-15-5.json"
        },
        {
            c: r.aLen <= 15 && c.aLen == 6,
            s: "/Styles/dd_pag-9-15-6.json"
        },
        {
            c: r.aLen >= 16 && c.aLen == 2,
            s: "/Styles/dd_pag-16-2.json"
        },
        {
            c: r.aLen >= 16 && c.aLen == 3,
            s: "/Styles/dd_pag-16-3.json"
        },
        {
            c: r.aLen >= 16 && c.aLen == 4,
            s: "/Styles/dd_pag-16-4.json"
        },
        {
            c: r.aLen >= 16 && c.aLen == 5,
            s: "/Styles/dd_pag-16-5.json"
        },
        {
            c: r.aLen >= 16 && c.aLen == 6,
            s: "/Styles/dd_pag-16-6.json"
        },

    ];
};
