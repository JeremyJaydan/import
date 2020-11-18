
import { ResourceReference } from "./ResourceReference.js";
import { ResourceType } from "./ResourceType.js";

import { JavaScriptImportExpression } from "../expression/JavaScriptImportExpression.js";
import { CSSImportExpression } from "../expression/CSSImportExpression.js";

import { path } from "../mod.js";

export class ResourceImport{
  
  constructor(importString, urlString, opts){
    this.importString = importString;
    this.urlString = urlString;
    this.parentResource = (opts && opts.parentResource) || null;
  }
  
  get reference(){
    return new ResourceReference(this.remoteImportUrl);
  }
  
  get remoteImportUrl(){
    return ResourceImport.getRemoteImportUrl(
      this.urlString,
      this.parentResource.reference.location.parentDirectoryPath
    );
  }
  
  get localImportUrl(){
    return ResourceImport.getLocalImportUrl(
      this.urlString,
      {
        parentLocationDepth: this.parentResource.reference.location.depth,
        referencePath: this.reference.location.path
      }
    );
  }
  
  static getRemoteImportUrl(urlString, parentDirectoryPath){
    if(urlString.startsWith("http")){
      return urlString;
    }else{
      return `https://${path.join(parentDirectoryPath, urlString)}`;
    }
  }
  
  static getLocalImportUrl(urlString, {parentLocationDepth, referencePath}){
    if(urlString.startsWith("http")){
      return "../".repeat(parentLocationDepth) + referencePath;
    }else{
      return urlString;
    }
  }
  
}
