
import { LocationType } from "../location/LocationType.js";

import { ResourceReference } from "./ResourceReference.js";
import { ResourceType } from "./ResourceType.js";
import { ResourceImport } from "./ResourceImport.js";

import { JavaScriptImportExpression } from "../expression/JavaScriptImportExpression.js";
import { CSSImportExpression } from "../expression/CSSImportExpression.js";
import { HTMLImportExpression } from "../expression/HTMLImportExpression.js";

export class Resource{
  
  constructor(content, opts){
    this.content = content;
    this.reference = (opts && opts.reference) || null;
  }
  
  get imports(){
    switch(this.reference.type){
      
      case ResourceType.JavaScript:
      case ResourceType.TypeScript:
        return Resource.getImports(
          this.content,
          JavaScriptImportExpression,
          { parentResource: this }
        );
          
          
      case ResourceType.CSS:
        return Resource.getImports(
          this.content,
          CSSImportExpression,
          { parentResource: this }
        );
        
      case ResourceType.HTML:
        return Resource.getImports(
          this.content,
          HTMLImportExpression,
          { parentResource: this }
        );
      
      default: return [];
      
    }
  }
  
  get replacedImportsContent(){
    switch(this.reference.type){
      
      case ResourceType.JavaScript:
      case ResourceType.TypeScript:
        return Resource.replaceImports(
          this.content,
          JavaScriptImportExpression,
          { parentResource: this }
        );
        
      case ResourceType.CSS:
        return Resource.replaceImports(
          this.content,
          CSSImportExpression,
          { parentResource: this }
        );
        
      case ResourceType.HTML:
        return Resource.replaceImports(
          this.content,
          HTMLImportExpression,
          { parentResource: this }
        );
        
      default: this.content;
      
    }
  }
  
  static getImports(content, expression, opts = {parentResource: null}){
    return ([...content.matchAll(expression)] || [])
      .map(([importString, importUrl]) => {
        return new ResourceImport(importString, importUrl, opts);
      });
  }
  
  static replaceImports(content, expression, opts = {parentResource: null}){
    return content.replace(
      expression,
      (importString, importUrl) => {
        let resourceImport = new ResourceImport(importString, importUrl, opts);
        return importString.replace(
          importUrl,
          resourceImport.localImportUrl
        );
      }
    );
  }
  
}
