sm_MB = function (rs, cs) {
    return [{
        c:  cs.aLen <= 6,
        s: "/Styles/sm_MB_6.json"
    }, {
        c:  cs.aLen <= 8,
        s: "/Styles/sm_MB_8.json"
    }, 
{
        c:  cs.aLen <= 10,
        s: "/Styles/sm_MB_10.json"
    }, 
{
        c:  cs.aLen <= 12,
        s: "/Styles/sm_MB_12.json"
    }, 
            {
        c:  cs.aLen <= 14,
        s: "/Styles/sm_MB_14.json"
    },  
 {
        c:  cs.aLen <= 16,
        s: "/Styles/sm_MB_16.json"
    },  
                         
    {
        c: true,
        s: "/Styles/sm_MB_16.json"
    }];
};