module.exports={testDir:"tests",timeout:90000,workers:3,use:{baseURL:"http://localhost:8124",viewport:{width:844,height:390}},
 webServer:{command:"python3 -m http.server 8124 >/dev/null 2>&1",port:8124,reuseExistingServer:true}};
