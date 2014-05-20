static-files
============

Display files in HTML format with syntax highlighting.

HowTo
-----
Currently it only works at a root of a domain (didn't test at other place, maybe will work by changing the index.html base-url tag value).

Install all the file in a directory exposed by the web-server, like ```/some/folder```.
Rewrite rule needs to be configured in the web-server, for example in nginx:
```
server {
	...
	server_name domain.example.com;
	...
	root /some/folder;
	location /static/ {
	}
	location / {
		try_files $uri /index.html =404;
	}
}
```

To validate the installation, you could try urls:
- ```http://domain.example.com/test.sh```
- ```http://domain.example.com/foo/Bar.java```

