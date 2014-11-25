A utility server used as a Github webhook to trigger AWS Codedeploy for an Application/Deployment Group.

## Requirements
- Docker
- IAM role with acess to Codedeploy

## Installation
```bash
$ sudo docker build -t CI .
```
Now, add the endpoint as a github webhook with your repo/branch matching your application/deployment group: `http://.../my-app/qa` This will trigger a CodeDeploy build whenever the `qa` branch for `my-app` repo is pushed.

## Running
```bash
$ sudo docker run -d -p 80:3000 CI
```

## Securing
A secret can also be used to secure the endpoint.
Assign the secret in your webhook configuration for your Repo, and run the CI container setting the secret env var.
```bash
$ sudo docker run -d -p 80:3000 -e SECRET=xxxxxx CI
```