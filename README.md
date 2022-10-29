<h1 align="center">
<img src="images/blogger.svg" width="100" alt="logo"/></br></br>
Blog Post POC
</h1>

## Author

<h3>Prince Kumar Sharma</h3>

## Usage 

Make sure following dependencies are installed in the system

* [`Docker`](https://docs.docker.com/engine/install/)
* Enable Kubernetes from Docker preference
* [`Skaffold`](https://skaffold.dev/)
* Create JWT_KEY as environment variable in kubernetes cluster 

```bash

Creating JWT_KEY in kubernetes cluster

kubectl create secret generic jwt-secret --from-literal JWT_KEY=yourjwtkey

```

> Note: To run this application in local, map local ip with **blogpost.xyz** in `system32/drivers/etc/hosts` file 

```bash

git clone https://github.com/ipreencekmr/Blog.git

cd Blog 

skaffold dev

OR

 kubectl apply -f .\infra\k8s\ .
 kubectl apply -f .\infra\k8s-dev\ .
 
```

## Available scripts

> Works for backend applications

```bash
npm run test
```

```bash
npm run build
```

```bash
npm run start
```

> Works for front end application 

```bash
npm run dev
```

## Used Technologies 

* Next JS 
* React JS
* MongoDB
* Nats Streaming Server
* Docker 
* Kubernetes
* Github Workflows
* React Bootstrap
* NPM JS
* Ingress Nginx
