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

To make sure that the HTTP queue works we have to output active ESTABLISHED connections:
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

All taxonomy entries fetched approximately in 6 minutes:
```
...
|  Spanish mackerel
|  marlin
|  domestic carp, Cyprinus carpio
|  buffalo fish, buffalofish
|  hind
info: fetch durationMs=349191 = 5.81985 minutes
61697 entries
13360 HTTP-requests
10 parallel threads
```

2. Store flat tree, output hierarchical tree.

I choosed MongoDB as a storage because it's reliable and efficient document-oriented database. 

In order to build such tree I used next algorythm

```javascript
async function makeNestedTree(data) {
	let levels = [{}];

	data.forEach(item => {
		const path = item.name.split(conf.get('separator'));
		const level = path.length;
		item.name = path.pop();
		
		levels.length = level;
		levels[level-1].children = levels[level-1].children || [];
		levels[level-1].children.push(item);
		levels[level] = item;
	});

	return levels[0].children;
}
```

This function runs in O(N) time (or "linear time") in direct proportion to the size of the input data set, where N is the number of items in the array.
If the array has 10 items, we have to iterate and make some data transformation 10 times. If it has 1000 items, we have to print 1000 times correspondingly.

3. Design and build interface to show this data.

I proceeded from assumption that THIS data exactly means the same structure as we displayed in previous paragraph. Without cheating like IDs, parent-IDs etc.

```json
{
    "name": "ImageNet 2011 Fall Release",
    "size": 32326,
    "children": [
        {
            "name": "plant, flora, plant life",
            "size": 4486,
            "children": []
        }
}
```
I don't have a lot of time to write Tree UI within the bounds of this assignment so I chose jsTree plugin as a quite mature solution. I've been using it about 7 years ago developing this site (http://hapok.ru).




