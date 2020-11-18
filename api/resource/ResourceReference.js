
import { Resource } from "./Resource.js";
import { ResourceType } from "./ResourceType.js";
import { Location } from "../location/Location.js";
import { LocationType } from "../location/LocationType.js";

export class ResourceReference{
  
  constructor(target){
    this.location = new Location(target);
  }
  
  async getResource(){
    switch (this.location.type){
      
      case LocationType.Local:
        return Deno.readTextFile(this.location.origin)
          .then(content => {
            return new Resource(content, {reference: this});
          });
        
      case LocationType.Remote:
        return fetch(this.location.origin)
          .then(response => {
            return response.text().then(content => {
              if(this.type === ResourceType.Unknown){
                this.type = response.headers.get("Content-Type").split(";")[0];
              }
              return new Resource(content, {reference: this});
            });
          });
      
    }
  }
  
  createResource(content, type){
    return new Resource(content, type, {
      reference: this
    });
  }
  
  get ext(){
    return this.location.parts.reverse()[0].split(".").reverse()[0];
  }
  
  set type(value){
    this._type = value;
  }
  
  get type(){
    if(this._type){
      return this._type;
    }
    switch(this.ext){
      case "txt": return ResourceType.PlainText;
      case "js": return ResourceType.JavaScript;
      case "mjs": return ResourceType.JavaScript;
      case "ts": return ResourceType.TypeScript;
      case "html": return ResourceType.HTML;
      case "css": return ResourceType.CSS;
      default: return ResourceType.Unknown;
    }
  }
  
  get importable(){
    return this.type !== ResourceType.Unknown;
  }
  
}
