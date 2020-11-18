
import { Location, ResourceReference, path } from "./api/mod.js";

const url = Deno.args[0];

if(url){
  
  const options = {
    force: Deno.args.filter(arg => {
      return arg === "--force"
    }),
    forceRecursive: Deno.args.filter(arg => {
      return arg === "--force-recursive";
    })
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

// import { Command } from "https://deno.land/x/cliffy@v0.15.0/command/mod.ts";

// const cmd = new Command()
//   .name("mod")
//   .version("0.0.0")
//   .description("Multi content type vendering tool")
  
//   .command("import <url>")
//   .description("Import anything* locally or from the wild")
//   .option("-f, --force [overwrite:boolean]", "overwrite existing module", {
//     default: false
//   })
//   .option("-r, --force-recursive [overwrite:boolean]", "recursively overwrite existing modules", {
//     default: false
//   })
//   .action((options, url) => {
    
//     const loc = new Location(Deno.cwd());
//     const ref = new ResourceReference(url);
    
//     loc.import(ref, options)
//       .then(() => {
//         console.log("Done!");
//       });
      
//   })
  
//   .parse(Deno.args);