const puppeteer =require('puppeteer');
const axios = require('axios');
let fs = require('fs')

var  args= process.argv.slice(2);
//console.log('myArgs: ', args);

var xmlserializer = require('xmlserializer');
//const endPointURL=args[0];
//webSocketDebuggerUrl: 'ws://localhost:9222/devtools/browser/0b0ed4d7-b815-429b-8df6-6c5975df00d9'

var html2xhtml = function (htmlString) {
  var parser = require('parse5'),
      dom = parser.parse(htmlString);

  return xmlserializer.serializeToString(dom);
};
const replaceToStyle=(input)=>{

  return input.replace(/\"\*\*s\*\*/g, '{makestyle({elementId:\'').replace(/\*\*e\*\*\"/g,"\'})}")
}



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
    await page.setViewport({ width: 1200, height: 800})
    //await page.setDefaultNavigationTimeout(1000000);
    await page.setDefaultNavigationTimeout(0);
  
    //var pageURL="http://www.cmbchina.com/"
    
    //var pageURL="http://www.ccb.com/cn/home/indexv3.html"
    //var pageURL="https://www.pmdaniu.com/clouds/133784/62ddde7e8aac61d38a24bcd43d6f1aae-130884/%E7%99%BB%E5%BD%95%E7%95%8C%E9%9D%A2.html"
    
    var pageURL="http://localhost:8080/ggas/home-page.html"
    var outputFile="home-style.js"
    
    
    await page.goto(pageURL,{ waitUntil: 'networkidle0'});
    await page.waitForTimeout(2000);
  
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

              if(nameString.startsWith("-webkit")){
                continue;
              }
              
              if(nameString.startsWith("border-")){
                continue;
              }
              /*
              if(nameString.startsWith("text-decoration")){
                continue;
              }*/



              var value = styleObj.getPropertyValue(nameString);
              //console.log("\t"+camelCased(nameString)+": \""+ value+"\";");
              if( element.parentElement ){
                var parentStyleObj = element.parentElement.style
                var parentValue = parentStyleObj.getPropertyValue(nameString);
                if(parentValue===value){
                  //continue;
                }


              }
              

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
  
  
    fs.writeFile('/Users/Philip/githome/dyna-react-ui/src/layouts/ggashome/homestyle.json', JSON.stringify(styleData,null,4), err => {
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
        //{makestyle({elementId:*****i*****"+componentId+"u*****u})}
        element.setAttribute("style","**s**"+componentId+"**e**");
        element.removeAttribute("reactcomponent");
        element.removeAttribute("class");
        //element.removeAttribute("component-id");
        
  
  
  
        
      });
  
      //console.log("style list length==============>",styleList.length)
  
      return styleList
  
    });
  
  
  
  
  
  
  
  
    //https://stackoverflow.com/questions/3558119/are-non-void-self-closing-tags-valid-in-html5
    /*
    area, base, br, col, embed, hr, img, input, 
    keygen, link, meta, param, source, track, wbr
  
    */
  
    const innerHTML  = await page.evaluate(() => {
  
  
      const elements = document.body.getElementsByTagName("*");
  
      
      let counter = 0;
      [...elements].map(element => {
  
        if(element.tagName==='SCRIPT'){
          element.remove();
        }
        var elementStyle = getComputedStyle(element,false);
        if(elementStyle.getPropertyValue("visibility")==='hidden'){
          console.log("kill visibility=hidden", element.getAttribute("id"))
          //element.remove();
        }
        if(elementStyle.getPropertyValue("display")==='none'){
          console.log("kill display=none", element.getAttribute("id"))
          element.remove();
        }
        
  
      })
      
      
      let html = document.body.innerHTML
      return html
      //console.log("html=====>",html)
      
    })
  
    await page.close();
    await browser.disconnect();
  
  
    let finalContent = replaceToStyle(html2xhtml(innerHTML)).replace(/<!--(.*?)-->/gm, "")
          //.replace('"\{makestyle\(\{',"makestyle\(\{")
          //.replace("\'\}\)\}\"","\'\}\)\}")
          
          //.replace("<!--","{/*")
          //.replace("-->","*/}")
    fs.writeFile('/Users/Philip/githome/dyna-react-ui/src/layouts/ggashome/homepage.js', finalContent, err => {
        if (err) {
          console.error(err)
          return
        }
        console.log("file "+outputFile+" write done")
        //file written successfully
    })
   
  
  
  
  })();
  