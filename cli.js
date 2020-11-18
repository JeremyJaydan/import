
import { Location, ResourceReference, path } from "./api/mod.js";

const url = Deno.args[0];

if(url){
  
  const options = {
    force: Deno.args.filter(arg => {
      return arg === "--force"
    }).length > 0,
    forceRecursive: Deno.args.filter(arg => {
      return arg === "--force-recursive";
    }).length > 0
  };
  
  const loc = new Location(Deno.cwd());
  const ref = new ResourceReference(url);
  
  loc.import(ref, options)
    .then(() => {
      console.log("Done!");
    });
  
}else{
  console.log(`
    
    Import vAlpha
    
    usage: import <url>
    
  `);
}
