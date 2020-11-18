
import { LocationType } from "./LocationType.js";
import { SchemePathExpression } from "../expression/SchemePathExpression.js";
import { Resource } from "../resource/Resource.js";
import { ResourceImport } from "../resource/ResourceImport.js";
import { $for } from "../../lib/for-next.js";

import { ensureFile, existsSync } from "../mod.js";

export class Location{
  
  constructor(origin){
    this.origin = origin;
  }
  
  get type(){
    if(this.origin.startsWith("http")){
      return LocationType.Remote;
    }else{
      return LocationType.Local;
    }
  }
  
  get depth(){
    return (this.parts.length - 1) || 0;
  }
  
  get path(){
    return this.origin.replace(SchemePathExpression, "");
  }
  
  get parentDirectoryPath(){
    return this.path.split("/").slice(0, -1).join("/");
  }
  
  get parts(){
    return this.path.split("/");
  }
  
  get host(){
    return this.parts[0];
  }
  
  imported = [];
  skipped = 0;
  async import(reference, opts){
    
    const path = `/${this.path}/${reference.location.path}`;
    const exists = existsSync(path);
    const importedAlready = this.imported.indexOf(path) !== -1;
    
    opts.force = opts.force || opts.forceRecursive;
    
    if((exists && !opts.force) || importedAlready){
      if(exists && !importedAlready){
        this.skipped++;
      }
    }else{
      console.log(`importing: ${reference.location.path}`);
      const resource = await reference.getResource();
      await ensureFile(path);
      const content = await resource.replacedImportsContent;
      Deno.writeTextFile(path, content);
      this.imported.push(path);
      return $for(resource.imports, (resourceImport, {next}) => {
        if(!opts.forceRecursive) opts.force = false;
        this.import(resourceImport.reference, opts).then(next);
      }, {
        // interval: 1000
      }).then(() => {
        if(this.skipped > 0){
          console.log(`Skipped ${this.skipped} existing modules in '${reference.location.path}'. (use --force to overwrite or --force-recursive)`);
        }
        return resource;
      });
    }
    

    
  }
  
}
