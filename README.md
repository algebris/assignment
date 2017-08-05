## Assignment

### Installation 

```
# git clone git@github.com:algebris/operam.git
# yarn install
```

### Usage

`npm start fetch [id]` - start fetching taxonomy and store it to DB. Optionally you can set ID as a root point.  
`npm start show-tree [node name]` - display tree data. Optionally use node name as a root output node.

### Configuration

`/config/*` - configuration files are located here. The name depends on environment, see details (https://www.npmjs.com/package/config)

| parameter name | |
| ---- | ---- |
| *uri* | taxonomy source URL where %s ID substitution position |
| *rootNodeId* | default root node ID for fetching taxonomy |
| *separator* | delimiter between terms in taxonomy |
| *maxSockets* | maximum HTTP sockets which could run simultaneously |
| *tagsDict.\** | XML tag names for parsing |
| *db.\** | database connection settings |

### Coding notes
1. Fetch taxonomy from remote site 

```
/lib/HttXmlReader.js
/lib/TaxonomyReader.js
```

I proceeded from assumption that data could be fetched branch by branch using this URL pattern 
http://imagenet.stanford.edu/python/tree.py/SubtreeXML?rootid={id} so there should be a hundreds of requests. In order to optimize  
