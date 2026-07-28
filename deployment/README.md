# Kubernetes Project 3 - Deployment

## Objective

Understand Deployments, ReplicaSets, Self-Healing, Scaling, and Infrastructure as Code using deployment.yaml.

---

### What is a Deployment?

A Deployment is a Kubernetes resource that manages Pods.

It provides:

- Self-Healing
- Scaling
- Rolling Updates
- Rollbacks
- Replica Management

---

### Why Deployments?

Standalone Pods are not managed.

If a standalone Pod crashes,

Kubernetes does not recreate it.

Deployments solve this problem by managing Pods through ReplicaSets.

---
```text
# Deployment Architecture

Developer

↓

kubectl

↓

API Server

↓

Deployment

↓

ReplicaSet

↓

Pods

↓

Containers
```
---

### What is ReplicaSet?

ReplicaSet ensures the desired number of Pods are always running.

Example

Desired Pods = 3

Current Pods = 2

ReplicaSet automatically creates one more Pod.

---

### Create Deployment

```bash
kubectl create deployment nginx-deployment --image=nginx
```

View Deployments

```bash
kubectl get deployments
```

View ReplicaSets

```bash
kubectl get replicasets
```

View Pods

```bash
kubectl get pods
```

---

### Self-Healing

Delete a Pod

```bash
kubectl delete pod <pod-name>
```

Observe

```bash
kubectl get pods -w
```

ReplicaSet automatically creates a new Pod.

---

### Scaling

Scale Up

```bash
kubectl scale deployment nginx-deployment --replicas=3
```

Scale Down

```bash
kubectl scale deployment nginx-deployment --replicas=1
```

ReplicaSet creates or removes Pods to match the desired state.

---

### Deployment YAML

deployment.yaml

Example

```yaml
apiVersion: apps/v1
kind: Deployment

metadata:
  name: nginx-deployment

spec:
  replicas: 3

  selector:
    matchLabels:
      app: nginx

  template:
    metadata:
      labels:
        app: nginx

    spec:
      containers:
      - name: nginx
        image: nginx
        ports:
        - containerPort: 80
```

Apply Deployment

```bash
kubectl apply -f deployment.yaml
```

Delete Deployment

```bash
kubectl delete deployment nginx-deployment
```

---

### Troubleshooting

View Deployment

```bash
kubectl get deployments
```

Describe Deployment

```bash
kubectl describe deployment nginx-deployment
```

View ReplicaSets

```bash
kubectl get replicasets
```

View Pods

```bash
kubectl get pods
```

Describe Pod

```bash
kubectl describe pod <pod-name>
```

View Logs

```bash
kubectl logs <pod-name>
```

---

### Key Learnings

- Deployment manages Pods.
- ReplicaSet manages Pod replicas.
- Deployments provide Self-Healing.
- Deployments support Scaling.
- Infrastructure as Code is achieved using deployment.yaml.
- ReplicaSet recreates Pods automatically if they are deleted.
