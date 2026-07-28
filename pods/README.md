# Kubernetes Project 2 - Pods

## Objective

Understand what a Pod is, why Kubernetes uses Pods instead of directly managing containers, and learn how to create, inspect, troubleshoot, and delete Pods.

---

### What is a Pod?

A Pod is the smallest deployable unit in Kubernetes.

A Pod contains one or more containers that share:

- Network
- Storage (Volumes)
- Lifecycle

Kubernetes manages Pods, not individual containers.

---

### Why Pods?

Docker creates containers.

Kubernetes manages Pods.

Pods provide:

- Shared Networking
- Shared Storage
- Shared Lifecycle
- Multi-container support (Sidecar Pattern)

---

### Pod Architecture
```text
Developer

↓

kubectl

↓

API Server

↓

Scheduler

↓

Worker Node

↓

Pod

↓

Container

↓

Application
```
---

### Pod Creation

Create a Pod

```bash
kubectl run nginx-pod --image=nginx
```

Verify Pods

```bash
kubectl get pods
```

View detailed information

```bash
kubectl get pods -o wide
```

Describe Pod

```bash
kubectl describe pod nginx-pod
```

View Logs

```bash
kubectl logs nginx-pod
```

Access Pod

```bash
kubectl exec -it nginx-pod -- /bin/bash
```

If bash is unavailable

```bash
kubectl exec -it nginx-pod -- /bin/sh
```

Delete Pod

```bash
kubectl delete pod nginx-pod
```

---

### Create Pod using YAML

Create file

pod.yaml

Example

```yaml
apiVersion: v1
kind: Pod

metadata:
  name: nginx-pod

spec:
  containers:
  - name: nginx
    image: nginx
```

Apply YAML

```bash
kubectl apply -f pod.yaml
```

---

### Common Pod States

Running

- Pod is healthy.

Pending

- Waiting for scheduling.
- Insufficient resources.

ImagePullBackOff

- Unable to download image.
- Wrong image name.

CrashLoopBackOff

- Container starts and crashes repeatedly.
- Usually an application issue.

---

### Troubleshooting Commands

Check Pods

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

Access Container

```bash
kubectl exec -it <pod-name> -- /bin/sh
```

---

### Key Learnings

- Kubernetes manages Pods.
- A Pod can contain one or more containers.
- Pods receive their own IP address.
- Pods are ephemeral (they can be deleted and recreated).
- Standalone Pods are NOT self-healing.
