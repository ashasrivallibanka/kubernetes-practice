# Kubernetes Project 6 - ConfigMaps

## Objective

Understand what ConfigMaps are, why they are used, and how Kubernetes applications consume configuration without hardcoding values inside the application.

---

### What is a ConfigMap?

A ConfigMap is a Kubernetes resource used to store non-sensitive configuration data as key-value pairs.

Instead of storing configuration inside the application code, Kubernetes stores it separately in a ConfigMap.

Applications read configuration from the ConfigMap at runtime.

---

### Why do we need ConfigMaps?

Applications usually have different configurations for different environments.

Example:

Development

- Database: dev-db
- Port: 3000

Testing

- Database: test-db
- Port: 3001

Production

- Database: prod-db
- Port: 80

Without ConfigMaps, developers would have to modify the application code and rebuild Docker images for every environment.

ConfigMaps allow the same application image to be used across multiple environments.

---

### ConfigMap Architecture

```text
Developer

↓

Creates ConfigMap

↓

Kubernetes Stores Configuration

↓

Pod Starts

↓

Reads ConfigMap

↓

Application Uses Configuration
```

---

### ConfigMap Data

ConfigMaps store non-sensitive data such as:

- Application Name
- Environment
- Port Number
- Log Level
- API URL
- Feature Flags
- Configuration Files

Sensitive information such as passwords and API keys should be stored in Kubernetes Secrets.

---

### Create a ConfigMap

Create ConfigMap using literals

```bash
kubectl create configmap app-config \
--from-literal=APP_NAME="Task Manager" \
--from-literal=ENVIRONMENT=development \
--from-literal=PORT=3000
```

---

### View ConfigMaps

List ConfigMaps

```bash
kubectl get configmaps
```

Describe ConfigMap

```bash
kubectl describe configmap app-config
```

View ConfigMap in YAML

```bash
kubectl get configmap app-config -o yaml
```

---

### Use ConfigMap as Environment Variables

Create Pod

```text
pod-configmap-env.yaml
```

Apply

```bash
kubectl apply -f pod-configmap-env.yaml
```

Verify Pod

```bash
kubectl get pods
```

Enter Pod

```bash
kubectl exec -it configmap-env-demo -- /bin/sh
```

View Environment Variables

```bash
printenv
```

Expected

```text
APP_NAME=Task Manager
ENVIRONMENT=development
PORT=3000
```

Exit

```bash
exit
```

---

### Environment Variable Flow

```text
ConfigMap

↓

Environment Variables

↓

Pod

↓

Application
```

The application reads configuration from environment variables instead of hardcoded values.

---

### Use ConfigMap as Volume

Create Pod

```text
pod-configmap-volume.yaml
```

Apply

```bash
kubectl apply -f pod-configmap-volume.yaml
```

Enter Pod

```bash
kubectl exec -it configmap-volume-demo -- /bin/sh
```

View Mounted Files

```bash
ls /etc/config
```

Expected

```text
APP_NAME
ENVIRONMENT
PORT
```

Read File

```bash
cat /etc/config/APP_NAME
```

Expected

```text
Task Manager
```

Exit

```bash
exit
```

---

### Volume Mount Flow

```text
ConfigMap

↓

Mounted as Volume

↓

Pod

↓

Application Reads Files
```

This method is useful when applications expect configuration files instead of environment variables.

---

### Update ConfigMap

Edit ConfigMap

```bash
kubectl edit configmap app-config
```

Example

Change

```text
ENVIRONMENT=development
```

to

```text
ENVIRONMENT=production
```

Verify

```bash
kubectl describe configmap app-config
```

---

### Important Note

Pods using ConfigMaps as environment variables do not automatically receive updated values.

The Pod must be restarted or recreated.

ConfigMaps mounted as volumes are updated automatically after a short delay, but the application may still need to reload or restart to use the new values.

---

### Create ConfigMap using YAML

File

```text
configmap.yaml
```

Example

```yaml
apiVersion: v1
kind: ConfigMap

metadata:
  name: app-config

data:
  APP_NAME: Task Manager
  ENVIRONMENT: development
  PORT: "3000"
```

Apply

```bash
kubectl apply -f configmap.yaml
```

Verify

```bash
kubectl get configmaps
```

Describe

```bash
kubectl describe configmap app-config
```

---

## Understanding ConfigMap YAML

### apiVersion

```yaml
apiVersion: v1
```

Specifies the Kubernetes Core API.

---

### kind

```yaml
kind: ConfigMap
```

Creates a ConfigMap resource.

---

### metadata

```yaml
metadata:
  name: app-config
```

Defines the ConfigMap name.

---

### data

```yaml
data:
```

Stores configuration as key-value pairs.

---

## Environment Variables vs Volume Mounts

### Environment Variables

- Best for small configuration values
- Read during Pod startup
- Pod restart required after ConfigMap changes

Examples:

- Port
- Environment
- Application Name

---

### Volume Mounts

- Best for configuration files
- Mounted as files inside the Pod
- File contents update automatically after ConfigMap changes
- Application may still require a reload or restart

Examples:

- nginx.conf
- application.properties
- config.json

---

## ConfigMap vs Hardcoded Configuration

### Hardcoded Configuration

- Configuration inside application code
- Requires rebuilding Docker images
- Difficult to maintain

### ConfigMap

- Configuration stored separately
- No Docker image rebuild required
- Easier environment management
- Better DevOps practice

---

### Troubleshooting

List ConfigMaps

```bash
kubectl get configmaps
```

Describe ConfigMap

```bash
kubectl describe configmap app-config
```

View ConfigMap YAML

```bash
kubectl get configmap app-config -o yaml
```

Check Pods

```bash
kubectl get pods
```

Verify Environment Variables

```bash
kubectl exec -it configmap-env-demo -- printenv
```

Verify Mounted Files

```bash
kubectl exec -it configmap-volume-demo -- ls /etc/config
```

Read Mounted File

```bash
kubectl exec -it configmap-volume-demo -- cat /etc/config/APP_NAME
```

---

## Common Problems

### ConfigMap Not Found

Reason:

Incorrect ConfigMap name.

Solution:

```bash
kubectl get configmaps
```

Verify the name.

---

### Key Not Found

Reason:

Incorrect key name.

Solution:

```bash
kubectl describe configmap app-config
```

Verify that the key exists.

---

### Environment Variables Not Updated

Reason:

Pod was not restarted after ConfigMap update.

Solution:

Restart or recreate the Pod.

---

### Mounted Configuration Not Reflected

Reason:

Application has not reloaded the updated configuration.

Solution:

Restart or reload the application if required.

---

### Real Production Usage

ConfigMaps are commonly used for:

- Application Name
- Environment
- Log Level
- Port Number
- Feature Flags
- API URLs
- Nginx Configuration
- Spring Boot application.properties
- Application configuration files

---

### Key Learnings

- ConfigMaps store non-sensitive configuration.
- Configuration is separated from application code.
- Pods can consume ConfigMaps as environment variables.
- Pods can consume ConfigMaps as mounted files.
- ConfigMaps reduce the need to rebuild Docker images.
- ConfigMaps improve application portability across environments.
- YAML is the preferred way to manage ConfigMaps in production.
