# Kubernetes Project 8 - Ingress

## Objective

Understand how Kubernetes Ingress exposes multiple applications through a single entry point and routes traffic to different Services based on URL paths.

---

### What is Ingress?

Ingress is a Kubernetes resource that manages external HTTP/HTTPS access to applications running inside a Kubernetes cluster.

Instead of exposing every application using a separate NodePort, Ingress allows multiple applications to be accessed using a single IP address or domain.

---

### Why do we need Ingress?

Suppose a company has three applications:

- Employee Portal
- HR Portal
- Admin Portal

Using NodePort:

```
192.168.49.2:30001
192.168.49.2:30002
192.168.49.2:30003
```

Users must remember different ports.

With Ingress:

```
company.com/employee
company.com/hr
company.com/admin
```

A single entry point is used, making application access easier.

---

### Ingress Architecture

```
Browser

↓

Ingress Controller

↓

Ingress Rules

↓

Service

↓

Pods
```

Traffic first reaches the Ingress Controller.

The controller checks the Ingress rules and forwards the request to the correct Service.

The Service then forwards the request to the appropriate Pod.

---

## Components of Ingress

### Browser

Sends HTTP or HTTPS requests.

---

### Ingress Controller

Reads Ingress rules and forwards incoming requests.

Common controllers include:

- NGINX
- Traefik
- HAProxy

For Minikube we use the NGINX Ingress Controller.

---

### Ingress Resource

Stores routing rules.

Example:

```
/employee

↓

employee-service

/hr

↓

hr-service
```

---

### Service

Receives traffic from the Ingress Controller and forwards it to Pods.

---

### Pods

Run the actual application.

---

### Install Ingress Controller

Enable Ingress in Minikube

```bash
minikube addons enable ingress
```

Verify

```bash
kubectl get pods -n ingress-nginx
```

Verify Namespace

```bash
kubectl get namespaces
```

---

### Deploy Sample Applications

Create Employee Deployment

```bash
kubectl apply -f employee-deployment.yaml
```

Create HR Deployment

```bash
kubectl apply -f hr-deployment.yaml
```

Verify

```bash
kubectl get deployments
```

```bash
kubectl get pods
```

---

### Create Services

Employee Service

```bash
kubectl apply -f employee-service.yaml
```

HR Service

```bash
kubectl apply -f hr-service.yaml
```

Verify

```bash
kubectl get services
```

---

### Create Ingress Resource

Create

```
ingress.yaml
```

Example

```yaml
apiVersion: networking.k8s.io/v1
kind: Ingress

metadata:
  name: company-ingress

spec:
  ingressClassName: nginx

  rules:
  - http:
      paths:

      - path: /employee
        pathType: Prefix
        backend:
          service:
            name: employee-service
            port:
              number: 80

      - path: /hr
        pathType: Prefix
        backend:
          service:
            name: hr-service
            port:
              number: 80
```

Apply

```bash
kubectl apply -f ingress.yaml
```

Verify

```bash
kubectl get ingress
```

Describe

```bash
kubectl describe ingress company-ingress
```

---

## Understanding ingress.yaml

### apiVersion

```yaml
apiVersion: networking.k8s.io/v1
```

Uses the Kubernetes Networking API.

---

### kind

```yaml
kind: Ingress
```

Creates an Ingress resource.

---

### metadata

```yaml
metadata:
  name: company-ingress
```

Defines the Ingress resource name.

---

### spec

Contains all routing rules.

---

### ingressClassName

```yaml
ingressClassName: nginx
```

Specifies which Ingress Controller should process this Ingress resource.

---

### rules

Defines routing rules.

---

### path

```yaml
path: /employee
```

Matches requests beginning with `/employee`.

---

### pathType

```yaml
pathType: Prefix
```

Matches the specified path and all subpaths.

Example:

```
/employee
/employee/profile
/employee/details
```

---

### backend

Specifies the destination Service.

Example

```yaml
backend:
  service:
    name: employee-service
```

---

### Test Ingress

View Ingress

```bash
kubectl get ingress
```

View Controller

```bash
kubectl get pods -n ingress-nginx
```

Get Minikube IP

```bash
minikube ip
```

Open

```
http://<minikube-ip>/employee
```

```
http://<minikube-ip>/hr
```

Or use curl

```bash
curl http://$(minikube ip)/employee
```

```bash
curl http://$(minikube ip)/hr
```

Both routes display the default NGINX page because both applications currently use the NGINX image.

---

### Traffic Flow

```
Browser

↓

Ingress Controller

↓

Ingress Rules

↓

Service

↓

Pods

↓

Response
```

---

## Port Forwarding vs Ingress

### Port Forwarding

Creates a temporary tunnel from your local machine to a Pod or Service.

Example

```bash
kubectl port-forward service/employee-service 8080:80
```

Access

```
http://localhost:8080
```

Used for:

- Local development
- Debugging
- Temporary testing

Not recommended for production.

---

### Ingress

Provides one public entry point for multiple applications.

Example

```
http://<minikube-ip>/employee

http://<minikube-ip>/hr
```

Used in production because it supports:

- Single entry point
- Path-based routing
- Host-based routing
- HTTPS
- SSL/TLS termination

---

### Troubleshooting

Check Ingress

```bash
kubectl get ingress
```

Describe Ingress

```bash
kubectl describe ingress company-ingress
```

Check Services

```bash
kubectl get services
```

Check Pods

```bash
kubectl get pods
```

Check Endpoints

```bash
kubectl get endpoints
```

Check Ingress Controller

```bash
kubectl get pods -n ingress-nginx
```

View Controller Logs

```bash
kubectl logs -n ingress-nginx deployment/ingress-nginx-controller
```

---

## Common Problems

### 404 Not Found

Possible causes:

- Wrong path
- Incorrect Ingress rule
- Incorrect pathType

---

### Service Not Found

Verify Service names.

```bash
kubectl get services
```

---

### No Endpoints

Service selector does not match Pod labels.

Verify

```bash
kubectl describe service employee-service
```

---

### Pods Not Running

Check

```bash
kubectl get pods
```

Describe Pod

```bash
kubectl describe pod <pod-name>
```

---

### Ingress Controller Not Running

Enable

```bash
minikube addons enable ingress
```

Verify

```bash
kubectl get pods -n ingress-nginx
```

---

### Real Production Usage

Ingress is commonly used for:

- Microservices
- E-commerce applications
- Banking applications
- Enterprise portals
- REST APIs
- Web applications

It allows multiple applications to share a single domain while routing requests to the correct backend Services.

---

### Key Learnings

- Ingress provides external HTTP/HTTPS access to Kubernetes applications.
- It routes traffic using URL paths or hostnames.
- An Ingress Controller is required to process Ingress rules.
- Services receive traffic from the Ingress Controller and forward it to Pods.
- Ingress replaces multiple NodePorts with a single entry point.
- Port forwarding is mainly for local development and debugging.
- Ingress is the preferred solution for exposing web applications in production.
