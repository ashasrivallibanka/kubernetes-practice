# Kubernetes Project 4 - ReplicaSets and Scaling

## Objective

Understand how ReplicaSets maintain the desired number of Pods and how Kubernetes scales applications up and down based on demand.

---

### What is a ReplicaSet?

A ReplicaSet is a Kubernetes resource that ensures a specified number of Pod replicas are always running.

It continuously compares:

```text
Desired Pods
vs
Current Pods
```

If the current number is lower than the desired number, the ReplicaSet creates new Pods.

If the current number is higher than the desired number, the ReplicaSet removes extra Pods.

---

### Why do we need ReplicaSets?

A standalone Pod is not self-healing.

If a standalone Pod is deleted or crashes, Kubernetes does not recreate it automatically.

ReplicaSets solve this problem by maintaining the desired number of Pods.

Example:

```text
Desired Pods = 3
Current Pods = 2
```

ReplicaSet creates one new Pod.

After recovery:

```text
Desired Pods = 3
Current Pods = 3
```

---

### ReplicaSet Architecture

```text
Deployment
    ↓
ReplicaSet
    ↓
Pods
    ↓
Containers
```

A Deployment normally manages the ReplicaSet.

The ReplicaSet manages the Pods.

The Pods run the application containers.

---

### ReplicaSet and Deployment Relationship

A Deployment does not normally create Pods directly.

The flow is:

```text
Deployment
    ↓
Creates ReplicaSet
    ↓
ReplicaSet creates Pods
```

Deployments are preferred in production because they provide:

- Scaling
- Self-healing
- Rolling updates
- Rollbacks
- ReplicaSet management

---

### View ReplicaSets

```bash
kubectl get replicasets
```

Short form:

```bash
kubectl get rs
```

Purpose:

Display ReplicaSets and their current status.

Example fields:

```text
NAME
DESIRED
CURRENT
READY
AGE
```

### DESIRED

The number of Pods Kubernetes should maintain.

### CURRENT

The number of Pods currently created.

### READY

The number of healthy Pods ready to serve traffic.

---

### Describe a ReplicaSet

```bash
kubectl describe replicaset <replicaset-name>
```

Short form:

```bash
kubectl describe rs <replicaset-name>
```

Purpose:

Display detailed ReplicaSet information such as:

- Labels
- Selectors
- Desired replicas
- Current replicas
- Pod template
- Events

This command is useful for troubleshooting.

---

## What is Scaling?

Scaling means increasing or decreasing the number of application Pods.

There are two basic types:

### Scale Up

Increase the number of Pods when traffic or workload increases.

Example:

```text
1 Pod → 5 Pods
```

### Scale Down

Reduce the number of Pods when traffic decreases.

Example:

```text
5 Pods → 2 Pods
```

Scaling helps improve:

- Availability
- Performance
- Resource usage
- Cost efficiency

---

### Scale a Deployment Up

```bash
kubectl scale deployment nginx-deployment --replicas=5
```

Purpose:

Increase the desired number of Pods to five.

Behind the scenes:

```text
Current Pods = 1
Desired Pods = 5
ReplicaSet creates 4 more Pods
```

---

### Verify Scaling

Check Deployment:

```bash
kubectl get deployments
```

Check ReplicaSet:

```bash
kubectl get replicasets
```

Check Pods:

```bash
kubectl get pods
```

Expected result:

```text
5 running Pods
```

---

### Watch Scaling in Real Time

```bash
kubectl get pods -w
```

Purpose:

Continuously watch Pod status changes.

The `-w` option means:

```text
watch
```

This is useful for observing:

- Pod creation
- Pod deletion
- Container startup
- Pod termination

Stop watching with:

```text
Ctrl + C
```

---

### Scale a Deployment Down

```bash
kubectl scale deployment nginx-deployment --replicas=2
```

Purpose:

Reduce the number of running Pods to two.

Behind the scenes:

```text
Current Pods = 5
Desired Pods = 2
ReplicaSet removes 3 Pods
```

---

## Create a ReplicaSet Using YAML

File:

```text
replicaset.yaml
```

Example:

```yaml
apiVersion: apps/v1
kind: ReplicaSet

metadata:
  name: nginx-rs

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
```

Apply the file:

```bash
kubectl apply -f replicaset.yaml
```

Verify:

```bash
kubectl get replicasets
kubectl get pods
```

---

## Understanding ReplicaSet YAML

### apiVersion

```yaml
apiVersion: apps/v1
```

Specifies the Kubernetes API version used for ReplicaSets.

### kind

```yaml
kind: ReplicaSet
```

Tells Kubernetes to create a ReplicaSet.

### metadata

```yaml
metadata:
  name: nginx-rs
```

Defines the ReplicaSet name.

### replicas

```yaml
replicas: 3
```

Defines the desired number of Pods.

### selector

```yaml
selector:
  matchLabels:
    app: nginx
```

Tells the ReplicaSet which Pods it should manage.

### template

```yaml
template:
```

Defines the Pod blueprint used to create new Pods.

### labels

```yaml
labels:
  app: nginx
```

The Pod label must match the ReplicaSet selector.

---

### Important Selector Rule

The ReplicaSet selector and Pod template labels must match.

Correct:

```yaml
selector:
  matchLabels:
    app: nginx

template:
  metadata:
    labels:
      app: nginx
```

If they do not match, Kubernetes rejects the configuration or the ReplicaSet cannot manage the expected Pods correctly.

---

### Self-Healing with ReplicaSet

List Pods:

```bash
kubectl get pods
```

Delete one Pod:

```bash
kubectl delete pod <pod-name>
```

Watch the Pods:

```bash
kubectl get pods -w
```

The ReplicaSet detects that the current number of Pods is lower than the desired number and creates a replacement.

This behavior is called:

```text
Self-Healing
```

---

### Troubleshooting Commands

Check ReplicaSets:

```bash
kubectl get replicasets
```

Describe ReplicaSet:

```bash
kubectl describe replicaset <replicaset-name>
```

Check Pods:

```bash
kubectl get pods
```

View detailed Pod information:

```bash
kubectl describe pod <pod-name>
```

View Pod logs:

```bash
kubectl logs <pod-name>
```

View all related resources:

```bash
kubectl get deployments,replicasets,pods
```

---

## Common Problems

### Desired replicas are not ready

Possible reasons:

- Image download failure
- Container crash
- Insufficient CPU or memory
- Incorrect Pod configuration

Troubleshoot with:

```bash
kubectl describe pod <pod-name>
kubectl logs <pod-name>
```

### ReplicaSet selector does not match Pod labels

The selector and template labels must use the same key and value.

### Too many Pods are running

Check whether multiple ReplicaSets or Deployments are using the same labels.

```bash
kubectl get deployments
kubectl get replicasets
kubectl get pods --show-labels
```

---

## ReplicaSet vs Deployment

### ReplicaSet

- Maintains the desired number of Pods
- Provides self-healing
- Supports manual scaling
- Does not provide easy rolling updates and rollbacks

### Deployment

- Manages ReplicaSets
- Maintains Pods
- Supports scaling
- Supports rolling updates
- Supports rollbacks
- Preferred for production applications

---

## Manual Scaling vs Automatic Scaling

### Manual Scaling

A user explicitly changes the replica count.

Example:

```bash
kubectl scale deployment nginx-deployment --replicas=5
```

### Automatic Scaling

Kubernetes changes replicas automatically based on metrics such as CPU usage.

This is commonly done using:

```text
Horizontal Pod Autoscaler
```
---

### Real DevOps Usage

ReplicaSets and scaling are used to:

- Maintain application availability
- Recover failed Pods
- Handle traffic increases
- Reduce resources when demand decreases
- Run multiple copies of backend applications
- Support highly available services
- Maintain the desired application state

---

### Key Learnings

- ReplicaSet maintains the desired number of Pods.
- ReplicaSet compares desired state with current state.
- ReplicaSet creates replacement Pods when Pods fail.
- Scaling changes the number of Pod replicas.
- Scaling up improves application capacity.
- Scaling down reduces resource usage.
- Deployments manage ReplicaSets.
- Deployments are preferred over direct ReplicaSets in production.
- ReplicaSet selectors must match Pod labels.
- `kubectl get pods -w` helps observe scaling in real time.
