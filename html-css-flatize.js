const puppeteer = require('puppeteer');
const axios = require('axios');
const fs = require('fs')

var  args= process.argv.slice(2);
console.log('myArgs: ', args);

//const endPointURL=args[0];
//webSocketDebuggerUrl: 'ws://localhost:9222/devtools/browser/0b0ed4d7-b815-429b-8df6-6c5975df00d9'
let cssDefaultJSONText = fs.readFileSync('data/default-css.json');
let cssDefaultValues = JSON.parse(cssDefaultJSONText);




const home2={
  page:"http://www.cmbchina.com/",
  output:"cmb.html"

}
const baidu={
  page:"http://www.baidu.com/",
  output:"baidu.html"

}//https://cmstest.ggas.com/ggas-big-dashboard/

const dash={
  page:"https://cmstest.ggas.com/ggas-big-dashboard/",
  output:"cms-dash.html"

}

const ccb={
  page:"http://www.ccb.com/cn/home/indexv3.html",
  output:"ccb.html"

}
//https://cmstest.ggas.com/cmes/merchantManager/showTriQrCode/T000001/


const showTriQrCode={
  page:"https://cmstest.ggas.com/cmes/merchantManager/showTriQrCode/T000001/",
  output:"showTriQrCode.html"

}


const ggas={
  page:"http://www.ggas.com/",
  output:"ggas.html"

}


const location=showTriQrCode;

/*
  page.on('response', response => {
    if (response.url())
      console.log("response code: ", response.url());
      // do something here
  });
page.on('response', async response => {
        const url = response.url();
        if (response.request().resourceType() === 'image') {
            response.buffer().then(file => {
                const fileName = url.split('/').pop();
                const filePath = path.resolve(__dirname, fileName);
                const writeStream = fs.createWriteStream(filePath);
                writeStream.write(file);
            });
        }
    });


    page.on('response', async response => {
    const url = response.url();
    console.log(url)
    if (response.request().resourceType() === 'image') {
        response.buffer().then(file => {
            console.log(url)
        });
    }
  });


*/


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
  await page.setViewport({ width: 1440, height: 900})
  await page.setDefaultNavigationTimeout(10000);
  //await page.setDefaultNavigationTimeout(0);

  

  var pageURL=location.page
  var outputFile=location.output



  page.on('response', async response => {
    const url = response.url();
    console.log(url)
    if (response.request().resourceType() === 'image') {
        response.buffer().then(file => {
            console.log(url)
        });
    }
  });
  await page.goto(pageURL,{ waitUntil: 'networkidle0'});






  //await page.waitForTimeout(2000);
  //await page.screenshot({path: 'home.png'});

  page.on('console', consoleObj => console.log(consoleObj.text()));
  

  



  await page.evaluate(({cssDefaultValues}) => {
    const styleList=[];
    const elements = document.body.getElementsByTagName("*");

    
    let counter = 0;
     [...elements].map(element => {
      
      

      const   dumpCSSText=({element})=>{
        var s = '';

        var elementStyle = getComputedStyle(element,false);

        for(var i = 0; i < elementStyle.length; i++){
          
          var key = elementStyle[i];
          var value=elementStyle.getPropertyValue(elementStyle[i]);
          if(cssDefaultValues[element.tagName]&&cssDefaultValues[element.tagName][key]===elementStyle.getPropertyValue(key)){
            continue;
          }
          s+=key+ ':' +value+';';
        }
        return s;
      }
     

      
      var cssExpr=dumpCSSText({element,parentElement:element.parentElement})
      //element.style=cssExpr
      counter++;
      element.style=cssExpr
      var componentId = element.getAttribute("id") || element.tagName.toLowerCase()+""+counter
      element.setAttribute("componentid",componentId)
      element.setAttribute("reactcomponent","")
      
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
  


  //console.log(html);

  //await browser.close();


  
  
  //await page.screenshot({path: 'login-page.png'});
  
  // await page.type('input.ant-input-lg', '商户01');
  // await page.type('//form/div/div[3]/div/div[2]/div/span/div/div/div/ul/li/div/span/input', '农商科技(M004094)');
  // //await page.screenshot({path: 'add_merchant_02.png'});

  // await page.click('.ant-btn-primary span');
  // await page.waitForTimeout(2000);

  // await page.waitForSelector('.ant-result-title');
  // await page.click('.ant-btn-primary span');
  // await page.waitForTimeout(2000);



})();




/*
const  dumpCSSText2=(element)=>{
  var s = '';
  var o = getComputedStyle(element);
  for(var i = 0; i < o.length; i++){
    s+=o[i] + ':' + o.getPropertyValue(o[i])+';';
  }
  return s;
}


const  dumpCSSText=(element,parentElement)=>{
  var s = '';
  var elementStyle = getComputedStyle(element);
  var parentElementStyle=getComputedStyle(parentElement);
  for(var i = 0; i < elementStyle.length; i++){


    if(parentElement&&parentElementStyle.getPropertyValue&&(elementStyle.getPropertyValue(elementStyle[i]) === parentElementStyle.getPropertyValue(elementStyle[i]))){
      //continue;
    }


    s+=elementStyle[i] + ':' + elementStyle.getPropertyValue(elementStyle[i])+';';
  }
  return s;
}
*/