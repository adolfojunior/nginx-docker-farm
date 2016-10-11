
# Docker + Nginx config to route multiple Apps

First, lets create a network to make all the containers accesible by name.

```sh
# docker network create <network-name>
docker network create nginx-network
```

* Run an `App1` binded to `nginx-network`

```sh
docker run \
  --name app1 \
  --net nginx-network \
  -d \
  -w /usr/src/app \
  -v $(pwd)/app:/usr/src/app \
  -p 3001:3000 \
  mhart/alpine-node \
  node server.js
```

* Run an `App2` binded to `nginx-network`

```sh
docker run \
  --name app2 \
  --net nginx-network \
  -d \
  -w /usr/src/app \
  -v $(pwd)/app:/usr/src/app \
  -p 3002:3000 \
  mhart/alpine-node \
  node server.js
```

Creating a `nginx config` for each app, inside the [conf.d](conf.d)

- [app1 config](conf.d/vhost_app1.conf)
- [app2 config](conf.d/vhost_app2.conf)

* Run nginx.

```sh
docker run \
  --name nginx \
  --net nginx-network \
  -d \
  -p 80:80 \
  -p 443:443 \
  -v $(pwd)/conf.d:/etc/nginx/conf.d:ro \
  nginx:alpine
```

If you add a new server, just reload the nginx server

```sh
docker exec -it nginx nginx -s reload
```

## Test it

- Should return Nginx page
```sh
curl http://192.168.99.100

# with a DNS config

curl http://docker.dev
```

- Should return App1 page
```sh
curl -H "Host: app1.docker.dev" http://192.168.99.100

# or (with a DNS config)

curl http://app1.docker.dev
```

- Should return App2 page
```sh
curl -H "Host: app2.docker.dev" http://192.168.99.100

# or (with a DNS config)

curl http://app2.docker.dev
```
 
