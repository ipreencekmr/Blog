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
* [`Ingress-nginx (Windows)`](https://kubernetes.github.io/ingress-nginx/deploy/#quick-start)
* [`Ingress-nginx (Linux)`](https://kubernetes.github.io/ingress-nginx/deploy/#minikube)

```bash

**Windows**

kubectl apply -f https://raw.githubusercontent.com/kubernetes/ingress-nginx/controller-v1.4.0/deploy/static/provider/cloud/deploy.yaml

**Linux MiniKube**

minikube addons enable ingress

```

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

 cd auth && npm install && docker build -t YOUR_DOCKER_REPOSITORY/auth && docker push YOUR_DOCKER_REPOSITORY/auth
 cd posts && npm install && docker build -t YOUR_DOCKER_REPOSITORY/posts && docker push YOUR_DOCKER_REPOSITORY/posts
 cd comments && npm install && docker build -t YOUR_DOCKER_REPOSITORY/comments && docker push YOUR_DOCKER_REPOSITORY/comments
 cd client && npm install && docker build -t YOUR_DOCKER_REPOSITORY/client && docker push YOUR_DOCKER_REPOSITORY/client
 
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

* TypeScript
* JavaScript
* Supertest
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


## Services Available

### Auth Services

#### Sign Up
```
URL: https://blogpost.xyz/api/users/signup
Method: POST
Payload: 

{
    "email":"test@test.com",
    "password":"12345678"
}
```
 
#### Sign In
```
URL: https://blogpost.xyz/api/users/signin
Method: POST
Payload: 

{
    "email":"test@test.com",
    "password":"12345678"
}
```


### Post Services

#### Create Post
```
URL: https://blogpost.xyz/api/posts
Method: POST
Payload: 

{
    "title":"My Post",
    "desc":"My Post Description"
}
```

#### Update Post
```
URL: https://blogpost.xyz/api/posts/{post_id}
Method: POST
Payload: 

{
    "title":"My Updated Post",
    "desc":"My Updated Post Description"
}
```


#### Get Posts
```
URL: https://blogpost.xyz/api/posts
Method: GET
```


### Comment Services

#### Add Comment
```
URL: https://blogpost.xyz/api/comments
Method: POST
Payload: 

{
    "postId":{post_id},
    "desc":"Add a comment to post"
}
```

#### Get Comment
```
URL: https://blogpost.xyz/api/comments/{comment_id}
Method: GET
```

#### Update Comment
```
URL: https://blogpost.xyz/api/comments/{comment_id}
Method: POST
Payload: 

{
    "postId":{post_id},
    "desc":"Update my comment"
}
```


