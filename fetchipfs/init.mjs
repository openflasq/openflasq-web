console.log(`In ${window.location.href} starting script: ${import.meta.url}`);
console.log("This is init.mjs, located at /init.mjs")
 
var html=document.getElementsByTagName("html")[0]
console.log("Cleaned html");
html.removeAttribute("class")


delete window.gaplugins
delete window.gaGlobal
delete window.gaData
delete window.datalayer
console.log(window)

// http://gpersoon.com/koios/lib/bootstrap/test.html
// dnslink=/ipfs/QmZEgAo2Su99vcSwCf14AGokucaPCcshxr8zK3fZ5fKjf5
// https://ipfs.io/ipns/koios.online
// https://ipfs.io/ipns/viewer.koios.online
// https://ipfs.io/ipns/viewer.test.koios.online
// c:\bin\dig +noall +answer TXT _dnslink.koios.online
// c:\bin\dig +noall +answer TXT _dnslink.viewer.koios.online
// c:\bin\dig +noall +answer TXT _dnslink.viewer.test.koios.online

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

function MakeBlob(html,fjavascript) {
    var blob = new Blob([html], {type: (fjavascript?'text/javascript':'text/html')});
    var url = URL.createObjectURL(blob);      
    return url;
}   

// var ipfsurl="https://ipfs.io/ipfs/"
var ipfsurl="https://gateway.ipfs.io/ipfs/";

async function start(ghpath) { 
	console.log("start");
	fetch(ghpath + "/releasenotes.txt").then(console.log) // workaround so metamask mobile knows how to access github
		
	let url = (new URL(document.location));
	console.log(url)
    var split=url.pathname.split("/");
	console.log(split)
	var last=split[split.length-1]
	var beforelast=split[split.length-2]
	console.log(beforelast,last);
	
	var cid=url.searchParams.get("ipfs");   	
	if (!cid) {	
		var prod=ghpath + 'fetchipfs';
		var cidlocation=(beforelast=="test")?test:prod;
		var cidfile="flask";
		switch (last) {
			case "flasq": 	 						 
			case "QmatxGTj7zExBWE3TnHjYaMGStNKKrTmnqfT2b2AJUx7mB": 	 
			case "":
			cidlocation=prod;cidfile="flasq";break;
		}
		
		var loadfile=cidlocation+"/"+cidfile;
		console.log(`Loading config file ${loadfile}`);
		var result=await fetch(loadfile) ;
		console.log(result);
		try { cid=(await result.text()).trim(); } catch (error) { console.log(error); }
	}
	console.log(`cid ${cid}`)
	if (cid) {
		var modulesource=(await (await fetch(ipfsurl+cid)).text()).trim();
		var tag="//--script--"
		var n = modulesource.indexOf(tag);
		if (n <0 ) { console.error("Can't find tag");return;} 
		modulesource = modulesource.substring(n+tag.length);		
		//console.log(modulesource);
		var url2=MakeBlob(modulesource,true);    
        var html=document.getElementsByTagName("html")[0]        
		let list = html.classList;
		console.log(list)
		for (var i=0;i<list.length;i++) {
			console.log(list[i])
			list.remove(list[i])
		}		
        console.log(html);        
		await import(url2);		
		html.removeAttribute("class")		 // try again
	}
	
	console.log("checking scripts")
	console.log(document)
	await sleep(1000)  // delete more traces from webflow
	var todelete=[]
	var scriptlist=document.getElementsByTagName("script")
	for (var i=0;i<scriptlist.length;i++) {
		if (scriptlist[i].outerHTML.includes("google-analytics"))
		   todelete.push(scriptlist[i])
	}
	for (var i=0;i<todelete.length;i++)
		todelete[i].parentNode.removeChild(todelete[i])
}

start('https://openflasq.github.io/');

