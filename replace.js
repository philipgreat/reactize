
const p = '\"**s**u10***e**\"';


const replaceToStyle=(input)=>{

    return input.replace(/\"\*\*s\*\*/g, '{replace(\'').replace(/\*\*e\*\*\"/g,"\')}")
}


const value='<div id="u2_state0" data-label="State1" componentid="u2_state0" style="**s**u2_state0**e**">'
            +'<div id="u2_state0_content" componentid="u2_state0_content" style="**s**u2_state0_content**e**">'


console.log(replaceToStyle(value))



