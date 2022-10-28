<h1 align="center">
<img src="images/blogger.svg" width="100" alt="logo"/></br></br>
Blog Post POC
</h1>

## Usage 

Make sure following dependencies are installed in the system

* [`Docker`](https://docs.docker.com/engine/install/)
* Enable Kubernetes from Docker preference
* [`Skaffold`](https://skaffold.dev/)

> Note: To run this application in local, map local ip with **blogpost.xyz** in `system32/drivers/etc/hosts` file 

```bash
git clone https://github.com/ipreencekmr/Blog.git
skaffold dev

> OR

 kubectl apply -f .\infra\k8s\ .
 kubectl apply -f .\infra\k8s-dev\ .
```
