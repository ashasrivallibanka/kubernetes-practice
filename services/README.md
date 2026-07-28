# Kubernetes Project 5 - Services

## Objective

Understand why Kubernetes Services are required, how they provide stable networking for Pods, and how applications communicate inside and outside a Kubernetes cluster.

---

### What is a Service?

A Service is a Kubernetes resource that provides a stable network endpoint for accessing one or more Pods.

Instead of communicating directly with Pod IP addresses, applications communicate with a Service.

The Service forwards requests to the appropriate Pods.

---

### Why do we need Services?

Pods are temporary (ephemeral).

Whenever a Pod is deleted or recreated, it receives a new IP address.

If applications communicate directly with Pod IPs, communication breaks when the Pod IP changes.

Services solve this problem by providing:

- Stable IP Address
- Stable DNS Name
- Load Balancing
- Service Discovery

---

### Pod Networking Problem

Example

```text
Pod A

IP = 10.244.0.5
```

Application communicates using:

```text
10.244.0.5
```

Pod crashes.

ReplicaSet creates another Pod.

```text
Pod B

IP = 10.244.0.18
```

The application still tries:

```text
10.244.0.5
```

Communication fails.

---

### Service Solution

Applications communicate with the Service.

The Service automatically forwards traffic to healthy Pods.

```text
Application

↓

Service

↓

Pod 1

Pod 2

Pod 3
```

Even if Pods change, the Service remains the same.

---

### Service Architecture

```text
Client

↓

Service

↓

Pod 1

Pod 2

Pod 3

↓

Containers
```

The client never communicates directly with Pods.

---

### Labels

Labels are key-value pairs attached to Kubernetes objects.

Example

```yaml
labels:
  app: nginx
```

Key

```text
app
```

Value

```text
nginx
```

Labels help Kubernetes identify and group resources.

---

### Selectors

Selectors search for resources using Labels.

Example

```yaml
selector:
  app: nginx
```

The Service automatically finds all Pods having:

```yaml
labels:
  app: nginx
```

---

### Why are Labels and Selectors Important?

Deployments use Labels.

ReplicaSets use Labels.

Services use Labels.

Instead of remembering Pod names, Kubernetes identifies Pods using Labels.

---

## Types of Services

### ClusterIP

Default Service type.

Accessible only inside the Kubernetes cluster.

Used for communication between applications.

Example:

```text
Frontend

↓

Backend Service

↓

Backend Pods
```

---

### NodePort

Exposes an application outside the Kubernetes cluster.

Users access the application using:

```text
Node IP : NodePort
```

Example:

```text
192.168.49.2:31245
```

---

### LoadBalancer

Creates an external load balancer.

Commonly used on cloud platforms such as:

- AWS
- Azure
- Google Cloud

---

### ExternalName

Maps a Kubernetes Service to an external DNS name.

---

### Create ClusterIP Service

Expose Deployment

```bash
kubectl expose deployment nginx-deployment --port=80 --target-port=80
```

Verify

```bash
kubectl get services
```

Describe Service

```bash
kubectl describe service nginx-deployment
```

---

### Create NodePort Service

Delete existing Service

```bash
kubectl delete service nginx-deployment
```

Create NodePort

```bash
kubectl expose deployment nginx-deployment \
--type=NodePort \
--port=80 \
--target-port=80
```

Verify

```bash
kubectl get services
```

---

### Access Application

Find Minikube IP

```bash
minikube ip
```

Find NodePort

```bash
kubectl get services
```

Open Browser

```text
http://<Minikube-IP>:<NodePort>
```

Example

```text
http://192.168.49.2:31245
```

---

### Service YAML

File

```text
service.yaml
```

Example

```yaml
apiVersion: v1
kind: Service

metadata:
  name: nginx-service

spec:
  type: NodePort

  selector:
    app: nginx

  ports:
  - protocol: TCP
    port: 80
    targetPort: 80
```

Apply

```bash
kubectl apply -f service.yaml
```

Verify

```bash
kubectl get services
```

---

## Understanding Service YAML

### apiVersion

```yaml
apiVersion: v1
```

Uses the Kubernetes Core API.

---

### kind

```yaml
kind: Service
```

Creates a Service.

---

### metadata

```yaml
metadata:
  name: nginx-service
```

Defines the Service name.

---

### type

```yaml
type: NodePort
```

Determines how the Service is exposed.

Possible values:

- ClusterIP
- NodePort
- LoadBalancer
- ExternalName

---

### selector

```yaml
selector:
  app: nginx
```

Finds Pods having:

```yaml
labels:
  app: nginx
```

---

### ports

```yaml
port: 80
```

Service Port.

---

### targetPort

```yaml
targetPort: 80
```

Container Port.

Traffic flow:

```text
Browser

↓

NodePort

↓

Service Port

↓

Container Port
```

---

### Endpoints

Endpoints are the Pod IP addresses currently selected by a Service.

View Endpoints

```bash
kubectl get endpoints
```

Describe Service

```bash
kubectl describe service nginx-service
```

The Endpoints automatically update whenever Pods are created or deleted.

---

### Service Discovery

Services automatically discover Pods using Labels and Selectors.

Example

Service Selector

```yaml
selector:
  app: nginx
```

Pods

```yaml
labels:
  app: nginx
```

The Service routes traffic to all matching Pods.

---

### Load Balancing

Suppose three Pods exist.

```text
Service

↓

Pod 1

Pod 2

Pod 3
```

The Service distributes incoming requests among healthy Pods.

This provides simple load balancing.

---

### Troubleshooting

View Services

```bash
kubectl get services
```

Describe Service

```bash
kubectl describe service nginx-service
```

View Endpoints

```bash
kubectl get endpoints
```

View Pod Labels

```bash
kubectl get pods --show-labels
```

View Deployments

```bash
kubectl get deployments
```

View Pods

```bash
kubectl get pods
```

View Logs

```bash
kubectl logs <pod-name>
```

---

## Common Problems

### No Endpoints

Possible reason:

Selector does not match Pod labels.

Check

```bash
kubectl get pods --show-labels
```

---

### Browser Cannot Access Application

Check

- Minikube IP
- NodePort
- Service Type
- Pod Status

---

### Service Exists but No Traffic

Possible reasons

- Pods not running
- Wrong selector
- Wrong targetPort

---

### Labels Do Not Match

Example

Service

```yaml
selector:
  app: nginx
```

Pod

```yaml
labels:
  app: web
```

The Service cannot find the Pod.

---

## ClusterIP vs NodePort

### ClusterIP

- Default Service
- Internal communication only
- Cannot be accessed from outside the cluster

---

### NodePort

- External access
- Opens a port on every Node
- Used mainly for testing and learning

---

### Real Production Usage

Frontend communicates with Backend.

Backend communicates with Database.

All communication happens using Services instead of Pod IP addresses.

Example

```text
Customer

↓

Frontend Service

↓

Frontend Pods

↓

Backend Service

↓

Backend Pods

↓

Database Service

↓

Database Pod
```

---

### Key Learnings

- Services provide stable networking.
- Pods should never be accessed using Pod IP addresses.
- Services use Labels and Selectors to find Pods.
- ClusterIP is used for internal communication.
- NodePort exposes applications outside the cluster.
- Endpoints represent the Pod IPs behind a Service.
- Services automatically update Endpoints when Pods change.
- YAML is the preferred way to create Services.
