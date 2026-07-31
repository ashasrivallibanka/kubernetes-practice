# Kubernetes Project 9 - Rolling Updates & Rollbacks

## Objective

Understand how Kubernetes updates applications without downtime using Rolling Updates and restores previous versions using Rollbacks.

---

### What is a Rolling Update?

A Rolling Update is a deployment strategy in Kubernetes where old Pods are gradually replaced with new Pods while keeping the application available.

Instead of stopping the entire application, Kubernetes updates Pods one by one.

This ensures little or no downtime during deployments.

---

### Why do we need Rolling Updates?

Suppose Version 1 of an application is running.

Developers release Version 2.

Instead of stopping Version 1 completely, Kubernetes gradually replaces the old Pods with new Pods.

This allows users to continue using the application while the update is happening.

---

### Rolling Update Architecture

Before Update

```
Deployment

↓

ReplicaSet

↓

Pod v1

Pod v1

Pod v1
```

---

During Update

```
Deployment

↓

ReplicaSet v1

↓

ReplicaSet v2

↓

Old Pods Removed

↓

New Pods Created
```

---

After Update

```
Deployment

↓

ReplicaSet v2

↓

Pod v2

Pod v2

Pod v2
```

---

### Benefits of Rolling Updates

- Minimal or zero downtime
- Continuous application availability
- Safer deployments
- Automatic Pod replacement
- Easy rollback if deployment fails

---

### Create Initial Deployment

Create

```
deployment.yaml
```

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
        image: nginx:1.25

        ports:
        - containerPort: 80
```

Apply

```bash
kubectl apply -f deployment.yaml
```

Verify

```bash
kubectl get deployments
```

```bash
kubectl get replicasets
```

```bash
kubectl get pods
```

---

### Perform Rolling Update

Update image

```bash
kubectl set image deployment/nginx-deployment nginx=nginx:1.26
```

Watch rollout

```bash
kubectl rollout status deployment/nginx-deployment
```

Verify Pods

```bash
kubectl get pods
```

---

### Rolling Update Flow

```
3 Old Pods

↓

2 Old + 1 New

↓

1 Old + 2 New

↓

3 New Pods
```

The application remains available throughout the deployment.

---

### Verify Rolling Update

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
kubectl get pods -o wide
```

Verify the image version has changed.

---

### Rollback

Rollback Deployment

```bash
kubectl rollout undo deployment/nginx-deployment
```

Watch Rollback

```bash
kubectl rollout status deployment/nginx-deployment
```

Verify

```bash
kubectl describe deployment nginx-deployment
```

Check ReplicaSets

```bash
kubectl get replicasets
```

The previous ReplicaSet becomes active again.

---

### Rollback Architecture

```
Deployment

↓

ReplicaSet v1

↓

ReplicaSet v2

↓

Rollback

↓

ReplicaSet v1 Active Again
```

---

### Rollout History

View History

```bash
kubectl rollout history deployment/nginx-deployment
```

View Deployment

```bash
kubectl describe deployment nginx-deployment
```

Rollback to Specific Revision

```bash
kubectl rollout undo deployment/nginx-deployment --to-revision=1
```

Kubernetes stores previous Deployment revisions for recovery.

---

### Update Deployment using YAML

Edit

```
deployment.yaml
```

Example

Change

```yaml
image: nginx:1.25
```

to

```yaml
image: nginx:1.26
```

Apply

```bash
kubectl apply -f deployment.yaml
```

Watch Rollout

```bash
kubectl rollout status deployment/nginx-deployment
```

Verify

```bash
kubectl describe deployment nginx-deployment
```

---

### Why YAML is Preferred

Production teams manage Deployments using YAML files stored in Git repositories.

Deployment Flow

```
Developer

↓

Git Repository

↓

CI/CD Pipeline

↓

kubectl apply

↓

Rolling Update
```

Benefits

- Version controlled
- Reproducible deployments
- Easy code review
- Supports GitOps
- CI/CD friendly

---

## Rolling Update vs Recreate Strategy

### Rolling Update

- No downtime
- Pods replaced gradually
- Recommended for production

---

### Recreate

- Stops all old Pods first
- Starts new Pods afterwards
- Causes application downtime
- Suitable only for applications that cannot run multiple versions simultaneously

---

### Traffic Flow During Rolling Update

```
Users

↓

Service

↓

Old Pods

+

New Pods

↓

Deployment Complete

↓

Only New Pods
```

Users continue accessing the application during the update.

---

## Troubleshooting

Check Deployment

```bash
kubectl get deployments
```

Describe Deployment

```bash
kubectl describe deployment nginx-deployment
```

Check ReplicaSets

```bash
kubectl get replicasets
```

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

Check Rollout Status

```bash
kubectl rollout status deployment/nginx-deployment
```

Pause Rollout

```bash
kubectl rollout pause deployment/nginx-deployment
```

Resume Rollout

```bash
kubectl rollout resume deployment/nginx-deployment
```

Undo Rollout

```bash
kubectl rollout undo deployment/nginx-deployment
```

View Rollout History

```bash
kubectl rollout history deployment/nginx-deployment
```

---

## Common Problems

### ImagePullBackOff

Reason

- Incorrect image name
- Image tag does not exist
- Registry authentication issues

Solution

```bash
kubectl describe pod <pod-name>
```

---

### CrashLoopBackOff

Reason

Application crashes immediately after starting.

Solution

```bash
kubectl logs <pod-name>
```

---

### Rollout Stuck

Possible Reasons

- New Pods not becoming Ready
- Invalid image
- Resource limitations
- Failing readiness probes

Check

```bash
kubectl rollout status deployment/nginx-deployment
```

---

### Rollback Failed

Verify available revisions.

```bash
kubectl rollout history deployment/nginx-deployment
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

### Real Production Usage

Rolling Updates are commonly used for:

- E-commerce applications
- Banking applications
- Healthcare systems
- Social media platforms
- Enterprise web applications
- Microservices deployments

Companies use Rolling Updates to deploy new versions without interrupting users.

---

### Key Learnings

- Rolling Updates replace old Pods gradually with new Pods.
- Applications remain available during deployments.
- Rollbacks restore the previous working version quickly.
- Kubernetes stores Deployment revisions.
- Rollout history helps track deployment versions.
- YAML is the preferred method for production deployments.
- Rolling Updates integrate naturally with GitOps and CI/CD pipelines.
- Troubleshooting involves checking Deployments, ReplicaSets, Pods, logs, and rollout status.
