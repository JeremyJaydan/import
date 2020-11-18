# import
experimental module vendering tool 

# Installation
- [have deno installed](https://deno.land/#installation)
- install with deno
```
deno install --unstable --allow-read --allow-net --allow-write https://import.jeremyjaydan.dev/cli.js
```

# Usage
- be in a directory where you want the dependencies e.g. (project)/vendor/.
- execute import command with url to the dependency
```
import <url>
```

# Behind the scenes
- Works alright with JavaScript modules
- Hardly works with html & css
- Module type is determined by file extension or resource content type as a fallback
- Module imports found by regular expressions based on module type
- Is an object-oriented mess, I'll probably re-write this  

