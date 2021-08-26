const puppeteer = require('puppeteer');
const axios = require('axios');
const fs = require('fs')

var  args= process.argv.slice(2);
console.log('myArgs: ', args);

//const endPointURL=args[0];
//webSocketDebuggerUrl: 'ws://localhost:9222/devtools/browser/0b0ed4d7-b815-429b-8df6-6c5975df00d9'



(async () => {
  //const browser = await puppeteer.launch();
  
  

  const response = await axios.get('http://localhost:9222/json/version')
  console.log("data", response.data);
  const {webSocketDebuggerUrl} = response.data 

  console.log("webSocketDebuggerUrl", webSocketDebuggerUrl);
  const url = webSocketDebuggerUrl 
  const browser = await puppeteer.connect({ browserWSEndpoint: url });	
  const page = await browser.newPage();
  //await page.setViewport({ width: 1440, height: 900})
  await page.setViewport({ width: 1800, height: 1000})
  //await page.setDefaultNavigationTimeout(1000000);
  await page.setDefaultNavigationTimeout(0);



  //var pageURL="http://www.cmbchina.com/"
  
  //var pageURL="http://www.ccb.com/cn/home/indexv3.html"
  //var pageURL="https://www.pmdaniu.com/clouds/133784/62ddde7e8aac61d38a24bcd43d6f1aae-130884/%E7%99%BB%E5%BD%95%E7%95%8C%E9%9D%A2.html"
  
  var pageURL="http://localhost:8080/ggas/login.html"
  var outputFile="login-style.js"
  



  //var pageURL="https://developer.mozilla.org/zh-CN/docs/Learn/CSS/CSS_layout/Multiple-column_Layout";

  
  await page.goto(pageURL,{ waitUntil: 'networkidle0'});
  
  /*

  await page.goto('https://www.pmdaniu.com/clouds/133784/62ddde7e8aac61d38a24bcd43d6f1aae-130884/%E7%99%BB%E5%BD%95%E7%95%8C%E9%9D%A2.html',{ waitUntil: 'networkidle0'});
  
  const data = await page.evaluate(() => document.querySelector('*').outerHTML);

  console.log(data);
  */
  await page.waitForTimeout(2000);
  //await page.screenshot({path: 'home.png'});

  page.on('console', consoleObj => console.log(consoleObj.text()));
  
  
  const styleData=await page.evaluate(() => {
    const styleList={};
    const elements = document.body.getElementsByTagName("*");

    
    let counter = 0;
    [...elements].map(element => {
      

      const camelCased =(myString)=>{
        return myString.replace(/-([a-z])/g, function (g) { return g[1].toUpperCase(); });


      } 

      const   dumpCSSTextAsObject=({element})=>{
        const styleDefine={}
        var styleObj = element.style
        //console.log(element.style.cssText);


        if(element.tagName==='SCRIPT'){
            return {};
        }
       // console.log(element.getAttribute("componentid")+"=================================");

        //for (var i = styleObj.length; i--;) 
        for (var i = 0;i<styleObj.length; i++){
            var nameString = styleObj[i];
            var value = styleObj.getPropertyValue(nameString);
            //console.log("\t"+camelCased(nameString)+": \""+ value+"\";");

            styleDefine[camelCased(nameString)] = value;
            //need to notice differ starts with -webkit-

        }
        
      

        //console.log(element.style.cssText);
        return styleDefine;
      }

      styleList[element.getAttribute("componentid")]=dumpCSSTextAsObject({element})

    });

    //console.log("style list length==============>",styleList.length)

    return styleList

  });


  fs.writeFile('output/login-style.json', JSON.stringify(styleData,null,4), err => {
    if (err) {
      console.error(err)
      return
    }
    console.log("file write done")
    //file written successfully
  })




  const data = await page.evaluate(() => {
    const styleList={};
    const elements = document.body.getElementsByTagName("*");

    
    let counter = 0;
    [...elements].map(element => {
      

      //element.removeAttribute("")

      

      var attrs = element.attributes;
      //for(var i = attrs.length - 1; i >= 0; i--) 
      for(var i = 0; i< attrs.length ;i++) {
        //output += attrs[i].name + "->" + attrs[i].value;
        //console.log("\t"+attrs[i].name+"="+attrs[i].value)
        const name = attrs[i].name
        
        if(name==="id" || name==="componentid"|| name==="reactcomponent"){
          continue;
        }
        element.removeAttribute(name);
        
      }
      // return (<div style={makestyle({elementId:'p20'})}>SampleValue</div>)
      const componentId=element.getAttribute("componentid")

      if(componentId===null){
        console.error("Found null for " + element.innerHTML);
      }

      element.setAttribute("style","{makestyle({elementId:'"+componentId+"'})}");
      element.removeAttribute("reactcomponent");
      element.removeAttribute("class");
      //element.removeAttribute("component-id");
      
      


      
    });

    //console.log("style list length==============>",styleList.length)

    return styleList

  });







  //console.log("style list length==============>",data)

  let html = await page.content();
  await page.close();
  await browser.disconnect();
  
  let finalContent = html
    //.replace('"\{makestyle\(\{',"makestyle\(\{")
    //.replace("\'\}\)\}\"","\'\}\)\}")
    .replace(/<!--[\s\S]*?-->/g,"")
    //.replace("<!--","{/*")
    //.replace("-->","*/}")

  fs.writeFile('output/'+outputFile, finalContent, err => {
    if (err) {
      console.error(err)
      return
    }
    console.log("file write done")
    //file written successfully
  })



})();
