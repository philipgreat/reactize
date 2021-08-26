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
  
  await page.evaluate(({cssDefaultValues}) => {
    const styleList=[];
    const elements = document.body.getElementsByTagName("*");

    
    let counter = 0;
     [...elements].map(element => {
      
      const   dumpCSSTextAsObject=({element})=>{
        
        console.log(element.style.cssText);
        return element.style.cssText;
      }
      
      var cssExpr=dumpCSSTextAsObject({element,parentElement:element.parentElement})

      return element.tagName

      
      //return element+window.getComputedStyle(element).getPropertyValue("font-family");
    });

    console.log("style list length==============>",styleList.length)
  },{cssDefaultValues});


  

  let html = await page.content();
  await page.close();
  await browser.disconnect();
  
  //let finalContent = html.replace("style-back=","style=").replace("id=","oldid=").replace("class=","oldclass=")

  fs.writeFile('output/'+outputFile, html, err => {
    if (err) {
      console.error(err)
      return
    }
    console.log("file write done")
    //file written successfully
  })


