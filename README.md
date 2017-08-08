## Coding challenge

### Installation 

```
# git clone git@github.com:algebris/operam.git
# cd operam
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
/src/lib/HttXmlReader.js
/src/TaxonomyReader.js
```

I proceeded from assumption that data could be fetched branch by branch using this URL pattern 
http://imagenet.stanford.edu/python/tree.py/SubtreeXML?rootid={id} so there should be a hundreds of requests. In order to optimize it
I desided to make parallel requesting to source. Thus using `conf.maxSockets` define number of opened connections to remote server and
`keepAlive` option (see lib/HttpXmlReader.js) guaranteed that we don't break those connections.

```
➜  test5 netstat | grep http
tcp4       0    101  192.168.0.101.58322    imagenet.stanfor.http  ESTABLISHED
tcp4       0    101  192.168.0.101.58321    imagenet.stanfor.http  ESTABLISHED
tcp4       0    101  192.168.0.101.58320    imagenet.stanfor.http  ESTABLISHED
tcp4       0    101  192.168.0.101.58319    imagenet.stanfor.http  ESTABLISHED
tcp4       0    101  192.168.0.101.58318    imagenet.stanfor.http  ESTABLISHED
tcp4       0    101  192.168.0.101.58317    imagenet.stanfor.http  ESTABLISHED
tcp4       0    101  192.168.0.101.58316    imagenet.stanfor.http  ESTABLISHED
tcp4       0    101  192.168.0.101.58315    imagenet.stanfor.http  ESTABLISHED
tcp4       0    101  192.168.0.101.58314    imagenet.stanfor.http  ESTABLISHED
tcp4       0    101  192.168.0.101.58293    imagenet.stanfor.http  ESTABLISHED
tcp4       0      0  192.168.0.101.58200    s3-website-us-we.http  CLOSE_WAIT 
...
```

